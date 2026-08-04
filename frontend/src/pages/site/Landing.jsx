import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  Chrome, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Clock3, 
  ShieldCheck, 
  BarChart3, 
  Bot, 
  Code2, 
  RotateCw, 
  Terminal, 
  Layers,
  ChevronRight,
  Database,
  Cpu
} from 'lucide-react';
import SiteLayout from '../../components/site/SiteLayout.jsx';
import { CHROME_WEBSTORE_URL } from './Download.jsx';

export default function Landing() {
  // Interactive Active Recall Flashcard State
  const [flipped, setFlipped] = useState(false);
  const [activeTab, setActiveTab] = useState('arch');

  const steps = [
    {
      step: '01',
      title: 'Solve on LeetCode & GFG',
      desc: 'AlgoMind automatically detects accepted solutions & submission notes in real-time.',
      icon: <Terminal className="text-indigo-600 dark:text-[#a78bfa]" size={24} />
    },
    {
      step: '02',
      title: 'Active Recall Prompting',
      desc: 'Capture key intuition and answer flashcard prompts before forgetting the core trick.',
      icon: <BrainCircuit className="text-[#7c3aed] dark:text-purple-400" size={24} />
    },
    {
      step: '03',
      title: 'Spaced Repetition Schedule',
      desc: 'SM-2 algorithms queue revision dates right before memory decay occurs.',
      icon: <Clock3 className="text-blue-600 dark:text-blue-400" size={24} />
    }
  ];

  return (
    <SiteLayout>
      
      {/* HERO SECTION */}
      <section className="pt-16 pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-[#a78bfa] text-xs font-semibold"
            >
              <Sparkles size={14} />
              <span>Official Chrome Extension Now Live</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white"
            >
              Master DSA Problem Solving <br />
              <span className="bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#3b82f6] bg-clip-text text-transparent">
                Without Memory Decay
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl font-normal leading-relaxed"
            >
              Track coding sessions automatically. Remember every problem. Revise at the exact right time. Improve your coding interview performance with zero friction.
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <a
                href={CHROME_WEBSTORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#3b82f6] hover:from-[#6551e3] hover:to-[#2563eb] rounded-2xl shadow-xl shadow-indigo-500/25 flex items-center gap-2.5 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Chrome size={18} />
                <span>Add to Chrome — It's Free</span>
                <ArrowRight size={16} />
              </a>
              
              <Link
                to="/dashboard"
                className="px-6 py-3.5 text-sm font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-[#101522] border border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-xs flex items-center gap-2"
              >
                <span>Explore Live Dashboard</span>
              </Link>
            </motion.div>

            {/* Feature badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-slate-500 dark:text-slate-400"
            >
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> Free to use</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> Manifest V3 Ready</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-500" /> Zero manual entry</span>
            </motion.div>

          </div>

          {/* Hero Right: INTERACTIVE ACTIVE RECALL FLASHCARD PREVIEW */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative mx-auto max-w-sm rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#101522]/95 shadow-2xl p-6 backdrop-blur-xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#7c3aed] to-[#3b82f6] flex items-center justify-center text-white text-xs font-bold">
                    <BrainCircuit size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-none">Interactive Demo</h4>
                    <span className="text-[9px] text-indigo-600 dark:text-[#a78bfa] font-mono font-bold">Click card to test recall</span>
                  </div>
                </div>
                <button
                  onClick={() => setFlipped(!flipped)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-[#a78bfa] border border-indigo-500/20 text-[10px] font-bold flex items-center gap-1 hover:bg-indigo-500/20 transition-all cursor-pointer"
                >
                  <RotateCw size={12} className={flipped ? 'rotate-180 transition-transform' : ''} />
                  <span>{flipped ? 'Front' : 'Flip'}</span>
                </button>
              </div>

              {/* Flip Container */}
              <AnimatePresence mode="wait">
                {!flipped ? (
                  <motion.div
                    key="front"
                    initial={{ opacity: 0, rotateY: -90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: 90 }}
                    transition={{ duration: 0.25 }}
                    className="p-4 bg-slate-50 dark:bg-[#0b1020]/80 rounded-2xl border border-slate-200 dark:border-white/5 space-y-3"
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold font-mono">LeetCode #322</span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-400 font-bold font-mono">Medium</span>
                    </div>
                    
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">Coin Change</h5>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                      "Find the minimum number of coins needed to make up amount <code className="text-indigo-600 dark:text-[#a78bfa]">N</code> using infinite supply of given coin denominations."
                    </p>

                    <div className="pt-2">
                      <button
                        onClick={() => setFlipped(true)}
                        className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Zap size={14} />
                        <span>Test Solution Recall</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={{ opacity: 0, rotateY: -90 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    exit={{ opacity: 0, rotateY: 90 }}
                    transition={{ duration: 0.25 }}
                    className="p-4 bg-indigo-500/10 dark:bg-indigo-950/30 rounded-2xl border border-indigo-500/20 space-y-3"
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold font-mono">Optimal DP Pattern</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-[#a78bfa] font-bold font-mono">O(N * amount)</span>
                    </div>

                    <p className="text-[11px] text-slate-700 dark:text-slate-200 font-mono leading-relaxed bg-slate-900 text-emerald-400 p-2.5 rounded-xl text-[10px]">
                      dp[i] = min(dp[i], dp[i - coin] + 1)
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-bold pt-1">
                      <span className="text-slate-600 dark:text-slate-400">Memory Repetition Status:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono">Next: +7 Days ✓</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Memory Curve Indicator */}
              <div className="p-3 bg-slate-50 dark:bg-[#0b1020]/80 border border-slate-200 dark:border-white/5 rounded-2xl flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock3 size={14} className="text-indigo-600 dark:text-[#a78bfa]" /> Ebbinghaus Retention
                </span>
                <span className="text-[9px] font-mono text-emerald-500 font-bold">Optimal Curve ✓</span>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* VERIFIED STANDARDS STRIP */}
      <section className="py-8 border-y border-slate-200/60 dark:border-white/5 bg-slate-100/50 dark:bg-[#0b1020]/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-8 sm:gap-16 text-xs font-bold text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-indigo-500" />
            <span>Chrome Extension (Manifest V3)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-indigo-500" />
            <span>IndexedDB Local Cache</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-indigo-500" />
            <span>AI Spaced Repetition Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-indigo-500" />
            <span>Zero Advertising Telemetry</span>
          </div>
        </div>
      </section>

      {/* ASYMMETRIC BENTO GRID FEATURES SECTION */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-[#a78bfa]">
            Built For Serious Coders
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Everything You Need To Master DSA
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
            Designed to transform short-term problem solving into long-term interview recall.
          </p>
        </div>

        {/* 3-Part Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento 1: Spaced Repetition Engine */}
          <div className="p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#101522]/90 backdrop-blur-xl space-y-4 hover:border-indigo-500/40 transition-all shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/10">
              <Clock3 size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ebbinghaus Memory Engine</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Calculates your personalized memory decay curve based on problem difficulty and confidence. Alerts you right before memory decay sets in.
            </p>
          </div>

          {/* Bento 2: Extension Automation */}
          <div className="p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#101522]/90 backdrop-blur-xl space-y-4 hover:border-indigo-500/40 transition-all shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7c3aed] to-[#3b82f6] flex items-center justify-center text-white shadow-lg shadow-indigo-500/10">
              <Chrome size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Silent Extension Capture</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Runs silently on LeetCode, HackerRank, and Codeforces to log accepted submissions, completion duration, and topic tags automatically.
            </p>
          </div>

          {/* Bento 3: AI Coach & Anti-Cheat */}
          <div className="p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#101522]/90 backdrop-blur-xl space-y-4 hover:border-indigo-500/40 transition-all shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3b82f6] to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/10">
              <Bot size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Coach & Honesty Score</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Generates targeted hints, weak-topic audits, and monitors tab-switch & copy-paste events to compute your authentic Honesty Score.
            </p>
          </div>

        </div>
      </section>

      {/* AUTOMATED PIPELINE STEPS */}
      <section id="how-it-works" className="py-24 bg-slate-100/40 dark:bg-[#0b1020]/40 border-y border-slate-200/60 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-[#a78bfa]">
              Automated Memory Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              How AlgoMind Works
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
              From accepted submission to active recall mastery in 6 automated steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {steps.map((step, idx) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white dark:bg-[#101522]/90 border border-slate-200 dark:border-white/10 rounded-3xl p-6 space-y-3 shadow-md relative overflow-hidden"
              >
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-indigo-600 dark:text-[#a78bfa] font-mono">
                    {step.num}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{step.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="py-24 max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-[#a78bfa]">
            Command Center
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Powerful Web Dashboard
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
            Track your memory health, topic decay, revision schedules, and AI coach audits in one place.
          </p>
        </div>

        <div className="relative rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101522] shadow-2xl overflow-hidden p-2 sm:p-4">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0b1020] rounded-t-2xl">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-4 text-xs text-slate-400 font-mono">https://algomind.io/dashboard</span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/50 dark:bg-[#070913]">
            <div className="p-5 bg-white dark:bg-[#101522] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xs space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Memory Score</span>
              <div className="text-3xl font-black text-emerald-600 dark:text-[#65e6bd]">94%</div>
              <p className="text-[10px] text-slate-500 font-medium">Stable recall across solved topics</p>
            </div>

            <div className="p-5 bg-white dark:bg-[#101522] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xs space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Due Revisions</span>
              <div className="text-3xl font-black text-indigo-600 dark:text-[#a78bfa]">3 Problems</div>
              <p className="text-[10px] text-slate-500 font-medium">Optimal Ebbinghaus curve timing</p>
            </div>

            <div className="p-5 bg-white dark:bg-[#101522] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xs space-y-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">AI Topic Focus</span>
              <div className="text-3xl font-black text-amber-500">Dynamic Prog</div>
              <p className="text-[10px] text-slate-500 font-medium">Topic decay detection active</p>
            </div>
          </div>
        </div>
      </section>

      {/* AUTHENTIC TRANSPARENT ARCHITECTURE SECTION (REPLACES FAKE REVIEWS) */}
      <section className="py-20 max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-[#a78bfa]">
            Built Open & Transparent
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Developer-First Architecture
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
            No bloated trackers. Built with modern web standards for zero friction.
          </p>
        </div>

        {/* Specs & Architecture Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#101522]/90 space-y-3 shadow-xs">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-[#a78bfa] w-fit">
              <Chrome size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Manifest V3 Chrome Engine</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Uses lightweight service workers and background content scripts for zero CPU overhead while browsing coding platforms.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#101522]/90 space-y-3 shadow-xs">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-[#a78bfa] w-fit">
              <Database size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">IndexedDB Local Offline Storage</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Session logs are stored locally first so you never lose revision data even during offline study sessions.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#101522]/90 space-y-3 shadow-xs">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-[#a78bfa] w-fit">
              <Cpu size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Spaced Repetition Scheduling</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Adapts SM-2 memory curves to your individual confidence scores to ensure maximum recall retention.
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#3b82f6] p-10 sm:p-16 text-center text-white shadow-2xl overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Ready To Stop Forgetting <br /> Solved DSA Problems?
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 max-w-xl mx-auto font-medium">
            Install the official extension today and let AI manage your spaced repetition revision schedules automatically.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <a
              href={CHROME_WEBSTORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-indigo-900 hover:bg-slate-100 rounded-2xl text-sm font-bold shadow-xl flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Chrome size={18} />
              <span>Add to Chrome — It's Free</span>
            </a>
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-indigo-950/40 hover:bg-indigo-950/60 border border-white/20 text-white rounded-2xl text-sm font-bold transition-all"
            >
              Explore Web Dashboard
            </Link>
          </div>
        </div>
      </section>

    </SiteLayout>
  );
}
