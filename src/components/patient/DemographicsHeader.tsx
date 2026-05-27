import React from 'react';
import { Calendar, User, Phone, MapPin, Activity, ShieldAlert } from 'lucide-react';
import { Patient } from '@/types/clinical';

export function DemographicsHeader({ patient }: { patient: Patient }) {
  const initials = patient.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isFallRisk = patient.status === 'crit';

  return (
    <section 
      className="glass-card p-6 border-l-4 border-l-clinical-teal relative overflow-hidden shadow-premium transition-all duration-300 hover:shadow-lg"
      aria-labelledby="patient-name-heading"
    >
      {/* Decorative background element */}
      <div 
        className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-primary-50/50 to-transparent pointer-events-none dark:from-primary-900/10" 
        aria-hidden="true" 
      />
      
      <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
        <div className="flex items-start gap-5">
          <div 
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 border border-primary-200 flex items-center justify-center text-primary-600 shadow-sm shrink-0 dark:from-slate-800 dark:to-slate-700 dark:border-slate-600 dark:text-primary-400 group-hover:scale-105 transition-transform duration-300"
            aria-hidden="true"
          >
            <span className="text-2xl font-bold">{initials}</span>
          </div>
          
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 id="patient-name-heading" className="text-2xl font-bold text-foreground tracking-tight">{patient.name}</h2>
              <span 
                className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 shadow-sm"
                aria-label={`Patient ID ${patient.mrd}`}
              >
                {patient.mrd}
              </span>
              {isFallRisk && (
                <div 
                  className="flex items-center text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50 shadow-sm"
                  role="status"
                >
                  <ShieldAlert size={12} className="mr-1" aria-hidden="true" />
                  Fall Risk
                </div>
              )}
            </div>
            
            <div 
              className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500 mt-3"
              aria-label="Patient details"
            >
              <div className="flex items-center gap-1.5 hover:text-foreground transition-colors duration-200">
                <User size={14} className="text-slate-400" aria-hidden="true" />
                <span aria-label={`Age ${patient.age}, Gender ${patient.gender}`}>{patient.age}y • {patient.gender}</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-foreground transition-colors duration-200">
                <Calendar size={14} className="text-slate-400" aria-hidden="true" />
                <span aria-label={`ABHA ID: ${patient.abha}`}>ABHA ID: {patient.abha}</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-foreground transition-colors duration-200">
                <Activity size={14} className="text-slate-400" aria-hidden="true" />
                <span>Admitted: {patient.admDate}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 md:items-end">
          <div className="text-right">
            <div className="text-xs text-slate-500 mb-1" id="attending-physician-label">Attending Physician</div>
            <div className="text-sm font-medium text-foreground" aria-labelledby="attending-physician-label">{patient.physician}</div>
          </div>
          <div className="flex gap-4">
            <div className="glass px-4 py-2 rounded-lg flex flex-col hover:bg-surface-hover transition-colors duration-200">
              <span className="text-xs text-slate-500 mb-0.5" id="location-label">Location</span>
              <span className="text-sm font-semibold text-foreground flex items-center gap-1.5" aria-labelledby="location-label">
                <MapPin size={14} className="text-clinical-teal" aria-hidden="true" />
                {patient.ward}
              </span>
            </div>
            <div className="glass px-4 py-2 rounded-lg flex flex-col hover:bg-surface-hover transition-colors duration-200">
              <span className="text-xs text-slate-500 mb-0.5" id="code-status-label">Code Status</span>
              <span className="text-sm font-semibold text-primary-600 flex items-center gap-1.5" aria-labelledby="code-status-label">
                <Activity size={14} aria-hidden="true" />
                Full Code
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
