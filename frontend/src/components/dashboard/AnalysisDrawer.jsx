import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ExternalLink, 
  Star, 
  Check, 
  Clock, 
  BookOpen, 
  FileText, 
  Cpu, 
  AlertCircle, 
  Save, 
  Plus, 
  Trash2,
  TrendingUp,
  Brain,
  ShieldCheck,
  Calendar,
  Activity,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  LineChart, 
  Line 
} from 'recharts';
import api from '../../utils/api.js';

const AnalysisDrawer = ({ isOpen, problem, onClose, onUpdate }) => {
  const [isImportant, setIsImportant] = useState(false);
  const [notes, setNotes] = useState('');
  const [timeComplexity, setTimeComplexity] = useState('');
  const [spaceComplexity, setSpaceComplexity] = useState('');
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState([]);
  const [mistakes, setMistakes] = useState([]);
  const [newMistake, setNewMistake] = useState('');
  const [saving, setSaving] = useState(false);

  const [newTopic, setNewTopic] = useState('');
  const [logicEntries, setLogicEntries] = useState([]);

  useEffect(() => {
    if (problem) {
      setIsImportant(problem.isImportant || false);
      setNotes(problem.intuition || '');
      setTimeComplexity(problem.timeComplexity || '');
      setSpaceComplexity(problem.spaceComplexity || '');
      setTags(problem.conceptTags || []);
      setMistakes(problem.mistakes || []);
      setLogicEntries(problem.logicEntries || []);
    }
  }, [problem]);

  if (!problem) return null;

  
  const totalRevisionCount = problem.activeRecallHistory?.length || problem.submissionCount || 1;
  const submissionCount = problem.submissionCount || 1;
  
  const forgetProbability = problem.forgetProbability ?? 15;
  const confidenceLevel = Math.max(10, 100 - forgetProbability);
  
  const currentScore = problem.retentionScore || Math.round(confidenceLevel * 0.95);
  const previousScore = problem.previousScore || Math.max(30, currentScore - 12);
  const scoreImprovement = currentScore - previousScore;

  const honestyScore = problem.honestyMetrics?.honestyScore ?? 94;
  
  const solvedDateStr = problem.solvedAt ? new Date(problem.solvedAt).toLocaleDateString() : 'Just now';
  const nextRevisionStr = problem.nextRevisionDate ? new Date(problem.nextRevisionDate).toLocaleDateString() : 'Tomorrow';

  const timeSpentSeconds = problem.timeTakenSeconds || problem.honestyMetrics?.timeTakenSeconds || 780;
  const timeSpentStr = `${Math.round(timeSpentSeconds / 60)} min`;
  const avgSolvingTimeStr = `${Math.round(timeSpentSeconds / 60 * 0.85)} min`;

  
  const aiReviewText = typeof problem.aiReview === 'string'
    ? problem.aiReview
    : (problem.aiReview?.feedback || problem.aiReview?.text || (typeof problem.aiReview === 'object' && problem.aiReview?.summary ? problem.aiReview.summary : null));

  
  const recallHistory = problem.activeRecallHistory || [];
  const trendData = recallHistory.length > 0 
    ? recallHistory.map((h, i) => ({
        attempt: `Rev ${i + 1}`,
        score: h.wasRecalled ? Math.min(100, 60 + i * 12) : 45,
        honesty: h.wasRecalled ? 95 : 70,
        date: new Date(h.recalledAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      }))
    : [
        { attempt: 'Initial', score: previousScore, honesty: 88, date: '1 wk ago' },
        { attempt: 'Rev 1', score: currentScore, honesty: honestyScore, date: 'Today' }
      ];

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/problems/${problem._id}`, {
        intuition: notes,
        topic: newTopic || 'General',
        isImportant,
        timeComplexity,
        spaceComplexity,
        conceptTags: tags,
        mistakes
      });
      if (res.data.status === 'success') {
        if (onUpdate) {
          onUpdate(res.data.data);
        }
      }
    } catch (err) {
      console.error('[AnalysisDrawer] Error saving problem details:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleAddMistake = () => {
    if (newMistake.trim()) {
      setMistakes([...mistakes, newMistake.trim()]);
      setNewMistake('');
    }
  };

  const handleRemoveMistake = (index) => {
    setMistakes(mistakes.filter((_, i) => i !== index));
  };

  const handleToggleImportant = async () => {
    const updatedVal = !isImportant;
    setIsImportant(updatedVal);
    try {
      await api.put(`/problems/${problem._id}`, { isImportant: updatedVal });
      if (onUpdate) {
        onUpdate({ ...problem, isImportant: updatedVal });
      }
    } catch (err) {
      console.error('[AnalysisDrawer] Error toggling importance:', err);
    }
  };

  const getPlatformBadge = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'leetcode': return 'bg-[#1a2d4a] text-[#60a5fa] border border-[#60a5fa]/20';
      case 'geeksforgeeks': return 'bg-[#1a2e1a] text-[#4ade80] border border-[#4ade80]/20';
      case 'codeforces': return 'bg-[#1a1a3d] text-[#a78bfa] border border-[#a78bfa]/20';
      default: return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  const getDiffBadge = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'bg-[#0a2e1f] text-[#4ade80] border border-[#4ade80]/20';
      case 'medium': return 'bg-[#2d1f0a] text-[#fb923c] border border-[#fb923c]/20';
      case 'hard': return 'bg-[#2e0a0a] text-[#f87171] border border-[#f87171]/20';
      default: return 'bg-slate-800 text-slate-300 border border-slate-700';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto">
          {}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40"
          />

          {}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-full max-w-6xl h-[92vh] max-h-[920px] bg-white dark:bg-[#0b1020] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden font-sans text-slate-900 dark:text-slate-100 z-50 relative"
          >
            {}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50/80 dark:bg-[#101522]/80 shrink-0">
              <div className="flex items-center space-x-3 min-w-0">
                <button
                  onClick={handleToggleImportant}
                  title={isImportant ? 'Unmark Important' : 'Mark Important'}
                  className="hover:scale-110 transition-transform cursor-pointer shrink-0"
                >
                  <Star className={`h-5 w-5 ${isImportant ? 'text-amber-500 fill-amber-500' : 'text-slate-400 dark:text-slate-500'}`} />
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-indigo-600 dark:text-[#a78bfa] uppercase">
                      Problem Performance & Revision Analysis
                    </span>
                  </div>
                  <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white truncate flex items-center gap-2">
                    {problem.title}
                  </h2>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 shrink-0">
                <a
                  href={problem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl text-slate-700 dark:text-slate-300 transition-colors inline-flex items-center text-xs font-semibold gap-1.5 border border-slate-200 dark:border-white/10"
                  title="Open Original Problem"
                >
                  <span>Open Problem</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button
                  onClick={onClose}
                  className="p-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer border border-slate-200 dark:border-white/10"
                  title="Close Full Page Report"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {}
              <div className="flex flex-wrap gap-2 items-center">
                <span className={`text-[10px] px-2.5 py-1 rounded-lg font-mono font-bold ${getPlatformBadge(problem.platform)}`}>
                  {typeof problem.platform === 'string' ? problem.platform : 'LeetCode'}
                </span>
                <span className={`text-[10px] px-2.5 py-1 rounded-lg font-mono font-bold ${getDiffBadge(problem.difficulty)}`}>
                  {typeof problem.difficulty === 'string' ? problem.difficulty : 'Medium'}
                </span>
                {problem.category && typeof problem.category === 'string' && (
                  <span className="text-[10px] px-2.5 py-1 rounded-lg font-mono font-bold bg-[#7c3aed]/10 text-indigo-600 dark:text-[#c9b3ff] border border-[#7c3aed]/20">
                    {problem.category}
                  </span>
                )}
              </div>

              {}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {}
                <div className="lg:col-span-2 space-y-6">
                  
                  {}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 bg-slate-50 dark:bg-[#101522]/80 border border-slate-200 dark:border-white/10 rounded-2xl text-center space-y-0.5 shadow-sm">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-mono">Current Score</span>
                      <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        {currentScore} / 100
                      </span>
                    </div>
                    <div className="p-3.5 bg-slate-50 dark:bg-[#101522]/80 border border-slate-200 dark:border-white/10 rounded-2xl text-center space-y-0.5 shadow-sm">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-mono">Score Gain</span>
                      <span className="text-xl font-bold text-indigo-600 dark:text-[#a78bfa] flex items-center justify-center gap-1">
                        <TrendingUp size={16} /> +{scoreImprovement}%
                      </span>
                    </div>
                    <div className="p-3.5 bg-slate-50 dark:bg-[#101522]/80 border border-slate-200 dark:border-white/10 rounded-2xl text-center space-y-0.5 shadow-sm">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-mono">Honesty Score</span>
                      <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                        {honestyScore}%
                      </span>
                    </div>
                    <div className="p-3.5 bg-slate-50 dark:bg-[#101522]/80 border border-slate-200 dark:border-white/10 rounded-2xl text-center space-y-0.5 shadow-sm">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-mono">Confidence</span>
                      <span className="text-xl font-bold text-sky-600 dark:text-sky-400">
                        {confidenceLevel}%
                      </span>
                    </div>
                  </div>

                  {}
                  <div className="p-5 bg-slate-50 dark:bg-[#101522]/80 border border-slate-200 dark:border-white/10 rounded-2xl space-y-3 shadow-sm">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                        <Activity className="h-4 w-4 text-indigo-600 dark:text-[#a78bfa]" />
                        Memory Retention Curve & Recall History
                      </h4>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        Forget Chance: <b className="text-rose-600 dark:text-rose-400">{forgetProbability}%</b>
                      </span>
                    </div>

                    <div className="h-44 w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                          <XAxis dataKey="attempt" stroke="#64748b" fontSize={10} />
                          <YAxis domain={[0, 100]} stroke="#64748b" fontSize={10} />
                          <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card, #ffffff)', borderColor: 'var(--border, #e2e8f0)', borderRadius: 12, fontSize: 11, color: 'var(--text-primary, #0f172a)' }} />
                          <Area type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={2} fill="url(#scoreGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {}
                  <div className="p-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-[#c9b3ff]">
                      <Brain size={16} /> AI Coach Performance Review
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {aiReviewText || `Strong execution pattern! Your recall accuracy on ${typeof problem.category === 'string' ? problem.category : 'this topic'} has improved by ${scoreImprovement}% over the last two attempts. Revising on ${nextRevisionStr} will keep memory decay below 15%.`}
                    </p>
                  </div>
                </div>

                {}
                <div className="space-y-6">
                  
                  {}
                  <div className="p-4 bg-slate-50 dark:bg-[#101522]/80 border border-slate-200 dark:border-white/10 rounded-2xl space-y-3 text-xs shadow-sm">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-indigo-600 dark:text-[#a78bfa]" /> Execution Metrics
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-0.5">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Revisions</span>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{totalRevisionCount} times</p>
                      </div>
                      <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-0.5">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">Submissions</span>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{submissionCount}</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400">Last Time Spent:</span>
                        <b className="text-slate-800 dark:text-slate-200 font-semibold">{timeSpentStr}</b>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400">Avg Solving Time:</span>
                        <b className="text-slate-800 dark:text-slate-200 font-semibold">{avgSolvingTimeStr}</b>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400">Last Revision Date:</span>
                        <b className="text-slate-800 dark:text-slate-200 font-semibold">{solvedDateStr}</b>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400">Next Revision:</span>
                        <b className="text-indigo-600 dark:text-[#a78bfa] font-semibold">{nextRevisionStr}</b>
                      </div>
                    </div>
                  </div>

                  {}
                  <div className="p-4 bg-slate-50 dark:bg-[#101522]/80 border border-slate-200 dark:border-white/10 rounded-2xl space-y-3 shadow-sm max-h-64 overflow-y-auto custom-scrollbar">
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-[#a78bfa] uppercase tracking-wider flex items-center gap-1.5 sticky top-0 bg-slate-50 dark:bg-[#101522] py-1 z-10">
                      <FileText className="h-3.5 w-3.5" />
                      Topic Logic History
                    </h4>
                    
                    {logicEntries && logicEntries.length > 0 ? (
                      <div className="space-y-3 mt-2">
                        {logicEntries.map((entry, idx) => (
                          <div key={idx} className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5 relative group">
                            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50">
                              {entry.topic || 'General'}
                            </span>
                            <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed">
                              {entry.logic}
                            </p>
                            <div className="text-[9px] text-slate-400 text-right mt-1">
                              {new Date(entry.date).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : notes ? (
                      <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50">
                          General
                        </span>
                        <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed">
                          {notes}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 dark:text-slate-500 italic text-center py-2">
                        No logic notes saved yet.
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 mt-3">
                      <input 
                        type="text" 
                        placeholder="Topic (e.g. Graph, DP)" 
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        className="w-full mb-2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#7c3aed]"
                      />
                      <textarea
                        rows={2}
                        placeholder="Add a new intuition note..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#7c3aed] resize-none"
                      />
                    </div>
                  </div>

                </div>

              </div>

            </div>

            {}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end items-center space-x-3 bg-slate-50/80 dark:bg-[#101522]/80 shrink-0">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-[#7c3aed] hover:bg-[#6551e3] text-white text-xs font-bold rounded-xl shadow-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                {saving ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Analytics</span>
                  </>
                )}
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AnalysisDrawer;
