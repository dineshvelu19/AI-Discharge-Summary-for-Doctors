'use client';

import React from 'react';

export function WardQueue() {
  const patients = [
    { id: 1, name: 'Patient A', status: 'Pending', priority: 'High' },
    { id: 2, name: 'Patient B', status: 'In Progress', priority: 'Medium' },
    { id: 3, name: 'Patient C', status: 'Ready', priority: 'Low' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold text-foreground">Ward Queue</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">Patient</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-slate-600 dark:text-slate-400">Priority</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-4 text-sm text-foreground">{patient.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{patient.status}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    patient.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                    patient.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {patient.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}