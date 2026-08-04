import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Chrome, 
  BrainCircuit, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Clock3, 
  BarChart3, 
  Bot, 
  RotateCw, 
  RefreshCw, 
  Bell, 
  ArrowRight, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  Sparkles,
  MessageSquare,
  XCircle,
  Laptop,
  Check,
  ExternalLink
} from 'lucide-react';
import SiteLayout from '../../components/site/SiteLayout.jsx';

// Easily configurable Chrome Web Store link for production launch
export const CHROME_WEBSTORE_URL = 'https://chromewebstore.google.com/detail/algomind-dsa-revision-tra/llnbalgemifaffdddhlnhbjiandgjgmc?hl=en&authuser=0';

// 8-10 Configurable Extension Screenshot Slides
const gallerySlides = [
  {
    id: 1,
    title: 'LeetCode Automatic Detection',
    caption: 'AlgoMind silently detects accepted submissions on LeetCode, HackerRank, and Codeforces.',
    type: 'leetcode',
    problemTitle: '322. Coin Change',
    platform: 'LeetCode',
    difficulty: 'Medium',
    status: 'Accepted Verdict Detected ✓',
  },
  {
    id: 2,
    title: 'Active Recall Flashcard Overlay',
    caption: 'Self-testing prompts force your brain to retrieve algorithm approaches before revealing solutions.',
    type: 'active-recall',
    problemTitle: '207. Course Schedule (Graph Cycle)',
    platform: 'LeetCode',
    difficulty: 'Medium',
    status: 'Recall Prompt Active',
  },
  {
    id: 3,
    title: 'Spaced Repetition Queue',
    caption: 'Calculates optimal Ebbinghaus review intervals so you revise right before memory decay sets in.',
    type: 'spaced-queue',
    problemTitle: 'Daily Revision Queue',
    platform: 'AlgoMind Engine',
    difficulty: 'Spaced SM-2',
    status: '3 Problems Due Today',
  },
  {
    id: 4,
    title: 'AI Hint & Code Review Audit',
    caption: 'Generates targeted hints, pattern breakdowns, and optimal time complexity recommendations.',
    type: 'ai-review',
    problemTitle: '15. 3Sum (Two Pointers)',
    platform: 'LeetCode',
    difficulty: 'Medium',
    status: 'AI Code Analysis Complete',
  },
  {
    id: 5,
    title: 'Honesty Score & Tab Anti-Cheat',
    caption: 'Monitors tab switches, solution browsing, and copy-paste events to compute your authentic Honesty Score.',
    type: 'honesty',
    problemTitle: 'Honesty Score Audit',
    platform: 'AlgoMind Security',
    difficulty: 'Anti-Cheat',
    status: '94 / 100 Authentic Solved Score',
  },
  {
    id: 6,
    title: 'Memory Analytics & Topic Retention',
    caption: 'Visualizes long-term retention curves, topic mastery scores, and interview readiness index.',
    type: 'analytics',
    problemTitle: 'Topic Mastery Matrix',
    platform: 'AlgoMind Dashboard',
    difficulty: 'Live Analytics',
    status: '91% Total Retention Rate',
  },
  {
    id: 7,
    title: 'Daily Revision Reminder Alarms',
    caption: 'Configurable Chrome alarms push notifications when high-yield problems are due for review.',
    type: 'alarms',
    problemTitle: 'Daily Scheduled Alert',
    platform: 'Chrome Notifications',
    difficulty: 'Manifest V3',
    status: 'Reminder Set for 09:00 PM',
  },
  {
    id: 8,
    title: 'Cross-Device Cloud Sync',
    caption: 'Seamlessly synchronizes solved problems and recall metrics across Extension and Web Dashboard.',
    type: 'sync',
    problemTitle: 'Cloud Database Sync',
    platform: 'AlgoMind Cloud',
    difficulty: 'Auto Sync',
    status: 'IndexedDB & Cloud Synced ✓',
  },
];

// Feature Cards Data
const features = [
  {
    icon: Chrome,
    title: 'Automatic Problem Tracking',
    desc: 'Runs silently on LeetCode, HackerRank, Codeforces, and GeeksforGeeks. Captures accepted solutions, completion time, and difficulty automatically.',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    icon: Clock3,
    title: 'Spaced Repetition Engine',
    desc: 'Powered by the Ebbinghaus memory curve algorithm. Automatically schedules review dates (+1 day, +3 days, +7 days, +21 days) to prevent memory decay.',
    color: 'from-[#7c3aed] to-[#3b82f6]'
  },
  {
    icon: BrainCircuit,
    title: 'Active Recall Flashcards',
    desc: 'Replaces passive re-reading with active memory retrieval prompts. Test your solution intuition before viewing algorithm code.',
    color: 'from-[#3b82f6] to-cyan-500'
  },
  {
    icon: Bot,
    title: 'AI Review & Complexity Hints',
    desc: 'Generates instant problem summaries, time & space complexity breakdowns, and targeted hints tailored to your individual weak spots.',
    color: 'from-amber-500 to-orange-500'
  },
  {
    icon: BarChart3,
    title: 'Memory Analytics',
    desc: 'Comprehensive topic confidence heatmaps, retention percentage curves, and interview readiness scores updated in real time.',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    icon: Bell,
    title: 'Revision Reminders',
    desc: 'Chrome background alarms push discrete daily notifications so you never miss a critical spaced repetition review window.',
    color: 'from-rose-500 to-purple-600'
  },
  {
    icon: RefreshCw,
    title: 'Cross Device Cloud Sync',
    desc: 'Uses IndexedDB for instant offline storage and syncs automatically with the AlgoMind Web Dashboard whenever connected.',
    color: 'from-indigo-500 to-purple-600'
  }
];

// 4 Step How It Works Timeline
const timelineSteps = [
  {
    step: '01',
    title: 'Add to Chrome',
    desc: 'Install the extension with one click from the Chrome Web Store. Zero complex configuration required.'
  },
  {
    step: '02',
    title: 'Solve Coding Problems',
    desc: 'Practice on LeetCode, HackerRank, or Codeforces as usual. AlgoMind auto-captures accepted submissions.'
  },
  {
    step: '03',
    title: 'Review with Active Recall',
    desc: 'Receive AI hints and active recall flashcard prompts when problems are due in your spaced queue.'
  },
  {
    step: '04',
    title: 'Remember Forever',
    desc: 'Lock problem patterns into long-term memory and enter technical coding interviews with total confidence.'
  }
];

// Comparison Matrix Data
const comparisonData = [
  {
    feature: 'Problem Tracking',
    without: 'Manual spreadsheets or forgotten bookmarks',
    with: '100% automated background tracking'
  },
  {
    feature: 'Revision Method',
    without: 'Re-solving 300+ problems from scratch',
    with: 'Active recall flashcards in 15 mins/day'
  },
  {
    feature: 'Retention Rate',
    without: '70% pattern decay within 14 days',
    with: '90%+ long-term interview memory retention'
  },
  {
    feature: 'Accountability',
    without: 'Self-deception looking at solutions early',
    with: 'Authentic Honesty Score & anti-cheat audit'
  },
  {
    feature: 'Study Efficiency',
    without: 'Wasting time re-studying strong topics',
    with: 'AI prioritizes only declining memory curves'
  }
];

// FAQs Data
const faqs = [
  {
    q: 'Which coding platforms does the extension support?',
    a: 'AlgoMind currently supports LeetCode, HackerRank, Codeforces, GeeksforGeeks, AtCoder, and CodeChef. Additional platforms are added regularly.'
  },
  {
    q: 'Does the extension collect my private browsing data?',
    a: 'No. AlgoMind operates under strict privacy guidelines. It activates only on supported coding platform domain URLs to capture problem titles, submission verdicts, and timestamps.'
  },
  {
    q: 'Which web browsers are compatible?',
    a: 'AlgoMind is compatible with all Chromium-based browsers, including Google Chrome, Brave, Arc Browser, Microsoft Edge, Opera, and Vivaldi.'
  },
  {
    q: 'Does the extension work offline?',
    a: 'Yes! AlgoMind utilizes IndexedDB local storage. If you solve problems offline, session logs are cached safely on your device and sync to your account when reconnected.'
  },
  {
    q: 'Is the Chrome Extension free to use?',
    a: 'Yes, AlgoMind is free to install and includes full automatic tracking, active recall scheduling, and memory analytics for developers.'
  }
];

export default function DownloadPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % gallerySlides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + gallerySlides.length) % gallerySlides.length);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <SiteLayout>
      <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16 space-y-24">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION */}
        {/* ========================================================================= */}
        <section className="text-center max-w-4xl mx-auto space-y-6 pt-4">
          
          {/* Extension Badge Icon */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-[#7c3aed] via-[#6366f1] to-[#3b82f6] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30 mx-auto relative group"
          >
            <BrainCircuit size={48} className="group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-50 dark:border-[#070913] flex items-center justify-center text-white">
              <Check size={12} strokeWidth={3} />
            </div>
          </motion.div>

          {/* Title & Tagline */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-600 dark:text-[#a78bfa] shadow-xs">
              <Sparkles size={14} className="text-amber-400" />
              <span>Official Chrome Extension</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              AlgoMind — DSA Revision Tracker
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Automatically capture accepted coding solutions, prevent algorithm memory decay, and master DSA for technical interviews.
            </p>
          </motion.div>

          {/* Configurable Web Store CTA Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="pt-2 flex flex-col items-center space-y-4"
          >
            <a
              href={CHROME_WEBSTORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#3b82f6] hover:from-[#6551e3] hover:to-[#2563eb] rounded-2xl shadow-2xl shadow-indigo-500/30 flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Chrome size={22} />
              <span>Add to Chrome — It's Free</span>
              <ArrowRight size={18} />
            </a>

            {/* Trust Badges Below Button */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={15} /> Secure
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={15} /> Lightweight
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={15} /> Privacy Friendly
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={15} /> Works on Chromium Browsers
              </span>
            </div>
          </motion.div>

        </section>

        {/* ========================================================================= */}
        {/* 2. SCREENSHOT GALLERY CAROUSEL SECTION */}
        {/* ========================================================================= */}
        <section className="space-y-6 max-w-5xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-[#a78bfa]">
              Interactive Showcase
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              See AlgoMind In Action
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              Explore how the extension automatically captures coding progress and guides your active recall.
            </p>
          </div>

          {/* Large Carousel Viewport Container */}
          <div className="relative rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101522] shadow-2xl overflow-hidden p-3 sm:p-6">
            
            {/* Top Browser Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0b1020] rounded-t-2xl mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline-block">
                  Chrome Extension • {gallerySlides[activeSlide].title}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-[#a78bfa] border border-indigo-500/20">
                Slide {activeSlide + 1} of {gallerySlides.length}
              </span>
            </div>

            {/* Active Slide Presentation */}
            <div className="min-h-[300px] sm:min-h-[380px] p-6 sm:p-10 bg-slate-50/50 dark:bg-[#070913] rounded-2xl flex flex-col justify-between space-y-6 relative">
              
              {/* Prev / Next Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-2xl bg-white/90 dark:bg-[#101522]/90 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white shadow-lg backdrop-blur-md transition-all cursor-pointer z-10"
                aria-label="Previous Screenshot"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-2xl bg-white/90 dark:bg-[#101522]/90 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white shadow-lg backdrop-blur-md transition-all cursor-pointer z-10"
                aria-label="Next Screenshot"
              >
                <ChevronRight size={20} />
              </button>

              {/* Dynamic Slide Mockup Representation */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={gallerySlides[activeSlide].id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 max-w-2xl mx-auto text-center"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-mono font-bold">
                    <span>{gallerySlides[activeSlide].platform}</span>
                    <span>•</span>
                    <span>{gallerySlides[activeSlide].difficulty}</span>
                  </div>

                  <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    {gallerySlides[activeSlide].title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {gallerySlides[activeSlide].caption}
                  </p>

                  <div className="p-4 rounded-2xl bg-white dark:bg-[#101522] border border-slate-200 dark:border-white/10 shadow-md inline-flex items-center gap-3 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={18} />
                    <span>{gallerySlides[activeSlide].status}</span>
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>

            {/* Thumbnail Selector Bar Below */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-4">
              {gallerySlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setActiveSlide(idx)}
                  className={`p-2 rounded-xl text-[10px] font-mono font-bold truncate border transition-all cursor-pointer ${
                    activeSlide === idx
                      ? 'bg-indigo-500/10 border-indigo-600 text-indigo-600 dark:text-white dark:border-[#a78bfa] shadow-xs'
                      : 'bg-slate-50 dark:bg-[#0c0f1d] border-slate-200 dark:border-white/5 text-slate-500 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  0{idx + 1}. {slide.title.split(' ')[0]}
                </button>
              ))}
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. FEATURE CARDS SECTION (7 CORE PILLARS) */}
        {/* ========================================================================= */}
        <section id="features" className="space-y-12 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-[#a78bfa]">
              Comprehensive Feature Set
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Engineered For Interview Retention
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              Every tool and metric you need to transition from short-term solving to long-term interview recall.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  whileHover={{ y: -4 }}
                  className="p-7 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#101522]/90 backdrop-blur-xl space-y-4 hover:border-indigo-500/40 transition-all duration-300 shadow-xs group"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white shadow-lg shadow-indigo-500/10 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-[#a78bfa] transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {feat.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. HOW IT WORKS TIMELINE (4 STEPS) */}
        {/* ========================================================================= */}
        <section id="how-it-works" className="space-y-12 max-w-6xl mx-auto py-6 border-y border-slate-200/60 dark:border-white/5">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-[#a78bfa]">
              Simple 4-Step Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              How AlgoMind Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              From initial extension setup to long-term memory mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {timelineSteps.map((item) => (
              <div
                key={item.step}
                className="p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#101522] space-y-3 relative shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-indigo-600 dark:text-[#a78bfa] font-mono">
                    {item.step}
                  </span>
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. WHY ALGOMIND COMPARISON ("WITHOUT" VS "WITH") */}
        {/* ========================================================================= */}
        <section className="space-y-8 max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-[#a78bfa]">
              Proven Results
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Why Choose AlgoMind?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              Compare traditional problem grinding against AI-powered active recall.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#101522]/90 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#0b1020]/80 font-bold text-xs">
              <span className="text-slate-500 uppercase tracking-wider">Evaluation Aspect</span>
              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5 mt-2 md:mt-0">
                <XCircle size={16} /> Without AlgoMind
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-2 md:mt-0">
                <CheckCircle2 size={16} /> With AlgoMind
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-white/5 text-xs font-medium">
              {comparisonData.map((row) => (
                <div key={row.feature} className="grid grid-cols-1 md:grid-cols-3 p-5 gap-3 items-center">
                  <span className="font-bold text-slate-900 dark:text-white">{row.feature}</span>
                  <span className="text-slate-500 dark:text-slate-400">{row.without}</span>
                  <span className="text-indigo-600 dark:text-[#a78bfa] font-bold">{row.with}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. FAQ ACCORDION SECTION */}
        {/* ========================================================================= */}
        <section className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-600 dark:text-[#a78bfa]">
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#101522]/90 backdrop-blur-xl overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left text-xs sm:text-sm font-bold flex items-center justify-between gap-3 cursor-pointer text-slate-900 dark:text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-indigo-600 dark:text-[#a78bfa] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium border-t border-slate-100 dark:border-white/5 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. REVIEWS ARCHITECTURE (PRE-LAUNCH EMPTY STATE) */}
        {/* ========================================================================= */}
        <section className="max-w-4xl mx-auto text-center space-y-4">
          <div className="p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0c0f1d]/80 backdrop-blur-xl space-y-3 shadow-xs">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-[#a78bfa] w-fit mx-auto">
              <MessageSquare size={24} />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              User Reviews & Community Feedback
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto font-medium leading-relaxed">
              AlgoMind is now live on the official Chrome Web Store! Check out ratings or leave a review for the community.
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <a
                href={CHROME_WEBSTORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-md"
              >
                <Chrome size={15} />
                <span>Rate on Chrome Web Store</span>
                <ExternalLink size={13} />
              </a>
              <a
                href="mailto:algomind.help@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                <span>Submit Feedback & Feature Ideas</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. FOOTER CTA SECTION */}
        {/* ========================================================================= */}
        <section className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-r from-[#7c3aed] via-[#6366f1] to-[#3b82f6] p-10 sm:p-16 text-center text-white shadow-2xl overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Start mastering DSA today.
            </h2>

            <p className="text-sm sm:text-base text-indigo-100 max-w-xl mx-auto font-medium">
              Add AlgoMind to Chrome and transform short-term problem solving into long-term interview recall.
            </p>

            <div className="pt-2 flex justify-center">
              <a
                href={CHROME_WEBSTORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-indigo-900 hover:bg-slate-100 rounded-2xl text-sm font-bold shadow-xl flex items-center gap-2.5 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Chrome size={20} />
                <span>Add to Chrome — It's Free</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

      </div>
    </SiteLayout>
  );
}
