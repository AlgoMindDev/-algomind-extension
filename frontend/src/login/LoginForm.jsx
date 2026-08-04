import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
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

const validatePassword = (password) => {
  if (!password) return 'Password is required';
  const criteria = getPasswordCriteria(password);
  const unfulfilled = criteria.filter((c) => !c.valid);
  if (unfulfilled.length > 0) {
    return 'Password does not meet all security criteria';
  }
  return '';
};

const LoginForm = ({ isDark = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authError, setAuthError] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleEmailBlur = () => {
    setEmailError(validateEmail(email));
  };

  const handlePasswordBlur = () => {
    setPasswordError(validatePassword(password));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    const eErr = validateEmail(email);
    const pErr = validatePassword(password);

    setEmailError(eErr);
    setPasswordError(pErr);

    if (eErr || pErr) {
      return;
    }

    setLoadingSubmit(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setAuthError(err.message || 'Invalid email or password.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
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

      <PasswordInput
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (passwordError) setPasswordError('');
        }}
        onBlur={handlePasswordBlur}
        error={passwordError}
        disabled={loadingSubmit}
        isDark={isDark}
      />

      <div className="flex items-center justify-between pt-0.5">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className={`h-3.5 w-3.5 rounded transition cursor-pointer ${
              isDark
                ? 'border-slate-700 bg-slate-800 text-purple-500 focus:ring-purple-500/40 focus:ring-offset-slate-900'
                : 'border-slate-300 bg-white text-purple-600 focus:ring-purple-500/40'
            }`}
          />
          <label
            htmlFor="remember-me"
            className={`ml-2 block text-xs cursor-pointer select-none ${
              isDark ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Remember me
          </label>
        </div>

        <div className="text-xs">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert("Password reset instructions will be sent to your registered email.");
            }}
            className={`font-semibold transition-colors duration-150 ${
              isDark
                ? 'text-purple-400 hover:text-purple-300'
                : 'text-purple-600 hover:text-purple-700'
            }`}
          >
            Forgot password?
          </a>
        </div>
      </div>

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
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>

      <p className={`mt-5 text-center text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Don't have an account?{' '}
        <Link
          to="/register"
          className={`font-semibold transition-colors duration-150 ${
            isDark
              ? 'text-purple-400 hover:text-purple-300'
              : 'text-purple-600 hover:text-purple-700'
          }`}
        >
          Sign up for free
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
