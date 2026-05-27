// supabase/functions/_shared/safety_gate.ts

export interface Medication {
  name: string;
  dosage?: string;
  frequency?: string;
}

export interface Allergy {
  drug: string;
  severity?: string;
}

export interface SafetyGateResult {
  passed: boolean;
  warnings: string[];
}

export function runSafetyGate(
  draftText: string,
  medications: Medication[],
  allergies: Allergy[]
): SafetyGateResult {
  const warnings: string[] = [];
  const lowercaseDraft = draftText.toLowerCase();

  // 1. Check for Allergy Clashes
  for (const allergy of allergies) {
    if (!allergy.drug) continue;
    const drugName = allergy.drug.toLowerCase();
    
    // Check if allergic drug is prescribed or mentioned
    if (lowercaseDraft.includes(drugName)) {
      warnings.push(`POTENTIAL ALLERGY CLASH: Patient is allergic to ${allergy.drug}, but it is mentioned in the clinical draft.`);
    }
    
    // Check prescribed medications
    for (const med of medications) {
      if (med.name && med.name.toLowerCase().includes(drugName)) {
         warnings.push(`CRITICAL ALLERGY CLASH: Patient is prescribed ${med.name} but has a recorded allergy to ${allergy.drug}.`);
      }
    }
  }

  // 2. Standard guideline omissions (e.g. Aspirin required for STEMI)
  const isSTEMI = lowercaseDraft.includes("stemi") || 
                  lowercaseDraft.includes("heart attack") || 
                  lowercaseDraft.includes("myocardial infarction");
                  
  if (isSTEMI) {
    const hasAspirin = lowercaseDraft.includes("aspirin") || 
                       medications.some(m => m.name && m.name.toLowerCase().includes("aspirin"));
    if (!hasAspirin) {
      warnings.push("GUIDELINE OMISSION: Patient has a STEMI/Heart Attack diagnosis, but Aspirin is not mentioned in treatments or medications.");
    }
  }

  return {
    passed: warnings.length === 0,
    warnings
  };
}
