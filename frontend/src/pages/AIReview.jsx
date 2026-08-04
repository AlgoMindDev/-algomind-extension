import React, { useState, useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Clock, 
  Activity, 
  Flame, 
  Award,
  TrendingUp,
  TrendingDown,
  LineChart,
  Lightbulb,
  Compass,
  ShieldAlert,
  Sparkles,
  Loader2,
  Check,
  AlertTriangle,
  Target,
  ExternalLink,
  ChevronRight,
  Zap,
  BarChart2,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  UserCheck,
  RotateCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';
import AppShell from '../components/AppShell.jsx';
import FocusWorkspace from '../components/focus/FocusWorkspace';
import CommandPalette from '../components/shared/CommandPalette';
import AnalysisDrawer from '../components/dashboard/AnalysisDrawer.jsx';

const AIReview = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [updatingProblemId, setUpdatingProblemId] = useState(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  const [selectedProblemForAnalysis, setSelectedProblemForAnalysis] = useState(null);
  const [isAnalysisDrawerOpen, setIsAnalysisDrawerOpen] = useState(false);

  
  const [typedText, setTypedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);

  const thinkingSteps = [
    'Thinking...',
    'Reviewing revision history...',
    'Analyzing memory retention...',
    'Comparing topic performance...',
    'Preparing today\'s study plan...'
  ];

  
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

  const fetchProfileData = async () => {
    setLoadingData(true);
    try {
      const [problemsRes, analyticsRes] = await Promise.all([
        api.get('/problems'),
        api.get('/analytics/dashboard')
      ]);
      setProblems(problemsRes.data.data || []);
      setAnalytics(analyticsRes.data.data || null);
    } catch (err) {
      console.error('[AI Review] Error loading data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  
  const level = analytics?.level || 1;
  const xp = analytics?.xp || 0;
  const stats = analytics || {};
  const topicStats = analytics?.topicStats || [];
  const displayName = user?.username || 'Ambuj';

  const weakTopics = [...topicStats]
    .filter(t => t.retention < 70)
    .sort((a, b) => a.retention - b.retention);

  const strongTopics = [...topicStats]
    .filter(t => t.retention >= 70)
    .sort((a, b) => b.retention - a.retention);

  const primaryWeakTopic = weakTopics[0]?.topic || (topicStats[topicStats.length - 1]?.topic || 'Graphs');
  const primaryStrongTopic = strongTopics[0]?.topic || (topicStats[0]?.topic || 'Arrays');
  
  const priorityTopicStat = topicStats.find(t => t.topic === primaryWeakTopic);
  const priorityRetention = priorityTopicStat ? priorityTopicStat.retention : 42;
  const priorityForgetRate = 100 - priorityRetention;
  const priorityCount = priorityTopicStat ? priorityTopicStat.total : (problems.filter(p => p.category === primaryWeakTopic).length || 3);

  const strongTopicStat = topicStats.find(t => t.topic === primaryStrongTopic);
  const strongRetention = strongTopicStat ? strongTopicStat.retention : 92;

  const forgetSoonProblems = [...problems]
    .filter(p => p.status === 'Pending' || (p.forgetProbability && p.forgetProbability > 25))
    .sort((a, b) => (b.forgetProbability || 0) - (a.forgetProbability || 0))
    .slice(0, 4);

  const readinessScore = Math.min(98, Math.max(35, Math.round((analytics?.recallAccuracy || 85) * 0.95)));
  const estimatedStudyTime = Math.max(15, Math.min(90, (forgetSoonProblems.length || 3) * 8 + (analytics?.overdueRevisions || 1) * 6));
  const problemsDueCount = analytics?.overdueRevisions || forgetSoonProblems.length || 5;

  
  const getDynamicQuiz = (topicName) => {
    const t = (topicName || '').toLowerCase();
    if (t.includes('dp') || t.includes('dynamic')) {
      return {
        question: `In ${topicName || 'Dynamic Programming'}, what strategy avoids recalculating overlapping subproblems?`,
        options: [
          { id: 'A', text: 'Memoization / Tabulation (Caching results)', isCorrect: true },
          { id: 'B', text: 'Re-running recursion from scratch every step', isCorrect: false },
          { id: 'C', text: 'Linear scanning with random seeds', isCorrect: false }
        ],
        explanation: 'Memoization stores subproblem results to prevent exponential re-computation!'
      };
    }
    if (t.includes('tree') || t.includes('bst')) {
      return {
        question: `What is the average search time complexity in a balanced Binary Search Tree (BST)?`,
        options: [
          { id: 'A', text: 'O(log N)', isCorrect: true },
          { id: 'B', text: 'O(N²)', isCorrect: false },
          { id: 'C', text: 'O(N log N)', isCorrect: false }
        ],
        explanation: 'In a balanced BST, each step cuts the remaining search space in half, resulting in O(log N)!'
      };
    }
    if (t.includes('graph')) {
      return {
        question: `What is the standard time complexity of BFS traversal on a graph with V vertices and E edges?`,
        options: [
          { id: 'A', text: 'O(V + E)', isCorrect: true },
          { id: 'B', text: 'O(V * E)', isCorrect: false },
          { id: 'C', text: 'O(V²)', isCorrect: false }
        ],
        explanation: 'BFS visits every vertex and explores each edge once, achieving O(V + E) complexity!'
      };
    }
    return {
      question: `What is the time complexity of Binary Search on a sorted array of N elements?`,
      options: [
        { id: 'A', text: 'O(log N)', isCorrect: true },
        { id: 'B', text: 'O(N)', isCorrect: false },
        { id: 'C', text: 'O(N²)', isCorrect: false }
      ],
      explanation: 'Binary Search repeatedly divides the array range in half, achieving logarithmic O(log N) time!'
    };
  };

  const currentQuiz = getDynamicQuiz(primaryWeakTopic);

  const sortedConfidenceTopics = [...topicStats].sort((a, b) => b.retention - a.retention);

  
  const totalSolvedCount = problems.length;
  const streakCount = stats?.streak || 0;
  
  const fullText = `Hey ${displayName},

I'm your personal AI study coach.
I've analyzed your ${totalSolvedCount} solved problems and ${streakCount}-day streak.
Currently, your focus topic is ${primaryWeakTopic} (${priorityRetention}% retention) with ${problemsDueCount} revisions queued.
Let me generate your optimized study plan for today!`;

  useEffect(() => {
    if (loadingData || !user) return;
    
    setTypedText('');
    setIsTypingComplete(false);
    setIsAnalysisComplete(false);
    setThinkingIndex(0);

    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        setTypedText(fullText.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTypingComplete(true);
        setTimeout(() => {
          setIsAnalysisComplete(true);
        }, 700);
      }
    }, 22);

    return () => clearInterval(typingInterval);
  }, [loadingData, user, problems.length]);

  
  useEffect(() => {
    if (isAnalysisComplete) return;

    const thinkingInterval = setInterval(() => {
      setThinkingIndex(prev => (prev + 1) % thinkingSteps.length);
    }, 800);

    return () => clearInterval(thinkingInterval);
  }, [isAnalysisComplete]);

  
  const handleQuickRecall = async (problemId, action = 'recalled') => {
    setUpdatingProblemId(problemId);
    try {
      const res = await api.put(`/problems/${problemId}/revision`, { action });
      if (res.data.status === 'success') {
        fetchProfileData();
      }
    } catch (err) {
      console.error('[AI Review] Error executing recall action:', err);
    } finally {
      setUpdatingProblemId(null);
    }
  };

  const openAnalysis = (problem) => {
    setSelectedProblemForAnalysis(problem);
    setIsAnalysisDrawerOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080b13] text-[#7c6af7] flex items-center justify-center">
        <Brain className="h-10 w-10 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppShell active="ai-review" level={level} xp={xp}>
      <main className="max-w-[1280px] mx-auto px-6 py-8 space-y-8 font-sans">
        
        {}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[#7c3aed] to-[#3b82f6] text-white shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                AI Coach
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Your personal study coach & performance guide</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-sm">
              <span className={`w-2 h-2 rounded-full ${isAnalysisComplete ? 'bg-emerald-500' : 'bg-amber-400 animate-ping'}`} />
              {isAnalysisComplete ? 'Updated Just now' : 'Analyzing Data'}
              <button onClick={fetchProfileData} title="Refresh analysis" className="ml-1 text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors">
                <RotateCw size={12} className={loadingData ? 'animate-spin' : ''} />
              </button>
            </span>
          </div>
        </div>

        {}
        <section className="bg-white dark:bg-[#101522]/90 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl relative overflow-hidden space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {}
            <div className="md:col-span-4 flex flex-col items-center justify-center space-y-3">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-gradient-to-tr from-indigo-100/70 via-purple-50/50 to-blue-50/80 dark:from-indigo-950/60 dark:via-purple-950/40 dark:to-[#0f172a] border border-indigo-200/50 dark:border-white/10 p-3 shadow-inner flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 to-transparent blur-xl pointer-events-none" />
                <img 
                  src="/ai_coach_avatar.png" 
                  alt="AI Coach Mentor" 
                  className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full flex-col items-center justify-center text-indigo-600 dark:text-[#a78bfa]">
                  <Brain size={48} className="animate-pulse" />
                  <span className="text-xs font-bold mt-2">AI Mentor</span>
                </div>
              </div>

              {}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold ${
                isAnalysisComplete 
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
                  : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/20'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isAnalysisComplete ? 'bg-emerald-500' : 'bg-indigo-500 animate-pulse'}`} />
                {isAnalysisComplete ? 'Coach is ready' : 'Coach is analyzing'}
              </span>
            </div>

            {}
            <div className="md:col-span-8 space-y-4">
              <div className="bg-slate-50/90 dark:bg-[#0b1020]/90 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm relative text-slate-900 dark:text-white space-y-4 min-h-[180px] flex flex-col justify-between">
                
                {}
                <div className="text-sm font-medium leading-relaxed space-y-2 text-slate-800 dark:text-slate-200 whitespace-pre-line font-sans">
                  <span>{typedText}</span>
                  {!isTypingComplete && (
                    <span className="inline-block w-1.5 h-4 bg-indigo-600 dark:bg-[#a78bfa] ml-1 animate-pulse" />
                  )}
                </div>

                {}
                <div className="pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs font-medium">
                  {!isAnalysisComplete ? (
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-[#a78bfa] font-mono font-bold">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce delay-150" />
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce delay-300" />
                      </span>
                      <span>{thinkingSteps[thinkingIndex]}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                      <CheckCircle2 size={15} />
                      <span>Analysis complete.</span>
                    </div>
                  )}
                </div>

              </div>

              {}
              <AnimatePresence>
                {isAnalysisComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2"
                  >
                    {}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0b1020]/90 border border-slate-200 dark:border-white/10 shadow-sm text-center sm:text-left">
                      <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Interview Readiness</span>
                      <p className="text-xl font-extrabold text-indigo-600 dark:text-[#c9b3ff] mt-0.5">{readinessScore}%</p>
                    </div>

                    {}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0b1020]/90 border border-slate-200 dark:border-white/10 shadow-sm text-center sm:text-left">
                      <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Today's Focus</span>
                      <p className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-0.5 truncate">{primaryWeakTopic}</p>
                    </div>

                    {/* Tile 3 */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0b1020]/90 border border-slate-200 dark:border-white/10 shadow-sm text-center sm:text-left">
                      <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Problems Due</span>
                      <p className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">{problemsDueCount}</p>
                    </div>

                    {/* Tile 4 */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0b1020]/90 border border-slate-200 dark:border-white/10 shadow-sm text-center sm:text-left">
                      <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Est. Study Time</span>
                      <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{estimatedStudyTime} min</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>

        </section>

        {loadingData ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="h-8 w-8 text-indigo-600 dark:text-[#7c6af7] animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Synthesizing personal coach review and generating study plan...</p>
          </div>
        ) : (
          <div className="space-y-8">

            {/* COACH EXECUTIVE ASSESSMENT */}
            <section className="bg-white dark:bg-[#101522]/60 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-md space-y-4 text-slate-900 dark:text-white">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-600 dark:text-[#a78bfa]" />
                <h2 className="text-base font-bold">Coach Assessment</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Strengths */}
                <div className="p-4 bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/5 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 size={15} /> Strengths
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed font-medium">
                    You consistently perform well in <strong>{primaryStrongTopic}</strong> with a high confidence score of <strong>{strongRetention}%</strong>. Your recall speed in this area is solid.
                  </p>
                </div>

                {/* Weaknesses */}
                <div className="p-4 bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/5 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
                    <AlertTriangle size={15} /> Needs Attention
                  </div>
                  <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed font-medium">
                    Your retention in <strong>{primaryWeakTopic}</strong> has dropped to <strong>{priorityRetention}%</strong>. Memory decay risk is currently high ({priorityForgetRate}%) due to low revision frequency.
                  </p>
                </div>

              </div>
            </section>


            {/* MAIN 2-COLUMN LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* LEFT COLUMN (GRID SPAN 2) */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* TODAY'S STUDY PLAN */}
                <section className="bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/30 rounded-2xl p-6 shadow-xl space-y-5 text-slate-900 dark:text-white">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-indigo-600 dark:text-[#c9b3ff]" />
                        <h2 className="text-base font-bold">Today's Study Plan</h2>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">High-priority task order to maximize retention gain today</p>
                    </div>
                    <span className="text-xs font-mono font-bold px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-[#c9b3ff] border border-indigo-200 dark:border-indigo-500/20 rounded-xl self-start sm:self-auto">
                      Estimated Time: {estimatedStudyTime} minutes
                    </span>
                  </div>

                  {/* Task Sequence */}
                  <div className="space-y-3">
                    
                    {/* Task 1 */}
                    <div className="p-4 bg-white dark:bg-[#101522]/80 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-between gap-4 hover:border-indigo-500/40 transition-colors shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          1
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            Revise {forgetSoonProblems[0]?.title || problems[0]?.title || `${primaryWeakTopic} Core Problem`}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                            High decay probability ({forgetSoonProblems[0]?.forgetProbability || priorityForgetRate}%) • {forgetSoonProblems[0]?.category || primaryWeakTopic}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => (forgetSoonProblems[0] || problems[0]) ? handleQuickRecall((forgetSoonProblems[0] || problems[0])._id) : navigate('/revisions')}
                        className="px-3.5 py-1.5 bg-[#7c3aed] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#6551e3] transition-colors cursor-pointer shrink-0"
                      >
                        Revise Now
                      </button>
                    </div>

                    {/* Task 2 */}
                    <div className="p-4 bg-white dark:bg-[#101522]/80 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-between gap-4 hover:border-indigo-500/40 transition-colors shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-indigo-600/80 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          2
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            Solve 1 {primaryWeakTopic} problem
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                            Target: Lift {primaryWeakTopic} confidence from {priorityRetention}% to &gt;70%
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/revisions"
                        className="px-3.5 py-1.5 bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 text-xs font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-white/20 transition-all shrink-0"
                      >
                        Browse Topic
                      </Link>
                    </div>

                    {/* Task 3 */}
                    <div className="p-4 bg-white dark:bg-[#101522]/80 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-between gap-4 hover:border-indigo-500/40 transition-colors shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-indigo-600/60 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          3
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            Revise {forgetSoonProblems[1]?.title || problems[1]?.title || `${primaryStrongTopic} Problem`}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                            Scheduled Spaced Repetition Due Today • {forgetSoonProblems[1]?.category || primaryStrongTopic}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => (forgetSoonProblems[1] || problems[1]) ? handleQuickRecall((forgetSoonProblems[1] || problems[1])._id) : navigate('/revisions')}
                        className="px-3.5 py-1.5 bg-[#7c3aed] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#6551e3] transition-colors cursor-pointer shrink-0"
                      >
                        Revise Now
                      </button>
                    </div>

                    {/* Task 4 */}
                    <div className="p-4 bg-white dark:bg-[#101522]/80 border border-slate-200 dark:border-white/10 rounded-xl flex items-center justify-between gap-4 hover:border-indigo-500/40 transition-colors shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-indigo-600/40 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          4
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            Read your previous intuition notes
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                            Review notes saved from extension on {primaryWeakTopic} problems
                          </p>
                        </div>
                      </div>
                      <Link
                        to="/revisions"
                        className="px-3.5 py-1.5 bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 text-xs font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-white/20 transition-all shrink-0"
                      >
                        View Notes
                      </Link>
                    </div>

                  </div>
                </section>


                {/* TOPIC ANALYSIS & DIAGNOSIS */}
                <section className="bg-white dark:bg-[#101522]/60 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-md space-y-4 text-slate-900 dark:text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-amber-500" />
                      <h2 className="text-base font-bold">Topic Analysis</h2>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 rounded-lg">
                      {primaryWeakTopic} Audit
                    </span>
                  </div>

                  <div className="p-5 bg-slate-50 dark:bg-[#0b1020]/80 border border-slate-200 dark:border-white/10 rounded-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-4">
                      <div>
                        <h3 className="text-lg font-bold">{primaryWeakTopic}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">Confidence: <b className="text-amber-700 dark:text-amber-400 font-mono">{priorityRetention}%</b></p>
                      </div>
                      <Link
                        to="/revisions"
                        className="px-4 py-2 bg-[#7c3aed] hover:bg-[#6551e3] text-white text-xs font-bold rounded-xl shadow-md transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
                      >
                        Revise {primaryWeakTopic} Problems <ArrowUpRight size={14} />
                      </Link>
                    </div>

                    {/* Reason & Coach Advice */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 bg-white dark:bg-[#101522] border border-slate-200 dark:border-white/5 rounded-xl space-y-1 shadow-sm">
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-bold">Reason for Low Score</span>
                        <p className="text-slate-800 dark:text-slate-300 font-medium leading-relaxed">
                          Low revision frequency. High forget probability ({priorityForgetRate}%). Last revised 8 days ago.
                        </p>
                      </div>
                      <div className="p-3.5 bg-white dark:bg-[#101522] border border-slate-200 dark:border-white/5 rounded-xl space-y-1 shadow-sm">
                        <span className="text-[10px] font-mono text-indigo-600 dark:text-[#a78bfa] uppercase font-bold">Coach Advice</span>
                        <p className="text-slate-800 dark:text-slate-300 font-medium leading-relaxed">
                          Revise 2 {primaryWeakTopic} problems today to reset memory curve decay.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>


                {/* PROBLEMS THAT NEED ATTENTION */}
                <section className="bg-white dark:bg-[#101522]/60 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-md space-y-4 text-slate-900 dark:text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-indigo-600 dark:text-[#a78bfa]" />
                      <h2 className="text-base font-bold">Problems That Need Attention</h2>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Highest decay probability</span>
                  </div>

                  {forgetSoonProblems.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 dark:bg-[#0b1020]/40 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 space-y-2">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-300">No high decay problems 🎉</p>
                      <p className="text-xs text-slate-500">You are maintaining excellent recall performance across active cards.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {forgetSoonProblems.map((p) => {
                        const forgetProb = p.forgetProbability || 45;

                        return (
                          <motion.div
                            key={p._id}
                            whileHover={{ y: -3 }}
                            className="p-5 bg-slate-50 dark:bg-[#0b1020]/80 border border-slate-200 dark:border-white/10 rounded-2xl flex flex-col justify-between shadow-sm hover:border-indigo-500/30 transition-all space-y-4 group"
                          >
                            <div className="space-y-2.5">
                              {/* Badges */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-[#c9b3ff] border border-indigo-200 dark:border-indigo-500/20">
                                    {p.category || 'DSA'}
                                  </span>
                                  <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold ${
                                    p.difficulty === 'Easy' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' :
                                    p.difficulty === 'Hard' ? 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20' :
                                    'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                                  }`}>
                                    {p.difficulty || 'Medium'}
                                  </span>
                                </div>
                                <span className={`text-[10px] font-mono font-bold ${
                                  forgetProb >= 60 ? 'text-rose-600 dark:text-rose-400' :
                                  forgetProb >= 40 ? 'text-amber-600 dark:text-amber-400' :
                                  'text-emerald-600 dark:text-emerald-400'
                                }`}>
                                  {forgetProb}% FORGET
                                </span>
                              </div>

                              {/* Title */}
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-[#c9b3ff] transition-colors">
                                <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
                                  {p.title} <ExternalLink size={12} className="opacity-40" />
                                </a>
                              </h3>

                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                Revision due: <b>{p.nextRevisionDate ? new Date(p.nextRevisionDate).toLocaleDateString() : 'Today'}</b>
                              </p>
                            </div>

                            {/* Buttons */}
                            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200 dark:border-white/5">
                              <button
                                onClick={() => openAnalysis(p)}
                                className="py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-[11px] font-semibold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer inline-flex items-center justify-center gap-1"
                              >
                                View Analysis <BarChart2 size={12} />
                              </button>
                              <button
                                onClick={() => handleQuickRecall(p._id)}
                                disabled={updatingProblemId === p._id}
                                className="py-1.5 px-2.5 rounded-lg bg-[#7c3aed] text-white text-[11px] font-bold shadow-md hover:bg-[#6551e3] transition-colors cursor-pointer disabled:opacity-40 inline-flex items-center justify-center gap-1"
                              >
                                {updatingProblemId === p._id ? '...' : <Check size={12} />} Revise Now
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </section>

              </div>


              {/* RIGHT COLUMN (GRID SPAN 1) */}
              <div className="space-y-8">
                
                {/* LEARNING PATTERN & BEHAVIOR OBSERVATIONS */}
                <section className="bg-white dark:bg-[#101522]/60 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-md space-y-4 text-slate-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <Compass className="h-4 w-4 text-indigo-600 dark:text-[#a78bfa]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">Learning Behavior</h3>
                  </div>

                  <div className="space-y-3 text-xs text-slate-800 dark:text-slate-300 font-medium">
                    <div className="p-3 bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/5 rounded-xl space-y-1 shadow-sm">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block font-bold">SOLVING SPEED & RETENTION GAP</span>
                      <p className="leading-relaxed">
                        You solve <strong>{primaryStrongTopic}</strong> ({strongRetention}%) significantly faster and with higher confidence than <strong>{primaryWeakTopic}</strong> ({priorityRetention}%).
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/5 rounded-xl space-y-1 shadow-sm">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block font-bold">REVISION PATTERN</span>
                      <p className="leading-relaxed">
                        Average of <strong>{Math.max(1, Math.round((analytics?.totalRevised || 5) / Math.max(1, totalSolvedCount)))} revision(s)</strong> per problem completed so far.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/5 rounded-xl space-y-1 shadow-sm">
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block font-bold">HONESTY & RECALL RATING</span>
                      <p className="leading-relaxed">
                        Your overall recall accuracy index is currently <strong>{Math.round(analytics?.recallAccuracy || 85)}%</strong>.
                      </p>
                    </div>
                  </div>
                </section>


                {/* CONFIDENCE SUMMARY */}
                <section className="bg-white dark:bg-[#101522]/60 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-md space-y-4 text-slate-900 dark:text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-[#a78bfa]" />
                      <h3 className="text-xs font-bold uppercase tracking-wider">Confidence Summary</h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 font-medium">High → Low</span>
                  </div>

                  <div className="space-y-3">
                    {sortedConfidenceTopics.slice(0, 5).map((t) => (
                      <div key={t.topic} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-800 dark:text-slate-200">{t.topic}</span>
                          <span className={
                            t.retention >= 75 ? 'text-emerald-600 dark:text-emerald-400 font-mono font-bold' : 
                            t.retention >= 50 ? 'text-amber-600 dark:text-amber-400 font-mono font-bold' : 
                            'text-rose-600 dark:text-rose-400 font-mono font-bold'
                          }>
                            {t.retention}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
                          <div 
                            className={`h-full rounded-full ${
                              t.retention >= 75 ? 'bg-emerald-500' : 
                              t.retention >= 50 ? 'bg-amber-500' : 
                              'bg-rose-500'
                            }`}
                            style={{ width: `${t.retention}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>


                {/* WEEKLY IMPROVEMENT STATS */}
                <section className="bg-white dark:bg-[#101522]/60 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-md space-y-4 text-slate-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">Weekly Progress</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-center text-xs">
                    <div className="p-3 bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/5 rounded-xl shadow-sm">
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 block uppercase font-mono font-bold">Forget Risk</span>
                      <span className="text-sm font-bold text-amber-600 dark:text-amber-400 block mt-0.5">{priorityForgetRate}%</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/5 rounded-xl shadow-sm">
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 block uppercase font-mono font-bold">Confidence</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">↑ {Math.round(analytics?.recallAccuracy || 85)}%</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/5 rounded-xl shadow-sm">
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 block uppercase font-mono font-bold">Revisions Done</span>
                      <span className="text-sm font-bold text-indigo-600 dark:text-[#a78bfa] block mt-0.5">{analytics?.totalRevised || problems.length}</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/5 rounded-xl shadow-sm">
                      <span className="text-[9px] text-slate-400 block uppercase font-mono font-bold">Avg Speed</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">{Math.round(analytics?.avgSolvingTime || 22)} min</span>
                    </div>
                  </div>
                </section>


                {/* AI FLASHCARD MASTERY CHECK (INTERACTIVE RECALL QUIZ) */}
                <section className="bg-white dark:bg-[#101522]/60 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-md space-y-4 text-slate-900 dark:text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <h3 className="text-xs font-bold uppercase tracking-wider">Quick Recall Challenge</h3>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 rounded">
                      +20 XP
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-[#0b1020]/80 border border-slate-200 dark:border-white/5 rounded-xl space-y-3">
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-normal">
                      {currentQuiz.question}
                    </p>

                    <div className="space-y-2 pt-1">
                      {currentQuiz.options.map((opt) => {
                        const isSelected = quizAnswer === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setQuizAnswer(opt.id)}
                            className={`w-full p-2.5 text-left text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? opt.isCorrect
                                  ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold'
                                  : 'bg-rose-50 dark:bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-400 font-bold'
                                : 'bg-white dark:bg-[#101522] border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
                            }`}
                          >
                            <span>{opt.id}. {opt.text}</span>
                            {isSelected && (
                              opt.isCorrect 
                                ? <CheckCircle2 size={14} className="text-emerald-500" />
                                : <AlertTriangle size={14} className="text-rose-500" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {quizAnswer && (
                      <p className={`text-[11px] font-bold p-2.5 rounded-lg border flex items-center gap-1.5 ${
                        quizAnswer === 'A' 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                      }`}>
                        {quizAnswer === 'A' ? (
                          <>
                            <CheckCircle2 size={14} /> Correct! {currentQuiz.explanation} +20 XP awarded!
                          </>
                        ) : (
                          <>
                            <AlertTriangle size={14} /> Incorrect. Option A is correct. {currentQuiz.explanation}
                          </>
                        )}
                      </p>
                    )}
                  </div>
                </section>

              </div>

            </div>

            {/* FINAL COACH MESSAGE - FULL HORIZONTAL WIDTH */}
            <section className="w-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 dark:from-[#101522]/90 dark:via-[#101522]/80 dark:to-[#0b1020] border border-indigo-500/20 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-3 text-slate-900 dark:text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-[#c9b3ff] uppercase tracking-wider">
                  <UserCheck size={18} /> Final Coach Guidance & Strategy Commitment
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-indigo-500/10 text-indigo-700 dark:text-[#c9b3ff] border border-indigo-500/20 rounded-lg">
                  Personalized Strategy Note
                </span>
              </div>
              <div className="space-y-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                <p>
                  You're making steady progress, <strong>{displayName}</strong>. Your recall accuracy index is currently at <strong>{Math.round(analytics?.recallAccuracy || 85)}%</strong> across <strong>{totalSolvedCount}</strong> total problems.
                </p>
                <p>
                  To maximize your interview readiness score, prioritize resolving your <strong>{primaryWeakTopic}</strong> memory decay today. Completing today's recommended {estimatedStudyTime}-minute revision plan will reset your Ebbinghaus curve and protect your {streakCount}-day study streak.
                </p>
              </div>
            </section>

          </div>
        )}
      </main>

      {/* Full Page Analysis Modal Drawer */}
      <AnalysisDrawer
        isOpen={isAnalysisDrawerOpen}
        problem={selectedProblemForAnalysis}
        onClose={() => setIsAnalysisDrawerOpen(false)}
        onUpdate={(updatedProb) => {
          fetchProfileData();
          setSelectedProblemForAnalysis(updatedProb);
        }}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        problems={problems}
      />
    </AppShell>
  );
};

export default AIReview;
