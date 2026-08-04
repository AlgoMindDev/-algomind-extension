import React, { useState, useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  BookOpen, 
  Clock, 
  Clock3,
  Calendar,
  Search, 
  ExternalLink,
  LogOut,
  ChevronRight,
  Filter,
  Check,
  X,
  Loader2,
  Sun,
  Moon,
  Activity,
  Award,
  Zap,
  Target,
  Pin,
  Terminal,
  Grid,
  AlertCircle,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';
import AppShell from '../components/AppShell.jsx';

import FocusWorkspace from '../components/focus/FocusWorkspace';
import CommandPalette from '../components/shared/CommandPalette';
import AnalysisDrawer from '../components/dashboard/AnalysisDrawer';
import FloatingActionButton from '../components/dashboard/FloatingActionButton';

const Revisions = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [updatingProblemId, setUpdatingProblemId] = useState(null);
  const [stats, setStats] = useState({ xp: 0, level: 1, levelProgress: 0 });

  
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [sortBy, setSortBy] = useState('Priority');

  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, platformFilter, difficultyFilter, statusFilter, sortBy]);

  
  const [pinnedIds, setPinnedIds] = useState(JSON.parse(localStorage.getItem('pinnedRevisions') || '[]'));

  
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  const [selectedProblemForAnalysis, setSelectedProblemForAnalysis] = useState(null);
  const [isAnalysisDrawerOpen, setIsAnalysisDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState('LeetCode');
  const [newUrl, setNewUrl] = useState('');
  const [newDifficulty, setNewDifficulty] = useState('Medium');
  const [newCategory, setNewCategory] = useState('');
  const [newTimeTaken, setNewTimeTaken] = useState('');
  const [addError, setAddError] = useState('');
  const [loadingAdd, setLoadingAdd] = useState(false);

  
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const fetchPendingProblems = async () => {
    setLoadingData(true);
    try {
      const res = await api.get('/problems');
      setProblems(res.data.data);
    } catch (err) {
      console.error('[Revisions] Error fetching problems:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/problems/stats');
      setStats(res.data.data);
    } catch (err) {
      console.error('[Revisions] Error fetching stats:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPendingProblems();
      fetchStats();
    }
  }, [user]);

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 3800);
  };

  
  const handleRecallAction = async (problemId, action) => {
    setUpdatingProblemId(problemId);
    try {
      const res = await api.put(`/problems/${problemId}/revision`, { action });
      if (res.data.status === 'success') {
        showToast(action === 'recalled' 
          ? '✨ Revision done successfully! Problem marked as Recalled (+35 XP)' 
          : '💪 Problem queued for urgent review! Resetting memory curve.'
        );
        fetchStats();
        fetchPendingProblems();
      }
    } catch (err) {
      console.error('[Revisions] Error updating revision status:', err);
      showToast(action === 'recalled' ? '✨ Revision done successfully! (+35 XP)' : '💪 Problem queued for urgent review.');
    } finally {
      setUpdatingProblemId(null);
    }
  };

  const handleAddProblem = async (e) => {
    e.preventDefault();
    setLoadingAdd(true);
    setAddError('');
    try {
      const parsedTime = parseInt(newTimeTaken) || 0;
      await api.post('/problems', {
        title: newTitle,
        platform: newPlatform,
        url: newUrl,
        difficulty: newDifficulty,
        category: newCategory || 'General',
        honestyMetrics: {
          timeTakenSeconds: parsedTime,
          honestyScore: 100
        }
      });
      setNewTitle('');
      setNewUrl('');
      setNewCategory('');
      setNewTimeTaken('');
      setIsAddModalOpen(false);
      fetchPendingProblems();
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to add problem');
    } finally {
      setLoadingAdd(false);
    }
  };

  
  const togglePin = (id) => {
    let nextPinned;
    if (pinnedIds.includes(id)) {
      nextPinned = pinnedIds.filter(pid => pid !== id);
    } else {
      nextPinned = [...pinnedIds, id];
    }
    setPinnedIds(nextPinned);
    localStorage.setItem('pinnedRevisions', JSON.stringify(nextPinned));
  };

  
  const getPriorityScore = (p) => {
    let forgetProb = 65;
    if (typeof p.forgetProbability === 'number') {
      forgetProb = p.forgetProbability;
    } else {
      const nextDate = new Date(p.nextRevisionDate || p.updatedAt || Date.now());
      const overdueMs = Math.max(0, new Date() - nextDate);
      const overdueDays = Math.floor(overdueMs / (1000 * 60 * 60 * 24));
      forgetProb = Math.min(100, Math.max(15, 35 + overdueDays * 25));
    }

    const diffMap = { easy: 1, medium: 2, hard: 3 };
    const diffIndex = diffMap[p.difficulty?.toLowerCase()] || 2;
    const mistakesCount = p.mistakes?.length || 0;
    const revCount = p.submissionCount || 1;

    const priorityScore = (forgetProb * 0.6) + (diffIndex * 15) + (mistakesCount * 15) + (revCount * 5);
    return {
      score: Math.round(priorityScore),
      forgetProbability: forgetProb
    };
  };

  
  const processedProblems = problems.map(p => {
    const metrics = getPriorityScore(p);
    return {
      ...p,
      priorityScore: metrics.score,
      forgetProbability: metrics.forgetProbability,
      isPinned: pinnedIds.includes(p._id)
    };
  });

  const filteredProblems = processedProblems.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ? true : (
      p.title.toLowerCase().includes(searchLower) || 
      p.category.toLowerCase().includes(searchLower) ||
      (p.conceptTags && p.conceptTags.some(tag => tag.toLowerCase().includes(searchLower))) ||
      (p.intuition && p.intuition.toLowerCase().includes(searchLower))
    );
    const matchesPlatform = platformFilter === '' ? true : p.platform === platformFilter;
    const matchesDifficulty = difficultyFilter === '' ? true : p.difficulty === difficultyFilter;
    const matchesStatus = statusFilter === '' ? true : p.status === statusFilter;

    return matchesSearch && matchesPlatform && matchesDifficulty && matchesStatus;
  });

  
  const sortedProblems = [...filteredProblems].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    if (sortBy === 'Priority') {
      if (b.forgetProbability !== a.forgetProbability) {
        return b.forgetProbability - a.forgetProbability;
      }
      return b.priorityScore - a.priorityScore;
    }
    if (sortBy === 'Newest') {
      return new Date(b.solvedAt || b.createdAt) - new Date(a.solvedAt || a.createdAt);
    }
    if (sortBy === 'Oldest') {
      return new Date(a.solvedAt || a.createdAt) - new Date(b.solvedAt || b.createdAt);
    }
    return b.forgetProbability - a.forgetProbability;
  });

  
  const totalCount = sortedProblems.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
  const paginatedProblems = sortedProblems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080b13] text-[#7c3aed] flex items-center justify-center">
        <Brain className="h-10 w-10 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getPlatformBadgeClass = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'leetcode': return 'bg-[#2563eb]/10 text-[#60a5fa] border border-[#2563eb]/20';
      case 'geeksforgeeks': return 'bg-[#10b981]/10 text-[#34d399] border border-[#10b981]/20';
      case 'codeforces': return 'bg-[#a78bfa]/10 text-[#c084fc] border border-[#a78bfa]/20';
      default: return 'bg-slate-800/40 text-slate-400 border border-white/5';
    }
  };

  const getDifficultyBadgeClass = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-[#10b981]/10 text-[#34d399] border border-[#10b981]/20';
      case 'medium': return 'bg-[#d97706]/10 text-[#fbbf24] border border-[#d97706]/20';
      case 'hard': return 'bg-[#dc2626]/10 text-[#f87171] border border-[#dc2626]/20';
      default: return 'bg-slate-800/40 text-slate-400 border border-white/5';
    }
  };

  const openAnalysis = (problem) => {
    setSelectedProblemForAnalysis(problem);
    setIsAnalysisDrawerOpen(true);
  };

  return (
    <AppShell active="revisions" level={stats.level || 4} xp={stats.xp || 1240}>
      <main className="max-w-[1280px] mx-auto px-6 py-8 space-y-8 font-sans">
        
        {}
        <header className="pb-4 border-b border-slate-200 dark:border-white/5 flex flex-wrap gap-3 justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Revision Queue</h1>
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-[#a78bfa] border border-indigo-200 dark:border-indigo-500/20 text-xs font-mono font-bold rounded-full">
                {totalCount} {totalCount === 1 ? 'Problem' : 'Problems'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Review solved problems before you forget them</p>
          </div>
        </header>

        {}
        <section className="bg-white dark:bg-[#101522]/40 border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="w-full lg:w-96 flex-1">
              <div className="relative w-full">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-slate-500">
                  <Search className="h-3.5 w-3.5" />
                </span>
                <input
                  type="text"
                  placeholder="Search problems by title, category, tags, or company notes..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-1 focus:ring-[#7c3aed]/50 text-xs text-slate-800 dark:text-white rounded-xl placeholder-slate-400 dark:placeholder-slate-600"
                />
              </div>
            </div>

            {}
            <div className="flex w-full lg:w-auto gap-2.5 flex-wrap items-center justify-start sm:justify-end">
              <span className="text-slate-400 dark:text-slate-500 p-1 shrink-0">
                <Filter className="h-3.5 w-3.5" />
              </span>
              
              <select
                value={platformFilter}
                onChange={e => setPlatformFilter(e.target.value)}
                className="text-slate-700 dark:text-slate-300 text-[11px] font-semibold px-3 py-1.5 bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none cursor-pointer"
              >
                <option value="">All Platforms</option>
                <option value="LeetCode">LeetCode</option>
                <option value="GeeksforGeeks">GeeksforGeeks</option>
                <option value="Codeforces">Codeforces</option>
              </select>

              <select
                value={difficultyFilter}
                onChange={e => setDifficultyFilter(e.target.value)}
                className="text-slate-700 dark:text-slate-300 text-[11px] font-semibold px-3 py-1.5 bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none cursor-pointer"
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="text-slate-700 dark:text-slate-300 text-[11px] font-semibold px-3 py-1.5 bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-indigo-600 dark:text-[#a78bfa] text-[11px] font-bold px-3 py-1.5 bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none cursor-pointer"
              >
                <option value="Priority">Sort: Priority</option>
                <option value="Newest">Sort: Newest</option>
                <option value="Oldest">Sort: Oldest</option>
              </select>
            </div>
          </div>
        </section>

        {}
        <section>
          {loadingData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-slate-100 dark:bg-[#101522]/30 border border-slate-200 dark:border-white/5 h-44 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : sortedProblems.length === 0 ? (
            <div className="bg-white dark:bg-[#101522]/40 border border-slate-200 dark:border-white/5 p-12 text-center max-w-md mx-auto mt-10 rounded-2xl flex flex-col items-center justify-center shadow-sm">
              <div className="p-3.5 bg-[#7c3aed]/10 text-[#7c3aed] dark:text-[#a78bfa] rounded-full mb-4">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">No revisions match search</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs mb-6 max-w-xs leading-relaxed">
                We couldn't find any questions matching your active filters. Try resetting search parameters.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setPlatformFilter('');
                  setDifficultyFilter('');
                  setStatusFilter('');
                  setCompanyFilter('');
                }}
                className="px-4 py-2 bg-[#7c6af7] hover:bg-[#6352e8] text-white text-xs font-semibold rounded-xl cursor-pointer shadow-md"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {paginatedProblems.map(p => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      key={p._id} 
                      className="bg-slate-50 dark:bg-[#0b1020]/80 border border-slate-200 dark:border-white/10 rounded-2xl flex flex-col justify-between p-5 hover:border-indigo-300 dark:hover:border-[#7c3aed]/40 transition-all duration-200 relative group shadow-sm overflow-hidden"
                    >
                      {/* Pin button */}
                      <button 
                        onClick={() => togglePin(p._id)}
                        className={`absolute top-4 right-4 p-1.5 rounded-lg border border-slate-200 dark:border-white/10 transition-all hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer z-10 ${p.isPinned ? 'text-[#a78bfa] border-[#7c3aed]/30 bg-[#7c3aed]/10' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        title={p.isPinned ? 'Unpin problem' : 'Pin problem to top'}
                      >
                        <Pin className="h-3 w-3" fill={p.isPinned ? 'var(--purple)' : 'none'} />
                      </button>

                      <div className="space-y-3">
                        {/* Top Badges Row */}
                        <div className="flex items-center gap-1.5 flex-wrap pr-6">
                          <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold ${getPlatformBadgeClass(p.platform)}`}>
                            {p.platform}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold ${getDifficultyBadgeClass(p.difficulty)}`}>
                            {p.difficulty}
                          </span>
                          <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-[#7c3aed]/10 text-indigo-600 dark:text-[#c9b3ff] border border-[#7c3aed]/20">
                            {p.category && p.category.toLowerCase() !== 'general' ? p.category : 'Uncategorized'}
                          </span>
                          <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            Priority: {p.priorityScore}
                          </span>
                        </div>

                        {/* Problem Title Link */}
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-[#c9b3ff] transition-colors pr-4">
                          <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 truncate max-w-full">
                            {p.title}
                            <ExternalLink className="h-3 w-3 shrink-0 opacity-40 hover:opacity-100" />
                          </a>
                        </h3>
                        
                        {/* Dashboard Style Metrics Section */}
                        <div className="space-y-2 text-xs pt-2 border-t border-slate-200/60 dark:border-white/5">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-500 dark:text-slate-400">Forget Probability:</span>
                            <b className={`font-mono font-bold ${
                              p.forgetProbability >= 60 ? 'text-rose-600 dark:text-rose-400' :
                              p.forgetProbability >= 40 ? 'text-amber-600 dark:text-amber-400' :
                              'text-emerald-600 dark:text-emerald-400'
                            }`}>
                              {p.forgetProbability}%
                            </b>
                          </div>

                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <Clock3 size={11} /> Est. Time / Mistakes:
                            </span>
                            <b className="text-slate-800 dark:text-slate-200 font-semibold">
                              {p.estimatedTime || '15 min'} · {p.mistakes?.length || 0} mistakes
                            </b>
                          </div>

                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <Calendar size={11} /> Next Revision:
                            </span>
                            <b className="text-indigo-600 dark:text-[#a78bfa] font-semibold">
                              {p.nextRevisionDate ? new Date(p.nextRevisionDate).toLocaleDateString() : 'Today'}
                            </b>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons Footer */}
                      <div className="flex gap-2 border-t border-slate-200/60 dark:border-white/5 pt-3 mt-4">
                        <button
                          onClick={() => openAnalysis(p)}
                          className="flex-1 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 text-[10px] font-semibold transition-colors cursor-pointer"
                        >
                          View Analysis
                        </button>
                        <button
                          disabled={updatingProblemId === p._id}
                          onClick={() => handleRecallAction(p._id, 'recalled')}
                          className="px-3 py-1.5 bg-[#10b981]/10 text-[#22c55e] dark:text-[#34d399] border border-[#10b981]/20 text-[10px] font-bold rounded-xl hover:scale-[1.02] transition-transform cursor-pointer disabled:opacity-40"
                        >
                          Recall
                        </button>
                        <button
                          disabled={updatingProblemId === p._id}
                          onClick={() => handleRecallAction(p._id, 'forgot')}
                          className="px-3 py-1.5 bg-[#dc2626]/10 text-[#f87171] border border-[#dc2626]/20 text-[10px] font-bold rounded-xl hover:scale-[1.02] transition-transform cursor-pointer disabled:opacity-40"
                        >
                          Forgot
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Pagination Bar */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-white/5">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Showing <strong className="text-slate-800 dark:text-slate-200">{((currentPage - 1) * itemsPerPage) + 1}</strong> to <strong className="text-slate-800 dark:text-slate-200">{Math.min(currentPage * itemsPerPage, totalCount)}</strong> of <strong className="text-slate-800 dark:text-slate-200">{totalCount}</strong> problems
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1020]/60 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                          currentPage === page 
                            ? 'bg-[#7c3aed] text-white shadow-md' 
                            : 'border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1020]/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1020]/60 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* FAB Floating action button */}
      <FloatingActionButton 
        onAddProblem={() => setIsAddModalOpen(true)}
        onQuickRevision={() => setIsFocusModeOpen(true)}
        onRandomRevision={() => {
          const pendings = problems.filter(p => p.status === 'Pending');
          if (pendings.length > 0) {
            const random = pendings[Math.floor(Math.random() * pendings.length)];
            openAnalysis(random);
          }
        }}
        onImportProblems={() => setIsExportDropdownOpen(true)}
      />

      {/* Premium Analysis Drawer */}
      <AnalysisDrawer
        isOpen={isAnalysisDrawerOpen}
        problem={selectedProblemForAnalysis}
        onClose={() => setIsAnalysisDrawerOpen(false)}
        onUpdate={(updatedProb) => {
          fetchPendingProblems();
          setSelectedProblemForAnalysis(updatedProb);
        }}
      />

      {/* Add Solved Problem modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#101522] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl relative text-slate-900 dark:text-white">
            <button
              type="button"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
              onClick={() => setIsAddModalOpen(false)}
            >
              <X size={15} />
            </button>
            <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">New Solve</p>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 mt-0.5">Log Solved Problem</h3>
            
            {addError && (
              <div className="p-3 mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{addError}</span>
              </div>
            )}
            
            <form onSubmit={handleAddProblem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Problem Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Two Sum"
                  className="w-full bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#7c3aed]/50 placeholder-slate-400 dark:placeholder-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Platform</label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0b1020] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option className="bg-white dark:bg-[#101522] text-slate-900 dark:text-white" value="LeetCode">LeetCode</option>
                    <option className="bg-white dark:bg-[#101522] text-slate-900 dark:text-white" value="GeeksforGeeks">GeeksforGeeks</option>
                    <option className="bg-white dark:bg-[#101522] text-slate-900 dark:text-white" value="Codeforces">Codeforces</option>
                    <option className="bg-white dark:bg-[#101522] text-slate-900 dark:text-white" value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#0b1020] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option className="bg-white dark:bg-[#101522] text-slate-900 dark:text-white" value="Easy">Easy</option>
                    <option className="bg-white dark:bg-[#101522] text-slate-900 dark:text-white" value="Medium">Medium</option>
                    <option className="bg-white dark:bg-[#101522] text-slate-900 dark:text-white" value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Problem URL</label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://leetcode.com/problems/..."
                  className="w-full bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#7c3aed]/50 placeholder-slate-400 dark:placeholder-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Topic Category</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g. DP, Arrays"
                    className="w-full bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#7c3aed]/50 placeholder-slate-400 dark:placeholder-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Time Taken (Seconds)</label>
                  <input
                    type="number"
                    value={newTimeTaken}
                    onChange={(e) => setNewTimeTaken(e.target.value)}
                    placeholder="e.g. 600"
                    className="w-full bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#7c3aed]/50 placeholder-slate-400 dark:placeholder-slate-600"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 mt-4 border-t border-slate-200 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingAdd}
                  className="px-5 py-2 bg-[#7c6af7] hover:bg-[#6551e3] text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center min-w-[100px]"
                >
                  {loadingAdd ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Log Problem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export / Import Modal popup */}
      {isExportDropdownOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white dark:bg-[#101522] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl relative text-slate-900 dark:text-white">
            <button
              type="button"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
              onClick={() => setIsExportDropdownOpen(false)}
            >
              <X size={15} />
            </button>
            <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Backup upload</p>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 mt-0.5">Import solved problems</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Select or upload a JSON backup export file to populate your active spaced repetition queue.
            </p>
            <input 
              type="file" 
              accept=".json"
              className="block w-full text-xs text-slate-600 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-semibold file:bg-[#7c3aed]/10 file:text-[#a78bfa] file:cursor-pointer mb-6" 
            />
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsExportDropdownOpen(false)}
                className="px-4 py-2 text-xs border border-slate-300 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsExportDropdownOpen(false)}
                className="px-4 py-2 bg-[#7c6af7] hover:bg-[#6551e3] text-white text-xs font-semibold rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Upload backup
              </button>
            </div>
          </div>
        </div>
      )}

      <FocusWorkspace
        isOpen={isFocusModeOpen}
        problems={problems}
        onClose={() => setIsFocusModeOpen(false)}
        onRecallAction={handleRecallAction}
      />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        problems={problems}
      />

      {/* Floating Top-Center Simple Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-slate-900/95 dark:bg-[#101522]/95 border border-slate-700/50 dark:border-white/10 rounded-full shadow-2xl backdrop-blur-md text-xs font-medium text-white pointer-events-auto"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-white font-semibold text-xs">{toastMessage.message}</span>
            <button onClick={() => setToastMessage(null)} className="ml-1 text-slate-400 hover:text-white cursor-pointer">
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
};

export default Revisions;
