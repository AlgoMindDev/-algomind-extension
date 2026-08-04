import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { 
  Brain, 
  Award, 
  Activity, 
  Flame, 
  Target, 
  Calendar,
  CheckCircle2,
  BarChart2,
  PieChart as PieIcon
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';
import AppShell from '../components/AppShell.jsx';
import HeatmapCard from '../components/dashboard/HeatmapCard.jsx';
import BadgesCard from '../components/dashboard/BadgesCard.jsx';
import CommandPalette from '../components/shared/CommandPalette.jsx';


const PLATFORM_COLORS = {
  LeetCode: '#f59e0b',       
  GeeksforGeeks: '#10b981',  
  Codeforces: '#0ea5e9',     
  Other: '#8b5cf6',          
  Uncategorized: '#94a3b8'   
};

const CATEGORICAL_COLORS = ['#f59e0b', '#10b981', '#0ea5e9', '#8b5cf6', '#ec4899', '#f43f5e'];

const Profile = () => {
  const { user, loading } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  
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
      console.error('[Profile] Error loading profile data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

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

  
  const totalSolved = problems.length;
  const totalRevised = problems.reduce((acc, p) => acc + (p.submissionCount || 1), 0);
  
  const totalHistoryItems = problems.reduce((acc, p) => acc + (p.activeRecallHistory?.length || 0), 0);
  const totalSuccesses = problems.reduce((acc, p) => acc + (p.activeRecallHistory?.filter(h => h.wasRecalled).length || 0), 0);
  const recallAccuracy = totalHistoryItems > 0 ? Math.round((totalSuccesses / totalHistoryItems) * 100) : 100;

  
  const easySolved = problems.filter(p => p.difficulty === 'Easy').length;
  const mediumSolved = problems.filter(p => p.difficulty === 'Medium').length;
  const hardSolved = problems.filter(p => p.difficulty === 'Hard').length;

  
  const platformMap = {};
  problems.forEach(p => {
    const pName = p.platform || 'LeetCode';
    platformMap[pName] = (platformMap[pName] || 0) + 1;
  });

  const platformData = Object.keys(platformMap).map(key => ({
    name: key,
    value: platformMap[key],
    color: PLATFORM_COLORS[key] || '#8b5cf6'
  })).sort((a, b) => b.value - a.value);

  
  const meaningfulPlatformsCount = platformData.filter(p => totalSolved > 0 && (p.value / totalSolved) >= 0.10).length;
  const shouldRenderDonut = platformData.length >= 3 && meaningfulPlatformsCount >= 3;

  
  const topicMap = {};
  problems.forEach(p => {
    let cat = p.category || 'Uncategorized';
    if (cat.toLowerCase() === 'general') cat = 'Uncategorized';
    topicMap[cat] = (topicMap[cat] || 0) + 1;
  });

  const rawTopicData = Object.keys(topicMap).map(key => ({
    topic: key,
    solved: topicMap[key],
    fill: key === 'Uncategorized' ? '#94a3b8' : undefined
  }));

  
  const specificTopics = rawTopicData.filter(t => t.topic !== 'Uncategorized').sort((a, b) => b.solved - a.solved);
  const uncategorizedTopics = rawTopicData.filter(t => t.topic === 'Uncategorized');

  const topicData = [...specificTopics, ...uncategorizedTopics].map((t, idx) => ({
    ...t,
    fill: t.fill || CATEGORICAL_COLORS[idx % CATEGORICAL_COLORS.length]
  }));

  
  const level = analytics?.level || 1;
  const xp = analytics?.xp || 0;
  const xpInLevel = xp % 1000;
  const xpProgress = Math.round((xpInLevel / 1000) * 100);

  const getRank = (lvl) => {
    if (lvl >= 15) return 'Legendary Recall Grandmaster';
    if (lvl >= 10) return 'DSA Recall Specialist';
    if (lvl >= 5) return 'Active Recall Expert';
    return 'Spaced Repetition Initiate';
  };

  return (
    <AppShell active="profile" level={level} xp={xp}>
      <main className="max-w-[1280px] mx-auto px-6 py-8 space-y-8 font-sans">
        
        {}
        <div className="bg-gradient-to-r from-white via-slate-50 to-indigo-50/30 dark:from-[#101522]/90 dark:via-[#101522]/70 dark:to-[#0b1020] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl relative overflow-hidden text-slate-900 dark:text-white">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#7c3aed] via-[#6366f1] to-[#3b82f6] flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-indigo-500/25 border border-white/20 flex-shrink-0">
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{user.username}</h1>
                <span className="text-[10px] px-3 py-0.5 rounded-full font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-[#c9b3ff] border border-indigo-200 dark:border-indigo-500/20 shadow-sm">
                  {getRank(level)}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-medium">{user.email}</p>
              
              <div className="mt-4 w-60 sm:w-72">
                <div className="flex justify-between text-[10px] font-bold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">Level {level}</span>
                  <span className="text-[#7c3aed] dark:text-[#a78bfa] font-mono">{xpInLevel} / 1000 XP</span>
                </div>
                <div className="w-full bg-slate-200/80 dark:bg-[#0b1020]/80 rounded-full h-2 border border-slate-200 dark:border-white/10 overflow-hidden p-0.5">
                  <div 
                    className="bg-gradient-to-r from-[#7c3aed] to-[#6366f1] h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 sm:space-x-4 pt-4 md:pt-0 w-full md:w-auto justify-between sm:justify-end">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-[#0b1020]/80 border border-slate-200 dark:border-white/10 text-center shadow-sm min-w-[90px] sm:min-w-[105px]">
              <div className="text-xl sm:text-2xl font-black text-amber-500 dark:text-[#ffa65c]">{analytics?.currentStreak || 0}d</div>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1 font-bold">Streak</p>
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-[#0b1020]/80 border border-slate-200 dark:border-white/10 text-center shadow-sm min-w-[90px] sm:min-w-[105px]">
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{analytics?.longestStreak || 0}d</div>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1 font-bold">Best Streak</p>
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-[#0b1020]/80 border border-slate-200 dark:border-white/10 text-center shadow-sm min-w-[90px] sm:min-w-[105px]">
              <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-[#65e6bd]">{analytics?.memoryHealth || 0}%</div>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1 font-bold">Memory</p>
            </div>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {}
          <div className="lg:col-span-2 space-y-8">
            
            {}
            <div className="bg-white dark:bg-[#101522]/60 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm text-slate-900 dark:text-white">
              <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                <Activity className="h-4 w-4 text-[#7c3aed]" />
                Revision Statistics
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/5 rounded-xl">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 font-bold">Total Solved</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{totalSolved}</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/5 rounded-xl">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 font-bold">Total Reviews</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{totalRevised}</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/5 rounded-xl">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1 font-bold">Recall Accuracy</span>
                  <span 
                    className="text-xl sm:text-2xl font-extrabold" 
                    style={{ color: recallAccuracy >= 75 ? '#10b981' : '#f59e0b' }}
                  >
                    {recallAccuracy}%
                  </span>
                </div>
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {}
              <div className="bg-white dark:bg-[#101522]/60 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm text-slate-900 dark:text-white">
                <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Platform Solves</h3>
                
                {shouldRenderDonut ? (
                  
                  <div>
                    <div className="h-44 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={platformData}
                            cx="50%"
                            cy="50%"
                            innerRadius={42}
                            outerRadius={62}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {platformData.map((entry) => (
                              <Cell key={entry.name} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card, #101522)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 12, fontSize: 11 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-2.5 justify-center mt-2">
                      {platformData.map((entry) => (
                        <div key={entry.name} className="flex items-center space-x-1.5 text-[10px] text-slate-600 dark:text-slate-400">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                          <span>{entry.name} ({entry.value})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  
                  <div className="space-y-3 py-2">
                    {platformData.map((entry) => {
                      const share = totalSolved > 0 ? Math.round((entry.value / totalSolved) * 100) : 0;
                      return (
                        <div key={entry.name} className="p-3 bg-slate-50 dark:bg-[#0b1020]/60 border border-slate-200 dark:border-white/5 rounded-xl space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span className="text-slate-900 dark:text-white">{entry.name}</span>
                            </div>
                            <span className="font-mono text-slate-600 dark:text-slate-400">{entry.value} solves ({share}%)</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all"
                              style={{ width: `${share}%`, backgroundColor: entry.color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {platformData.length === 0 && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6">No platform solves logged yet.</p>
                    )}
                  </div>
                )}
              </div>

              {}
              <div className="bg-white dark:bg-[#101522]/60 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm text-slate-900 dark:text-white">
                <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Topic Strengths</h3>
                <div className="h-48">
                  {topicData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topicData.slice(0, 6)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                        <XAxis dataKey="topic" stroke="#64748b" fontSize={9} />
                        <YAxis stroke="#64748b" fontSize={9} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card, #101522)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: 12, fontSize: 11 }} cursor={{ fill: 'transparent' }} />
                        <Bar dataKey="solved" radius={[4, 4, 0, 0]}>
                          {topicData.slice(0, 6).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400">No topic solves to display.</p>
                    </div>
                  )}
                </div>
              </div>

              {}
              <div className="bg-white dark:bg-[#101522]/60 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm text-slate-900 dark:text-white md:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Difficulty Solves Breakdown</h3>
                  <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-[#a78bfa]">{totalSolved} Total Questions Solved</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {}
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      <span>Easy Questions</span>
                      <span className="font-mono">{easySolved} ({totalSolved > 0 ? Math.round((easySolved / totalSolved) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${totalSolved > 0 ? (easySolved / totalSolved) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {}
                  <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-amber-700 dark:text-amber-400">
                      <span>Medium Questions</span>
                      <span className="font-mono">{mediumSolved} ({totalSolved > 0 ? Math.round((mediumSolved / totalSolved) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${totalSolved > 0 ? (mediumSolved / totalSolved) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {}
                  <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-rose-700 dark:text-rose-400">
                      <span>Hard Questions</span>
                      <span className="font-mono">{hardSolved} ({totalSolved > 0 ? Math.round((hardSolved / totalSolved) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-500 rounded-full transition-all"
                        style={{ width: `${totalSolved > 0 ? (hardSolved / totalSolved) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {}
            <div>
              <HeatmapCard 
                heatmap={analytics?.heatmap} 
                totalRevisions={analytics?.totalRevisions || totalRevised} 
                streak={analytics?.currentStreak || 0} 
                loading={loadingData} 
              />
            </div>

          </div>

          {}
          <div className="space-y-8">
            
            {}
            <div>
              <BadgesCard 
                badges={analytics?.badges || []} 
                problems={problems}
                totalSolved={totalSolved}
                streak={analytics?.currentStreak || 0}
                totalRecalls={totalHistoryItems}
                accuracy={recallAccuracy}
                loading={loadingData} 
              />
            </div>

            {}
            <div className="bg-white dark:bg-[#101522]/60 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm text-slate-900 dark:text-white space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-indigo-600 dark:text-[#a78bfa]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Recent Activity Log</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Live Timeline</span>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {problems.slice(0, 6).map((p, idx) => {
                  const hasAttempts = p.activeRecallHistory && p.activeRecallHistory.length > 0;
                  const latestRecall = hasAttempts ? p.activeRecallHistory[p.activeRecallHistory.length - 1] : null;
                  
                  return (
                    <div key={p._id + idx} className="p-3 bg-slate-50 dark:bg-[#0b1020]/80 border border-slate-200 dark:border-white/5 rounded-xl space-y-2 hover:border-indigo-500/30 transition-all">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                            {p.platform || 'LeetCode'}
                          </span>
                          <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold ${
                            p.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                            p.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' :
                            'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          }`}>
                            {p.difficulty || 'Medium'}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 shrink-0">
                          {p.solvedAt ? new Date(p.solvedAt).toLocaleDateString() : 'Today'}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        <a href={p.url} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-[#c9b3ff] transition-colors">
                          {p.title}
                        </a>
                      </h4>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        <span className="truncate">Topic: <b className="text-slate-700 dark:text-slate-300">{p.category || 'DSA'}</b></span>
                        <span className={`font-mono font-bold ${
                          latestRecall ? (latestRecall.wasRecalled ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400') : 'text-indigo-600 dark:text-[#a78bfa]'
                        }`}>
                          {latestRecall ? (latestRecall.wasRecalled ? 'Passed Recall ✓' : 'Forgot Recall ✗') : 'Added to Spaced Queue'}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {problems.length === 0 && (
                  <p className="text-xs text-slate-500 italic text-center py-8">No recent log entries to show.</p>
                )}
              </div>
            </div>

          </div>

        </div>

      </main>
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        problems={problems}
      />
    </AppShell>
  );
};

export default Profile;
