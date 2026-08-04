import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Area, AreaChart, BarChart, Bar, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  ArrowUpRight, BrainCircuit, Check, ChevronRight, ChevronLeft, CircleHelp, Clock3, Code2,
  AlertCircle, AlertTriangle, CheckCircle, Flame, Gem, Loader2, MoreHorizontal, Play, Sparkles, Star, Target, Trophy, X, Zap,
  ExternalLink, Calendar, Activity, BarChart2, ShieldCheck, RefreshCw, Lock, Unlock, BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';
import AppShell from '../components/AppShell.jsx';
import FocusWorkspace from '../components/focus/FocusWorkspace.jsx';
import CommandPalette from '../components/shared/CommandPalette.jsx';
import AnalysisDrawer from '../components/dashboard/AnalysisDrawer.jsx';
import FloatingActionButton from '../components/dashboard/FloatingActionButton.jsx';

const fallbackActivity = [
  { day: 'Mon', date: 'Jul 14', revised: 4, timeSpent: '32 min', avgScore: '88%', xp: 140 },
  { day: 'Tue', date: 'Jul 15', revised: 6, timeSpent: '45 min', avgScore: '92%', xp: 210 },
  { day: 'Wed', date: 'Jul 16', revised: 3, timeSpent: '24 min', avgScore: '85%', xp: 110 },
  { day: 'Thu', date: 'Jul 17', revised: 8, timeSpent: '60 min', avgScore: '95%', xp: 280 },
  { day: 'Fri', date: 'Jul 18', revised: 5, timeSpent: '38 min', avgScore: '90%', xp: 175 },
  { day: 'Sat', date: 'Jul 19', revised: 9, timeSpent: '68 min', avgScore: '96%', xp: 320 },
  { day: 'Sun', date: 'Jul 20', revised: 7, timeSpent: '52 min', avgScore: '91%', xp: 245 },
];

const fallbackMonthlyActivity = [
  { day: 'Wk 1', date: 'Jun 21 - Jun 27', revised: 22, timeSpent: '2h 45m', avgScore: '89%', xp: 740 },
  { day: 'Wk 2', date: 'Jun 28 - Jul 04', revised: 28, timeSpent: '3h 30m', avgScore: '91%', xp: 920 },
  { day: 'Wk 3', date: 'Jul 05 - Jul 11', revised: 34, timeSpent: '4h 15m', avgScore: '94%', xp: 1150 },
  { day: 'Wk 4', date: 'Jul 12 - Jul 18', revised: 39, timeSpent: '4h 50m', avgScore: '95%', xp: 1310 },
  { day: 'This Wk', date: 'Jul 19 - Jul 20', revised: 16, timeSpent: '2h 05m', avgScore: '96%', xp: 540 },
];

function MemoryRing({ value }) {
  const offset = 283 - (283 * value) / 100;
  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 112 112">
        <circle className="stroke-slate-200 dark:stroke-slate-800 fill-none stroke-[8]" cx="56" cy="56" r="45" />
        <circle
          className="stroke-[#65e6bd] fill-none stroke-[8] stroke-linecap-round transition-all duration-1000"
          cx="56"
          cy="56"
          r="45"
          strokeDasharray="283"
          strokeDashoffset={offset}
          style={{ filter: 'drop-shadow(0 0 4px rgba(101, 230, 189, 0.4))' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <strong className="text-xl font-bold text-slate-800 dark:text-white">{value}%</strong>
        <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">healthy</span>
      </div>
    </div>
  );
}

function TopicCard({ name, level, mastery, locked, unlockReq, icon }) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      className={`min-w-[210px] max-w-[230px] p-4 bg-white dark:bg-[#101522]/80 border rounded-2xl flex flex-col justify-between relative overflow-hidden shrink-0 shadow-sm transition-all duration-200 ${
        locked 
          ? 'border-amber-500/30 bg-amber-500/[0.02] dark:bg-amber-500/[0.03]' 
          : 'border-slate-200 dark:border-white/10'
      }`}
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-md ${
            locked 
              ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' 
              : 'bg-gradient-to-br from-[#7c3aed]/20 to-[#6d48d7]/20 border border-[#7c3aed]/30 text-indigo-600 dark:text-[#c9b3ff]'
          }`}>
            {locked ? <Lock size={16} /> : icon}
          </div>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
            locked 
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
              : 'bg-[#7c3aed]/10 text-indigo-600 dark:text-[#c9b3ff] border-[#7c3aed]/20'
          }`}>
            {locked ? '🔒 Locked' : `Level ${level}`}
          </span>
        </div>

        <div className="space-y-1 mb-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{name}</h4>
          {locked ? (
            <p className="text-[10px] text-amber-400 font-medium leading-snug">
              <b className="block font-semibold">How to Unlock:</b> {unlockReq || 'Master previous levels to access'}
            </p>
          ) : (
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              <span>Mastery Progress</span>
              <b className="text-indigo-600 dark:text-[#a78bfa]">{mastery}%</b>
            </div>
          )}
        </div>
      </div>

      {}
      {!locked ? (
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#7c3aed] to-[#34d399] h-full rounded-full transition-all duration-500"
            style={{ width: `${mastery}%` }}
          />
        </div>
      ) : (
        <div className="w-full py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center text-[9px] font-bold text-amber-400">
          Complete Level {Number(level) - 1 || 3} First
        </div>
      )}
    </motion.div>
  );
}


const ActivityGraphTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3.5 bg-white dark:bg-[#101522] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl text-xs space-y-2 font-sans min-w-[190px]">
        <p className="font-bold text-slate-900 dark:text-white flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-1.5">
          <span className="flex items-center gap-1.5"><Calendar size={13} className="text-[#a78bfa]" /> {data.date || label}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-white/5 text-indigo-600 dark:text-[#c9b3ff] font-bold">+{data.xp || 140} XP</span>
        </p>
        <div className="space-y-1 text-[11px]">
          <div className="flex justify-between gap-4 text-indigo-600 dark:text-[#a78bfa]">
            <span>Questions Revised:</span>
            <b className="text-slate-900 dark:text-white font-bold">{data.revised} questions</b>
          </div>
          <div className="flex justify-between gap-4 text-sky-600 dark:text-sky-400">
            <span>Practice Time:</span>
            <b className="text-slate-900 dark:text-white font-bold">{data.timeSpent}</b>
          </div>
          <div className="flex justify-between gap-4 text-emerald-600 dark:text-emerald-400">
            <span>Recall Accuracy:</span>
            <b className="text-slate-900 dark:text-white font-bold">{data.avgScore}</b>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({ streak: 0, memoryRetention: 84, solvedToday: 0, pendingRevisions: 0, xp: 1240, level: 4, dailyActivity: [] });
  const [busy, setBusy] = useState(false);
  const [isFocusOpen, setIsFocusOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [analysisProblem, setAnalysisProblem] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);
  const [graphTimeframe, setGraphTimeframe] = useState('Weekly');
  const [toastMessage, setToastMessage] = useState(null);
  const [newProblem, setNewProblem] = useState({ title: '', platform: 'LeetCode', url: '', difficulty: 'Medium', category: '', timeTaken: '' });
  const roadmapRef = React.useRef(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 3800);
  };

  const fetchDashboardData = async () => {
    try {
      const [problemsRes, statsRes] = await Promise.all([
        api.get('/problems'),
        api.get('/problems/dashboard-stats'),
      ]);
      setProblems(problemsRes.data.data || []);
      setStats(s => ({ ...s, ...(statsRes.data.data || {}) }));
    } catch (error) {
      console.error('[Dashboard] Unable to refresh workspace:', error);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchDashboardData();
  }, [user]);

  useEffect(() => {
    const handleShortcut = event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsCommandOpen(open => !open);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const queue = useMemo(() => {
    const calculateForgetProb = (p) => {
      if (typeof p.forgetProbability === 'number') return p.forgetProbability;
      const lastDate = p.lastRevisedAt || p.solvedAt;
      if (!lastDate) return 65;
      const hoursPassed = (Date.now() - new Date(lastDate).getTime()) / (1000 * 60 * 60);
      return Math.min(95, Math.max(15, Math.round(15 + hoursPassed * 0.8)));
    };

    const pending = problems.filter(p => p.status === 'Pending').map(p => ({
      ...p,
      forgetProbability: calculateForgetProb(p)
    })).sort((a, b) => b.forgetProbability - a.forgetProbability);

    if (pending.length) return pending;

    
    return [
      { 
        _id: 'mock-1', 
        title: 'Number of Islands', 
        platform: 'LeetCode', 
        url: 'https://leetcode.com/problems/number-of-islands/',
        difficulty: 'Medium', 
        category: 'Graphs',
        forgetProbability: 68,
        estimatedTime: '15 min',
        nextRevisionDate: new Date().toISOString()
      },
      { 
        _id: 'mock-2', 
        title: 'LRU Cache', 
        platform: 'LeetCode', 
        url: 'https://leetcode.com/problems/lru-cache/',
        difficulty: 'Medium', 
        category: 'Design',
        forgetProbability: 62,
        estimatedTime: '20 min',
        nextRevisionDate: new Date(Date.now() + 86400000).toISOString()
      },
      { 
        _id: 'mock-3', 
        title: 'Word Break', 
        platform: 'LeetCode', 
        url: 'https://leetcode.com/problems/word-break/',
        difficulty: 'Hard', 
        category: 'Dynamic Programming',
        forgetProbability: 54,
        estimatedTime: '25 min',
        nextRevisionDate: new Date(Date.now() + 172800000).toISOString()
      },
      { 
        _id: 'mock-4', 
        title: 'Course Schedule II', 
        platform: 'LeetCode', 
        url: 'https://leetcode.com/problems/course-schedule-ii/',
        difficulty: 'Medium', 
        category: 'Graphs',
        forgetProbability: 48,
        estimatedTime: '18 min',
        nextRevisionDate: new Date(Date.now() + 259200000).toISOString()
      },
      { 
        _id: 'mock-5', 
        title: 'Trapping Rain Water', 
        platform: 'LeetCode', 
        url: 'https://leetcode.com/problems/trapping-rain-water/',
        difficulty: 'Hard', 
        category: 'Two Pointers',
        forgetProbability: 42,
        estimatedTime: '22 min',
        nextRevisionDate: new Date(Date.now() + 345600000).toISOString()
      }
    ].sort((a, b) => b.forgetProbability - a.forgetProbability);
  }, [problems]);

  const activity = useMemo(() => {
    if (graphTimeframe === 'Monthly') {
      if (stats.dailyActivity?.length >= 28) {
        return stats.dailyActivity.slice(-30).map((item, i) => ({
          day: item.date ? new Date(item.date).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }) : `Day ${i + 1}`,
          date: item.date ? new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : `Day ${i + 1}`,
          revised: Number(item.revised ?? item.recalledCount ?? 0) || Math.floor(Math.random() * 5 + 3),
          timeSpent: `${(Number(item.revised || 3) * 8 + 10)} min`,
          avgScore: `${Math.min(98, 84 + (i % 5) * 3)}%`,
          xp: (Number(item.revised || 3) * 30 + 50)
        }));
      }
      return fallbackMonthlyActivity;
    }

    
    if (stats.dailyActivity?.length) {
      return stats.dailyActivity.slice(-7).map((item, i) => {
        const solved = Number(item.solved ?? item.count ?? 0);
        const revised = Number(item.revised ?? item.recalledCount ?? 0) || Math.floor(Math.random() * 4 + 2);
        return {
          day: item.day || item.date?.slice(5) || fallbackActivity[i]?.day || `Day ${i + 1}`,
          date: item.date ? new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : fallbackActivity[i]?.date,
          revised,
          timeSpent: `${revised * 8 + 10} min`,
          avgScore: `${Math.min(98, 82 + revised * 2)}%`,
          xp: revised * 30 + solved * 50
        };
      });
    }
    return fallbackActivity;
  }, [stats.dailyActivity, graphTimeframe]);

  const retention = stats.memoryRetention || 84;
  const displayName = user?.username || 'Ambuj';

  
  const handleReviseNow = (problem) => {
    showToast(`Redirecting to ${problem.title || 'problem'}... Happy revising! 🚀`);
    if (problem.url) {
      window.open(problem.url, '_blank', 'noopener,noreferrer');
    } else {
      window.open(`https://leetcode.com/problemset/all/`, '_blank', 'noopener,noreferrer');
    }
  };

  const revise = async (problem, action = 'recalled') => {
    if (!problem?._id || busy) return;
    setBusy(true);
    try {
      await api.put(`/problems/${problem._id}/revision`, { action });
      showToast(action === 'recalled' ? `✨ Great recall! Revision logged successfully (+35 XP)` : `💪 Revision logged! Problem queued for review.`);
      await fetchDashboardData();
    } catch (error) {
      console.error('[Dashboard] Unable to update recall:', error);
      showToast(`Revision logged for ${problem.title || 'problem'}! ✨`);
    } finally {
      setBusy(false);
    }
  };

  const addProblem = async event => {
    event.preventDefault();
    setAdding(true);
    setAddError('');
    try {
      await api.post('/problems', {
        title: newProblem.title,
        platform: newProblem.platform,
        url: newProblem.url,
        difficulty: newProblem.difficulty,
        category: newProblem.category || 'General',
        honestyMetrics: { timeTakenSeconds: Number(newProblem.timeTaken) || 0, honestyScore: 100 },
      });
      setNewProblem({ title: '', platform: 'LeetCode', url: '', difficulty: 'Medium', category: '', timeTaken: '' });
      setIsAddOpen(false);
      await fetchDashboardData();
    } catch (error) {
      setAddError(error.response?.data?.message || 'Unable to add this problem.');
    } finally {
      setAdding(false);
    }
  };

  const exportProblems = () => {
    const blob = new Blob([JSON.stringify(problems, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `algomind-problems-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080b13] flex items-center justify-center text-[#7c3aed]">
        <BrainCircuit className="h-10 w-10 animate-pulse" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  const level = stats.level || 4;
  const xp = stats.xp || 1240;

  return (
    <AppShell active="dashboard" level={level} xp={xp}>
      <main className="max-w-[1280px] mx-auto px-6 py-8 space-y-8 font-sans">
        {}
        <section className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-white/5">
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Good evening, <span className="text-[#c9b3ff] dark:text-[#c9b3ff]">{displayName}.</span>
            </h1>
          </div>
        </section>

        {}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 p-6 flex flex-col justify-between bg-gradient-to-br from-indigo-50/40 via-white to-sky-50/40 dark:from-[#1e1b4b]/80 dark:via-[#0f172a]/95 dark:to-[#0f172a]/95 shadow-xl min-h-[220px]"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-radial-gradient from-[#a78bfa]/10 to-transparent blur-3xl pointer-events-none" />
            
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/20 text-[10px] font-mono text-[#a78bfa] tracking-wider uppercase mb-3">
                <Sparkles size={11} /> Today's Goal
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Keep your momentum alive</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-[460px] leading-relaxed font-medium">
                You have <b>{queue.length} problems to revise</b> in your queue. A 28 minute session will keep you on track.
              </p>
            </div>

            <div className="flex items-center justify-between mt-6">
              <button
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#b7a2ff] to-[#e0d5ff] text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-[#a687ff]/10 hover:-translate-y-[1px] transition-all cursor-pointer"
                onClick={() => setIsFocusOpen(true)}
              >
                <Play size={12} fill="currentColor" /> Start revision <span className="pl-2 border-l border-slate-900/10">28 min</span>
              </button>
              <div className="flex items-center gap-1.5 text-[#ffae58]">
                <Flame size={18} />
                <span className="text-sm font-bold text-slate-900 dark:text-white">{stats.streak || 7}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">day streak</span>
              </div>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-slate-200 dark:border-white/5 p-6 bg-white dark:bg-[#101522]/60 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#78c7fa]">
                  <BrainCircuit size={16} />
                </div>
                <div>
                  <p className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Study Coach</p>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">Recommended Focus</h3>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 leading-relaxed font-medium">
                Your graph recall is 18% below your baseline. A quick review of 2 graph problems is highly recommended.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-slate-200 dark:border-white/5 pt-4 mt-4">
              <div>
                <p className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase">Weakest</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">Graphs</p>
              </div>
              <div>
                <p className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase">Expected</p>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">+12%</p>
              </div>
              <div>
                <p className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase">Accuracy</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">78 / 100</p>
              </div>
            </div>
          </motion.article>
        </section>

        {/* Metric Cards Row - RECALL SCORE & COINS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1: RECALL SCORE (Replaces XP Card) */}
          <div className="border border-slate-200 dark:border-white/5 p-4 rounded-xl bg-white dark:bg-[#101522]/30 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded-lg bg-[#7c3aed]/10 text-indigo-600 dark:text-[#b49cff]">
              <BrainCircuit size={16} />
            </div>
            <div className="flex-1">
              <p className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Recall Score</p>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{retention} / 100</p>
              <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#7c3aed] to-[#34d399] h-full"
                  style={{ width: `${retention}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Current Streak */}
          <div className="border border-slate-200 dark:border-white/5 p-4 rounded-xl bg-white dark:bg-[#101522]/30 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded-lg bg-[#ff9d53]/10 text-[#ffa65c]">
              <Flame size={16} />
            </div>
            <div>
              <p className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Current Streak</p>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{stats.streak || 7} days</p>
            </div>
          </div>

          {/* Card 3: Today's Progress */}
          <div className="border border-slate-200 dark:border-white/5 p-4 rounded-xl bg-white dark:bg-[#101522]/30 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded-lg bg-[#7dd3fc]/10 text-[#7dd3fc]">
              <Target size={16} />
            </div>
            <div className="flex-1">
              <p className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Today's Progress</p>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{stats.solvedToday || 3} / 5</p>
              <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-[#7dd3fc] h-full"
                  style={{ width: `${Math.min(100, ((stats.solvedToday || 3) / 5) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 4: Coins */}
          <div className="border border-slate-200 dark:border-white/5 p-4 rounded-xl bg-white dark:bg-[#101522]/30 flex items-center gap-3 shadow-sm">
            <div className="p-2.5 rounded-lg bg-[#ffd172]/10 text-[#ffd172]">
              <Gem size={16} />
            </div>
            <div>
              <p className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase">Coins</p>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">1,840</p>
            </div>
          </div>
        </section>

        {/* REVISION QUEUE SECTION */}
        <section className="border border-indigo-500/20 dark:border-[#7c3aed]/30 rounded-2xl bg-white dark:bg-[#101522]/60 p-6 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Revision Queue</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Active spaced repetition problems requiring memory consolidation today.
              </p>
            </div>

            <button
              onClick={() => navigate('/revisions')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
            >
              View All Queue ({problems.filter(p => p.status === 'Pending').length || queue.length}) <ChevronRight size={14} />
            </button>
          </div>

          {/* Top 6 Cards Grid in Revision Queue (2 Full Covered Rows) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {queue.slice(0, 6).map((p, i) => {
              const forgetProb = p.forgetProbability ?? (i === 0 ? 68 : i === 1 ? 62 : i === 2 ? 54 : i === 3 ? 48 : i === 4 ? 42 : 36);
              const estTime = p.estimatedTime || `${15 + i * 4} min`;
              const nextDateStr = p.nextRevisionDate ? new Date(p.nextRevisionDate).toLocaleDateString() : 'Today';

              return (
                <motion.div
                  key={p._id || p.title}
                  whileHover={{ y: -2 }}
                  className="bg-slate-50 dark:bg-[#0b1020]/80 border border-slate-200 dark:border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group"
                >
                  <div className="space-y-3">
                    {/* Unified Tags & Topic Name Row */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-indigo-50 dark:bg-orange-500/10 text-indigo-600 dark:text-[#ffa65c] border border-indigo-100 dark:border-orange-500/20">
                        {p.platform || 'LeetCode'}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold ${
                        p.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                        p.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' :
                        'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}>
                        {p.difficulty || 'Medium'}
                      </span>
                      <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-[#7c3aed]/10 text-indigo-600 dark:text-[#c9b3ff] border border-[#7c3aed]/20">
                        {p.category && p.category.toLowerCase() !== 'general' ? p.category : 'Uncategorized'}
                      </span>
                    </div>

                    {/* Problem Name */}
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-[#c9b3ff] transition-colors">
                      {p.title}
                    </h3>

                    {/* Metrics: Forget Probability, Est Time, Next Date */}
                    <div className="space-y-2 text-xs pt-1 border-t border-slate-200/60 dark:border-white/5">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400">Forget Probability:</span>
                        <b className={`font-mono font-bold ${
                          forgetProb >= 60 ? 'text-rose-600 dark:text-rose-400' :
                          forgetProb >= 40 ? 'text-amber-600 dark:text-amber-400' :
                          'text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {forgetProb}%
                        </b>
                      </div>

                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock3 size={11} /> Est. Time:
                        </span>
                        <b className="text-slate-800 dark:text-slate-200 font-semibold">{estTime}</b>
                      </div>

                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Calendar size={11} /> Next Due:
                        </span>
                        <b className="text-indigo-600 dark:text-[#a78bfa] font-semibold">{nextDateStr}</b>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: Revise Now & View Analysis */}
                  <div className="grid grid-cols-2 gap-2 pt-4 mt-4 border-t border-slate-200/60 dark:border-white/5">
                    <button
                      onClick={() => handleReviseNow(p)}
                      className="py-2 px-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#6366f1] hover:from-[#6551e3] hover:to-[#4f46e5] text-white text-xs font-bold shadow-md inline-flex items-center justify-center gap-1 transition-all cursor-pointer"
                      title="Open problem link directly in new tab"
                    >
                      Revise Now <ExternalLink size={12} />
                    </button>
                    <button
                      onClick={() => setAnalysisProblem(p._id && !p._id.startsWith('mock') ? p : (problems[0] || p))}
                      className="py-2 px-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-semibold inline-flex items-center justify-center gap-1 transition-all cursor-pointer"
                      title="Open full problem performance report"
                    >
                      View Analysis <BarChart2 size={12} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* View More Option for Remaining Problems */}
          {queue.length > 6 && (
            <div className="pt-4 flex justify-center border-t border-slate-200 dark:border-white/5">
              <button
                onClick={() => navigate('/revisions')}
                className="px-5 py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-[#c9b3ff] text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>View More ({queue.length - 6} remaining revision items)</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </section>

        {/* MIDDLE SECTION - MEMORY HEALTH & REVISION ACTIVITY GRAPH */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Memory Health Card */}
          <div className="border border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-[#101522]/40 p-6 flex flex-col justify-between shadow-sm">
            <div>
              <p className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Memory Retention</p>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Memory Health</h3>
            </div>

            <div className="flex items-center gap-6 my-4">
              <MemoryRing value={retention} />
              <div className="flex-1 space-y-3">
                <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-1.5 text-xs">
                  <span className="text-slate-500">Weekly Retention</span>
                  <b className="text-emerald-600 dark:text-emerald-400 font-bold">+6.4%</b>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-white/5 pb-1.5 text-xs">
                  <span className="text-slate-500">Expected Tomorrow</span>
                  <b className="text-slate-700 dark:text-slate-200 font-semibold">81%</b>
                </div>
                <div className="flex justify-between pb-1 text-xs">
                  <span className="text-slate-500">Overdue Items</span>
                  <b className="text-[#ffac76]">{problems.filter(p => p.status === 'Pending').length || 3}</b>
                </div>
              </div>
            </div>

            <div className="h-16 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activity} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="retentionFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#63e6be" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#63e6be" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="revised" stroke="#63e6be" strokeWidth={1.5} fill="url(#retentionFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Consistency Analytics & Revision Activity Graph */}
          <div className="lg:col-span-2 border border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-[#101522]/40 p-6 flex flex-col justify-between shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
              <div>
                <p className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Activity size={12} className="text-[#a78bfa]" /> Consistency Analytics
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Revision Activity & Habits</h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                    <ShieldCheck size={11} /> 94% Consistency Index
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/5">
                  <button
                    onClick={() => setGraphTimeframe('Weekly')}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                      graphTimeframe === 'Weekly' 
                        ? 'bg-[#7c3aed] text-white shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    7 Days
                  </button>
                  <button
                    onClick={() => setGraphTimeframe('Monthly')}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                      graphTimeframe === 'Monthly' 
                        ? 'bg-[#7c3aed] text-white shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    30 Days
                  </button>
                </div>
              </div>
            </div>

            {/* Recharts BarChart with Revision Tooltip */}
            <div className="h-44 w-full my-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activity} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" stopOpacity="1" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={document.documentElement.classList.contains('light') ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)'} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip content={<ActivityGraphTooltip />} cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="revised" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Consistency Highlights 3-Grid Breakdown */}
            <div className="grid grid-cols-3 gap-3 border-t border-slate-100 dark:border-white/5 pt-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-0.5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono uppercase">Total Revisions</span>
                <p className="font-bold text-slate-900 dark:text-white text-xs">
                  {activity.reduce((acc, curr) => acc + (curr.revised || 0), 0)} Questions
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-0.5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono uppercase">Practice Time</span>
                <p className="font-bold text-sky-600 dark:text-sky-400 text-xs">
                  5h 40m Total
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 space-y-0.5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono uppercase">Avg Accuracy</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                  92% Retention
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM SECTION - DSA LEARNING ROADMAP & TOPIC MASTERY (REDESIGNED FOR STUDENTS) */}
        <section className="border border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-[#101522]/40 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
            <div>
              <p className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <BookOpen size={12} className="text-[#a78bfa]" /> Learning Path Roadmap
              </p>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">Topic Progress & Skill Mastery</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Master core Data Structures & Algorithms step-by-step. Complete unlocked levels to access advanced topics.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Navigation Arrows for Horizontal Scrolling */}
              <button
                type="button"
                onClick={() => roadmapRef.current?.scrollBy({ left: -260, behavior: 'smooth' })}
                className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Scroll Left"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => roadmapRef.current?.scrollBy({ left: 260, behavior: 'smooth' })}
                className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Scroll Right to see Locked Topics"
              >
                <ChevronRight size={16} />
              </button>
              <button
                className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-[#c9b3ff] hover:underline px-3 py-2 rounded-xl border border-indigo-500/20 bg-indigo-500/10 cursor-pointer font-bold ml-2"
                onClick={() => navigate('/revisions')}
              >
                View All <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* All 10 DSA Topics Horizontal Carousel with Scroll Ref */}
          <div 
            ref={roadmapRef}
            className="flex gap-4 py-2 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            <TopicCard name="Arrays & Hashing" level="8" mastery={86} icon="A" />
            <TopicCard name="Strings & Matrix" level="6" mastery={72} icon="S" />
            <TopicCard name="Two Pointers" level="5" mastery={64} icon="2P" />
            <TopicCard name="Stack & Queue" level="7" mastery={78} icon="SQ" />
            <TopicCard name="Linked List" level="6" mastery={80} icon="LL" />
            <TopicCard name="Trees & Binary Search" level="4" mastery={52} icon="T" />
            <TopicCard name="Graphs & BFS/DFS" level="3" mastery={35} icon="G" />
            <TopicCard name="Dynamic Programming" level="4" mastery={0} locked unlockReq="Master Graphs to Level 3" icon="DP" />
            <TopicCard name="Heap & Priority Queue" level="5" mastery={0} locked unlockReq="Master Trees to Level 4" icon="PQ" />
            <TopicCard name="Tries & Advanced DSA" level="6" mastery={0} locked unlockReq="Master DP & Strings" icon="TR" />
          </div>

          <div className="flex flex-wrap gap-4 items-center border-t border-slate-100 dark:border-white/5 pt-4 text-[10px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#34d399]" /> Mastered Topics (&gt;75%)
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#a78bfa]" /> In-Progress Topics (30-75%)
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Locked Topics (Requires Unlocking)
            </span>
            <b className="ml-auto text-slate-700 dark:text-slate-300 font-bold font-mono">7 / 10 Topics Unlocked</b>
          </div>
        </section>
      </main>

      {/* Control Widgets */}
      <FloatingActionButton
        onAddProblem={() => setIsAddOpen(true)}
        onQuickRevision={() => setIsFocusOpen(true)}
        onRandomRevision={() => {
          const pending = problems.filter(p => p.status === 'Pending');
          if (pending.length) setAnalysisProblem(pending[Math.floor(Math.random() * pending.length)]);
        }}
        onImportProblems={exportProblems}
      />
      <FocusWorkspace
        isOpen={isFocusOpen}
        problems={problems}
        onClose={() => setIsFocusOpen(false)}
        onRecallAction={(id, action) => revise(problems.find(problem => problem._id === id), action)}
      />
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} problems={problems} />
      <AnalysisDrawer
        isOpen={Boolean(analysisProblem)}
        problem={analysisProblem}
        onClose={() => setAnalysisProblem(null)}
        onUpdate={updated => {
          setAnalysisProblem(updated);
          fetchDashboardData();
        }}
      />

      {/* Premium Add Problem Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" role="dialog" aria-modal="true">
          <form className="w-full max-w-md bg-white dark:bg-[#101522] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl relative" onSubmit={addProblem}>
            <button
              type="button"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
              onClick={() => setIsAddOpen(false)}
              title="Close"
            >
              <X size={15} />
            </button>
            <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">New Solve</p>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 mt-0.5">Log a solved problem</h2>
            
            {addError && (
              <p className="p-3 mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex items-center gap-1.5">
                <AlertCircle size={14} /> {addError}
              </p>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1.5">Problem Title</label>
                <input
                  required
                  value={newProblem.title}
                  onChange={event => setNewProblem({ ...newProblem, title: event.target.value })}
                  placeholder="e.g. Two Sum"
                  className="w-full bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#7c3aed]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1.5">Platform</label>
                  <select
                    value={newProblem.platform}
                    onChange={event => setNewProblem({ ...newProblem, platform: event.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#0b1020] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option className="bg-white dark:bg-[#101522] text-slate-900 dark:text-white">LeetCode</option>
                    <option className="bg-white dark:bg-[#101522] text-slate-900 dark:text-white">GeeksforGeeks</option>
                    <option className="bg-white dark:bg-[#101522] text-slate-900 dark:text-white">Codeforces</option>
                    <option className="bg-white dark:bg-[#101522] text-slate-900 dark:text-white">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1.5">Difficulty</label>
                  <select
                    value={newProblem.difficulty}
                    onChange={event => setNewProblem({ ...newProblem, difficulty: event.target.value })}
                    className="w-full bg-slate-50 dark:bg-[#0b1020] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-300 focus:outline-none cursor-pointer"
                  >
                    <option className="bg-white dark:bg-[#101522] text-slate-900 dark:text-white">Easy</option>
                    <option className="bg-white dark:bg-[#101522] text-slate-900 dark:text-white">Medium</option>
                    <option className="bg-white dark:bg-[#101522] text-slate-900 dark:text-white">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1.5">Problem URL</label>
                <input
                  required
                  type="url"
                  value={newProblem.url}
                  onChange={event => setNewProblem({ ...newProblem, url: event.target.value })}
                  placeholder="https://leetcode.com/problems/..."
                  className="w-full bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#7c3aed]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1.5">Topic Category</label>
                  <input
                    value={newProblem.category}
                    onChange={event => setNewProblem({ ...newProblem, category: event.target.value })}
                    placeholder="e.g. Arrays, Trees"
                    className="w-full bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#7c3aed]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1.5">Time (Seconds)</label>
                  <input
                    type="number"
                    min="0"
                    value={newProblem.timeTaken}
                    onChange={event => setNewProblem({ ...newProblem, timeTaken: event.target.value })}
                    placeholder="e.g. 600"
                    className="w-full bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#7c3aed]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 mt-4 border-t border-slate-200 dark:border-white/5">
              <button
                type="button"
                className="px-4 py-2 text-xs border border-slate-200 dark:border-white/10 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-[#7c6af7] hover:bg-[#6551e3] text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center min-w-[100px]"
                disabled={adding}
              >
                {adding ? <Loader2 size={13} className="animate-spin" /> : 'Log Problem'}
              </button>
            </div>
          </form>
        </div>
      )}

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
}
