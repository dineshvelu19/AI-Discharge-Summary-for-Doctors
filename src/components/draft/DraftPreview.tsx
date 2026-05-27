'use client';

import React from 'react';
import { Download, Share2, Edit } from 'lucide-react';

export function DraftPreview() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Discharge Summary Draft</h2>
          <p className="text-sm text-slate-500 mt-1">Patient: John Doe | MRN: 123456</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <Edit size={16} />
            Edit
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <Share2 size={16} />
            Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
            <Download size={16} />
            Download
          </button>
        </div>
      </div>
      <div className="prose dark:prose-invert max-w-none">
        <div className="text-foreground leading-relaxed space-y-4">
          <p><strong>Admission Date:</strong> September 10, 2026</p>
          <p><strong>Discharge Date:</strong> September 16, 2026</p>
          <p><strong>Chief Complaint:</strong> Chest pain and shortness of breath</p>
          <h3 className="font-semibold mt-4">Hospital Course:</h3>
          <p>Patient was admitted with acute chest pain and dyspnea. Comprehensive cardiac workup was initiated...</p>
          <h3 className="font-semibold mt-4">Medications on Discharge:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Aspirin 81mg daily</li>
            <li>Lisinopril 10mg daily</li>
            <li>Atorvastatin 40mg daily</li>
          </ul>
          <h3 className="font-semibold mt-4">Follow-up:</h3>
          <p>Follow up with cardiology in 2 weeks and primary care in 1 week.</p>
        </div>
      </div>
    </div>
  );
}