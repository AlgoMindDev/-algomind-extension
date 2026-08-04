import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Mail, Clock, ShieldAlert, CheckCircle2, UserX, Database } from 'lucide-react';
import SiteLayout from '../../components/site/SiteLayout.jsx';

export default function DataDeletion() {
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
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-xs mb-1">
            <Trash2 size={28} />
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Data Deletion Policy & Request
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-medium">
            Learn how to permanently delete your AlgoMind account, active recall history, and Chrome extension data.
          </p>
        </motion.div>

        {/* Content Card */}
        <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#0c0f1d]/90 backdrop-blur-xl shadow-sm space-y-10 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          
          {/* Deletion Commitment Notice */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-slate-800 dark:text-rose-200 flex items-start gap-3">
            <ShieldAlert size={20} className="text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-xs uppercase tracking-wider text-rose-600 dark:text-rose-400">Permanent & Irreversible Deletion</p>
              <p className="text-xs mt-1 leading-relaxed opacity-90 font-medium">
                In accordance with global privacy regulations (GDPR & CCPA), you hold the absolute right to permanently purge all personal data, solved problem logs, and memory curves stored in AlgoMind servers.
              </p>
            </div>
          </div>

          {/* Processing Time Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-[#070913]/60 flex items-center gap-4 shadow-xs">
              <div className="p-3 rounded-xl bg-gradient-to-tr from-[#7c3aed] to-[#6366f1] text-white">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Processing Time</p>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">Within 7 Business Days</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-[#070913]/60 flex items-center gap-4 shadow-xs">
              <div className="p-3 rounded-xl bg-gradient-to-tr from-[#7c3aed] to-[#3b82f6] text-white">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Deletion Contact Email</p>
                <a href="mailto:algomind.help@gmail.com" className="text-sm font-extrabold text-indigo-600 dark:text-[#a78bfa] hover:underline">
                  algomind.help@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* What Data Gets Erased */}
          <div className="space-y-3 pt-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Database size={20} className="text-indigo-600 dark:text-[#a78bfa]" /> What Data Will Be Permanently Erased?
            </h2>
            <p>Upon processing your data deletion request, the following records will be permanently scrubbed from our active and backup databases:</p>
            <ul className="list-disc pl-5 space-y-1.5 opacity-90 font-medium">
              <li>Your account profile credentials (name, email address, password hash).</li>
              <li>All recorded problem completion logs, difficulty ratings, and solved timestamps.</li>
              <li>Your spaced repetition algorithms, memory retention curves, and topic mastery history.</li>
              <li>AI coach interaction logs and personal study notes.</li>
              <li>Chrome Extension paired session tokens.</li>
            </ul>
          </div>

          {/* How to Request Deletion */}
          <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-white/10">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <UserX size={20} className="text-indigo-600 dark:text-[#a78bfa]" /> How to Request Data Deletion
            </h2>

            <div className="space-y-4">
              {/* Option A */}
              <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-[#070913]/60 space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-[#a78bfa] font-bold text-[10px] uppercase tracking-wider">
                  Option A — Self-Service Account Deletion
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Delete Account via AlgoMind Dashboard</h3>
                <ol className="list-decimal pl-5 space-y-1 text-xs opacity-85 font-medium">
                  <li>Log in to your AlgoMind Web Dashboard.</li>
                  <li>Navigate to <strong>Account Profile & Settings</strong>.</li>
                  <li>Scroll down to the <strong>Danger Zone</strong> section.</li>
                  <li>Click <strong>Delete Account & Purge Data</strong> and confirm your password.</li>
                </ol>
              </div>

              {/* Option B */}
              <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-[#070913]/60 space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-[#a78bfa] font-bold text-[10px] uppercase tracking-wider">
                  Option B — Email Request
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Send an Email Request</h3>
                <p className="text-xs opacity-85 font-medium">
                  If you no longer have access to your account or wish to submit a formal request via email:
                </p>
                <ol className="list-decimal pl-5 space-y-1 text-xs opacity-85 font-medium">
                  <li>Send an email to <a href="mailto:algomind.help@gmail.com" className="text-indigo-600 dark:text-[#a78bfa] font-bold underline">algomind.help@gmail.com</a> from your registered email address.</li>
                  <li>Subject line: <strong>Data Deletion Request - [Your Registered Email]</strong>.</li>
                  <li>Include a brief note confirming your request for account closure and data deletion.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Confirmation Guarantee */}
          <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-indigo-600 dark:text-[#a78bfa] shrink-0" />
            <p className="text-xs opacity-90 font-medium">
              Once deletion is completed, our security team will send a final email confirmation to verify that your account data has been permanently removed.
            </p>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
