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
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#070913]/80 border-b border-slate-200/80 dark:border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7c3aed] via-[#6366f1] to-[#3b82f6] flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <BrainCircuit size={20} />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
              Algo<span className="text-[#7c3aed] dark:text-[#a78bfa]">Mind</span>
            </span>
            <span className="hidden sm:inline-block text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-[#a78bfa] border border-indigo-500/20">
              v1.0.2
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="/#features" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Features</a>
            <a href="/#how-it-works" className="hover:text-indigo-600 dark:hover:text-white transition-colors">How It Works</a>
            <Link to="/about" className={`hover:text-indigo-600 dark:hover:text-white transition-colors ${location.pathname === '/about' ? 'text-indigo-600 dark:text-white font-bold' : ''}`}>About</Link>
            <Link to="/download" className={`hover:text-indigo-600 dark:hover:text-white transition-colors ${location.pathname === '/download' ? 'text-indigo-600 dark:text-white font-bold' : ''}`}>Extension Setup</Link>
            <Link to="/changelog" className={`hover:text-indigo-600 dark:hover:text-white transition-colors ${location.pathname === '/changelog' ? 'text-indigo-600 dark:text-white font-bold' : ''}`}>Changelog</Link>
            <Link to="/roadmap" className={`hover:text-indigo-600 dark:hover:text-white transition-colors ${location.pathname === '/roadmap' ? 'text-indigo-600 dark:text-white font-bold' : ''}`}>Roadmap</Link>
            <Link to="/support" className={`hover:text-indigo-600 dark:hover:text-white transition-colors ${location.pathname === '/support' ? 'text-indigo-600 dark:text-white font-bold' : ''}`}>Support</Link>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-500" />}
            </button>

            <Link
              to="/dashboard"
              className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all shadow-xs"
            >
              Open Dashboard
            </Link>

            <Link
              to="/download"
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#7c3aed] to-[#6366f1] hover:from-[#6551e3] hover:to-[#4f46e5] rounded-xl shadow-md shadow-indigo-500/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Code2 size={14} />
              <span>Extension Setup</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-500" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
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
              className="md:hidden border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#070913]/95 backdrop-blur-2xl px-6 py-5 space-y-4 text-sm font-semibold"
            >
              <a href="/#features" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 dark:text-slate-200">Features</a>
              <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 dark:text-slate-200">How It Works</a>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 dark:text-slate-200">About</Link>
              <Link to="/download" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 dark:text-slate-200">Extension Setup</Link>
              <Link to="/changelog" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 dark:text-slate-200">Changelog</Link>
              <Link to="/roadmap" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 dark:text-slate-200">Roadmap</Link>
              <Link to="/support" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 dark:text-slate-200">Support & FAQ</Link>
              <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2.5">
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 text-xs font-bold text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 rounded-xl">Open Dashboard</Link>
                <Link to="/download" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-xl">Extension Setup</Link>
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
