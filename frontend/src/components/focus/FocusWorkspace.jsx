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

  const isLoading = !problems || (problems.length > 0 && !activeProblems.length);
  const isCompleted = !isLoading && (currentIndex >= activeProblems.length || !currentProblem);
  const tone = { Easy: 'mint', Medium: 'amber', Hard: 'rose' };
  const currentForgetProb = currentProblem?.computedForgetProb || currentProblem?.forgetProbability || 62;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 dark:bg-[#06080f]/98 bg-slate-50/98 text-slate-900 dark:text-[var(--text-primary)] flex flex-col justify-between p-6 md:p-8 overflow-y-auto backdrop-blur-md font-sans">
        
        {/* Header */}
        <div className="flex justify-between items-center max-w-2xl w-full mx-auto mb-6">
          <div className="flex items-center space-x-3">
            <span className="p-2 bg-[var(--purple-bg)] text-[var(--purple)] rounded-xl border border-[var(--purple)]/20">
              <Zap className="h-5 w-5 animate-pulse text-[#a78bfa]" />
            </span>
            <div>
              <h2 className="font-black text-sm tracking-wide uppercase dark:text-slate-200 text-slate-900">
                Focus Mode • Top 3 Highest Decay Risk
              </h2>
              {!isCompleted && (
                <p className="text-xs dark:text-slate-400 text-slate-600 font-medium">
                  Top 3 questions with highest forget probability selected dynamically for quick recall
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 dark:bg-[var(--bg-item)] bg-slate-200 hover:bg-slate-300 dark:hover:bg-[var(--bg-hover)] border dark:border-[var(--border)] border-slate-300 rounded-xl dark:text-slate-400 text-slate-700 hover:text-black dark:hover:text-white transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Card */}
        <div className="flex-1 flex items-center justify-center max-w-2xl w-full mx-auto my-4">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center p-8 dark:bg-[var(--bg-card)] bg-white border dark:border-[var(--border)] border-slate-300 rounded-2xl max-w-md w-full shadow-2xl flex flex-col items-center justify-center min-h-[300px]"
              >
                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin mb-4" />
                <h3 className="text-base font-bold dark:text-white text-slate-900 mb-1">Calculating Memory Decay Risks...</h3>
                <p className="text-xs dark:text-slate-400 text-slate-600 font-medium">Selecting your top 3 highest risk problems for quick revision.</p>
              </motion.div>
            ) : isCompleted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center p-8 dark:bg-[var(--bg-card)] bg-white border dark:border-[var(--border)] border-slate-300 text-slate-900 dark:text-white rounded-2xl max-w-md w-full shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#6ee7b7]/5 to-transparent pointer-events-none" />
                <div className="w-16 h-16 rounded-full bg-[var(--green-bg)] text-[var(--green)] border border-[#10b981]/20 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#10b981]/10">
                  <Trophy className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">All Recalls Completed!</h3>
                <p className="text-xs dark:text-slate-400 text-slate-600 font-medium leading-relaxed mb-6">
                  You successfully reviewed your scheduled forget-risk problems today. Your memory health index has been restored!
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
                className="w-full p-6 md:p-8 border rounded-2xl shadow-2xl flex flex-col justify-between min-h-[440px] relative dark:bg-[var(--bg-card)] bg-white dark:border-[var(--border)] border-slate-300 text-slate-900 dark:text-white"
              >
                <div>
                  {/* Step Progress Pills */}
                  <div className="flex gap-2 mb-6">
                    {Array.from({ length: activeProblems.length }).map((_, idx) => {
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
                              ? 'bg-[#6366f1] shadow-sm' 
                              : isActive 
                                ? 'bg-amber-500 ring-2 ring-amber-400/50 scale-[1.02]' 
                                : 'dark:bg-slate-800 dark:border-slate-700 bg-slate-200 border-slate-300 hover:bg-slate-300'
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* Memory Decay Warning Banner */}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 mb-5 shadow-sm ${
                    currentForgetProb >= 60 
                      ? 'dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-300 bg-rose-50 border-rose-200 text-rose-900 font-bold' 
                      : currentForgetProb >= 40 
                        ? 'dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-300 bg-amber-50 border-amber-200 text-amber-900 font-bold' 
                        : 'dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-300 bg-emerald-50 border-emerald-200 text-emerald-900 font-bold'
                  }`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <AlertTriangle size={18} className={currentForgetProb >= 60 ? 'dark:text-rose-400 text-rose-600 shrink-0' : 'dark:text-amber-400 text-amber-600 shrink-0'} />
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
                      <span className="text-[9px] font-mono block uppercase opacity-80">Forget Chance</span>
                      <span className="text-sm font-extrabold font-mono">{currentForgetProb}%</span>
                    </div>
                  </div>

                  {/* Category & Difficulty Tag */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-bold dark:bg-[#7c3aed]/15 dark:text-[#c9b3ff] dark:border-[#7c3aed]/30 bg-indigo-100 text-indigo-900 border border-indigo-300">
                      {currentProblem.category || 'General'}
                    </span>
                    <span className={`difficulty ${tone[currentProblem.difficulty] || 'amber'} uppercase text-[9px] font-bold px-2 py-0.5 rounded`}>
                      {currentProblem.difficulty || 'Medium'}
                    </span>
                  </div>

                  {/* Problem Title */}
                  <h1 className="text-2xl font-black dark:text-white text-slate-900 mb-2 tracking-tight">
                    {currentProblem.title}
                  </h1>

                  <a
                    href={currentProblem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs dark:text-[#a78bfa] text-[#4f46e5] font-bold hover:underline inline-flex items-center gap-1.5 mb-5"
                  >
                    <span>Open original problem source</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>

                  {/* Why Recommended for Revision Box */}
                  <div className="p-3.5 dark:bg-gradient-to-r dark:from-indigo-500/10 dark:via-amber-500/10 dark:to-transparent dark:border-amber-500/20 bg-amber-50 border border-amber-300 rounded-xl text-xs flex items-start gap-2.5 mb-6">
                    <BrainCircuit size={18} className="dark:text-amber-400 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <b className="dark:text-amber-300 text-amber-900 font-extrabold block text-[11px] uppercase tracking-wider mb-0.5">Why Recommended for Revision</b>
                      <p className="dark:text-slate-300 text-slate-800 font-semibold leading-relaxed text-xs">
                        {getRevisionReason(currentProblem)}
                      </p>
                    </div>
                  </div>

                  {/* Concept Notes Toggle Area */}
                  <AnimatePresence>
                    {revealed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 pt-4 border-t dark:border-[var(--border)] border-slate-200 overflow-hidden"
                      >
                        <div>
                          <h4 className="text-[10px] uppercase font-bold dark:text-slate-400 text-slate-600 mb-1.5 flex items-center gap-1">
                            <Sparkles size={11} className="dark:text-amber-400 text-amber-600" />
                            Conceptual Notes / Idea Logged
                          </h4>
                          <p className="text-xs dark:text-slate-200 text-slate-900 font-semibold leading-relaxed dark:bg-[var(--bg-deep)]/60 bg-slate-100 p-3.5 rounded-xl border dark:border-[var(--border)] border-slate-300">
                            {currentProblem.intuition || 'No concept notes added yet.'}
                          </p>
                        </div>

                        {currentProblem.mistakes && currentProblem.mistakes.length > 0 && (
                          <div>
                            <h4 className="text-[10px] uppercase font-bold dark:text-slate-400 text-slate-600 mb-1.5 flex items-center gap-1">
                              <XCircle size={11} className="dark:text-rose-400 text-rose-600" />
                              Common Pitfalls / Mistakes
                            </h4>
                            <ul className="text-xs dark:text-rose-300 text-rose-900 font-bold list-disc pl-4 space-y-1">
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

                {/* Footer Buttons */}
                <div className="mt-6 pt-4 border-t dark:border-[var(--border)] border-slate-200 flex justify-between items-center">
                  {!revealed ? (
                    <button
                      onClick={() => setRevealed(true)}
                      className="w-full py-3 dark:bg-[var(--bg-item)] dark:hover:bg-[var(--bg-hover)] dark:border-[var(--border)] dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold rounded-xl text-slate-900 transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Eye className="h-4 w-4 dark:text-[#a78bfa] text-[#4f46e5]" />
                      <span>Reveal Concept Notes</span>
                    </button>
                  ) : (
                    <div className="flex gap-4 w-full">
                      <button
                        onClick={() => handleRate('forgot')}
                        className="flex-1 py-3 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 bg-rose-100 text-rose-900 border border-rose-300 text-xs font-bold rounded-xl transition-transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <XCircle size={14} />
                        <span>[1] Forgot</span>
                      </button>
                      <button
                        onClick={() => handleRate('recalled')}
                        className="flex-1 py-3 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold rounded-xl transition-transform hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-1.5"
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

        {/* Shortcut Legend */}
        <div className="max-w-2xl w-full mx-auto border-t dark:border-[var(--border)] border-slate-300 pt-4 flex justify-between items-center text-[10px] dark:text-slate-400 text-slate-600 font-semibold">
          <div className="flex space-x-4">
            <span><kbd className="dark:bg-[var(--bg-item)] bg-slate-200 px-1.5 py-0.5 rounded border border-slate-400 dark:border-slate-700">Space</kbd> Reveal Notes</span>
            <span><kbd className="dark:bg-[var(--bg-item)] bg-slate-200 px-1.5 py-0.5 rounded border border-slate-400 dark:border-slate-700">1</kbd> Forgot</span>
            <span><kbd className="dark:bg-[var(--bg-item)] bg-slate-200 px-1.5 py-0.5 rounded border border-slate-400 dark:border-slate-700">2</kbd> Recalled</span>
          </div>
          <div>AlgoMind Focus Engine</div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default FocusWorkspace;
