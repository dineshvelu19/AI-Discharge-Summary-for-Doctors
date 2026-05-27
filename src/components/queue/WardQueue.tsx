import React from 'react';
import { FileEdit, CheckCircle, Clock, AlertTriangle, ChevronRight, User } from 'lucide-react';
import { Patient } from '@/types/clinical';

export function WardQueue({ 
  patients, 
  selectedIndex, 
  onSelect 
}: { 
  patients: Patient[]; 
  selectedIndex: number; 
  onSelect: (index: number) => void; 
}) {

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ok':
        return (
          <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50 shadow-sm" role="status">
            <CheckCircle size={12} className="mr-1.5" aria-hidden="true" /> Approved
          </span>
        );
      case 'crit':
        return (
          <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50 shadow-sm animate-pulse" role="status">
            <AlertTriangle size={12} className="mr-1.5" aria-hidden="true" /> Critical Flag
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 shadow-sm" role="status">
            <FileEdit size={12} className="mr-1.5 animate-pulse" aria-hidden="true" /> AI Drafting...
          </span>
        );
      case 'pend':
      default:
        return (
          <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 shadow-sm" role="status">
            <Clock size={12} className="mr-1.5" aria-hidden="true" /> Pending Review
          </span>
        );
    }
  };

  const getConfidenceScore = (patient: Patient) => {
    if (patient.status === 'ok') return 98;
    if (patient.status === 'crit') return 76;
    return 88;
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 80) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Ward Queue</h1>
          <p className="text-slate-500 mt-1">Manage and review AI-generated discharge summaries.</p>
        </div>
        
        <div 
          className="flex bg-surface-hover p-1 rounded-lg border border-border inline-flex"
          role="group"
          aria-label="Filter patients"
        >
          <button 
            className="px-4 py-1.5 text-sm font-medium rounded-md bg-white shadow-sm text-foreground dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
            aria-pressed="true"
          >
            My Patients ({patients.length})
          </button>
          <button 
            className="px-4 py-1.5 text-sm font-medium rounded-md text-slate-500 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all hover:bg-white/50 dark:hover:bg-slate-800/50"
            aria-pressed="false"
          >
            All Ward (24)
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" aria-label="Patients Ward Queue">
            <thead>
              <tr className="border-b border-border bg-surface-hover/50 text-xs uppercase tracking-wider text-slate-500">
                <th scope="col" className="px-6 py-4 font-medium">Patient Details</th>
                <th scope="col" className="px-6 py-4 font-medium">Location</th>
                <th scope="col" className="px-6 py-4 font-medium">Primary Diagnosis</th>
                <th scope="col" className="px-6 py-4 font-medium">Status</th>
                <th scope="col" className="px-6 py-4 font-medium text-center">AI Confidence</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {patients.map((patient, index) => {
                const primaryDiag = patient.diagnosis.split('\n')[0].replace('Primary: ', '');
                const score = getConfidenceScore(patient);
                return (
                  <tr 
                    key={index} 
                    onClick={() => onSelect(index)}
                    className={`hover:bg-surface-hover/80 transition-colors duration-200 group cursor-pointer ${
                      selectedIndex === index ? 'bg-primary-50/30 dark:bg-primary-950/10' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3 shrink-0 dark:bg-primary-900/50 dark:text-primary-400 group-hover:bg-primary-200 group-hover:scale-105 transition-all duration-200">
                          <User size={18} aria-hidden="true" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground group-hover:text-primary-600 transition-colors">
                            {patient.name}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center mt-0.5">
                            <span>{patient.mrd}</span>
                            <span className="mx-1.5" aria-hidden="true">•</span>
                            <span aria-label={`Age ${patient.age}, Gender ${patient.gender}`}>{patient.age}y • {patient.gender}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm font-medium text-foreground group-hover:text-primary-700 transition-colors">
                        {patient.ward}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        <span className="sr-only">Admission date: </span>Adm: {patient.admDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-foreground line-clamp-2 max-w-xs group-hover:text-primary-700 transition-colors">
                        {primaryDiag}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(patient.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center justify-center bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full border border-border shadow-sm">
                        <span className={`text-sm font-bold ${getConfidenceColor(score)}`}>
                          {score}%
                        </span>
                        {score < 80 && (
                          <AlertTriangle size={14} className="ml-1.5 text-amber-500" aria-label="Low confidence warning" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-primary-50 text-slate-400 hover:text-primary-600 transition-all duration-200 group-hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-primary-500/50 dark:hover:bg-primary-900/30"
                        aria-label={`View details for ${patient.name}`}
                      >
                        <ChevronRight size={20} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
