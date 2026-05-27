'use client';

import React from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-8">
        <Menu className="text-primary-600" size={24} />
        <h1 className="text-lg font-bold text-foreground">QuickDischarge</h1>
      </div>
      <nav className="space-y-2">
        <div className="text-sm font-medium text-slate-500 px-3 py-2">Navigation</div>
        <Link href="/" className="block px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          Dashboard
        </Link>
        <a href="#" className="block px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          Drafts
        </a>
        <a href="#" className="block px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          Patients
        </a>
      </nav>
    </aside>
  );
}