import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrainCircuit, CircleUserRound, Home, LogOut, Sparkles, TimerReset, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const nav = [
  ['dashboard', '/dashboard', Home, 'Dashboard'],
  ['revisions', '/revisions', TimerReset, 'Revision queue'],
  ['ai-review', '/ai-review', Sparkles, 'AI Review'],
];

export default function AppShell({ children, active, level = 4, xp = 1240 }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [theme, setTheme] = React.useState(() => {
    try {
      return localStorage.getItem('theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="flex items-center justify-between w-full pr-1">
          <Link to="/dashboard" className="brand">
            <span className="brand-mark"><BrainCircuit size={20} /></span>
            <span>Algo<span>Mind</span></span>
          </Link>
          <button
            onClick={toggleTheme}
            className="p-1.5 hover:bg-[#ffffff0c] text-slate-400 rounded-lg transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-400" />}
          </button>
        </div>
        <nav className="mt-8">
          {nav.map(([key, path, Icon, label]) => (
            <Link
              key={key}
              to={path}
              className={(active === key || location.pathname === path) ? 'nav-link active' : 'nav-link'}
            >
              <Icon size={18} />
              <span>{label}</span>
              {key === 'revisions' && <b className="nav-count">3</b>}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="quest-card">
            <span className="quest-spark"><Sparkles size={15} /></span>
            <div>
              <b>Daily quest</b>
              <p>Complete 2 more recalls</p>
            </div>
            <div className="quest-track"><i /></div>
          </div>
          <div className="level-card">
            <div>
              <span>LEVEL {level}</span>
              <b>{xp % 1000} <small>/ 1000 XP</small></b>
            </div>
            <div className="level-track">
              <i style={{ width: `${Math.max(15, (xp % 1000) / 10)}%` }} />
            </div>
          </div>
          <div className="account-row">
            <Link to="/profile" className="account-profile">
              <span className="avatar small">
                {user?.username?.slice(0, 2).toUpperCase() || 'AM'}
              </span>
              <span>
                <b>{user?.username || 'Ambuj'}</b>
                <small>Diamond learner</small>
              </span>
            </Link>
            <button title="Log out" onClick={logout}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
      <section className="app-stage">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        {children}
      </section>
    </div>
  );
}
