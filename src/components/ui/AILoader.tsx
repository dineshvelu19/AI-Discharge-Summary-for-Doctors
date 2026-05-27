'use client';

import React from 'react';
import { Brain } from 'lucide-react';

interface AILoaderProps {
  progress: number;
  status: string;
}

export function AILoader({ progress, status }: AILoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md">
      <div className="mb-8 relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-900"></div>
        <div 
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 dark:border-t-primary-400 transition-transform duration-300"
          style={{ 
            transform: `rotate(${(progress / 100) * 360}deg)`,
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className="text-primary-600 dark:text-primary-400" size={32} />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-4 text-center">Generating Discharge Summary</h3>
      
      <div className="w-full mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{status}</p>
          <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">{progress}%</p>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <p className="text-sm text-slate-500 text-center">This may take a moment as we analyze clinical data and generate your summary...</p>
    </div>
  );
}