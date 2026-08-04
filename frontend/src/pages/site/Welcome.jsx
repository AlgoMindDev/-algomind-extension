import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Chrome, AlertCircle, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import SiteLayout from '../../components/site/SiteLayout.jsx';

export default function Welcome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  return (
    <SiteLayout>
      <div className="py-20 max-w-4xl mx-auto px-6 space-y-10">
        
        {}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10 animate-bounce">
            <CheckCircle2 size={42} />
          </div>

          <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Installation Verified ✓
          </span>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            🎉 AlgoMind Installed Successfully
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto font-medium">
            Your Chrome Extension is active. Complete one quick step to sync your account and unlock your AI revision engine.
          </p>
        </motion.div>

        {}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          
          <div className="p-4 bg-white dark:bg-[#101522] border border-slate-200 dark:border-white/10 rounded-2xl text-center space-y-1 shadow-sm">
            <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Extension</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle2 size={12} /> Installed
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-[#101522] border border-slate-200 dark:border-white/10 rounded-2xl text-center space-y-1 shadow-sm">
            <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Browser</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle2 size={12} /> Connected
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-[#101522] border border-slate-200 dark:border-white/10 rounded-2xl text-center space-y-1 shadow-sm">
            <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Version</span>
            <span className="text-xs font-bold text-indigo-600 dark:text-[#a78bfa] font-mono">
              v1.0.0
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-[#101522] border border-slate-200 dark:border-white/10 rounded-2xl text-center space-y-1 shadow-sm">
            <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Account Login</span>
            <span className="text-xs font-bold text-amber-500 flex items-center justify-center gap-1">
              <AlertCircle size={12} /> Required
            </span>
          </div>

          <div className="p-4 bg-white dark:bg-[#101522] border border-slate-200 dark:border-white/10 rounded-2xl text-center space-y-1 shadow-sm col-span-2 sm:col-span-1">
            <span className="text-[9px] font-mono text-slate-400 uppercase font-bold block">Tracking</span>
            <span className="text-xs font-bold text-indigo-600 dark:text-[#a78bfa]">
              Waiting
            </span>
          </div>

        </div>

        {}
        <div className="bg-white dark:bg-[#101522] border border-slate-200 dark:border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl max-w-md mx-auto space-y-6 text-center">
          
          {user ? (
            <div className="space-y-3">
              <p className="text-sm font-bold text-emerald-500 flex items-center justify-center gap-2">
                <CheckCircle2 size={18} /> Welcome back, {user.username}!
              </p>
              <p className="text-xs text-slate-500">Redirecting to your Dashboard...</p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full w-full animate-pulse" />
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Connect Your AlgoMind Account
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Login or register to link your Chrome Extension with the cloud revision engine.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3.5 px-4 bg-[#7c3aed] hover:bg-[#6551e3] text-white text-xs font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Continue to Login / Register</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-3 px-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-2xl transition-all cursor-pointer"
                >
                  Direct Dashboard Access
                </button>
              </div>

              <p className="text-[10px] text-slate-400 font-medium pt-2">
                🔒 Secure token sync via Chrome storage APIs.
              </p>
            </>
          )}

        </div>

      </div>
    </SiteLayout>
  );
}
