import React, { useState } from 'react';
import { Edit3, CheckCircle, Clock, AlertTriangle, FileText, ChevronDown, ChevronUp, Copy, Check, Sparkles, Save, RefreshCw } from 'lucide-react';

interface DraftSection {
  id: string;
  title: string;
  content: string;
  confidence: 'high' | 'medium' | 'low';
  lastUpdated: string;
  isExpanded?: boolean;
}

const INITIAL_DRAFTS: DraftSection[] = [
  {
    id: 'cc',
    title: 'Chief Complaint & Admission Reason',
    content: 'Patient presented to the ED on 09/14/2026 with severe shortness of breath, productive cough, and fever (102.1°F). Diagnosed with community-acquired pneumonia and admitted for IV antibiotics and oxygen therapy.',
    confidence: 'high',
    lastUpdated: '2 mins ago',
    isExpanded: true
  },
  {
    id: 'hpi',
    title: 'Hospital Course',
    content: 'Patient was started on IV Rocephin and Azithromycin. Required 2L O2 via nasal cannula for first 48 hours. Fever resolved by day 2. Transitioned to oral antibiotics on day 3. Respiratory status improved significantly, saturating 96% on room air prior to discharge.',
    confidence: 'high',
    lastUpdated: '1 min ago',
    isExpanded: true
  },
  {
    id: 'meds',
    title: 'Discharge Medications',
    content: '• Azithromycin 500mg PO daily x 3 days\n• Albuterol MDI 2 puffs Q4H PRN wheezing\n• Acetaminophen 650mg PO Q6H PRN pain/fever\n• Resume pre-admission medications (Lisinopril 10mg PO daily)',
    confidence: 'medium',
    lastUpdated: 'Just now',
    isExpanded: true
  },
  {
    id: 'fup',
    title: 'Follow-up Instructions',
    content: 'Follow up with Primary Care Provider Dr. Smith within 1 week. Return to ED immediately if experiencing worsening shortness of breath, chest pain, or return of fever > 101°F.',
    confidence: 'high',
    lastUpdated: 'Just now',
    isExpanded: false
  }
];

export const DraftPreview = () => {
  const [sections, setSections] = useState<DraftSection[]>(INITIAL_DRAFTS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, isExpanded: !s.isExpanded } : s
    ));
  };

  const handleEdit = (section: DraftSection) => {
    setEditingId(section.id);
    setEditContent(section.content);
    // Ensure expanded when editing
    setSections(sections.map(s => 
      s.id === section.id ? { ...s, isExpanded: true } : s
    ));
  };

  const handleSave = (id: string) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, content: editContent, lastUpdated: 'Just now', confidence: 'high' as const } : s
    ));
    setEditingId(null);
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getConfidenceBadge = (confidence: string) => {
    switch(confidence) {
      case 'high':
        return <span className="flex items-center gap-1 text-xs font-medium text-clinical-teal bg-clinical-teal/10 px-2 py-1 rounded-md border border-clinical-teal/20" role="status" aria-label="High AI Confidence"><CheckCircle size={12} aria-hidden="true" /> High Confidence</span>;
      case 'medium':
        return <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200" role="status" aria-label="Medium AI Confidence, Review Recommended"><AlertTriangle size={12} aria-hidden="true" /> Review Recommended</span>;
      case 'low':
        return <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-200" role="status" aria-label="Low AI Confidence, Needs Verification"><AlertTriangle size={12} aria-hidden="true" /> Needs Verification</span>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-card p-6 border-b-4 border-b-primary-500 rounded-t-xl rounded-b-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="text-primary-500" size={20} aria-hidden="true" />
            <h2 className="text-2xl font-bold text-foreground">AI Draft Summary</h2>
          </div>
          <p className="text-slate-500 flex items-center gap-2 text-sm" aria-live="polite">
            <Clock size={14} aria-hidden="true" /> Last updated by AI 2 mins ago
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-surface-hover text-slate-700 dark:text-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/50 bg-surface shadow-sm hover:shadow"
            aria-label="Regenerate all sections"
          >
            <RefreshCw size={16} className="text-primary-500" aria-hidden="true" />
            Regenerate All
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-md shadow-primary-500/20 transition-all hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            aria-label="Approve and sign discharge summary"
          >
            <CheckCircle size={16} aria-hidden="true" />
            Approve & Sign
          </button>
        </div>
      </div>

      {/* Editor Blocks */}
      <div className="space-y-4" role="list">
        {sections.map((section) => (
          <div 
            key={section.id} 
            className={`glass-card overflow-hidden transition-all duration-300 border-l-4 shadow-sm hover:shadow-md ${
              editingId === section.id 
                ? 'border-l-primary-500 shadow-lg shadow-primary-500/10 ring-1 ring-primary-500/20' 
                : section.confidence === 'medium' 
                  ? 'border-l-amber-500' 
                  : 'border-l-clinical-teal'
            }`}
            role="listitem"
          >
            {/* Block Header */}
            <div 
              className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
              onClick={() => editingId !== section.id && toggleExpand(section.id)}
              role="button"
              aria-expanded={section.isExpanded}
              aria-controls={`section-content-${section.id}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (editingId !== section.id) toggleExpand(section.id);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div className="text-slate-400 hover:text-slate-600 transition-colors" aria-hidden="true">
                  {section.isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <FileText size={16} className="text-slate-400" aria-hidden="true" />
                  {section.title}
                </h3>
                {getConfidenceBadge(section.confidence)}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium hidden md:inline-block">
                  <span className="sr-only">Last updated: </span>{section.lastUpdated}
                </span>
                
                {editingId !== section.id && (
                  <div className="flex gap-1">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleCopy(section.id, section.content); }}
                      className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                      aria-label={`Copy ${section.title} content to clipboard`}
                      title="Copy to clipboard"
                    >
                      {copiedId === section.id ? <Check size={16} className="text-green-500" aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEdit(section); }}
                      className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                      aria-label={`Edit ${section.title}`}
                      title="Edit section"
                    >
                      <Edit3 size={16} aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Block Content */}
            <div 
              id={`section-content-${section.id}`}
              className={`transition-all duration-300 ease-in-out ${
                section.isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
              }`}
              aria-hidden={!section.isExpanded}
            >
              <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
                {editingId === section.id ? (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label htmlFor={`edit-content-${section.id}`} className="sr-only">Edit content for {section.title}</label>
                    <textarea
                      id={`edit-content-${section.id}`}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full min-h-[120px] p-4 bg-white dark:bg-slate-950 border border-primary-300 dark:border-primary-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-inner text-slate-700 dark:text-slate-300 resize-y leading-relaxed"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500/50"
                        aria-label="Cancel editing"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleSave(section.id)}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-500/20 transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500/50 hover:-translate-y-0.5"
                        aria-label="Save changes"
                      >
                        <Save size={16} aria-hidden="true" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-300">
                    {section.content.split('\n').map((paragraph, i) => (
                      <p key={i} className={paragraph.startsWith('•') ? 'ml-4 my-1' : 'mb-3 last:mb-0'}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
