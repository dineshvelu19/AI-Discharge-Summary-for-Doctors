'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Sparkles, Activity, FileCheck, BrainCircuit, ArrowLeft,
  ChevronDown, ChevronUp, Copy, Check, Save, RefreshCw, AlertTriangle, 
  CheckCircle, Play, Mic, Trash2, ShieldAlert, Monitor, Smartphone, 
  Settings, Printer, Send, Clock, User
} from 'lucide-react';
import { Patient, Medication, TranslationSet } from '@/types/clinical';

export const DraftPreview = ({ 
  patient, 
  onUpdatePatient, 
  onBack 
}: { 
  patient: Patient; 
  onUpdatePatient: (updated: Patient) => void;
  onBack: () => void;
}) => {
  // Step state
  const [activeStep, setActiveStep] = useState<number>(patient.step);
  
  // Scraper states
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncedSources, setSyncedSources] = useState({
    emr: patient.scraped,
    lis: patient.scraped,
    ris: patient.scraped,
    nursing: patient.scraped
  });
  const [syncProgress, setSyncProgress] = useState({ emr: 100, lis: 100, ris: 100, nursing: 100 });

  // Dictation states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [dictationText, setDictationText] = useState<string>(patient.rawNotes);

  // Edit raw notes
  const [clinicalNotes, setClinicalNotes] = useState<string>(patient.rawNotes);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Medication Planner states
  const [newMedName, setNewMedName] = useState<string>('');
  const [newMedInstruction, setNewMedInstruction] = useState<string>('');

  // Follow-up Date state
  const [followupDate, setFollowupDate] = useState<string>(patient.followupDate);

  // Audit Log State
  const [auditLogs, setAuditLogs] = useState<{ time: string; text: string }[]>([]);

  // Smartphone Chassis Portal states
  const [showSmartphone, setShowSmartphone] = useState<boolean>(false);
  const [portalLang, setPortalLang] = useState<'en' | 'ta' | 'hi' | 'kn' | 'es'>('en');

  // Sign Modal state
  const [showSignModal, setShowSignModal] = useState<boolean>(false);
  const [pinValue, setPinValue] = useState<string>('');

  // Settings Modal state
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [apiModel, setApiModel] = useState<string>('gemini-2.0-flash');

  // QAS Chaos Panel states
  const [showChaosPanel, setShowChaosPanel] = useState<boolean>(false);
  const [qasLatency, setQasLatency] = useState<boolean>(false);
  const [qasError, setQasError] = useState<boolean>(false);

  // Highlight/Glow animation state for section focusing
  const [glowingSection, setGlowingSection] = useState<string | null>(null);

  // Core safety warnings calculated dynamically
  const [activeWarnings, setActiveWarnings] = useState<{ type: 'crit' | 'warn' | 'miss'; key: string; msg: string }[]>([]);
  const [safetyScore, setSafetyScore] = useState<number>(100);

  // References for scrolling
  const medSectionRef = useRef<HTMLDivElement>(null);
  const followupSectionRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Initialize and update rawNotes & states when patient changes
  useEffect(() => {
    setActiveStep(patient.step);
    setClinicalNotes(patient.rawNotes);
    setDictationText(patient.rawNotes);
    setFollowupDate(patient.followupDate);
    setSyncedSources({
      emr: patient.scraped,
      lis: patient.scraped,
      ris: patient.scraped,
      nursing: patient.scraped
    });
    
    // Load local storage Gemini key
    if (typeof window !== 'undefined') {
      setApiKey(localStorage.getItem('gemini_api_key') || '');
      setApiModel(localStorage.getItem('gemini_api_model') || 'gemini-2.0-flash');
    }

    logAudit(`Loaded patient chart context for ${patient.name}`);
  }, [patient]);

  // Recalculate Gated Safety Audit dynamically
  useEffect(() => {
    const rawNotesLower = clinicalNotes.toLowerCase();
    const warnings: { type: 'crit' | 'warn' | 'miss'; key: string; msg: string }[] = [];

    // Allergy check
    const hasPenicillinAllergy = rawNotesLower.includes('penicillin') || rawNotesLower.includes('penicilin');
    const hasSulfaAllergy = rawNotesLower.includes('sulfa');

    const hasAmoxicillin = patient.medications.some(m => 
      m.name.toLowerCase().includes('amox') || m.name.toLowerCase().includes('penicillin')
    );
    const hasSulfaMed = patient.medications.some(m => 
      m.name.toLowerCase().includes('bactrim') || m.name.toLowerCase().includes('sulfa') || m.name.toLowerCase().includes('trimethoprim')
    );

    // Guideline check
    const hasStent = rawNotesLower.includes('stent') || rawNotesLower.includes('stemi') || rawNotesLower.includes('occlusion') || rawNotesLower.includes('coronary');
    const hasDKA = rawNotesLower.includes('dka') || rawNotesLower.includes('ketoacidosis');

    const hasAspirin = patient.medications.some(m => 
      m.name.toLowerCase().includes('aspirin') || m.name.toLowerCase().includes('asa')
    );
    const hasLispro = patient.medications.some(m => 
      m.name.toLowerCase().includes('lispro') || m.name.toLowerCase().includes('humalog') || m.name.toLowerCase().includes('novolog')
    );

    // Penicillin allergy collision
    if (hasPenicillinAllergy && hasAmoxicillin && !patient.critResolved) {
      warnings.push({
        type: 'crit',
        key: 'ALLERGY_PENICILLIN',
        msg: "Penicillin allergy documented, but Penicillin derivative (Amoxicillin) is active in prescriptions."
      });
    }

    // Sulfa allergy collision
    if (hasSulfaAllergy && hasSulfaMed) {
      warnings.push({
        type: 'crit',
        key: 'ALLERGY_SULFA',
        msg: "Sulfa allergy documented, but Sulfa antibiotic (Bactrim/Septra) is active in prescriptions."
      });
    }

    // Stent Aspirin Omission
    if (hasStent && !hasAspirin) {
      warnings.push({
        type: 'warn',
        key: 'OMISSION_ASPIRIN',
        msg: "Post-coronary stent patient requires Dual Antiplatelet Therapy. Aspirin 81mg PO daily is currently missing."
      });
    }

    // DKA Lispro Omission
    if (hasDKA && !hasLispro) {
      warnings.push({
        type: 'warn',
        key: 'OMISSION_LISPRO',
        msg: "Post-DKA regimen lacks mealtime short-acting insulin coverage (Insulin Lispro). Bedtime Glargine alone is insufficient."
      });
    }

    // Metformin Dose Discrepancy
    if (rawNotesLower.includes('metformin') && patient.medications.some(m => m.name.toLowerCase().includes('metformin'))) {
      const hasDiscrepancy = patient.medications.some(m => m.name.toLowerCase().includes('metformin 500mg'));
      if (hasDiscrepancy) {
        warnings.push({
          type: 'warn',
          key: 'DISCREPANCY_METFORMIN',
          msg: "Metformin dose in discharge (500mg BD) differs from admission clinical record (1000mg BD)."
        });
      }
    }

    // Missing follow-up date
    if (!followupDate) {
      warnings.push({
        type: 'miss',
        key: 'FOLLOWUP_DATE',
        msg: "Follow-up clinic checkup date is missing. Complete date selection before signing."
      });
    }

    setActiveWarnings(warnings);

    // Calculate score
    let score = 100;
    const critCount = warnings.filter(w => w.type === 'crit').length;
    const warnCount = warnings.filter(w => w.type === 'warn').length;
    const missCount = warnings.filter(w => w.type === 'miss').length;
    score -= critCount * 40;
    score -= warnCount * 15;
    score -= missCount * 10;
    setSafetyScore(Math.max(score, 10));
  }, [clinicalNotes, patient.medications, patient.critResolved, followupDate]);

  // Log to Audit Trail
  const logAudit = (text: string) => {
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    setAuditLogs(prev => [{ time, text }, ...prev.slice(0, 39)]);
  };

  // Scroll to logs end
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [auditLogs]);

  // Handle Step transition
  const handleGoStep = (stepIndex: number) => {
    onUpdatePatient({ ...patient, step: stepIndex });
    setActiveStep(stepIndex);
    const stepNames = ["Connected Ingestion", "Clinical Draft Review", "Final Certification"];
    logAudit(`Workspace step navigated to: ${stepNames[stepIndex]}`);
  };

  // Scraper simulation
  const handleImportEMR = () => {
    if (isSyncing || patient.scraped) return;
    setIsSyncing(true);
    logAudit(`Starting connected scraper sync for ${patient.name}...`);

    const sources: ('emr' | 'lis' | 'ris' | 'nursing')[] = ['emr', 'lis', 'ris', 'nursing'];
    let delay = 0;

    sources.forEach((src, idx) => {
      setSyncProgress(prev => ({ ...prev, [src]: 0 }));
      setTimeout(() => {
        setSyncedSources(prev => ({ ...prev, [src]: true }));
        setSyncProgress(prev => ({ ...prev, [src]: 100 }));
        logAudit(`Database successfully synced: ${src.toUpperCase()} repository`);
        
        if (idx === sources.length - 1) {
          setIsSyncing(false);
          onUpdatePatient({ ...patient, scraped: true });
          logAudit(`All connected systems synchronized successfully.`);
        }
      }, delay + 450);
      delay += 450;
    });
  };

  // Bedside Voice recording simulator
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      logAudit(`Physician dictation recording paused.`);
    } else {
      setIsRecording(true);
      logAudit(`Physician dictation recording active...`);
    }
  };

  // Generate AI Summary
  const handleGenerateSummary = () => {
    if (!clinicalNotes.trim()) return;
    setIsAiLoading(true);
    logAudit(`Triggering double-engine AI clinical synthesis...`);

    // Latency Chaos Injector
    const delay = qasLatency ? 8000 : 1200;
    if (qasLatency) {
      logAudit(`QAS CHAOS: 8-second artificial API request latency delay active.`);
    }

    setTimeout(() => {
      setIsAiLoading(false);
      if (qasError) {
        logAudit(`QAS CHAOS: API Error triggered (HTTP 429 Rate Limit). Safely fell back to clinical templates.`);
        onUpdatePatient({ ...patient, scraped: true, step: 1 });
        setActiveStep(1);
        return;
      }

      onUpdatePatient({ 
        ...patient, 
        scraped: true, 
        step: 1, 
        rawNotes: clinicalNotes 
      });
      setActiveStep(1);
      logAudit(`AI discharge summary draft synthesized successfully.`);
    }, delay);
  };

  // Add Medication
  const handleAddMedication = () => {
    if (!newMedName.trim() || !newMedInstruction.trim()) return;
    const newMed: Medication = {
      name: newMedName.trim(),
      instruction: newMedInstruction.trim()
    };
    onUpdatePatient({
      ...patient,
      medications: [...patient.medications, newMed]
    });
    logAudit(`Prescribed new drug order: ${newMed.name}`);
    setNewMedName('');
    setNewMedInstruction('');
  };

  // Delete Medication
  const handleDeleteMedication = (index: number) => {
    const medName = patient.medications[index].name;
    onUpdatePatient({
      ...patient,
      medications: patient.medications.filter((_, i) => i !== index)
    });
    logAudit(`Removed drug order: ${medName}`);
  };

  // Resolve Penicillin Allergy
  const handleResolvePenicillin = () => {
    onUpdatePatient({
      ...patient,
      critResolved: true,
      // Substitute amoxicillin with Azithromycin PO
      medications: patient.medications.map(m => 
        m.name.toLowerCase().includes('amox')
          ? { name: "Azithromycin 500mg PO OD", instruction: "Take 1 tablet by mouth once daily for 5 days (penicillin-safe alternative)" }
          : m
      )
    });
    logAudit(`Allergy conflict resolved: Replaced Amoxicillin with Azithromycin PO`);
  };

  // Resolve Missing follow-up date
  const handleResolveDate = (date: string) => {
    setFollowupDate(date);
    onUpdatePatient({
      ...patient,
      followupDate: date
    });
    logAudit(`Follow-up clinic checkup date recorded: ${date}`);
  };

  // Trigger PIN signing modal
  const handleConfirmPIN = () => {
    if (pinValue === '1234' || pinValue.length === 4) {
      onUpdatePatient({
        ...patient,
        status: 'ok',
        step: 2
      });
      logAudit(`Physician certified discharge summary successfully with secure PIN`);
      setShowSignModal(false);
      setPinValue('');
    } else {
      logAudit(`Physician authentication failed: Invalid signature PIN`);
    }
  };

  // Focus Warning scroll
  const handleFocusWarning = (key: string) => {
    if (key === 'ALLERGY_PENICILLIN' || key === 'med-section') {
      setGlowingSection('med-section');
      medSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setGlowingSection(null), 3000);
    } else if (key === 'FOLLOWUP_DATE' || key === 'followup-date') {
      setGlowingSection('followup-date');
      followupSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => setGlowingSection(null), 3000);
    }
  };

  // ICD Code Confirmation
  const handleSelectICD = (idx: number) => {
    onUpdatePatient({ ...patient, icdCodeIndex: idx });
    logAudit(`Primary diagnostic code confirmed: ${patient.icdOptions[idx].code}`);
  };

  // Dynamic lay summaries translation mapping
  const getLaySummary = () => {
    const translation = patient.translations[portalLang] || patient.translations.en;
    return translation;
  };

  // Print paper summary
  const handlePrint = () => {
    logAudit(`Discharge paper summary queued for physical print`);
    window.print();
  };

  // Copy patient text Q&A
  const handleCopyText = () => {
    const summary = getLaySummary();
    const formatted = `QUICKDISCHARGE 2.0 PATIENT SUMMARY\n\n1. Why were you admitted?\n${summary.why}\n\n2. What treatments did you receive?\n${summary.treatments}\n\n3. Diet & Active Restrictions:\n${summary.restrictions}\n\n4. Critical warnings:\n${summary.warnings}\n\n5. Follow-up clinic OPD:\n${summary.followup}`;
    navigator.clipboard.writeText(formatted);
    logAudit(`Lay Patient Visit Summary copied to clipboard`);
  };

  // QAS Scenario injector
  const handleInjectQasScenario = (type: 'ALLERGY' | 'ASPIRIN' | 'INSULIN') => {
    if (type === 'ALLERGY') {
      onUpdatePatient({
        ...patient,
        critResolved: false,
        rawNotes: "Patient has documented Penicillin allergy. Listed Amoxicillin 500mg PO TID on discharge list.",
        medications: [
          { name: "Amoxicillin 500mg PO TID", instruction: "Take three times daily for lung infection" },
          ...patient.medications.filter(m => !m.name.toLowerCase().includes('amox'))
        ]
      });
      setClinicalNotes("Patient has documented Penicillin allergy. Listed Amoxicillin 500mg PO TID on discharge list.");
      logAudit(`QAS STAGING: Injected Penicillin allergy collision scenario`);
    } else if (type === 'ASPIRIN') {
      onUpdatePatient({
        ...patient,
        rawNotes: "Patient post coronary stenting successfully placed in LAD block. Requires dual antiplatelet therapy.",
        medications: patient.medications.filter(m => !m.name.toLowerCase().includes('aspirin') && !m.name.toLowerCase().includes('asa'))
      });
      setClinicalNotes("Patient post coronary stenting successfully placed in LAD block. Requires dual antiplatelet therapy.");
      logAudit(`QAS STAGING: Injected post-stent Aspirin omission scenario`);
    } else if (type === 'INSULIN') {
      onUpdatePatient({
        ...patient,
        rawNotes: "48yo female admitted in severe Diabetic Ketoacidosis (DKA). Omitted short-acting sliding Insulin Lispro.",
        medications: patient.medications.filter(m => !m.name.toLowerCase().includes('lispro'))
      });
      setClinicalNotes("48yo female admitted in severe Diabetic Ketoacidosis (DKA). Omitted short-acting sliding Insulin Lispro.");
      logAudit(`QAS STAGING: Injected DKA Insulin Lispro omission scenario`);
    }
  };

  const handleResetQas = () => {
    onUpdatePatient({
      ...patient,
      critResolved: false,
      scraped: false,
      step: 0,
      followupDate: "",
      status: 'crit',
      medications: [
        { name: "Amoxicillin 500mg PO TID", instruction: "Take 1 tablet by mouth three times daily for lung infection (7 days)" },
        { name: "Metformin 500mg PO BD", instruction: "Take 1 tablet by mouth twice daily with meals for diabetes control" },
        { name: "Azithromycin 500mg PO OD", instruction: "Take 1 tablet by mouth once daily for 5 days" },
        { name: "Paracetamol 650mg PO SOS", instruction: "Take 1 tablet by mouth every 6 hours as needed for fever or pain" }
      ]
    });
    setFollowupDate('');
    setClinicalNotes(patient.rawNotes);
    setActiveStep(0);
    setQasLatency(false);
    setQasError(false);
    logAudit(`QAS STAGING: Reset all clinical sandbox states successfully`);
  };

  const primaryWarning = activeWarnings.find(w => w.type === 'crit');
  const unlockedApprove = activeWarnings.filter(w => w.type === 'crit' || w.type === 'miss').length === 0;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 relative pb-12">
      {/* Dynamic Staging Chaos Toast */}
      {qasLatency && (
        <div className="fixed top-6 right-6 z-50 bg-amber-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl border border-amber-400 shadow-xl flex items-center gap-2 animate-bounce">
          <Clock size={14} className="animate-spin" />
          QAS Staging Alert: Artificial API response latency active (8s delay)
        </div>
      )}

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column (Clinical Workspace) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Intake Header */}
          <div className="glass-card p-6 border-b-4 border-b-primary-500 rounded-t-xl rounded-b-lg flex justify-between items-center shadow-premium">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BrainCircuit className="text-primary-500 animate-pulse" size={24} aria-hidden="true" />
                <h2 className="text-2xl font-bold text-foreground">Clinical Discharge Cockpit 2.0</h2>
              </div>
              <p className="text-slate-500 text-sm flex items-center gap-2">
                Attending Physician: <span className="font-semibold text-slate-800 dark:text-slate-300">{patient.physician}</span>
              </p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setShowSmartphone(!showSmartphone)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  showSmartphone 
                    ? 'bg-primary-50 border-primary-300 text-primary-700' 
                    : 'bg-white border-border hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Smartphone size={14} />
                Patient View
              </button>
            </div>
          </div>

          {/* Stepper Tabs */}
          <div className="flex border border-border bg-slate-50/50 dark:bg-slate-800/20 p-1.5 rounded-xl gap-2 shadow-inner">
            {[
              { label: 'Data Ingestion', step: 0 },
              { label: 'Review Draft', step: 1 },
              { label: 'Certification & Sign', step: 2 }
            ].map((tab, i) => (
              <button
                key={i}
                onClick={() => handleGoStep(tab.step)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  activeStep === tab.step 
                    ? 'bg-white dark:bg-slate-800 text-primary-600 shadow-md ring-1 ring-primary-500/10' 
                    : activeStep > tab.step
                      ? 'text-green-600 hover:text-green-700 bg-green-50/20 dark:bg-green-950/10'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border ${
                  activeStep === tab.step 
                    ? 'bg-primary-100 border-primary-400 text-primary-700'
                    : activeStep > tab.step
                      ? 'bg-green-100 border-green-400 text-green-700'
                      : 'bg-slate-100 border-border text-slate-500'
                }`}>
                  {activeStep > tab.step ? '✓' : tab.step + 1}
                </span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panel Render */}
          <div className="transition-all duration-300">
            
            {/* STEP 1: Connected Intake / Ingestion Scraper */}
            {activeStep === 0 && (
              <div className="glass-card p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="border-b border-border pb-4">
                  <h3 className="text-lg font-bold text-foreground mb-1">Verify Clinical Intake & Dictate</h3>
                  <p className="text-slate-500 text-sm">Aura syncs records from Connected Clinical Systems. Dictate bedside findings to structure the discharge draft.</p>
                </div>

                {/* Scraper Panel */}
                <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30 border border-border rounded-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Connected Clinical Databases</h4>
                    <button 
                      onClick={handleImportEMR}
                      disabled={isSyncing || patient.scraped}
                      className="bg-primary-600 text-white hover:bg-primary-700 disabled:bg-green-500 disabled:text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-premium flex items-center gap-2 hover:-translate-y-0.5 transition-all"
                    >
                      {isSyncing ? (
                        <>⏳ Syncing Databases...</>
                      ) : patient.scraped ? (
                        <>✓ Databases Synced</>
                      ) : (
                        <>📥 Import EMR Records</>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'emr', label: 'Electronic Medical Record (EMR)', desc: 'Intake profiles, demographics, clinic course', icon: '🏥', color: 'bg-blue-500' },
                      { key: 'lis', label: 'Laboratory Information System (LIS)', desc: 'Complete blood counts, cultures, lab reports', icon: '🧪', color: 'bg-clinical-teal' },
                      { key: 'ris', label: 'Radiology Information System (RIS)', desc: 'Chest X-Ray reports, CT angiography scans', icon: '🩻', color: 'bg-amber-500' },
                      { key: 'nursing', label: 'Nursing flowsheets & OT Notes', desc: 'Active vitals logs, pain scale recordings', icon: '📋', color: 'bg-purple-500' }
                    ].map((src, i) => {
                      const isSynced = syncedSources[src.key as keyof typeof syncedSources];
                      return (
                        <div key={i} className="p-3 bg-white dark:bg-slate-950 border border-border rounded-lg flex items-start gap-3 hover:shadow-sm transition-all">
                          <span className="text-xl">{src.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{src.label}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5 truncate">{src.desc}</div>
                            {isSyncing && !isSynced && (
                              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                                <div className={`h-full ${src.color} animate-pulse`} style={{ width: '60%' }} />
                              </div>
                            )}
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            isSynced 
                              ? 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400' 
                              : 'bg-slate-50 text-slate-500 dark:bg-slate-900/30'
                          }`}>
                            {isSynced ? '✓ Synced' : 'Ready'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Voice Dictation Panel */}
                <div className="p-4 bg-white dark:bg-slate-950 border border-border rounded-xl space-y-4 shadow-inner">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Bedside Physician Dictation / Notes</h4>
                    <button 
                      onClick={toggleRecording}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold shadow transition-all ${
                        isRecording 
                          ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <Mic size={14} className={isRecording ? 'animate-bounce' : ''} />
                      <span>{isRecording ? 'Pause recording...' : 'Dictate notes'}</span>
                    </button>
                  </div>
                  
                  <div className="relative">
                    <textarea 
                      value={clinicalNotes}
                      onChange={(e) => { setClinicalNotes(e.target.value); setDictationText(e.target.value); }}
                      placeholder="Speak bedside observations or paste EMR structured handoffs. Aura builds these directly into the clinical timeline."
                      className="w-full min-h-[140px] p-4 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-inner text-slate-700 dark:text-slate-300 text-sm leading-relaxed"
                    />

                    {/* Microphone soundwave animation */}
                    {isRecording && (
                      <div className="absolute bottom-4 right-4 flex items-end gap-1 h-6 bg-slate-900/90 px-3 py-1.5 rounded-full border border-slate-700">
                        {[0.6, 0.9, 0.4, 0.8].map((speed, i) => (
                          <div 
                            key={i} 
                            className="w-1 bg-red-500 rounded-full animate-bounce" 
                            style={{ 
                              height: '100%', 
                              animationDuration: `${speed}s`, 
                              animationIterationCount: 'infinite' 
                            }} 
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-border pt-4">
                  <span className="text-xs text-slate-400">Double-Engine AI analyzes safety checklists and ICD codes before review.</span>
                  <button 
                    onClick={handleGenerateSummary}
                    disabled={isAiLoading || !clinicalNotes.trim()}
                    className="bg-primary-600 hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-500 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-premium flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-lg transition-all"
                  >
                    {isAiLoading ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Analyzing safety gates...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        ⚡ Generate AI Summary
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Review Draft Panels */}
            {activeStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* Critical Banner */}
                {primaryWarning && (
                  <div 
                    onClick={handleResolvePenicillin}
                    className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 rounded-xl flex gap-3 items-start cursor-pointer hover:bg-red-100/50 dark:hover:bg-red-950/30 transition-all shadow-sm"
                  >
                    <div className="p-2 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg">
                      <AlertTriangle size={20} className="animate-pulse" />
                    </div>
                    <div>
                      <div className="font-bold text-red-800 dark:text-red-400 text-sm">Critical Safety Alert: Drug-Allergy Collision</div>
                      <div className="text-red-700 dark:text-red-300 text-xs mt-0.5 leading-relaxed">{primaryWarning.msg}</div>
                      <div className="text-primary-600 dark:text-primary-400 font-semibold text-xs mt-2 hover:underline flex items-center gap-1">
                        Click here to reconcile and swap with a Penicillin-safe alternative (Azithromycin OD) →
                      </div>
                    </div>
                  </div>
                )}

                {/* Section Editor Blocks */}
                <div className="space-y-4">
                  {[
                    { id: 'diagnosis', title: 'Diagnosis & ICD Codes', content: patient.diagnosis, isCode: true },
                    { id: 'complaint', title: 'Presenting Complaint & History', content: patient.chiefComplaint },
                    { id: 'findings', title: 'Clinical Findings on Admission', content: patient.clinicalFindings },
                    { id: 'labs', title: 'Laboratory & Radiology Investigations', content: patient.investigations, badge: patient.status === 'crit' ? 'warn' : 'ok' }
                  ].map((sec, i) => (
                    <div key={i} className="glass-card overflow-hidden shadow-sm hover:shadow border-l-4 border-l-clinical-teal bg-white dark:bg-slate-900">
                      <div className="px-5 py-4 border-b border-border bg-slate-50/20 dark:bg-slate-800/10 flex justify-between items-center">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-base">
                          <FileText size={16} className="text-primary-500" />
                          {sec.title}
                        </h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          sec.badge === 'warn' 
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' 
                            : 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                        }`}>
                          {sec.badge === 'warn' ? '⚠ Review Flagged' : '✓ Confirmed'}
                        </span>
                      </div>
                      <div className="p-5 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-medium">
                        {sec.content}
                      </div>
                    </div>
                  ))}

                  {/* Medications list & interactive Planner */}
                  <div 
                    ref={medSectionRef}
                    className={`glass-card overflow-hidden shadow-premium border-l-4 border-l-amber-500 transition-all duration-500 bg-white dark:bg-slate-900 ${
                      glowingSection === 'med-section' ? 'ring-4 ring-amber-500/30 border-l-amber-500 shadow-xl' : ''
                    }`}
                  >
                    <div className="px-5 py-4 border-b border-border bg-slate-50/20 dark:bg-slate-800/10 flex justify-between items-center">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-base">
                        <ShieldAlert size={16} className="text-amber-500" />
                        Discharge Medications Prescription List
                      </h4>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        patient.critResolved 
                          ? 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400' 
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 animate-pulse'
                      }`}>
                        {patient.critResolved ? '✓ Allergy Resolved' : '⚠ Active Warnings'}
                      </span>
                    </div>

                    <div className="p-5 space-y-4">
                      {/* Medications Table */}
                      <div className="overflow-x-auto border border-border rounded-xl">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-950/50 text-xs font-semibold text-slate-500 uppercase border-b border-border">
                              <th className="px-4 py-3">Prescription Name</th>
                              <th className="px-4 py-3">Dosing Instructions</th>
                              <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {patient.medications.map((med, idx) => {
                              const isAmoxicillin = med.name.toLowerCase().includes('amox');
                              const isPenicillin = med.name.toLowerCase().includes('penicillin');
                              const showDanger = (isAmoxicillin || isPenicillin) && !patient.critResolved;
                              return (
                                <tr key={idx} className={showDanger ? 'bg-red-50/40 dark:bg-red-950/10' : ''}>
                                  <td className="px-4 py-3">
                                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                      {med.name}
                                      {showDanger && (
                                        <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">Allergy Clash</span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-slate-500">{med.instruction}</td>
                                  <td className="px-4 py-3 text-right">
                                    <button 
                                      onClick={() => handleDeleteMedication(idx)}
                                      className="p-1 hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-500 rounded-md transition-colors"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Add drug planner box */}
                      <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30 border border-border border-dashed rounded-xl space-y-3">
                        <div className="text-xs font-bold text-slate-600 dark:text-slate-300">✏ Add Medication Order</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input 
                            value={newMedName}
                            onChange={(e) => setNewMedName(e.target.value)}
                            placeholder="Drug name (e.g. Aspirin 81mg PO OD)"
                            list="drug-options"
                            className="bg-white dark:bg-slate-950 border border-border rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary-500/50"
                          />
                          <datalist id="drug-options">
                            <option value="Aspirin 81mg PO OD" />
                            <option value="Clopidogrel 75mg PO OD" />
                            <option value="Atorvastatin 80mg PO OD" />
                            <option value="Metformin 1000mg PO BD" />
                            <option value="Insulin Glargine 10 units SC bedtime" />
                            <option value="Insulin Lispro 4 units mealtime" />
                            <option value="Paracetamol 650mg PO SOS" />
                          </datalist>

                          <input 
                            value={newMedInstruction}
                            onChange={(e) => setNewMedInstruction(e.target.value)}
                            placeholder="Dosing instructions (e.g. Take once daily with breakfast)"
                            className="bg-white dark:bg-slate-950 border border-border rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary-500/50"
                          />
                        </div>
                        <div className="flex justify-end">
                          <button 
                            onClick={handleAddMedication}
                            disabled={!newMedName.trim() || !newMedInstruction.trim()}
                            className="bg-slate-800 hover:bg-slate-950 text-white disabled:bg-slate-200 disabled:text-slate-500 px-4 py-1.5 rounded-lg text-xs font-semibold shadow transition-all hover:-translate-y-0.5"
                          >
                            + Add Prescription
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Follow-up Section */}
                  <div 
                    ref={followupSectionRef}
                    className={`glass-card overflow-hidden shadow-sm border-l-4 border-l-primary-500 bg-white dark:bg-slate-900 transition-all duration-500 ${
                      glowingSection === 'followup-date' ? 'ring-4 ring-primary-500/30 border-l-primary-500 shadow-xl' : ''
                    }`}
                  >
                    <div className="px-5 py-4 border-b border-border bg-slate-50/20 dark:bg-slate-800/10 flex justify-between items-center">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-base">
                        <FileCheck size={16} className="text-primary-500" />
                        Follow-up &amp; Advice Instructions
                      </h4>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        followupDate 
                          ? 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400' 
                          : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 animate-pulse'
                      }`}>
                        {followupDate ? '✓ Date Resolved' : '✗ Missing Follow-up Date'}
                      </span>
                    </div>

                    <div className="p-5 space-y-3 text-sm">
                      <div className="text-slate-700 dark:text-slate-300">
                        <span className="font-semibold text-slate-500">Clinic Destination:</span> Pulmonology Inpatient OPD Clinic
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-500">Follow-up Date:</span>
                        {followupDate ? (
                          <strong className="text-green-600 bg-green-50 dark:bg-green-950/20 px-3 py-1 rounded-md border border-green-200 dark:border-green-800/50 text-xs">
                            {followupDate}
                          </strong>
                        ) : (
                          <span className="text-red-500 font-semibold text-xs">[PHYSICIAN TO COMPLETE]</span>
                        )}
                        <input 
                          type="date"
                          value={followupDate}
                          onChange={(e) => handleResolveDate(e.target.value)}
                          className="bg-white dark:bg-slate-950 border border-border rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary-500/50 shadow-inner"
                        />
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* STEP 3: Certification / Sign Modal */}
            {activeStep === 2 && (
              <div className="glass-card p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-2xl mx-auto text-center bg-white dark:bg-slate-900 border-2 border-primary-500/20 shadow-premium">
                <div className="w-16 h-16 bg-primary-50 dark:bg-primary-950/30 rounded-full flex items-center justify-center mx-auto text-primary-600 dark:text-primary-400">
                  <BrainCircuit size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Summary Final Certification</h3>
                  <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">Verify clinical summaries and unlock final signatures. Certification logs an encrypted block onto the audit trails.</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-border rounded-xl text-left divide-y divide-border text-sm space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="font-semibold text-slate-500">Patient Name</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{patient.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-semibold text-slate-500">MRN / IP Number</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{patient.mrd}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-semibold text-slate-500">Primary Diagnosis</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-xs">{patient.diagnosis.split('\n')[0].replace('Primary: ', '')}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-semibold text-slate-500">Gated Safety Gate Status</span>
                    <span className={`font-bold ${safetyScore >= 90 ? 'text-green-600' : 'text-red-500'}`}>{safetyScore}% Passed</span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-800/30 rounded-xl flex gap-3 text-left">
                  <span className="text-lg">🛡️</span>
                  <div className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed font-medium">
                    <strong>ABDM/NHCX Security Sign Notice:</strong> Confirming release prompts a 4-digit numeric PIN password dialog. Verification writes encrypted digital summaries to the patient MyCare health locker.
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button 
                    onClick={() => setShowSignModal(true)}
                    disabled={!unlockedApprove}
                    className="bg-primary-600 hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-500 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-premium hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    ✍ Confirm Approval &amp; Sign Summary
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer Bar */}
          <div className="glass-card px-6 py-4 flex justify-between items-center shadow-premium bg-slate-50/50 dark:bg-slate-800/10 border-t border-border">
            <div className={`text-xs font-bold ${
              patient.status === 'ok' ? 'text-green-600 animate-pulse' : 'text-slate-400'
            }`}>
              {patient.status === 'ok' ? '✓ DISCHARGE SUMMARY SIGNED & TRANSMITTED — Dr. Reynolds' : '📄 CLINICAL DRAFT — PENDING PHYSICIAN FINAL APPROVAL'}
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={onBack}
                className="px-4 py-2 rounded-lg text-xs font-semibold border border-border hover:bg-slate-100 text-slate-700 dark:text-slate-300 transition-all bg-white"
              >
                Back
              </button>
              {patient.status !== 'ok' && (
                <button 
                  onClick={() => setShowSignModal(true)}
                  disabled={!unlockedApprove}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-500 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-premium hover:shadow transition-all"
                >
                  Approve &amp; Sign
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Right Column (Safety Gating Sidebar) */}
        <div className="space-y-6">
          
          {/* Circular Safety Ring Score */}
          <div className="glass-card p-5 space-y-4 shadow-premium bg-white dark:bg-slate-900 border border-border">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Gated Safety &amp; Trust</h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                safetyScore >= 90 
                  ? 'bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400' 
                  : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 animate-pulse'
              }`}>
                {activeWarnings.length} Issues Open
              </span>
            </div>

            <div className="flex items-center gap-5">
              {/* Circular progress SVG */}
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="42" 
                    stroke="currentColor" 
                    className={safetyScore >= 90 ? 'text-green-500' : safetyScore >= 60 ? 'text-amber-500' : 'text-red-500'} 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={263.89}
                    strokeDashoffset={263.89 - (safetyScore / 100) * 263.89}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-slate-800 dark:text-slate-100 text-lg">
                  {safetyScore}%
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Safety Gating Audit</div>
                <div className="text-[10px] text-slate-400 mt-1 font-semibold leading-relaxed">
                  {safetyScore >= 90 ? 'NYU Clinical Gate Unlocked. Verified' : 'Checklist warnings block release. Reconcile.'}
                </div>
                <div className="text-[8px] text-slate-300 hover:text-primary-500 cursor-help mt-1 hover:underline transition-colors font-bold" title="Safety checklist is governed by the JAMA Network Open 2024 automated med reconciliation protocol.">
                  JAMA 2024 Reconciliation Protocol
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              {/* Live safety warnings list */}
              {activeWarnings.map((w, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleFocusWarning(w.key)}
                  className={`p-2.5 rounded-lg border text-xs cursor-pointer hover:opacity-85 transition-all flex items-start gap-2 ${
                    w.type === 'crit' 
                      ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400' 
                      : w.type === 'warn'
                        ? 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400'
                        : 'bg-slate-50 border-border text-slate-700 dark:bg-slate-900/40 dark:text-slate-300'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 bg-current" />
                  <div className="leading-relaxed font-semibold">{w.msg}</div>
                </div>
              ))}

              {patient.critResolved && (
                <div className="p-2.5 bg-green-50 border border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-900/40 dark:text-green-400 rounded-lg text-xs flex items-center gap-2 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-green-500" />
                  ✓ Penicillin Allergy Collision Resolved
                </div>
              )}
            </div>
          </div>

          {/* ICD Code Card */}
          <div className="glass-card p-5 space-y-4 shadow-premium bg-white dark:bg-slate-900 border border-border">
            <div className="text-xs font-bold tracking-wider text-slate-400 uppercase">ICD-10 Code Confirmation</div>
            
            <div className="space-y-3">
              {patient.icdOptions.map((opt, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSelectICD(idx)}
                  className={`p-3 border rounded-xl cursor-pointer hover:shadow-sm transition-all flex items-start gap-3 ${
                    patient.icdCodeIndex === idx 
                      ? 'bg-primary-50/50 border-primary-400 dark:bg-primary-950/10' 
                      : 'bg-white border-border hover:bg-slate-50 dark:bg-slate-950'
                  }`}
                >
                  <input 
                    type="radio" 
                    checked={patient.icdCodeIndex === idx}
                    onChange={() => handleSelectICD(idx)}
                    className="mt-1" 
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{opt.code}</div>
                    <div className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-relaxed">{opt.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secure Audit Trail Log */}
          <div className="glass-card p-5 space-y-4 shadow-premium bg-white dark:bg-slate-900 border border-border">
            <div className="text-xs font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
              📜 Secure Audit Trail Log
            </div>

            <div className="h-[120px] overflow-y-auto border border-border p-3 rounded-lg bg-slate-950 text-[10px] font-mono text-slate-400 space-y-2 flex flex-col-reverse shadow-inner">
              <div ref={logsEndRef} />
              {auditLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed">
                  <span className="text-clinical-teal">[{log.time}]</span> {log.text}
                </div>
              ))}
              {auditLogs.length === 0 && (
                <div className="text-slate-600">Secure workstation audit active...</div>
              )}
            </div>
          </div>

          {/* Action List Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleCopyText}
              className="bg-white hover:bg-slate-50 border border-border rounded-xl p-3 text-xs text-slate-700 dark:bg-slate-950 dark:text-slate-300 shadow hover:shadow-md transition-all font-bold flex flex-col items-center gap-2 text-center"
            >
              <Copy size={16} className="text-primary-500" />
              <span>Copy Q&amp;A summary</span>
            </button>
            <button 
              onClick={() => {
                logAudit(`Lay Patient summary pushed successfully to MyChart`);
                setShowSmartphone(true);
              }}
              className="bg-white hover:bg-slate-50 border border-border rounded-xl p-3 text-xs text-slate-700 dark:bg-slate-950 dark:text-slate-300 shadow hover:shadow-md transition-all font-bold flex flex-col items-center gap-2 text-center"
            >
              <Send size={16} className="text-clinical-teal" />
              <span>Push to MyChart</span>
            </button>
            <button 
              onClick={handlePrint}
              className="bg-white hover:bg-slate-50 border border-border rounded-xl p-3 text-xs text-slate-700 dark:bg-slate-950 dark:text-slate-300 shadow hover:shadow-md transition-all font-bold flex flex-col items-center gap-2 text-center"
            >
              <Printer size={16} className="text-amber-500" />
              <span>Print paper draft</span>
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="bg-white hover:bg-slate-50 border border-border rounded-xl p-3 text-xs text-slate-700 dark:bg-slate-950 dark:text-slate-300 shadow hover:shadow-md transition-all font-bold flex flex-col items-center gap-2 text-center"
            >
              <Settings size={16} className="text-purple-500" />
              <span>Gemini config key</span>
            </button>
          </div>

        </div>

      </div>

      {/* Floating Smartphone Chassis overlay */}
      {showSmartphone && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border-8 border-slate-950 rounded-[44px] p-4 max-w-[360px] w-full shadow-2xl relative">
            <button 
              onClick={() => setShowSmartphone(false)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white flex items-center justify-center font-bold text-sm shadow-lg"
            >
              ×
            </button>
            
            {/* Phone Notch */}
            <div className="w-32 h-6 bg-slate-950 rounded-full mx-auto mb-4" />

            {/* Phone screen */}
            <div className="bg-white dark:bg-slate-950 rounded-[28px] p-4 text-slate-800 dark:text-slate-200 overflow-y-auto max-h-[520px] space-y-4">
              <div className="text-center border-b border-border pb-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Apollo Hospitals, Chennai</div>
                <h4 className="font-bold text-base mt-1">Your Visit Summary</h4>
                <div className="text-xs text-slate-500 font-semibold mt-0.5">{patient.name} · Stay: 5 days</div>
              </div>

              {/* Language pill toggle buttons */}
              <div className="flex gap-1.5 flex-wrap justify-center border-b border-border pb-3">
                {[
                  { key: 'en', label: 'EN' },
                  { key: 'ta', label: 'தமிழ்' },
                  { key: 'hi', label: 'हिंदी' },
                  { key: 'kn', label: 'ಕನ್ನಡ' },
                  { key: 'es', label: 'ES' }
                ].map((lang, idx) => (
                  <button 
                    key={idx}
                    onClick={() => { setPortalLang(lang.key as any); logAudit(`Translated patient portal summary into: ${lang.label}`); }}
                    className={`text-[10px] px-2.5 py-1 rounded-full border font-bold transition-all ${
                      portalLang === lang.key 
                        ? 'bg-clinical-teal text-white border-clinical-teal' 
                        : 'bg-white border-border hover:bg-slate-50 text-slate-600 dark:bg-slate-900'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 border-l-4 border-l-clinical-teal rounded-lg">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Why were you admitted?</div>
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed">{getLaySummary()?.why}</div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900 border-l-4 border-l-clinical-teal rounded-lg">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">What treatments did you receive?</div>
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed">{getLaySummary()?.treatments}</div>
                </div>

                {/* Prescription List */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">💊 Your medicines at home</div>
                  <div className="space-y-2">
                    {patient.medications.map((med, idx) => (
                      <div key={idx} className="p-2 bg-white dark:bg-slate-950 border border-border rounded-md text-[11px]">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{med.name}</div>
                        <div className="text-slate-400 mt-0.5">{med.instruction}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900 border-l-4 border-l-clinical-teal rounded-lg">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">What are follow-up directions?</div>
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {followupDate ? `${getLaySummary()?.followup.replace('Date pending physician entry.', '')} Scheduled OPD Checkup Date: ${followupDate}` : getLaySummary()?.followup}
                  </div>
                </div>

                {/* Mobile Red Warning list */}
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-lg text-red-800 dark:text-red-400">
                  <div className="text-xs font-bold flex items-center gap-1">
                    <span>⚠️ Go to emergency immediately if:</span>
                  </div>
                  <div className="text-[10px] mt-1.5 space-y-1 leading-relaxed font-semibold">
                    <div>• Temperature returns above 38.5°C</div>
                    <div>• Breathlessness gets difficult or worse</div>
                    <div>• Severe chest pressure or tightness occurs</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Numerical PIN Signature Modal overlay */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="glass-card max-w-sm w-full bg-white dark:bg-slate-900 border border-border rounded-xl p-6 text-center space-y-5 shadow-2xl relative">
            <button 
              onClick={() => { setShowSignModal(false); setPinValue(''); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm"
            >
              ×
            </button>
            <div className="w-12 h-12 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">Attending PIN Signature</h4>
              <p className="text-slate-400 text-xs mt-1">Verify summary records and enter your 4-digit signature code to release summary compositions.</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1.5 text-left text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Physician</span>
                <span className="font-bold text-slate-800 dark:text-slate-300">Dr. Sarah Reynolds, MD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Certification date</span>
                <span className="font-bold text-slate-800 dark:text-slate-300">{new Date().toLocaleDateString('en-IN')}</span>
              </div>
            </div>

            {/* Dotted password PIN wrapper */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-500">Enter your 4-digit signature PIN (Default: 1234)</div>
              
              <div className="flex justify-center gap-4">
                {[0, 1, 2, 3].map((idx) => {
                  const digit = pinValue[idx];
                  return (
                    <div 
                      key={idx} 
                      className={`w-10 h-12 border rounded-xl flex items-center justify-center font-bold text-base shadow-inner ${
                        digit 
                          ? 'border-primary-500 bg-primary-50/20 text-primary-600 ring-2 ring-primary-500/20' 
                          : 'border-border bg-slate-50'
                      }`}
                    >
                      {digit ? '•' : ''}
                    </div>
                  );
                })}
              </div>

              {/* Hidden textfield for numerical inputs */}
              <input 
                type="password"
                maxLength={4}
                value={pinValue}
                onChange={(e) => setPinValue(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-0 h-0 opacity-0 absolute"
                autoFocus
                id="pin-keypad"
              />
              <button 
                onClick={() => document.getElementById('pin-keypad')?.focus()}
                className="text-primary-600 font-bold text-xs hover:underline mt-1"
              >
                Click to focus and type PIN
              </button>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => { setShowSignModal(false); setPinValue(''); }}
                className="flex-1 px-4 py-2 border border-border hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 bg-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmPIN}
                disabled={pinValue.length < 4}
                className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-premium transition-all"
              >
                Verify &amp; Sign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Gemini Config Settings Modal overlay */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="glass-card max-w-sm w-full bg-white dark:bg-slate-900 border border-border rounded-xl p-6 space-y-5 shadow-2xl relative">
            <button 
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm"
            >
              ×
            </button>
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto">
              <Settings size={24} />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">Gemini AI Configuration</h4>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">Configuring Gemini API keys stores credentials securely inside browser storage cache.</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-left border border-border flex gap-2 text-[10px] text-slate-500 leading-relaxed font-semibold">
              <span>🔒</span>
              <span><strong>Privacy Policy:</strong> Keys stored locally via localStorage in-browser cache. Transcripts route directly to Google; no server registers patient logs.</span>
            </div>

            <div className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">Gemini API Key</label>
                <input 
                  type="password"
                  value={apiKey}
                  onChange={(e) => { setApiKey(e.target.value); localStorage.setItem('gemini_api_key', e.target.value); }}
                  placeholder="AIzaSy..."
                  className="w-full bg-white dark:bg-slate-950 border border-border rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">API Precision Model</label>
                <select 
                  value={apiModel}
                  onChange={(e) => { setApiModel(e.target.value); localStorage.setItem('gemini_api_model', e.target.value); }}
                  className="w-full bg-white dark:bg-slate-950 border border-border rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary-500/50"
                >
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash (Fastest)</option>
                  <option value="gemini-2.0-pro">Gemini 2.0 Pro (Clinical Precision)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => { setApiKey(''); localStorage.removeItem('gemini_api_key'); logAudit(`Gemini API key cleared from browser storage`); }}
                className="px-4 py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl text-xs font-semibold"
              >
                Clear Key
              </button>
              <button 
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-premium transition-all"
              >
                Save &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating QAS Staging Debug Controller console */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => setShowChaosPanel(!showChaosPanel)}
          className="bg-slate-800 hover:bg-slate-950 text-white font-semibold text-xs px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-slate-700 hover:-translate-y-0.5 transition-all"
        >
          <span>🛠️</span>
          <span>Staging Console</span>
        </button>

        {showChaosPanel && (
          <div className="absolute bottom-14 right-0 w-[280px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 text-left space-y-4 animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">🛠️ QAS Staging Controller</span>
              <button onClick={() => setShowChaosPanel(false)} className="text-slate-400 hover:text-white font-bold text-xs">×</button>
            </div>
            
            <div className="text-[10px] text-slate-400 leading-relaxed font-semibold">
              Inject warning alerts, latency delays, and connection faults to stress-test safety gates.
            </div>

            <div className="space-y-3">
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Inject Clinical Scenarios</div>
              <div className="flex flex-col gap-1.5">
                <button 
                  onClick={() => handleInjectQasScenario('ALLERGY')}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-[10px] py-1.5 px-3 rounded-lg text-left font-semibold flex items-center gap-1.5"
                >
                  <span>🚨</span> Penicillin Allergy Alert
                </button>
                <button 
                  onClick={() => handleInjectQasScenario('ASPIRIN')}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-[10px] py-1.5 px-3 rounded-lg text-left font-semibold flex items-center gap-1.5"
                >
                  <span>⚠️</span> Aspirin Omission Alert
                </button>
                <button 
                  onClick={() => handleInjectQasScenario('INSULIN')}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-[10px] py-1.5 px-3 rounded-lg text-left font-semibold flex items-center gap-1.5"
                >
                  <span>⚠️</span> Insulin Omission Alert
                </button>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-850 pt-3">
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Inject Connection Faults</div>
              <div className="flex flex-col gap-1.5">
                <button 
                  onClick={() => { setQasLatency(!qasLatency); logAudit(`QAS CHAOS: Latency Injector state: ${!qasLatency ? 'ACTIVE' : 'INACTIVE'}`); }}
                  className={`border text-[10px] py-1.5 px-3 rounded-lg text-left font-semibold flex items-center gap-1.5 transition-all ${
                    qasLatency 
                      ? 'bg-amber-600/30 border-amber-500 text-amber-300' 
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                  }`}
                >
                  <span>⏳</span> Latency Injector (8s)
                </button>
                <button 
                  onClick={() => { setQasError(!qasError); logAudit(`QAS CHAOS: API Fault Injector state: ${!qasError ? 'ACTIVE' : 'INACTIVE'}`); }}
                  className={`border text-[10px] py-1.5 px-3 rounded-lg text-left font-semibold flex items-center gap-1.5 transition-all ${
                    qasError 
                      ? 'bg-red-600/30 border-red-500 text-red-300 animate-pulse' 
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                  }`}
                >
                  <span>💥</span> Force API Error (HTTP 429)
                </button>
              </div>
            </div>

            <div className="border-t border-slate-850 pt-3">
              <button 
                onClick={handleResetQas}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold py-2 rounded-lg transition-all"
              >
                🔄 Reset All Sandbox States
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
