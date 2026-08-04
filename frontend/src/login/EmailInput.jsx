import React from 'react';
import { Mail, AlertCircle } from 'lucide-react';

const EmailInput = ({
  value,
  onChange,
  error,
  onBlur,
  disabled = false,
  isDark = false,
}) => {
  return (
    <div className="space-y-1">
      <label 
        htmlFor="email-input" 
        className={`block text-[11px] font-semibold uppercase tracking-wider ml-0.5 ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}
      >
        Email Address
      </label>

      <div className="relative group">
        <span 
          className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
            error
              ? 'text-rose-500'
              : isDark 
                ? 'text-slate-400 group-focus-within:text-purple-400' 
                : 'text-slate-400 group-focus-within:text-purple-600'
          }`}
        >
          <Mail className="h-4 w-4" />
        </span>

        <input
          id="email-input"
          type="email"
          name="email"
          required
          autoComplete="email"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder="name@domain.com"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "email-error" : undefined}
          className={`block w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border outline-none transition-all duration-200 ${
            error
              ? isDark
                ? 'bg-rose-950/20 border-rose-500/50 text-rose-200 placeholder-rose-400/50 focus:ring-2 focus:ring-rose-500/20'
                : 'bg-rose-50/70 border-rose-300 text-rose-900 placeholder-rose-300 focus:ring-2 focus:ring-rose-500/20'
              : isDark
                ? 'bg-slate-800/60 border-slate-700 text-slate-100 placeholder-slate-500 hover:border-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-inner'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 hover:border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 shadow-sm'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        />
      </div>

      {error && (
        <div 
          id="email-error" 
          aria-live="polite" 
          className="flex items-center gap-1 mt-0.5 ml-0.5 text-[11px] text-rose-500 animate-fade-in"
        >
          <AlertCircle className="h-3 w-3 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default EmailInput;
