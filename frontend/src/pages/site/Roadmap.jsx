import React from 'react';
import { motion } from 'framer-motion';
import { Chrome, Layers, Code, Smartphone, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import SiteLayout from '../../components/site/SiteLayout.jsx';

export default function Roadmap() {
  const roadmapItems = [
    {
      stage: 'Phase 1',
      title: 'Chrome Extension',
      platform: 'Google Chrome',
      status: 'Completed & Live ✓',
      isLive: true,
      desc: 'Automatic submission tracking, AI Coach, Spaced Repetition engine, and Web Dashboard.',
      icon: Chrome,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      stage: 'Phase 2',
      title: 'Firefox Add-on',
      platform: 'Mozilla Firefox',
      status: 'In Progress ⚙️',
      isLive: false,
      desc: 'Porting Manifest V3 core scripts for full Firefox browser compatibility.',
      icon: Layers,
      color: 'from-amber-500 to-orange-500'
    },
    {
      stage: 'Phase 3',
      title: 'VS Code Extension',
      platform: 'VS Code Marketplace',
      status: 'Planned 🚀',
      isLive: false,
      desc: 'Track local IDE problem solving, LeetCode extension sync, and offline flashcard review.',
      icon: Code,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      stage: 'Phase 4',
      title: 'Android Companion App',
      platform: 'Google Play Store',
      status: 'Future Vision 📱',
      isLive: false,
      desc: 'On-the-go quick recall flashcards, daily push notifications, and streak widgets.',
      icon: Smartphone,
      color: 'from-purple-500 to-pink-500'
    },
    {
      stage: 'Phase 5',
      title: 'iOS Companion App',
      platform: 'Apple App Store',
      status: 'Future Vision 🍎',
      isLive: false,
      desc: 'Native iOS app with Lock Screen widgets and Apple Watch revision reminders.',
      icon: Smartphone,
      color: 'from-[#3b82f6] to-cyan-500'
    }
  ];

  return (
    <SiteLayout>
      <div className="py-16 max-w-5xl mx-auto px-6 space-y-12">
        
        {}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-[#a78bfa] border border-indigo-500/20">
            Platform Vision
          </span>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            AlgoMind Roadmap
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
            Our multi-platform vision to make active recall available everywhere you code.
          </p>
        </div>

        {}
        <div className="space-y-6">
          {roadmapItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.stage}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-6 sm:p-8 rounded-3xl border ${
                  item.isLive 
                    ? 'bg-white dark:bg-[#101522] border-emerald-500/40 shadow-xl' 
                    : 'bg-white/80 dark:bg-[#101522]/80 border-slate-200 dark:border-white/10 shadow-sm'
                } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center font-bold shadow-lg shrink-0`}>
                    <Icon size={26} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">{item.stage}</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">• {item.platform}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg font-medium">{item.desc}</p>
                  </div>
                </div>

                <div className="shrink-0">
                  <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl ${
                    item.isLive 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                      : 'bg-indigo-500/10 text-indigo-600 dark:text-[#a78bfa] border border-indigo-500/20'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </SiteLayout>
  );
}
