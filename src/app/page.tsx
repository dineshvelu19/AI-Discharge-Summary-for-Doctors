'use client';

import React, { useState } from 'react';
import { WardQueue } from '@/components/queue/WardQueue';
import { DemographicsHeader } from '@/components/patient/DemographicsHeader';
import { FileText, Sparkles, Activity, FileCheck, BrainCircuit, ArrowLeft } from 'lucide-react';
import { AILoader } from '@/components/ui/AILoader';
import { DraftPreview } from '@/components/draft/DraftPreview';

export default function Home() {
  const [view, setView] = useState<'dashboard' | 'generating' | 'draft'>('dashboard');
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Synthesizing clinical data...");

  const startGeneration = () => {
    setView('generating');
    setProgress(0);
    
    const statuses = [
      "Synthesizing clinical data...",
      "Analyzing recent lab results...",
      "Reviewing hospital course...",
      "Extracting discharge medications...",
      "Finalizing draft summary..."
    ];
    
    let currentProgress = 0;
    let statusIndex = 0;
    
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 5;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => setView('draft'), 800);
      } else {
        // Change status text occasionally
        if (Math.random() > 0.5 && statusIndex < statuses.length - 1) {
          statusIndex++;
          setStatusText(statuses[statusIndex]);
        }
      }
      
      setProgress(currentProgress);
    }, 600);
  };

  if (view === 'generating') {
    return (
      <main className="max-w-7xl mx-auto min-h-[80vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-500">
        <AILoader progress={progress} status={statusText} />
      </main>
    );
  }

  if (view === 'draft') {
    return (
      <main className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setView('dashboard')}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors mb-4 group focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded-md p-1"
          aria-label="Navigate back to Dashboard"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
          Back to Dashboard
        </button>
        <DraftPreview />
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Good Morning, Dr. Reynolds</h1>
          <p className="text-slate-500 mt-1">Here&apos;s your clinical overview for today, September 16, 2026.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            className="glass flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:bg-surface-hover transition-colors shadow-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            aria-label="View sign-out report"
          >
            <Activity size={16} className="text-primary-500" aria-hidden="true" />
            Sign-out Report
          </button>
          <button 
            onClick={startGeneration}
            className="bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-md shadow-primary-500/20 focus:outline-none focus:ring-2 focus:ring-primary-500/50 hover:shadow-lg hover:-translate-y-0.5"
            aria-label="Generate all pending drafts"
          >
            <Sparkles size={16} aria-hidden="true" />
            Generate All Drafts
          </button>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6" aria-label="Dashboard statistics">
        {[
          { label: 'Active Patients', value: '24', icon: <Activity className="text-blue-500" aria-hidden="true" />, trend: '+2 today' },
          { label: 'Pending Summaries', value: '7', icon: <FileText className="text-amber-500" aria-hidden="true" />, trend: '3 high priority' },
          { label: 'Ready to Sign', value: '4', icon: <FileCheck className="text-green-500" aria-hidden="true" />, trend: 'Needs review' },
          { label: 'AI Time Saved', value: '2.5h', icon: <BrainCircuit className="text-purple-500" aria-hidden="true" />, trend: 'This week' },
        ].map((stat, i) => (
          <div 
            key={i} 
            className="glass-card p-5 flex flex-col justify-between hover:border-primary-200 dark:hover:border-primary-800/50 transition-colors shadow-sm hover:shadow-md cursor-default"
            tabIndex={0}
            aria-label={`${stat.label}: ${stat.value}. ${stat.trend}`}
          >
            <div className="flex justify-between items-start mb-4" aria-hidden="true">
              <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center shadow-sm">
                {stat.icon}
              </div>
              <span className="text-xs font-medium text-slate-500 bg-surface px-2 py-1 rounded-md border border-border">
                {stat.trend}
              </span>
            </div>
            <div aria-hidden="true">
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Demographics Preview */}
      <section aria-label="Current Patient Context">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Current Patient Context</h2>
          <button 
            className="text-sm text-primary-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500/50 rounded-md px-1"
            aria-label="View full chart for current patient"
          >
            View Full Chart
          </button>
        </div>
        <DemographicsHeader />
      </section>

      {/* Ward Queue */}
      <section className="pt-4" aria-label="Ward Queue Section">
        <WardQueue />
      </section>
    </main>
  );
}
