import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrainCircuit, Chrome, Sparkles, ArrowRight, Menu, X, Github, CheckCircle2, Shield, Heart, Sun, Moon, Mail, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SiteLayout({ children }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070913] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden transition-colors duration-300">
      
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-20 right-10 w-96 h-96 bg-cyan-500/10 blur-3xl pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#070913]/80 border-b border-[#E5E7EB] dark:border-white/10 transition-all">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 h-[76px] flex items-center justify-between">
          
          {/* LEFT: Logo + Wordmark + Tiny Pill Badge */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6D5EF8] to-[#3B82F6] flex items-center justify-center text-white font-bold shadow-xs group-hover:scale-[1.03] transition-transform duration-200">
              <BrainCircuit size={18} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-[#111827] dark:text-white">
                Algo<span className="text-[#6D5EF8] dark:text-[#a78bfa]">Mind</span>
              </span>
              <span className="h-[22px] px-2.5 rounded-full bg-[#F3F4F6] dark:bg-white/5 text-[#6B7280] dark:text-slate-400 border border-[#E5E7EB] dark:border-white/10 text-[12px] font-mono font-medium flex items-center justify-center select-none">
                v1.0
              </span>
            </div>
          </Link>

          {/* CENTER: Clean Navigation Links (16px, 500 weight, 36-40px spacing with animated underline) */}
          <nav className="hidden md:flex items-center gap-9">
            <a 
              href="/#features" 
              className="group relative text-[15px] font-medium text-[#6B7280] dark:text-slate-300 hover:text-[#111827] dark:hover:text-white transition-colors duration-180 py-1"
            >
              <span>Features</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#6D5EF8] rounded-full group-hover:w-full transition-all duration-200 ease-out" />
            </a>
            <a 
              href="/#how-it-works" 
              className="group relative text-[15px] font-medium text-[#6B7280] dark:text-slate-300 hover:text-[#111827] dark:hover:text-white transition-colors duration-180 py-1"
            >
              <span>How it Works</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#6D5EF8] rounded-full group-hover:w-full transition-all duration-200 ease-out" />
            </a>
            <Link 
              to="/download" 
              className={`group relative text-[15px] font-medium text-[#6B7280] dark:text-slate-300 hover:text-[#111827] dark:hover:text-white transition-colors duration-180 py-1 ${
                location.pathname === '/download' ? '!text-[#6D5EF8] dark:!text-[#a78bfa] font-semibold' : ''
              }`}
            >
              <span>Docs</span>
              <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#6D5EF8] rounded-full transition-all duration-200 ease-out ${
                location.pathname === '/download' ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
            <Link 
              to="/roadmap" 
              className={`group relative text-[15px] font-medium text-[#6B7280] dark:text-slate-300 hover:text-[#111827] dark:hover:text-white transition-colors duration-180 py-1 ${
                location.pathname === '/roadmap' ? '!text-[#6D5EF8] dark:!text-[#a78bfa] font-semibold' : ''
              }`}
            >
              <span>Roadmap</span>
              <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#6D5EF8] rounded-full transition-all duration-200 ease-out ${
                location.pathname === '/roadmap' ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
          </nav>

          {/* RIGHT: Theme Toggle + Secondary CTA + Primary CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* 40px Circular Theme Toggle with 15deg rotation */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full border border-[#E5E7EB] dark:border-white/10 bg-white dark:bg-white/5 text-[#111827] dark:text-white hover:bg-[#F5F3FF] dark:hover:bg-purple-950/30 hover:border-[#6D5EF8]/30 flex items-center justify-center transition-all duration-200 group cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun size={16} className="text-amber-400 group-hover:rotate-[15deg] transition-transform duration-200" />
              ) : (
                <Moon size={16} className="text-[#6D5EF8] group-hover:rotate-[15deg] transition-transform duration-200" />
              )}
            </button>

            {/* Secondary CTA: Install Extension */}
            <Link
              to="/download"
              className="h-[44px] px-5 text-sm font-semibold text-[#111827] dark:text-white bg-white dark:bg-white/5 border border-[#E5E7EB] dark:border-white/10 rounded-[12px] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-none hover:border-[#6D5EF8] dark:hover:border-[#6D5EF8] hover:bg-[#F5F3FF] dark:hover:bg-[#6D5EF8]/10 hover:-translate-y-[1px] active:translate-y-0 transition-all duration-200 ease-out flex items-center justify-center"
            >
              Install Extension
            </Link>

            {/* Primary CTA: Open Dashboard */}
            <Link
              to="/dashboard"
              className="h-[44px] px-6 text-sm font-semibold text-white bg-gradient-to-b from-[#7C6EFC] via-[#6D5EF8] to-[#5B4BE8] hover:from-[#887AFE] hover:to-[#5040DF] rounded-[12px] shadow-[0_6px_16px_rgba(109,94,248,0.25),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_8px_24px_rgba(109,94,248,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] hover:-translate-y-[1px] hover:scale-[1.02] active:translate-y-0 active:scale-[0.98] transition-all duration-200 ease-out flex items-center justify-center cursor-pointer"
            >
              Open Dashboard
            </Link>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full border border-[#E5E7EB] dark:border-white/10 text-[#111827] dark:text-white flex items-center justify-center"
            >
              {theme === 'dark' ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-[#6D5EF8]" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#111827] dark:text-white"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-[#E5E7EB] dark:border-white/10 bg-white/95 dark:bg-[#070913]/95 backdrop-blur-2xl px-6 py-5 space-y-4 text-sm font-medium"
            >
              <a href="/#features" onClick={() => setMobileMenuOpen(false)} className="block text-[#111827] dark:text-slate-200">Features</a>
              <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-[#111827] dark:text-slate-200">How it Works</a>
              <Link to="/download" onClick={() => setMobileMenuOpen(false)} className="block text-[#111827] dark:text-slate-200">Docs</Link>
              <Link to="/roadmap" onClick={() => setMobileMenuOpen(false)} className="block text-[#111827] dark:text-slate-200">Roadmap</Link>
              <div className="pt-3 border-t border-[#E5E7EB] dark:border-white/10 flex flex-col gap-2.5">
                <Link to="/download" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-3 text-sm font-semibold text-[#111827] dark:text-white border border-[#E5E7EB] dark:border-white/10 rounded-[12px]">Install Extension</Link>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-3 text-sm font-semibold text-white bg-gradient-to-b from-[#7C6EFC] via-[#6D5EF8] to-[#5B4BE8] rounded-[12px]">Open Dashboard</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Master Site Footer */}
      <footer className="border-t border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-[#04060d] text-slate-600 dark:text-slate-400 py-14 text-xs mt-20 relative z-10 font-sans">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-10 lg:gap-12">
          
          {/* LEFT SECTION (Brand & Badges) */}
          <div className="sm:col-span-2 md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7c3aed] to-[#3b82f6] flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-105 transition-transform">
                <BrainCircuit size={18} />
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                Algo<span className="text-[#7c3aed] dark:text-[#a78bfa]">Mind</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm font-medium">
              AI-powered DSA revision engine that helps developers remember more with active recall and spaced repetition.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-slate-400 pt-1">
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 font-semibold">
                Manifest V3 Compatible
              </span>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-[#a78bfa] border border-indigo-500/20 font-semibold">
                Available on Chrome Web Store
              </span>
            </div>
          </div>

          {/* COLUMN 1: Product */}
          <div className="space-y-3">
            <h5 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">Product</h5>
            <ul className="space-y-2.5 font-medium">
              <li><Link to="/download" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-150">Chrome Extension</Link></li>
              <li><Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-150">Web Dashboard</Link></li>
              <li><a href="/#features" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-150">AI Coach</a></li>
              <li><a href="/#features" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-150">Active Recall</a></li>
              <li><Link to="/roadmap" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-150">Roadmap</Link></li>
            </ul>
          </div>

          {/* COLUMN 2: Resources */}
          <div className="space-y-3">
            <h5 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">Resources</h5>
            <ul className="space-y-2.5 font-medium">
              <li><Link to="/download" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-150">Documentation</Link></li>
              <li><Link to="/changelog" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-150">Changelog</Link></li>
              <li><Link to="/support" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-150">FAQ</Link></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-150">GitHub</a></li>
            </ul>
          </div>

          {/* COLUMN 3: Company */}
          <div className="space-y-3">
            <h5 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">Company</h5>
            <ul className="space-y-2.5 font-medium">
              <li><Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-150">About</Link></li>
              <li><Link to="/support" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-150">Contact</Link></li>
              <li><Link to="/support" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-150">Feedback</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: Legal */}
          <div className="space-y-3">
            <h5 className="text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">Legal</h5>
            <ul className="space-y-2.5 font-medium">
              <li><Link to="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-150">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-150">Terms of Service</Link></li>
              <li><Link to="/data-deletion" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-150">Data Deletion</Link></li>
            </ul>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-[#e5e7eb] dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <p>© 2026 AlgoMind. All rights reserved.</p>
          <p className="text-slate-600 dark:text-slate-300 font-semibold">Built with care for developers.</p>
          <p className="flex items-center gap-1 font-mono text-slate-500 dark:text-slate-400">
            <span>Version v1.0.2</span>
            <span>•</span>
            <span>Designed & Developed by <strong className="text-slate-800 dark:text-slate-200 font-bold">Ambuj Rai</strong></span>
          </p>
        </div>
      </footer>

    </div>
  );
}
