import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Tag, Calendar, Rocket, Clock3 } from 'lucide-react';
import SiteLayout from '../../components/site/SiteLayout.jsx';

export default function Changelog() {
  const releases = [
    {
      version: 'v1.0.2',
      tag: 'Linear Daily Briefing & Responsive Upgrade',
      date: 'August 2026',
      status: 'Current Version',
      features: [
        'Redesigned Daily Preparation Briefing modal (Linear/Raycast aesthetic with Today\'s Mission & Smart Recommendations)',
        'Dynamic viewport scaling (max-height 86vh) for laptop screens (1366x768, 1440x900) without vertical clipping',
        'Top 3 highest forget-risk problem selection engine in Focus Mode with animated loading indicator',
        'High-contrast Day Mode (Light Theme) styling for concept notes, alert boxes, and category badges',
        'Preserved spaced repetition schedule on intuition note updates without resetting step count'
      ]
    },
    {
      version: 'v1.0.1',
      tag: 'Official Web Store Launch',
      date: 'August 2026',
      status: 'Stable Release',
      features: [
        'Published on official Google Chrome Web Store for public distribution',
        'One-click Web Store installation & automatic extension updates',
        'Enhanced Real-time solution & comment tab detection for LeetCode & GeeksforGeeks',
        'Optimized note-only saves without incrementing revision step count',
        'Adaptive floating widget UI (auto-adjusts between desktop monitors and laptops)',
        'Direct Web Store user rating & review link integration'
      ]
    },
    {
      version: 'v1.0.0',
      tag: 'Initial Beta Release',
      date: 'July 2026',
      status: 'Initial Release',
      features: [
        'Chrome Extension with Manifest V3 architecture',
        'AI Coach with dynamic personalized review guidance',
        'Active Recall flashcard challenge engine',
        'Anti-Cheat Honesty Score (tab switches, paste detection)',
        'Full Web Dashboard with Ebbinghaus memory curve scheduler',
        'Multi-platform support for LeetCode, GeeksforGeeks, Codeforces'
      ]
    },
    {
      version: 'v1.1.0',
      tag: 'Upcoming Release',
      date: 'Q3 2026',
      status: 'In Development',
      features: [
        'Mozilla Firefox & Microsoft Edge extension support',
        'Custom topic tags and manual mistake note tagging',
        'Spaced repetition email notifications & calendar sync',
        'Dark mode themes customization'
      ]
    },
    {
      version: 'v1.2.0',
      tag: 'Planned Release',
      date: 'Q4 2026',
      status: 'Planned',
      features: [
        'VS Code Extension for direct IDE solving integration',
        'Peer-to-peer DSA mock interview challenge mode',
        'Mobile companion app for iOS & Android'
      ]
    }
  ];

  return (
    <SiteLayout>
      <div className="py-16 max-w-5xl mx-auto px-6 space-y-12">
        
        {}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-[#a78bfa] border border-indigo-500/20">
            Product History & Updates
          </span>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            AlgoMind Changelog
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
            Explore the latest features, releases, and upcoming platform enhancements.
          </p>
        </div>

        {}
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-slate-200 dark:before:bg-white/10">
          {releases.map((rel, idx) => (
            <motion.div
              key={rel.version}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative flex flex-col sm:flex-row items-start justify-between gap-6 p-6 sm:p-8 bg-white dark:bg-[#101522] border border-slate-200 dark:border-white/10 rounded-3xl shadow-xl z-10"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                    {rel.version}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                    idx === 0 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                      : 'bg-indigo-500/10 text-indigo-600 dark:text-[#a78bfa] border border-indigo-500/20'
                  }`}>
                    {rel.tag}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium font-mono">
                  <Calendar size={13} /> {rel.date} • {rel.status}
                </div>

                <ul className="space-y-2 pt-2 text-xs text-slate-700 dark:text-slate-300">
                  {rel.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <CheckCircle2 size={14} className={idx === 0 ? "text-emerald-500 shrink-0" : "text-indigo-500 shrink-0"} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {idx === 0 && (
                <div className="shrink-0 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 font-bold text-xs font-mono">
                  ● Live Release
                </div>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </SiteLayout>
  );
}
