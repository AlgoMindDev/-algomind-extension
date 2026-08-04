import React, { useState } from 'react';
import { KeyRound, Eye, EyeOff, AlertCircle } from 'lucide-react';
import PasswordRequirements from './PasswordRequirements.jsx';

const PasswordInput = ({
  value,
  onChange,
  error,
  onBlur,
  disabled = false,
  isDark = false,
  showRequirements = true,
  label = "Password",
  id = "password-input",
  name = "password",
  autoComplete = "current-password",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className={`block text-[11px] font-semibold uppercase tracking-wider ml-0.5 ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}
      >
        {label}
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
          <KeyRound className="h-4 w-4" />
        </span>

        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          required
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder="••••••••"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`block w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border outline-none transition-all duration-200 ${
            error
              ? isDark
                ? 'bg-rose-950/20 border-rose-500/50 text-rose-200 placeholder-rose-400/50 focus:ring-2 focus:ring-rose-500/20'
                : 'bg-rose-50/70 border-rose-300 text-rose-900 placeholder-rose-300 focus:ring-2 focus:ring-rose-500/20'
              : isDark
                ? 'bg-slate-800/60 border-slate-700 text-slate-100 placeholder-slate-500 hover:border-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-inner'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 hover:border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 shadow-sm'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          aria-label={showPassword ? "Hide password text" : "Show password text"}
          className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors cursor-pointer ${
            isDark
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {error && (
        <div
          id={`${id}-error`}
          aria-live="polite"
          className="flex items-center gap-1 mt-0.5 ml-0.5 text-[11px] text-rose-500 animate-fade-in"
        >
          <AlertCircle className="h-3 w-3 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {showRequirements && (isFocused || value.length > 0) && (
        <PasswordRequirements password={value} isDark={isDark} />
      )}
    </div>
  );
};

export default PasswordInput;
