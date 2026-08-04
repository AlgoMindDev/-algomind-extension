import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Zap, Activity, Chrome, Target, CheckCircle2, Rocket, BrainCircuit } from 'lucide-react';
import SiteLayout from '../../components/site/SiteLayout.jsx';

const pillars = [
  {
    icon: Brain,
    name: 'Active Recall',
    desc: 'Self-testing prompts force your brain to retrieve solved solutions, strengthening neural retention far better than passive reading.',
  },
  {
    icon: Target,
    name: 'Spaced Repetition',
    desc: 'Algorithmically calculates exact review intervals before memory decay sets in, maximizing retention while minimizing study hours.',
  },
  {
    icon: Zap,
    name: 'AI Coach',
    desc: 'Provides real-time hints, pattern breakdowns, and optimal time complexity recommendations tailored to your weak spots.',
  },
  {
    icon: Activity,
    name: 'Memory Analytics',
    desc: 'Visualizes long-term retention rates, topic mastery curves, and interview readiness scores with actionable progress signals.',
  },
  {
    icon: Sparkles,
    name: 'Smart Revision',
    desc: 'Automatically prioritizes high-yield problems in your daily queue so you spend time only where recall confidence is declining.',
  },
  {
    icon: Chrome,
    name: 'Chrome Extension',
    desc: 'Runs silently in the background on LeetCode, HackerRank, and Codeforces to log problem solutions and completion metrics automatically.',
  },
];

export default function About() {
  return (
    <SiteLayout>
      <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16 space-y-14">
        
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-[#a78bfa] border border-indigo-500/20 shadow-xs mb-1">
            <BrainCircuit size={28} />
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            About AlgoMind
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-medium">
            The intelligent interview preparation platform built to solve the "solve and forget" problem forever.
          </p>
        </motion.div>

        {/* Mission Card Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#3b82f6] text-white space-y-4 shadow-xl relative overflow-hidden"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-200">
            <Rocket size={16} />
            <span>Our Core Mission</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black leading-tight">
            "Help developers remember every solved problem instead of solving and forgetting."
          </h2>

          <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed max-w-2xl font-medium">
            Software engineers spend hundreds of hours practicing coding problems. Yet, weeks later, key algorithm insights fade. AlgoMind transforms interview prep into a structured science using active recall and spaced repetition.
          </p>
        </motion.div>

        {/* What is AlgoMind Section */}
        <div className="max-w-4xl mx-auto p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#0c0f1d]/90 backdrop-blur-xl shadow-xs space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            What is AlgoMind?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            AlgoMind is an AI-powered Chrome Extension and Web Dashboard built for developers preparing for technical coding interviews. It connects directly with competitive coding platforms, tracks your problem-solving velocity, and builds an automated spaced-repetition memory curve so you enter technical interviews with full confidence.
          </p>
        </div>

        {/* The 5 Pillars Grid */}
        <div className="max-w-6xl mx-auto space-y-6 pt-4">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              The 5 Pillars of AlgoMind
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Scientific learning mechanisms built into every layer of our platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#0c0f1d]/90 backdrop-blur-xl space-y-3 hover:border-indigo-500/40 transition-all shadow-xs"
                >
                  <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-[#a78bfa] w-fit">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why Active Recall Works */}
        <div className="max-w-4xl mx-auto space-y-4 pt-6 border-t border-slate-200 dark:border-white/10">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white text-center">
            Why Active Recall & Spaced Repetition Work
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0c0f1d]/80 backdrop-blur-xl space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Traditional Grinding (Fails)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Solving 300+ problems once without systematic review leads to the "forgetting curve" — losing over 70% of pattern recognition within 14 days.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0c0f1d]/80 backdrop-blur-xl space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={16} /> The AlgoMind Advantage (Succeeds)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Reviewing problems at mathematically optimal intervals locks patterns into long-term memory, requiring only 15 minutes of daily targeted practice.
              </p>
            </div>
          </div>
        </div>

      </div>
    </SiteLayout>
  );
}
