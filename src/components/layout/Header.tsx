import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

export function Header() {
  return (
    <header 
      className="h-16 border-b border-border glass flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm"
      role="banner"
    >
      <div className="flex items-center">
        <button 
          className="md:hidden mr-4 text-slate-500 hover:text-foreground transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          aria-label="Toggle mobile menu"
          aria-expanded="false"
        >
          <Menu size={24} aria-hidden="true" />
        </button>
        <div className="relative group">
          <Search 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" 
            size={18} 
            aria-hidden="true" 
          />
          <label htmlFor="global-search" className="sr-only">Search patients</label>
          <input 
            id="global-search"
            type="search" 
            placeholder="Search patients, MRN, conditions..." 
            className="pl-10 pr-4 py-2 w-64 md:w-96 rounded-full border border-border bg-surface-hover/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-slate-400 hover:bg-surface-hover focus:bg-surface dark:placeholder:text-slate-500 dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:focus:bg-slate-900"
            aria-label="Search patients, MRN, or conditions"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          className="relative p-2 text-slate-500 hover:text-foreground transition-all duration-200 rounded-full hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary-500/50 hover:shadow-sm"
          aria-label="View notifications"
        >
          <Bell size={20} aria-hidden="true" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-background" aria-hidden="true"></span>
        </button>
        
        <div 
          className="hidden md:flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 shadow-sm cursor-default hover:bg-green-100 transition-colors duration-200"
          role="status"
          aria-label="System is HIPAA Secure"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse" aria-hidden="true"></div>
          HIPAA Secure
        </div>
      </div>
    </header>
  );
}
