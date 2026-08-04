import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Mail, Clock, Chrome, RefreshCw, LogIn, Cpu, Bug, Sparkles, ChevronDown, Search } from 'lucide-react';
import SiteLayout from '../../components/site/SiteLayout.jsx';

const commonIssues = [
  {
    icon: Chrome,
    title: 'Extension Not Tracking',
    desc: 'Verify Chrome extension permissions for LeetCode/HackerRank. Ensure extension popup shows Active status.',
  },
  {
    icon: RefreshCw,
    title: 'Dashboard Sync Issue',
    desc: 'Click "Force Sync" in the Extension popup or refresh your Dashboard while connected to internet.',
  },
  {
    icon: LogIn,
    title: 'Login Issue',
    desc: 'Check your email/password. Use "Forgot password" or clear local browser cache to re-authenticate.',
  },
  {
    icon: Cpu,
    title: 'AI Review Failed',
    desc: 'Check API connectivity indicator. High load can cause temporary rate-limit pauses (auto-retries in 60s).',
  },
  {
    icon: Bug,
    title: 'Bug Report',
    desc: 'Report unexpected behavior with console screenshots directly to algomind.help@gmail.com.',
  },
  {
    icon: Sparkles,
    title: 'Feature Request',
    desc: 'Suggest new recall metrics, spaced repetition algorithms, or IDE extensions to our engineering team.',
  },
];

const faqs = [
  {
    q: 'How does AlgoMind calculate my revision queue?',
    a: 'AlgoMind uses spaced repetition memory curves adapted from SuperMemo SM-2. When you solve a problem, its difficulty and your recall confidence determine the optimal review interval (e.g. +1 day, +3 days, +7 days, +21 days).',
  },
  {
    q: 'Does the Chrome extension track my private browser data?',
    a: 'No. The extension only activates on supported coding platforms (LeetCode, HackerRank, Codeforces) to log problem titles, submission timestamps, and completion metrics.',
  },
  {
    q: 'What happens if I solve a problem offline?',
    a: 'AlgoMind saves recall logs locally in your browser storage. Once connected back online, sessions automatically sync to your cloud dashboard.',
  },
  {
    q: 'Can I request full deletion of my learning history?',
    a: 'Yes! You can request full account and dataset deletion anytime on our Data Deletion page or by emailing algomind.help@gmail.com.',
  },
  {
    q: 'Is AlgoMind free for developers?',
    a: 'AlgoMind provides a core free tier with unlimited active recall tracking, extension automation, and basic AI memory analytics for interview preparation.',
  },
  {
    q: 'How do I load the Chrome extension in Developer mode during Beta?',
    a: 'Visit our Extension Setup page, clone or download the repository, open chrome://extensions in Chrome, enable Developer mode in the top right, and click "Load unpacked" selecting the /extension folder.',
  },
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const filteredFaqs = faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SiteLayout>
      <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16 space-y-12">
        
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-[#a78bfa] border border-indigo-500/20 shadow-xs mb-1">
            <HelpCircle size={28} />
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Support & Knowledge Base
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-medium">
            Find solutions to common technical issues, troubleshooting guides, and contact the AlgoMind engineering team.
          </p>

          {/* Live Search Input */}
          <div className="relative max-w-md mx-auto pt-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search support articles & FAQs..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0c0f1d]/90 text-xs font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-xs"
              />
            </div>
          </div>
        </motion.div>

        {/* Support Header Cards: Email & Response Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0c0f1d]/80 backdrop-blur-xl flex items-center gap-4 shadow-xs">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#7c3aed] to-[#6366f1] text-white shadow-md shadow-indigo-500/20">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Support Email</p>
              <a href="mailto:algomind.help@gmail.com" className="text-base font-extrabold text-indigo-600 dark:text-[#a78bfa] hover:underline">
                algomind.help@gmail.com
              </a>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0c0f1d]/80 backdrop-blur-xl flex items-center gap-4 shadow-xs">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#7c3aed] to-[#3b82f6] text-white shadow-md shadow-indigo-500/20">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Response Time</p>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">
                24–48 Hours
              </p>
            </div>
          </div>
        </div>

        {/* Common Issues Section */}
        <div className="space-y-6 max-w-5xl mx-auto pt-4">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Common Issues & Self-Service Guides
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Quick solutions for extension and dashboard workflows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {commonIssues.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#0c0f1d]/90 backdrop-blur-xl space-y-2.5 hover:border-indigo-500/40 transition-colors shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-[#a78bfa]">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="space-y-6 max-w-4xl mx-auto pt-8 border-t border-slate-200 dark:border-white/10">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Everything you need to know about AlgoMind memory models.</p>
          </div>

          <div className="space-y-3.5">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={faq.q}
                    className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#0c0f1d]/90 backdrop-blur-xl overflow-hidden transition-all shadow-xs"
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
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-500 font-medium">
                No matching FAQ items found for "{searchQuery}". Email us at algomind.help@gmail.com!
              </div>
            )}
          </div>
        </div>

        {/* Contact Banner */}
        <div className="max-w-4xl mx-auto p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-[#7c3aed] to-[#6366f1] text-white text-center space-y-3 shadow-lg">
          <h3 className="text-xl font-bold">Still need support?</h3>
          <p className="text-xs text-indigo-100 max-w-md mx-auto leading-relaxed font-medium">
            Our engineering team is ready to help with bug reports, feature suggestions, or account issues.
          </p>
          <div className="pt-2">
            <a
              href="mailto:algomind.help@gmail.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-xs shadow-md hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
            >
              <Mail size={16} />
              <span>Contact algomind.help@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
