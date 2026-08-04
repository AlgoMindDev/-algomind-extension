import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Terminal, ArrowRight, BookOpen, Clock, Activity, Zap, FileText } from 'lucide-react';

const CommandPalette = ({ isOpen, onClose, problems = [] }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  
  const commands = [
    { id: 'dash', label: 'Go to Dashboard', icon: <BookOpen className="h-4 w-4" />, action: () => navigate('/dashboard') },
    { id: 'rev', label: 'Go to Revisions Queue', icon: <Clock className="h-4 w-4" />, action: () => navigate('/revisions') },
    { id: 'prof', label: 'Go to Profile Analytics', icon: <Activity className="h-4 w-4" />, action: () => navigate('/profile') }
  ];

  
  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProblems = problems.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const combinedItems = [...filteredCommands, ...filteredProblems.map(p => ({
    id: p._id,
    label: p.title,
    subtitle: p.category,
    icon: <FileText className="h-4 w-4" />,
    action: () => {
      
      navigate(`/revisions?search=${p.title}`);
    }
  }))];

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % combinedItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + combinedItems.length) % combinedItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (combinedItems[selectedIndex]) {
          combinedItems[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, combinedItems]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md"
          />

          {}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50 rounded-2xl border shadow-2xl overflow-hidden"
          >
            {}
            <div className="flex items-center px-4 py-3.5 border-b border-[var(--border)]">
              <Search className="h-5 w-5 text-slate-400 mr-3" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search anything... (e.g. DFS, Dijkstra, Go to Profile)"
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder-slate-500 focus:outline-none"
              />
              <kbd className="text-[10px] bg-[var(--bg-item)] border border-[var(--border)] px-1.5 py-0.5 rounded text-slate-400">ESC</kbd>
            </div>

            {}
            <div className="max-h-[300px] overflow-y-auto p-2">
              {combinedItems.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500 flex flex-col items-center gap-2">
                  <Terminal className="h-5 w-5 text-slate-600 animate-pulse" />
                  <p>No commands or problems found matching "{query}"</p>
                </div>
              ) : (
                combinedItems.map((item, idx) => {
                  const isActive = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        item.action();
                        onClose();
                      }}
                      style={{
                        backgroundColor: isActive ? 'var(--purple-bg)' : 'transparent',
                        color: isActive ? 'var(--purple)' : 'inherit'
                      }}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-3 text-xs">
                        <span className={`p-1.5 rounded-lg ${isActive ? 'bg-[#7c6af7]/20 text-[var(--purple)]' : 'bg-[var(--bg-item)] text-slate-400'}`}>
                          {item.icon}
                        </span>
                        <div>
                          <span className={`font-semibold ${isActive ? 'text-[var(--purple)]' : 'text-[var(--text-primary)]'}`}>
                            {item.label}
                          </span>
                          {item.subtitle && (
                            <span className="text-[10px] text-slate-500 ml-2">({item.subtitle})</span>
                          )}
                        </div>
                      </div>

                      {isActive && (
                        <span className="text-[10px] font-semibold text-[var(--purple)] inline-flex items-center gap-1">
                          Jump
                          <ArrowRight className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {}
            <div className="bg-[var(--bg-deep)]/40 border-t border-[var(--border)] px-4 py-2 flex justify-between items-center text-[10px] text-slate-500">
              <div className="flex space-x-3">
                <span><kbd className="bg-[var(--bg-item)] px-1 rounded">↑↓</kbd> Navigation</span>
                <span><kbd className="bg-[var(--bg-item)] px-1 rounded">Enter</kbd> Select</span>
              </div>
              <span>AlgoMind Command Center</span>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
