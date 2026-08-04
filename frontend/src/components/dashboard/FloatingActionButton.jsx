import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Sparkles, 
  Play, 
  HelpCircle, 
  Download, 
  Zap 
} from 'lucide-react';

const FloatingActionButton = ({ onAddProblem, onQuickRevision, onRandomRevision, onImportProblems }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const actions = [
    {
      icon: <Plus className="h-4 w-4" />,
      label: 'Add Problem',
      onClick: () => {
        setIsOpen(false);
        if (onAddProblem) onAddProblem();
      },
      color: 'bg-brand-500 hover:bg-brand-600 text-white'
    },
    {
      icon: <Zap className="h-4 w-4" />,
      label: 'Quick Revision',
      onClick: () => {
        setIsOpen(false);
        if (onQuickRevision) onQuickRevision();
      },
      color: 'bg-[#1e1a3d] text-[#a78bfa] hover:bg-[#2a2552]'
    },
    {
      icon: <Play className="h-4 w-4" />,
      label: 'Random Revision',
      onClick: () => {
        setIsOpen(false);
        if (onRandomRevision) onRandomRevision();
      },
      color: 'bg-[#1a2d4a] text-[#60a5fa] hover:bg-[#203a61]'
    },
    {
      icon: <Download className="h-4 w-4" />,
      label: 'Export Problems',
      onClick: () => {
        setIsOpen(false);
        if (onImportProblems) onImportProblems();
      },
      color: 'bg-slate-800 text-slate-200 hover:bg-slate-700'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {}
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col items-end space-y-2 mb-3">
            {actions.map((act, index) => (
              <motion.div
                key={act.label}
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.8 }}
                transition={{ duration: 0.15, delay: index * 0.03 }}
                className="flex items-center space-x-2"
              >
                {}
                <span className="text-[11px] font-semibold text-[var(--text-secondary)] bg-[var(--bg-card)] border border-[var(--border)] px-2 py-1 rounded-lg shadow-lg">
                  {act.label}
                </span>
                
                {}
                <button
                  onClick={act.onClick}
                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer ${act.color}`}
                >
                  {act.icon}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {}
      <motion.button
        onClick={toggleOpen}
        animate={{ rotate: isOpen ? 135 : 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 220 }}
        style={{ 
          backgroundColor: '#7c6af7', 
          boxShadow: '0 8px 32px 0 rgba(124, 106, 247, 0.3)' 
        }}
        className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 active:scale-95 cursor-pointer transition-transform z-50"
      >
        <Plus className="h-6 w-6" />
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;
