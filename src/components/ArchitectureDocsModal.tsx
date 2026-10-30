import React, { useState } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Database, 
  Compass, 
  Layers, 
  Palette, 
  GitBranch, 
  FileText,
  X
} from 'lucide-react';
import { ARCHITECTURE_DOCS } from '../data/architectureDocs';

interface ArchitectureDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeDocId, setActiveDocId] = useState('prd');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const currentDoc = ARCHITECTURE_DOCS.find(d => d.id === activeDocId) || ARCHITECTURE_DOCS[0];

  const handleCopyMarkdown = () => {
    navigator.clipboard?.writeText?.(currentDoc.markdownContent);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadDoc = () => {
    const blob = new Blob([currentDoc.markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDoc.id}-afrokreyol-kitchen.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDocIcon = (id: string) => {
    switch (id) {
      case 'prd': return FileText;
      case 'trd': return Layers;
      case 'appflow': return GitBranch;
      case 'ui-ux': return Palette;
      case 'backend-schema': return Database;
      default: return Compass;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center-safe justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-3xl shadow-2xl border border-[#E8DFD1] overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DFD1] bg-[#FAF7F2] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#1B4332] text-white">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[#1A1615]">
                Dossier d'Architecture & Spécifications Senior Dev
              </h2>
              <p className="text-xs text-[#7A6E63]">
                PRD, TRD, AppFlow, UI/UX Design Brief, Schéma Supabase & Roadmap
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8DFD1] hover:bg-white text-xs font-semibold text-[#1A1615] transition-colors"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  <span>Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier le texte / SQL</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadDoc}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-white text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger (.md)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#7A6E63] hover:text-[#1A1615] hover:bg-[#E8DFD1]/50 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-[#F3EDE2] border-b border-[#E8DFD1] overflow-x-auto scrollbar-none shrink-0">
          {ARCHITECTURE_DOCS.map((doc) => {
            const Icon = getDocIcon(doc.id);
            const isActive = activeDocId === doc.id;
            return (
              <button
                key={doc.id}
                onClick={() => setActiveDocId(doc.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1A1615] text-white shadow-xs'
                    : 'text-[#5C4F44] hover:bg-[#FAF7F2]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F4A261]' : 'text-[#8C7D70]'}`} />
                <span>{doc.title.split('(')[0].trim()}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-[#7A6E63]'
                }`}>
                  {doc.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Markdown Content Display */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6 font-sans">
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD1] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#D9532F] uppercase tracking-wider block">
                {currentDoc.badge}
              </span>
              <h3 className="font-serif font-bold text-lg text-[#1A1615] mt-0.5">
                {currentDoc.title}
              </h3>
              <p className="text-xs text-[#7A6E63] mt-1">
                {currentDoc.summary}
              </p>
            </div>

            {currentDoc.id === 'backend-schema' && (
              <span className="px-3 py-1.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold font-mono">
                PostgreSQL 16 / Supabase
              </span>
            )}
          </div>

          {/* Formatted Content */}
          <div className="prose prose-sm max-w-none text-[#1A1615] space-y-4">
            <pre className="p-5 rounded-2xl bg-[#1A1615] text-[#FAF7F2] text-xs font-mono overflow-x-auto leading-relaxed border border-white/10 selection:bg-[#D9532F]">
              <code>{currentDoc.markdownContent}</code>
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
};
