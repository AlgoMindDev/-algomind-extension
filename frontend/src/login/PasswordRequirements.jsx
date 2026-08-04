import React from 'react';
import { Check, X } from 'lucide-react';

export const getPasswordCriteria = (password = '') => {
  return [
    { id: 'minChar', label: '8+ chars', valid: password.length >= 8 },
    { id: 'uppercase', label: '1 uppercase', valid: /[A-Z]/.test(password) },
    { id: 'number', label: '1 number', valid: /[0-9]/.test(password) },
    { id: 'special', label: '1 special char', valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];
};

const PasswordRequirements = ({ password = '', isDark = false }) => {
  const criteria = getPasswordCriteria(password);

  return (
    <div className={`mt-2 p-2.5 rounded-xl border transition-all duration-200 text-xs ${
      isDark 
        ? 'bg-slate-800/40 border-slate-700/60 text-slate-300' 
        : 'bg-purple-50/40 border-purple-100 text-slate-600'
    }`}>
      <p className="font-semibold text-[10px] uppercase tracking-wider mb-1.5 text-purple-600/80 dark:text-purple-400/80">
        Password Security Criteria
      </p>
      <div className="grid grid-cols-2 gap-1">
        {criteria.map((item) => (
          <div key={item.id} className="flex items-center gap-1.5">
            <span
              className={`flex items-center justify-center h-3.5 w-3.5 rounded-full transition-colors duration-200 shrink-0 ${
                item.valid
                  ? 'bg-purple-500/15 text-purple-600 dark:bg-purple-400/20 dark:text-purple-400'
                  : 'bg-slate-200/60 text-slate-400 dark:bg-slate-700 dark:text-slate-500'
              }`}
            >
              {item.valid ? (
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              ) : (
                <X className="h-2.5 w-2.5 stroke-[2.5]" />
              )}
            </span>
            <span className={`text-[10px] transition-colors duration-200 ${
              item.valid 
                ? 'text-purple-700 dark:text-purple-300 font-medium' 
                : 'text-slate-500 dark:text-slate-400'
            }`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordRequirements;
