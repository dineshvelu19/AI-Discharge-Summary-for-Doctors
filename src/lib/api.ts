// API Contract for QuickDischarge 2.0
// Interacts with Supabase Edge Functions

const API_BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL 
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`
  : 'http://127.0.0.1:54321/functions/v1';

const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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
 * Helper to handle fetch responses and error parsing robustly.
 */
async function handleResponse(response: Response, defaultMessage: string, context: string) {
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMsg = defaultMessage;
    
    if (contentType?.includes('application/json')) {
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorMsg;
      } catch {
        errorMsg = `Server error: ${response.status} ${response.statusText}`;
      }
    } else {
      try {
        const textData = await response.text();
        errorMsg = textData || errorMsg;
      } catch {
        errorMsg = `Server error: ${response.status} ${response.statusText}`;
      }
    }
    
    console.error(`[API Error] ${context} - ${response.status}:`, errorMsg);
    throw new Error(errorMsg);
  }

  return response.json();
}

/**
 * Ingests a batch of EMR records.
 * The edge function will generate vector embeddings and insert them into the `emr_records` table.
 */
export async function ingestRecords(records: EMRRecord[]) {
  try {
    const response = await fetch(`${API_BASE_URL}/ingest_records`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ records }),
    });

    return await handleResponse(response, 'Failed to ingest records', 'POST /ingest_records');
  } catch (error) {
    if (error instanceof TypeError) {
      console.error('[Network Error] ingestRecords:', error.message);
      throw new Error('Network connection failed. Please check your internet and try again.');
    }
    throw error;
  }
}

/**
 * Generates a draft discharge summary for a given patient utilizing the RAG engine.
 */
export async function generateDraft(patientId: string, instructions?: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/generate_draft`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ patient_id: patientId, instructions }),
    });

    return await handleResponse(response, 'Failed to generate draft', 'POST /generate_draft');
  } catch (error) {
    if (error instanceof TypeError) {
      console.error('[Network Error] generateDraft:', error.message);
      throw new Error('Network connection failed. Please check your internet and try again.');
    }
    throw error;
  }
}

/**
 * Approves and finalizes a drafted discharge summary.
 */
export async function approveDraft(draftId: string, finalContent?: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/approve_draft`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ draft_id: draftId, final_content: finalContent }),
    });

    return await handleResponse(response, 'Failed to approve draft', 'POST /approve_draft');
  } catch (error) {
    if (error instanceof TypeError) {
      console.error('[Network Error] approveDraft:', error.message);
      throw new Error('Network connection failed. Please check your internet and try again.');
    }
    throw error;
  }
}
