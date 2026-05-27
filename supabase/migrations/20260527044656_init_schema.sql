-- ENABLE THE PGVECTOR EXTENSION FOR CLINICAL RETRIEVAL
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. ORGANISATIONS TABLE (TENANTS)
CREATE TABLE organisations (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT NOT NULL,
    abdm_hfr_id   TEXT UNIQUE,          -- ABDM Health Facility Registry ID
    nhcx_org_id   TEXT,                 -- NHCX Payer/Provider ID
    tier          TEXT DEFAULT 'trial', -- trial | pro | enterprise
    settings      JSONB DEFAULT '{}'::jsonb,
    created_at    TIMESTAMPTZ DEFAULT now()
);

-- 2. USERS TABLE (CLINICAL & ADMIN STAFF)
CREATE TABLE users (
    id              UUID PRIMARY KEY,     -- Maps to auth.users.id
    org_id          UUID REFERENCES organisations(id) ON DELETE CASCADE,
    full_name       TEXT NOT NULL,
    role            TEXT NOT NULL,        -- physician | resident | nurse | admin
    mci_reg_no      TEXT,                 -- Medical Council of India Registration Number
    abha_linked_id  TEXT,                 -- Linked ABHA clinician credentials
    preferred_lang  TEXT DEFAULT 'en',
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- RLS: Enable security on users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_isolation ON users
    FOR ALL
    USING (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

-- 3. PATIENTS TABLE
CREATE TABLE patients (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id         UUID REFERENCES organisations(id) ON DELETE CASCADE,
    mrn            TEXT NOT NULL,         -- Hospital Medical Record Number
    abha_id        TEXT,                  -- Patient's ABHA ID (e.g. name@sbx)
    full_name      TEXT NOT NULL,
    dob            DATE NOT NULL,
    gender         TEXT NOT NULL,         -- M | F | O
    phone          TEXT,
    preferred_lang TEXT DEFAULT 'en',
    allergies      JSONB DEFAULT '[]'::jsonb, -- Array of [{drug, severity, recorded_at}]
    created_at     TIMESTAMPTZ DEFAULT now(),
    UNIQUE(org_id, mrn)
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY patients_isolation ON patients
    FOR ALL USING (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

-- 4. ADMISSIONS TABLE
CREATE TABLE admissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id          UUID REFERENCES organisations(id) ON DELETE CASCADE,
    patient_id      UUID REFERENCES patients(id) ON DELETE CASCADE,
    ward_info       TEXT NOT NULL,
    bed_no          TEXT NOT NULL,
    admitted_at     TIMESTAMPTZ NOT NULL,
    discharged_at   TIMESTAMPTZ,
    attending_id    UUID REFERENCES users(id),
    status          TEXT DEFAULT 'active', -- active | discharged | transferred
    ip_number       TEXT,                  -- Inpatient Registry ID
    created_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY admissions_isolation ON admissions
    FOR ALL USING (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

-- 5. EMR_RECORDS TABLE (UNIFIED CLINICAL INGESTION BLOCK WITH PGVECTOR)
CREATE TABLE emr_records (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admission_id    UUID REFERENCES admissions(id) ON DELETE CASCADE,
    source_system   TEXT NOT NULL,         -- HIS | LIS | RIS | NURSING | OT
    record_type     TEXT NOT NULL,         -- diagnosis | medication | lab | imaging | note | vitals
    recorded_at     TIMESTAMPTZ NOT NULL,
    raw_content     TEXT NOT NULL,         -- Raw clinical note/report text
    structured      JSONB DEFAULT '{}'::jsonb,
    embedding       VECTOR(1536),          -- pgvector embedding for cosine similarity search
    ingested_at     TIMESTAMPTZ DEFAULT now()
);

-- CREATE HIGH-PERFORMANCE COSINE SIMILARITY SEARCH INDEX
CREATE INDEX emr_embedding_cosine_idx ON emr_records 
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX emr_admission_type_idx ON emr_records(admission_id, record_type);

ALTER TABLE emr_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY emr_isolation ON emr_records
    FOR ALL USING (
        admission_id IN (
            SELECT id FROM admissions WHERE org_id = (
                SELECT org_id FROM users WHERE id = auth.uid()
            )
        )
    );

-- 6. DISCHARGE_DRAFTS TABLE
CREATE TABLE discharge_drafts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admission_id    UUID REFERENCES admissions(id) ON DELETE CASCADE,
    org_id          UUID REFERENCES organisations(id) ON DELETE CASCADE,
    generated_by    UUID REFERENCES users(id),
    status          TEXT DEFAULT 'draft',  -- draft | under_review | approved | released
    model_used      TEXT DEFAULT 'claude-sonnet-3.5',
    rag_sources     JSONB DEFAULT '[]'::jsonb, -- Array of cited record IDs
    confidence_map  JSONB DEFAULT '{}'::jsonb, -- Field-level AI confidence indexes
    flags           JSONB DEFAULT '[]'::jsonb, -- Calculated checklist warnings
    audit_score     INT DEFAULT 100,       -- NYU Safety Score (0-100)
    generated_at    TIMESTAMPTZ DEFAULT now(),
    approved_at     TIMESTAMPTZ,
    approved_by     UUID REFERENCES users(id)
);

ALTER TABLE discharge_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY drafts_isolation ON discharge_drafts
    FOR ALL USING (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

-- 7. DISCHARGE_SECTIONS TABLE (11 CLINICAL BLOCKS SYSTEM)
CREATE TABLE discharge_sections (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    draft_id       UUID REFERENCES discharge_drafts(id) ON DELETE CASCADE,
    section_key    TEXT NOT NULL,         -- chief_complaint | history | medications | followup...
    content        TEXT,                  -- Original AI-drafted text block
    edited_content TEXT,                  -- Physician-corrected text block
    sources        JSONB DEFAULT '[]'::jsonb, -- [{record_id, field, snippet}]
    status         TEXT DEFAULT 'ai_draft', -- ai_draft | physician_edited | confirmed
    updated_at     TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE discharge_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY sections_isolation ON discharge_sections
    FOR ALL USING (
        draft_id IN (
            SELECT id FROM discharge_drafts WHERE org_id = (
                SELECT org_id FROM users WHERE id = auth.uid()
            )
        )
    );

-- 8. ICD_CODES TABLE
CREATE TABLE icd_codes (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    draft_id     UUID REFERENCES discharge_drafts(id) ON DELETE CASCADE,
    diagnosis    TEXT NOT NULL,
    icd10_code   TEXT,                  -- e.g. J18.9
    icd10_desc   TEXT,
    icd11_code   TEXT,                  -- Parallel ICD-11 annotation
    confidence   FLOAT DEFAULT 1.0,
    is_primary   BOOLEAN DEFAULT false,
    confirmed_by UUID REFERENCES users(id),
    confirmed_at TIMESTAMPTZ
);

ALTER TABLE icd_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY icd_isolation ON icd_codes
    FOR ALL USING (
        draft_id IN (
            SELECT id FROM discharge_drafts WHERE org_id = (
                SELECT org_id FROM users WHERE id = auth.uid()
            )
        )
    );

-- 9. AUDIT_LOG TABLE (APPEND-ONLY, IMMUTABLE TRAILS)
CREATE TABLE audit_log (
    id           BIGSERIAL PRIMARY KEY,
    org_id       UUID REFERENCES organisations(id),
    actor_id     UUID REFERENCES users(id),
    action       TEXT NOT NULL,          -- SECTION_EDITED | FLAG_RESOLVED | DRAFT_APPROVED
    entity_type  TEXT NOT NULL,          -- patients | discharge_drafts | medications
    entity_id    UUID NOT NULL,
    diff         JSONB DEFAULT '{}'::jsonb, -- Track before/after changes
    ip_address   INET NOT NULL,
    user_agent   TEXT,
    created_at   TIMESTAMPTZ DEFAULT now()
);

-- STRICT POSTGRES COMPLIANCE RULES: BLOCK UPDATES & DELETIONS
CREATE RULE no_delete_audit AS ON DELETE TO audit_log DO INSTEAD NOTHING;
CREATE RULE no_update_audit AS ON UPDATE TO audit_log DO INSTEAD NOTHING;

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_isolation ON audit_log
    FOR ALL USING (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

-- 10. FHIR_COMPOSITIONS TABLE (ABDM EXPORTS)
CREATE TABLE fhir_compositions (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    draft_id          UUID REFERENCES discharge_drafts(id) ON DELETE CASCADE,
    fhir_resource     JSONB NOT NULL,    -- Complete ABDM-compliant FHIR R4 JSON
    abha_id           TEXT NOT NULL,
    nrces_version     TEXT DEFAULT 'v6.5.0',
    submitted_at      TIMESTAMPTZ,
    submission_status TEXT DEFAULT 'pending', -- pending | accepted | rejected
    created_at        TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE fhir_compositions ENABLE ROW LEVEL SECURITY;
CREATE POLICY fhir_isolation ON fhir_compositions
    FOR ALL USING (
        draft_id IN (
            SELECT id FROM discharge_drafts WHERE org_id = (
                SELECT org_id FROM users WHERE id = auth.uid()
            )
        )
    );
