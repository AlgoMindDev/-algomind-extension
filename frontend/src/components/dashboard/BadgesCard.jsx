import React from 'react';
import { 
  Award,
  Flame,
  Brain,
  Zap,
  Target,
  Trophy,
  Crown,
  CheckCircle2,
  Lock,
  GitBranch,
  Network,
  Cpu,
  Layers,
  FileCode,
  Repeat
} from 'lucide-react';

const DEFAULT_BADGES = [
  { id: 'first_solve', name: 'First Solve', desc: 'Solved 1 problem', icon: Zap, color: '#f59e0b', required: 1, type: 'solved' },
  { id: 'getting_started', name: 'Getting Started', desc: 'Solved 10 problems', icon: Target, color: '#10b981', required: 10, type: 'solved' },
  { id: 'century', name: 'Century Solver', desc: 'Solved 50 problems', icon: Trophy, color: '#0ea5e9', required: 50, type: 'solved' },
  { id: 'on_fire', name: '7-Day Streak', desc: 'Maintained 7 day streak', icon: Flame, color: '#f97316', required: 7, type: 'streak' },
  { id: 'memory_master', name: 'Memory Legend', desc: '50 Active Recalls logged', icon: Brain, color: '#8b5cf6', required: 50, type: 'recalls' },
  { id: 'tree_slayer', name: 'Tree Conqueror', desc: 'Solved 5 Tree questions', icon: GitBranch, color: '#10b981', required: 5, type: 'topic', topicKey: 'tree' },
  { id: 'graph_slayer', name: 'Graph Navigator', desc: 'Solved 5 Graph questions', icon: Network, color: '#0ea5e9', required: 5, type: 'topic', topicKey: 'graph' },
  { id: 'dp_slayer', name: 'DP Slayer', desc: 'Solved 5 DP questions', icon: Cpu, color: '#a855f7', required: 5, type: 'topic', topicKey: 'dp' },
  { id: 'array_master', name: 'Array Master', desc: 'Solved 10 Array questions', icon: Layers, color: '#f59e0b', required: 10, type: 'topic', topicKey: 'array' },
  { id: 'string_slayer', name: 'String Specialist', desc: 'Solved 5 String questions', icon: FileCode, color: '#ec4899', required: 5, type: 'topic', topicKey: 'string' },
  { id: 'recursion_slayer', name: 'Recursion Explorer', desc: 'Solved 5 Backtracking/Recursion', icon: Repeat, color: '#6366f1', required: 5, type: 'topic', topicKey: 'recursion' },
  { id: 'interview_ready', name: 'Interview Ready', desc: 'Recall Accuracy > 85%', icon: Crown, color: '#eab308', required: 85, type: 'accuracy' }
];

const BadgesCard = ({ badges = [], problems = [], totalSolved = 4, streak = 3, totalRecalls = 12, accuracy = 88, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-[#101522]/60 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
          Solved Badges
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-slate-100 dark:bg-slate-800 rounded-xl p-3 h-24 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  
  const topicCounts = {};
  problems.forEach(p => {
    const cat = (p.category || '').toLowerCase();
    if (cat.includes('tree')) topicCounts['tree'] = (topicCounts['tree'] || 0) + 1;
    if (cat.includes('graph')) topicCounts['graph'] = (topicCounts['graph'] || 0) + 1;
    if (cat.includes('dp') || cat.includes('dynamic')) topicCounts['dp'] = (topicCounts['dp'] || 0) + 1;
    if (cat.includes('array')) topicCounts['array'] = (topicCounts['array'] || 0) + 1;
    if (cat.includes('string')) topicCounts['string'] = (topicCounts['string'] || 0) + 1;
    if (cat.includes('recurs') || cat.includes('backtrack')) topicCounts['recursion'] = (topicCounts['recursion'] || 0) + 1;
  });

  
  const processedBadges = DEFAULT_BADGES.map(badge => {
    let current = 0;
    if (badge.type === 'solved') current = totalSolved;
    else if (badge.type === 'streak') current = streak;
    else if (badge.type === 'recalls') current = totalRecalls;
    else if (badge.type === 'accuracy') current = accuracy;
    else if (badge.type === 'topic') current = topicCounts[badge.topicKey] || 0;

    const isUnlocked = current >= badge.required;
    const progressPercent = Math.min(100, Math.round((current / badge.required) * 100));

    return {
      ...badge,
      unlocked: isUnlocked,
      current,
      progressPercent
    };
  });

  const unlockedCount = processedBadges.filter(b => b.unlocked).length;

  return (
    <div className="bg-white dark:bg-[#101522]/60 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm space-y-4 text-slate-900 dark:text-white">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-indigo-600 dark:text-[#a78bfa]" />
          <h4 className="text-xs font-bold uppercase tracking-wider">
            Badges & Milestones
          </h4>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-[#c9b3ff] border border-indigo-200 dark:border-indigo-500/20">
          {unlockedCount} / {processedBadges.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {processedBadges.map((badge) => {
          const Icon = badge.icon;

          if (badge.unlocked) {
            return (
              <div 
                key={badge.id}
                title={`Unlocked! ${badge.desc}`}
                className="p-3 bg-slate-50 dark:bg-[#0b1020]/80 border border-slate-200 dark:border-white/10 rounded-xl text-center space-y-1.5 shadow-sm hover:border-indigo-400 transition-all group"
              >
                <div 
                  className="w-9 h-9 rounded-xl mx-auto flex items-center justify-center shadow-sm transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${badge.color}18`, color: badge.color }}
                >
                  <Icon size={18} />
                </div>
                <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">{badge.name}</p>
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={10} /> Unlocked
                </span>
              </div>
            );
          }

          
          return (
            <div 
              key={badge.id} 
              className="p-3 bg-slate-100/50 dark:bg-[#0b1020]/40 border border-slate-200/60 dark:border-white/5 rounded-xl text-center space-y-1.5 opacity-60 hover:opacity-100 transition-opacity"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <Lock size={15} />
              </div>
              <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 truncate">{badge.name}</p>
              <div className="space-y-1 pt-0.5">
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${badge.progressPercent}%` }}
                  />
                </div>
                <span className="text-[8px] font-mono text-slate-500 dark:text-slate-400 block font-bold">
                  {badge.current} / {badge.required}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgesCard;
