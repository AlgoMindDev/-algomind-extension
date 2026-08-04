import React, { useState } from 'react';
import { Brain } from 'lucide-react';
import SignupForm from './SignupForm.jsx';
import ThemeToggle from './ThemeToggle.jsx';

const SignupPage = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center px-4 py-6 relative overflow-hidden transition-colors duration-300 font-sans ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* Background Ambient Purple & Indigo Orbs */}
      <div
        className={`absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full blur-[130px] pointer-events-none transition-opacity duration-500 ${
          isDark ? 'bg-purple-600/15 opacity-70' : 'bg-purple-400/20 opacity-90'
        }`}
      />
      <div
        className={`absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full blur-[130px] pointer-events-none transition-opacity duration-500 ${
          isDark ? 'bg-indigo-600/15 opacity-70' : 'bg-indigo-400/20 opacity-90'
        }`}
      />

      {/* Theme Toggle Button Top-Right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </div>

      {/* Laptop & Mobile Optimized Container Card */}
      <main className="w-full max-w-[420px] relative z-10 my-auto">
        <div
          className={`rounded-3xl p-6 sm:p-8 transition-all duration-300 backdrop-blur-xl ${
            isDark
              ? 'bg-slate-900/90 border border-slate-800 shadow-2xl shadow-slate-950/80'
              : 'bg-white/95 border border-slate-200/80 shadow-xl shadow-purple-100/50'
          }`}
        >
          {/* Header Brand Section */}
          <div className="text-center mb-5 flex flex-col items-center">
            <div
              className={`inline-flex items-center justify-center p-3 rounded-2xl mb-3 transition-all duration-300 ${
                isDark
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(167,139,250,0.15)]'
                  : 'bg-purple-50 text-purple-600 border border-purple-200/70 shadow-[0_0_15px_rgba(124,58,237,0.1)]'
              }`}
            >
              <Brain className="h-7 w-7 stroke-[1.75]" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight flex items-center justify-center gap-2">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-300">
                AlgoMind
              </span>
            </h1>
            <p className={`mt-1 text-xs font-medium tracking-wide ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              "Start mastering DSA with intelligent revision."
            </p>
          </div>

          {/* Form Component */}
          <SignupForm isDark={isDark} />
        </div>

        {/* Footer info */}
        <p className={`mt-4 text-center text-[11px] ${
          isDark ? 'text-slate-500' : 'text-slate-400'
        }`}>
          &copy; {new Date().getFullYear()} AlgoMind Inc. All rights reserved.
        </p>
      </main>
    </div>
  );
};

export default SignupPage;
