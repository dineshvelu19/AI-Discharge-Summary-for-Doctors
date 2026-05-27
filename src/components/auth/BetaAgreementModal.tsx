"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";

export default function BetaAgreementModal({ children }: { children: React.ReactNode }) {
  const [accepted, setAccepted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setIsMounted(true);
    // Optional: read from localStorage to skip if already accepted in this session
    // const hasAccepted = sessionStorage.getItem("beta-accepted");
    // if (hasAccepted === "true") setAccepted(true);
  }, []);

  if (!isMounted) return null;

  if (accepted) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md"></div>
      
      {/* Modal */}
      <div className="glass-card relative z-10 w-full max-w-md overflow-hidden bg-surface/50 p-8 shadow-2xl">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-clinical-teal to-primary-600"></div>
        
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100/50 text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-200/50 dark:border-red-800/50">
            <ShieldAlert size={32} strokeWidth={1.5} />
          </div>
        </div>
        
        <h2 className="mb-2 text-center text-2xl font-bold tracking-tight text-foreground">
          Beta Testing Agreement
        </h2>
        
        <div className="mb-8 space-y-4 text-sm text-foreground/80">
          <p className="text-center">
            Welcome to the QuickDischarge 2.0 Beta. Before proceeding, please acknowledge the following critical constraint:
          </p>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
            <p className="font-semibold text-red-800 dark:text-red-300">
              DO NOT USE REAL PATIENT PROTECTED HEALTH INFORMATION (PHI).
            </p>
            <p className="mt-2 text-xs text-red-700 dark:text-red-400 leading-relaxed">
              This system is currently in beta testing phase. Any data entered must be fully anonymized or synthetic. No actual patient names, MRNs, DOBs, or other identifying details should be submitted.
            </p>
          </div>
        </div>
        
        <button
          onClick={() => {
            setAccepted(true);
            // sessionStorage.setItem("beta-accepted", "true");
          }}
          className="group relative flex w-full justify-center overflow-hidden rounded-lg bg-clinical-teal px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-clinical-teal-dark hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-clinical-teal focus:ring-offset-2 focus:ring-offset-background"
        >
          <span className="absolute inset-0 w-full h-full bg-white/20 group-hover:translate-x-full ease-out duration-300 transition-transform -translate-x-full"></span>
          <span className="relative flex items-center gap-2">
            I Understand and Accept
            <CheckCircle2 size={18} />
          </span>
        </button>
      </div>
    </div>
  );
}
