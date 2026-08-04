import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, AlertCircle, ArrowRight, Loader2, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import EmailInput from './EmailInput.jsx';
import PasswordInput from './PasswordInput.jsx';
import { getPasswordCriteria } from './PasswordRequirements.jsx';

const validateEmail = (email) => {
  if (!email) return 'Email address is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return '';
};

const SignupForm = ({ isDark = false }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [termsError, setTermsError] = useState('');
  const [authError, setAuthError] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleNameBlur = () => {
    if (!name.trim()) {
      setNameError('Full name is required');
    } else {
      setNameError('');
    }
  };

  const handleEmailBlur = () => {
    setEmailError(validateEmail(email));
  };

  const handlePasswordBlur = () => {
    const criteria = getPasswordCriteria(password);
    const isValid = criteria.every((c) => c.valid);
    if (!password) {
      setPasswordError('Password is required');
    } else if (!isValid) {
      setPasswordError('Password does not meet security criteria');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmBlur = () => {
    if (!confirmPassword) {
      setConfirmError('Please confirm your password');
    } else if (confirmPassword !== password) {
      setConfirmError('Passwords do not match');
    } else {
      setConfirmError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    let hasError = false;

    if (!name.trim()) {
      setNameError('Full name is required');
      hasError = true;
    }

    const eErr = validateEmail(email);
    if (eErr) {
      setEmailError(eErr);
      hasError = true;
    }

    const criteria = getPasswordCriteria(password);
    if (!criteria.every((c) => c.valid)) {
      setPasswordError('Password must meet all security criteria');
      hasError = true;
    }

    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      hasError = true;
    }

    if (!agreeTerms) {
      setTermsError('You must view and agree to the Terms of Service & Privacy Policy');
      hasError = true;
    }

    if (hasError) return;

    setLoadingSubmit(true);

    try {
      if (register) {
        await register(name, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setAuthError(err.message || 'Registration failed. Email may already exist.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
      {authError && (
        <div
          role="alert"
          aria-live="assertive"
          className={`p-3 rounded-xl border flex items-center gap-2 text-xs transition-all duration-200 animate-fade-in ${
            isDark
              ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span className="leading-tight font-medium">{authError}</span>
        </div>
      )}

      {/* Full Name */}
      <div className="space-y-1">
        <label
          htmlFor="name-input"
          className={`block text-[11px] font-semibold uppercase tracking-wider ml-0.5 ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          Full Name
        </label>
        <div className="relative group">
          <span
            className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${
              nameError
                ? 'text-rose-500'
                : isDark
                ? 'text-slate-400 group-focus-within:text-purple-400'
                : 'text-slate-400 group-focus-within:text-purple-600'
            }`}
          >
            <User className="h-4 w-4" />
          </span>
          <input
            id="name-input"
            type="text"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError('');
            }}
            onBlur={handleNameBlur}
            disabled={loadingSubmit}
            placeholder="John Doe"
            className={`block w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border outline-none transition-all duration-200 ${
              nameError
                ? isDark
                  ? 'bg-rose-950/20 border-rose-500/50 text-rose-200 placeholder-rose-400/50 focus:ring-2 focus:ring-rose-500/20'
                  : 'bg-rose-50/70 border-rose-300 text-rose-900 placeholder-rose-300 focus:ring-2 focus:ring-rose-500/20'
                : isDark
                ? 'bg-slate-800/60 border-slate-700 text-slate-100 placeholder-slate-500 hover:border-slate-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-inner'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 hover:border-slate-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 shadow-sm'
            } ${loadingSubmit ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
        </div>
        {nameError && (
          <p className="text-[11px] text-rose-500 font-medium ml-0.5">{nameError}</p>
        )}
      </div>

      {/* Email */}
      <EmailInput
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (emailError) setEmailError('');
        }}
        onBlur={handleEmailBlur}
        error={emailError}
        disabled={loadingSubmit}
        isDark={isDark}
      />

      {/* Password */}
      <PasswordInput
        id="signup-password"
        name="signup-password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (passwordError) setPasswordError('');
          if (confirmError && confirmPassword === e.target.value) setConfirmError('');
        }}
        onBlur={handlePasswordBlur}
        error={passwordError}
        disabled={loadingSubmit}
        isDark={isDark}
        autoComplete="new-password"
      />

      {/* Confirm Password */}
      <PasswordInput
        id="confirm-password-input"
        name="confirm-password"
        label="Confirm Password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          if (confirmError) setConfirmError('');
        }}
        onBlur={handleConfirmBlur}
        error={confirmError}
        disabled={loadingSubmit}
        isDark={isDark}
        showRequirements={false}
        autoComplete="new-password"
      />

      {/* Terms Checkbox with Active Links */}
      <div className="space-y-0.5 pt-0.5">
        <label className="flex items-start gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => {
              setAgreeTerms(e.target.checked);
              if (termsError) setTermsError('');
            }}
            className={`h-3.5 w-3.5 rounded mt-0.5 transition cursor-pointer ${
              isDark
                ? 'border-slate-700 bg-slate-800 text-purple-500 focus:ring-purple-500/40 focus:ring-offset-slate-900'
                : 'border-slate-300 bg-white text-purple-600 focus:ring-purple-500/40'
            }`}
          />
          <span className={`text-[11px] leading-snug ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            I agree to the{' '}
            <Link
              to="/terms"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="font-semibold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-0.5"
            >
              <span>Terms of Service</span>
              <ExternalLink className="h-2.5 w-2.5 inline opacity-70" />
            </Link>{' '}
            &{' '}
            <Link
              to="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="font-semibold text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-0.5"
            >
              <span>Privacy Policy</span>
              <ExternalLink className="h-2.5 w-2.5 inline opacity-70" />
            </Link>
          </span>
        </label>
        {termsError && (
          <p className="text-[11px] text-rose-500 font-medium pl-5.5">{termsError}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-1">
        <button
          type="submit"
          disabled={loadingSubmit}
          className={`w-full py-3 px-4 rounded-xl text-xs font-semibold text-white transition-all duration-200 flex justify-center items-center gap-1.5 cursor-pointer shadow-md active:scale-[0.98] ${
            isDark
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-950/40'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/20'
          } ${loadingSubmit ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loadingSubmit ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>

      <p className={`mt-4 text-center text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Already have an account?{' '}
        <Link
          to="/login"
          className={`font-semibold transition-colors duration-150 ${
            isDark
              ? 'text-purple-400 hover:text-purple-300'
              : 'text-purple-600 hover:text-purple-700'
          }`}
        >
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;
