import React from 'react';
import { Home, Users, FileText, Settings, Activity, Clock } from 'lucide-react';
import Link from 'next/link';

export function Sidebar() {
  const navItems = [
    { icon: <Home size={20} aria-hidden="true" />, label: 'Dashboard', href: '#' },
    { icon: <Users size={20} aria-hidden="true" />, label: 'Ward Queue', href: '#', active: true },
    { icon: <FileText size={20} aria-hidden="true" />, label: 'Templates', href: '#' },
    { icon: <Activity size={20} aria-hidden="true" />, label: 'Analytics', href: '#' },
    { icon: <Settings size={20} aria-hidden="true" />, label: 'Settings', href: '#' },
  ];

  return (
    <aside 
      className="w-64 h-screen border-r border-border glass flex flex-col fixed left-0 top-0 z-10 transition-colors duration-300 shadow-sm"
      aria-label="Sidebar"
    >
      <div className="p-6 flex items-center space-x-3">
        <div 
          className="w-8 h-8 rounded-lg bg-gradient-to-tr from-clinical-teal to-primary-500 flex items-center justify-center shadow-md transition-transform hover:scale-105 duration-200"
          aria-hidden="true"
        >
          <Activity size={18} className="text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight text-foreground cursor-default">QuickDischarge</span>
      </div>

      <div className="px-4 pb-6 mt-4 flex-1 overflow-y-auto">
        <div 
          className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2"
          id="clinical-tools-heading"
        >
          Clinical Tools
        </div>
        <nav className="space-y-1" aria-labelledby="clinical-tools-heading">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 ${
                item.active
                  ? 'bg-primary-50 text-primary-600 font-medium shadow-sm border border-primary-100 dark:bg-primary-900/30 dark:border-primary-900/50 dark:text-primary-500'
                  : 'text-slate-600 hover:bg-surface-hover hover:text-foreground hover:shadow-sm dark:text-slate-400'
              }`}
              aria-current={item.active ? 'page' : undefined}
            >
              <div className={`${item.active ? 'text-primary-500' : 'text-slate-400 group-hover:text-primary-400 transition-colors duration-200'}`}>
                {item.icon}
              </div>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="mt-8">
          <div 
            className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2"
            id="recent-activity-heading"
          >
            Recent Activity
          </div>
          <div 
            className="space-y-3 px-2"
            aria-labelledby="recent-activity-heading"
            role="list"
          >
            <div className="flex items-start space-x-3 group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-surface-hover transition-colors duration-200" role="listitem">
              <div className="mt-0.5 text-clinical-teal group-hover:scale-110 transition-transform duration-200"><Clock size={14} aria-hidden="true" /></div>
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary-600 transition-colors duration-200">John Doe (Bed 14)</p>
                <p className="text-xs text-slate-500">Draft saved 10m ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-surface-hover transition-colors duration-200" role="listitem">
              <div className="mt-0.5 text-clinical-teal group-hover:scale-110 transition-transform duration-200"><Clock size={14} aria-hidden="true" /></div>
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary-600 transition-colors duration-200">Jane Smith (Bed 02)</p>
                <p className="text-xs text-slate-500">Completed 1h ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <button 
          className="w-full flex items-center space-x-3 px-2 py-2 rounded-xl hover:bg-surface-hover transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-left"
          aria-label="User profile settings for Dr. Reynolds"
        >
          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold shadow-sm dark:bg-primary-900 dark:text-primary-100">
            DR
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Dr. Reynolds</p>
            <p className="text-xs text-slate-500 truncate">Attending Physician</p>
          </div>
        </button>
      </div>
    </aside>
  );
}
