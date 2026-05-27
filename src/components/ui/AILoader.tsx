import React from 'react';
import { BrainCircuit, Sparkles } from 'lucide-react';

interface AILoaderProps {
  status?: string;
  progress?: number;
}

export const AILoader: React.FC<AILoaderProps> = ({ 
  status = "Synthesizing clinical data...",
  progress
}) => {
  return (
    <div 
      className="flex flex-col items-center justify-center p-12 glass-card space-y-8 w-full max-w-lg mx-auto relative overflow-hidden border border-primary-500/20 shadow-premium"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Background shimmering effects */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/5 via-purple-500/5 to-clinical-teal/5 animate-pulse" aria-hidden="true"></div>
      
      {/* Animated blobs */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-blob" aria-hidden="true"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" aria-hidden="true"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-clinical-teal/10 rounded-full blur-3xl animate-blob animation-delay-500" aria-hidden="true"></div>
      
      <div className="relative flex items-center justify-center mt-4" aria-hidden="true">
        {/* Outer glowing rings */}
        <div className="absolute w-32 h-32 border-2 border-primary-500/20 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        <div className="absolute w-28 h-28 border-2 border-purple-500/30 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] animation-delay-500"></div>
        <div className="absolute w-24 h-24 border-2 border-clinical-teal/40 rounded-full animate-spin-slow border-t-transparent border-l-transparent"></div>
        <div className="absolute w-20 h-20 border border-primary-400/50 rounded-full animate-[spin_4s_linear_infinite_reverse] border-b-transparent"></div>
        
        {/* Center icon */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-primary-600 via-purple-600 to-clinical-teal-dark flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] z-10">
          <BrainCircuit className="text-white animate-pulse" size={32} />
          <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-50"></div>
        </div>
        
        {/* Sparkles */}
        <Sparkles className="absolute -top-4 -right-6 text-amber-400 animate-bounce shadow-amber-400/50" size={20} />
        <Sparkles className="absolute -bottom-6 -left-4 text-clinical-teal animate-bounce animation-delay-700" size={16} />
        <Sparkles className="absolute top-8 -left-8 text-purple-400 animate-pulse animation-delay-500" size={14} />
      </div>
      
      <div className="relative text-center z-10 w-full space-y-3">
        <h3 className="text-xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-clinical-teal bg-clip-text text-transparent animate-pulse drop-shadow-sm">
          AI Agent Drafting
        </h3>
        
        <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 font-medium bg-white/50 dark:bg-slate-800/50 py-1.5 px-4 rounded-full border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm w-max mx-auto shadow-sm">
          <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" aria-hidden="true"></div>
          <span aria-live="polite">{status}</span>
        </div>
        
        {/* Loading bar */}
        <div 
          className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-6 overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700 relative"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={status}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 via-purple-500 to-clinical-teal transition-all duration-300 ease-out"
            style={{ width: progress !== undefined ? `${progress}%` : '100%' }}
          >
            {progress === undefined && (
               <div className="absolute inset-0 bg-white/20 w-[200%] animate-slide" aria-hidden="true"></div>
            )}
          </div>
        </div>
        {progress !== undefined && (
          <div className="text-xs text-right text-slate-500 font-medium mt-1" aria-hidden="true">{progress}% Complete</div>
        )}
      </div>
    </div>
  );
};
