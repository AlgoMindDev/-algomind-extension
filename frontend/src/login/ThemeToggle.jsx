import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
      aria-pressed={isDark}
      className={`p-2 rounded-full transition-all duration-300 border cursor-pointer ${
        isDark
          ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-700 hover:text-amber-300 shadow-sm'
          : 'bg-white/90 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-purple-600 shadow-sm'
      }`}
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
};

export default ThemeToggle;
