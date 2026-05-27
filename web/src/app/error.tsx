'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-500" />
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
        Something went wrong
      </h2>
      
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
        We encountered an unexpected error while loading this page. This could be due to a network timeout or temporary service disruption.
      </p>
      
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md shadow-primary-500/20"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
        
        <button
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-12 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg text-left overflow-auto max-w-2xl w-full">
          <p className="text-sm font-mono text-red-500 font-bold mb-2">Error Details:</p>
          <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {error.message || 'Unknown error occurred'}
            {'\n\n'}
            {error.stack}
          </pre>
        </div>
      )}
    </div>
  );
}
