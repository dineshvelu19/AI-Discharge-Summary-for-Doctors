// API Contract for QuickDischarge 2.0
// Interacts with Supabase Edge Functions

const API_BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL 
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`
  : 'http://127.0.0.1:54321/functions/v1';

const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
};

export interface EMRRecord {
  patient_id: string;
  content: string;
  type?: string;
  date?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Ingests a batch of EMR records.
 * The edge function will generate vector embeddings and insert them into the `emr_records` table.
 */
export async function ingestRecords(records: EMRRecord[]) {
  const response = await fetch(`${API_BASE_URL}/ingest_records`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({ records }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to ingest records');
  }

  return response.json();
}

/**
 * Generates a draft discharge summary for a given patient utilizing the RAG engine.
 */
export async function generateDraft(patientId: string, instructions?: string) {
  const response = await fetch(`${API_BASE_URL}/generate_draft`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({ patient_id: patientId, instructions }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to generate draft');
  }

  return response.json();
}

/**
 * Approves and finalizes a drafted discharge summary.
 */
export async function approveDraft(draftId: string, finalContent?: string) {
  const response = await fetch(`${API_BASE_URL}/approve_draft`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({ draft_id: draftId, final_content: finalContent }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to approve draft');
  }

  return response.json();
}
