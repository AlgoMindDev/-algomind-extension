import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, HelpCircle, ArrowRight, Eye, ChevronRight, Zap, Trophy, Sparkles, Clock, XCircle, ExternalLink, BrainCircuit, AlertTriangle, ShieldAlert } from 'lucide-react';

const FocusWorkspace = ({ isOpen, problems = [], onClose, onRecallAction }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  
  const activeProblems = React.useMemo(() => {
    if (!problems || !problems.length) return [];
    
    const calculateForgetProb = (p) => {
      if (typeof p.forgetProbability === 'number') return p.forgetProbability;
      const lastDate = p.lastRevisedAt || p.solvedAt;
      if (!lastDate) return 65;
      const hoursPassed = (Date.now() - new Date(lastDate).getTime()) / (1000 * 60 * 60);
      return Math.min(95, Math.max(15, Math.round(15 + hoursPassed * 0.8)));
    };

    const sorted = [...problems].map(p => ({
      ...p,
      computedForgetProb: calculateForgetProb(p)
    })).sort((a, b) => b.computedForgetProb - a.computedForgetProb);

    return sorted.slice(0, 3);
  }, [problems]);

  const currentProblem = activeProblems[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
    setRevealed(false);
  }, [isOpen, problems]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen || !currentProblem) return;

      if (e.key === ' ') {
        e.preventDefault();
        setRevealed(true);
      } else if (e.key === '1') {
        e.preventDefault();
        handleRate('forgot');
      } else if (e.key === '2') {
        e.preventDefault();
        handleRate('recalled');
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, revealed, currentProblem]);

  const handleRate = async (rating) => {
    if (!currentProblem) return;
    
    
    if (onRecallAction) {
      await onRecallAction(currentProblem._id, rating);
    }

    setRevealed(false);
    if (currentIndex < activeProblems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      
      setCurrentIndex(activeProblems.length);
    }
  };

  const getRevisionReason = (p) => {
    if (!p) return 'High priority revision item scheduled for today.';
    const forgetProb = p.computedForgetProb || p.forgetProbability || 58;
    if (forgetProb >= 60) {
      return `Critical memory decay detected (${forgetProb}% forget probability). Revising right now prevents total recall loss.`;
    }
    if (forgetProb >= 40) {
      return `Moderate memory decay active (${forgetProb}% forget chance). Scheduled spaced-repetition recall recommended today.`;
    }
    return `Recommended for revision to reinforce long-term recall stability on ${p.category || 'this topic'}.`;
  };

  if (!isOpen) return null;

  const isCompleted = currentIndex >= activeProblems.length || !currentProblem;
  const tone = { Easy: 'mint', Medium: 'amber', Hard: 'rose' };
  const currentForgetProb = currentProblem?.computedForgetProb || currentProblem?.forgetProbability || 62;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#06080f]/98 text-[var(--text-primary)] flex flex-col justify-between p-6 md:p-8 overflow-y-auto backdrop-blur-md font-sans">
        
        {}
        <div className="flex justify-between items-center max-w-2xl w-full mx-auto mb-6">
          <div className="flex items-center space-x-3">
            <span className="p-2 bg-[var(--purple-bg)] text-[var(--purple)] rounded-xl border border-[var(--purple)]/20">
              <Zap className="h-5 w-5 animate-pulse text-[#a78bfa]" />
            </span>
            <div>
              <h2 className="font-extrabold text-sm tracking-wide uppercase text-slate-300">Focus Mode • Top 3 Decay Risk</h2>
              {!isCompleted && (
                <p className="text-xs text-slate-400">Questions with highest forget probability selected dynamically</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-[var(--bg-item)] hover:bg-[var(--bg-hover)] border border-[var(--border)] rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {}
        <div className="flex-1 flex items-center justify-center max-w-2xl w-full mx-auto my-4">
          <AnimatePresence mode="wait">
            {isCompleted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center p-8 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl max-w-md w-full shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#6ee7b7]/5 to-transparent pointer-events-none" />
                <div className="w-16 h-16 rounded-full bg-[var(--green-bg)] text-[var(--green)] border border-[#10b981]/20 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#10b981]/10">
                  <Trophy className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Top 3 Recalls Completed!</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  You successfully reviewed the 3 highest forget-risk problems today. Your memory health index has been restored!
                </p>
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] hover:brightness-110 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-[#7c3aed]/20 cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={currentProblem._id || currentProblem.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
                className="w-full p-6 md:p-8 border rounded-2xl shadow-2xl flex flex-col justify-between min-h-[440px] relative"
              >
                <div>
                  {}
                  <div className="flex gap-2 mb-6">
                    {Array.from({ length: Math.min(3, Math.max(3, activeProblems.length)) }).map((_, idx) => {
                      const isActive = idx === currentIndex;
                      const isPast = idx < currentIndex;
                      const prob = activeProblems[idx]?.computedForgetProb || activeProblems[idx]?.forgetProbability || 50;

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (idx < activeProblems.length) {
                              setCurrentIndex(idx);
                              setRevealed(false);
                            }
                          }}
                          title={`Question ${idx + 1} (${prob}% Forget Risk)`}
                          className={`h-2.5 flex-1 rounded-full transition-all duration-300 cursor-pointer relative ${
                            isPast 
                              ? 'bg-[#7c3aed] shadow-sm' 
                              : isActive 
                                ? 'bg-amber-400 ring-2 ring-amber-400/50 scale-[1.02]' 
                                : 'bg-slate-800 border border-slate-700 hover:bg-slate-700'
                          }`}
                        />
                      );
                    })}
                  </div>

                  {}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 mb-5 shadow-sm ${
                    currentForgetProb >= 60 
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                      : currentForgetProb >= 40 
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  }`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <AlertTriangle size={18} className={currentForgetProb >= 60 ? 'text-rose-400 shrink-0' : 'text-amber-400 shrink-0'} />
                      <div className="min-w-0">
                        <p className="text-[10px] font-mono font-bold uppercase tracking-wider">
                          Memory Decay Alert
                        </p>
                        <p className="text-xs font-semibold truncate">
                          {currentForgetProb >= 60 ? 'High Memory Decay Risk • Immediate Recall Recommended' : 'Moderate Decay Risk • Scheduled Spaced Repetition'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[9px] font-mono block text-slate-400 uppercase">Forget Chance</span>
                      <span className="text-sm font-extrabold font-mono">{currentForgetProb}%</span>
                    </div>
                  </div>

                  {}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-bold bg-[#7c3aed]/15 text-[#c9b3ff] border border-[#7c3aed]/30">
                      {currentProblem.category || 'General'}
                    </span>
                    <span className={`difficulty ${tone[currentProblem.difficulty] || 'amber'} uppercase text-[9px] font-bold px-2 py-0.5 rounded`}>
                      {currentProblem.difficulty || 'Medium'}
                    </span>
                  </div>

                  {}
                  <h1 className="text-2xl font-black text-white mb-2 tracking-tight">
                    {currentProblem.title}
                  </h1>

                  <a
                    href={currentProblem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#a78bfa] hover:underline inline-flex items-center gap-1.5 mb-5 font-medium"
                  >
                    <span>Open original problem source</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>

                  {}
                  <div className="p-3.5 bg-gradient-to-r from-indigo-500/10 via-amber-500/10 to-transparent border border-amber-500/20 rounded-xl text-xs text-amber-200 flex items-start gap-2.5 mb-6">
                    <BrainCircuit size={18} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <b className="text-amber-300 font-bold block text-[11px] uppercase tracking-wider mb-0.5">Why Recommended for Revision</b>
                      <p className="text-slate-300 leading-relaxed text-xs">
                        {getRevisionReason(currentProblem)}
                      </p>
                    </div>
                  </div>

                  {}
                  <AnimatePresence>
                    {revealed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 pt-4 border-t border-[var(--border)] overflow-hidden"
                      >
                        <div>
                          <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 flex items-center gap-1">
                            <Sparkles size={11} className="text-amber-400" />
                            Conceptual Notes / Idea Logged
                          </h4>
                          <p className="text-xs text-slate-200 leading-relaxed bg-[var(--bg-deep)]/60 p-3.5 rounded-xl border border-[var(--border)]">
                            {currentProblem.intuition || 'No concept notes added yet.'}
                          </p>
                        </div>

                        {currentProblem.mistakes && currentProblem.mistakes.length > 0 && (
                          <div>
                            <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 flex items-center gap-1">
                              <XCircle size={11} className="text-rose-400" />
                              Common Pitfalls / Mistakes
                            </h4>
                            <ul className="text-xs text-rose-300 list-disc pl-4 space-y-1">
                              {currentProblem.mistakes.map((m, idx) => (
                                <li key={idx}>{m}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {}
                <div className="mt-6 pt-4 border-t border-[var(--border)] flex justify-between items-center">
                  {!revealed ? (
                    <button
                      onClick={() => setRevealed(true)}
                      className="w-full py-3 bg-[var(--bg-item)] hover:bg-[var(--bg-hover)] border border-[var(--border)] text-xs font-semibold rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Eye className="h-4 w-4 text-[#a78bfa]" />
                      <span>Reveal Concept Notes</span>
                    </button>
                  ) : (
                    <div className="flex gap-4 w-full">
                      <button
                        onClick={() => handleRate('forgot')}
                        className="flex-1 py-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold rounded-xl transition-transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <XCircle size={14} />
                        <span>[1] Forgot</span>
                      </button>
                      <button
                        onClick={() => handleRate('recalled')}
                        className="flex-1 py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-xl transition-transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle size={14} />
                        <span>[2] Recalled</span>
                      </button>
                    </div>
                  )}
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {}
        <div className="max-w-2xl w-full mx-auto border-t border-[var(--border)] pt-4 flex justify-between items-center text-[10px] text-slate-400">
          <div className="flex space-x-4">
            <span><kbd className="bg-[var(--bg-item)] px-1.5 py-0.5 rounded border border-slate-700">Space</kbd> Reveal Notes</span>
            <span><kbd className="bg-[var(--bg-item)] px-1.5 py-0.5 rounded border border-slate-700">1</kbd> Forgot</span>
            <span><kbd className="bg-[var(--bg-item)] px-1.5 py-0.5 rounded border border-slate-700">2</kbd> Recalled</span>
          </div>
          <span>Press <kbd className="bg-[var(--bg-item)] px-1.5 py-0.5 rounded border border-slate-700">ESC</kbd> to exit focus mode</span>
        </div>

      </div>
    </AnimatePresence>
  );
};

export default FocusWorkspace;
