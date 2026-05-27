'use client';

import React from 'react';

export function DemographicsHeader() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-slate-500">Patient Name</p>
          <p className="text-lg font-semibold text-foreground">John Doe</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">MRN</p>
          <p className="text-lg font-semibold text-foreground">123456</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Age</p>
          <p className="text-lg font-semibold text-foreground">45</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Room</p>
          <p className="text-lg font-semibold text-foreground">301-B</p>
        </div>
      </div>
    </div>
  );
}