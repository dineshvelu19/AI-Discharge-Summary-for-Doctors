export interface Medication {
  name: string;
  instruction: string;
}

export interface TranslationSet {
  why: string;
  treatments: string;
  restrictions: string;
  warnings: string;
  followup: string;
}

export interface Patient {
  name: string;
  age: string;
  gender: string;
  mrd: string;
  abha: string;
  admDate: string;
  disDate: string;
  ward: string;
  physician: string;
  status: 'crit' | 'pend' | 'ok' | 'draft';
  step: number;
  scraped: boolean;
  critResolved: boolean;
  followupDate: string;
  rawNotes: string;
  diagnosis: string;
  chiefComplaint: string;
  clinicalFindings: string;
  investigations: string;
  condition: string;
  medications: Medication[];
  icdCodeIndex: number;
  icdOptions: { code: string; desc: string }[];
  translations: {
    en: TranslationSet;
    ta?: TranslationSet;
    hi?: TranslationSet;
    kn?: TranslationSet;
    es?: TranslationSet;
    [key: string]: TranslationSet | undefined;
  };
}
