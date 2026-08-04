import React, { useState } from 'react';
import api from '../../utils/api.js';

const StreakCalendarCard = ({ streakData = {}, loading = false, onFreezeApplied }) => {
  const [loadingFreeze, setLoadingFreeze] = useState(false);
  const [freezeApplied, setFreezeApplied] = useState(false);
  const [freezeError, setFreezeError] = useState('');

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '14px 16px' }}>
        <h4 style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
          Streak calendar
        </h4>
        <div style={{ height: '140px', backgroundColor: 'var(--bg-item)', borderRadius: '8px', animation: 'pulse 1.5s infinite', marginTop: '16px' }}></div>
      </div>
    );
  }

  if (!streakData || !streakData.days || streakData.days.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '14px 16px' }}>
        <h4 style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
          Streak calendar
        </h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', padding: '24px 0' }}>
          No streak calendar data available.
        </p>
      </div>
    );
  }

  const {
    month = '',
    days = [],
    currentStreak = 0,
    bestStreak = 0,
    freezesLeft = 1,
    missedYesterday = false
  } = streakData;

  
  const firstDayStr = days[0]?.date;
  
  const offset = firstDayStr ? new Date(firstDayStr + 'T00:00:00').getDay() : 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleUseFreeze = async () => {
    setLoadingFreeze(true);
    setFreezeError('');
    try {
      await api.post('/analytics/use-freeze');
      setFreezeApplied(true);
      if (onFreezeApplied) {
        onFreezeApplied();
      }
    } catch (err) {
      console.error('[Streak Calendar Freeze Error]:', err);
      setFreezeError(err.response?.data?.message || 'Failed to apply streak freeze.');
    } finally {
      setLoadingFreeze(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '14px 16px' }} className="h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-3">
          <h4 style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Streak calendar
          </h4>
          <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-secondary)' }}>{month}</span>
        </div>

        {}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '4px' }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dl, i) => (
            <span key={dl + i} style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 500 }}>{dl}</span>
          ))}
        </div>

        {}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {}
          {Array(offset).fill(null).map((_, i) => (
            <div key={`offset-${i}`} style={{ height: '28px' }} />
          ))}

          {}
          {days.map(dayInfo => {
            const cellDate = new Date(dayInfo.date + 'T00:00:00');
            const dayNum = cellDate.getDate();
            const isToday = cellDate.getTime() === today.getTime();
            const isFuture = cellDate > today;

            if (dayInfo.solved) {
              
              return (
                <div 
                  key={dayInfo.date} 
                  title={`${dayInfo.date} — Solved!`}
                  style={{ flex: 1, height: '28px', borderRadius: '5px', backgroundColor: 'var(--green-bg)', color: 'var(--green)', fontSize: '9px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  {dayNum}
                </div>
              );
            }

            if (isToday) {
              
              return (
                <div 
                  key={dayInfo.date} 
                  title="Today — Incomplete"
                  style={{ flex: 1, height: '28px', borderRadius: '5px', backgroundColor: 'var(--purple-bg)', color: 'var(--purple)', fontSize: '9px', border: '0.5px solid var(--purple)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  {dayNum}
                </div>
              );
            }

            if (isFuture) {
              
              return (
                <div 
                  key={dayInfo.date} 
                  style={{ flex: 1, height: '28px', borderRadius: '5px', backgroundColor: 'transparent', color: 'var(--border-medium)', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {dayNum}
                </div>
              );
            }

            
            return (
              <div 
                key={dayInfo.date} 
                title={`${dayInfo.date} — Unsolved`}
                style={{ flex: 1, height: '28px', borderRadius: '5px', backgroundColor: 'var(--bg-item)', color: 'var(--text-muted)', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                {dayNum}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        {}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', borderTop: '0.5px solid var(--border)', paddingTop: '8px' }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{currentStreak}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Current</div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>{bestStreak}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Best</div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--purple)' }}>{freezeApplied ? freezesLeft - 1 : freezesLeft}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Freezes left</div>
          </div>
        </div>

        {}
        {missedYesterday && freezesLeft > 0 && !freezeApplied && (
          <button 
            disabled={loadingFreeze}
            onClick={handleUseFreeze} 
            style={{ width: '100%', marginTop: '8px', padding: '6px', borderRadius: '8px', background: 'var(--purple-bg)', border: '0.5px solid var(--purple)', color: 'var(--purple)', fontSize: '11px', cursor: 'pointer' }}
            className="hover:bg-[var(--bg-hover)] transition-colors"
          >
            {loadingFreeze ? 'Applying freeze...' : 'Use streak freeze to save your streak'}
          </button>
        )}

        {freezeApplied && (
          <div style={{ width: '100%', marginTop: '8px', padding: '6px', borderRadius: '8px', background: 'var(--green-bg)', border: '0.5px solid var(--green)', color: 'var(--green)', fontSize: '11px', textAlign: 'center' }}>
            Streak freeze applied! Saved your streak.
          </div>
        )}

        {freezeError && (
          <div style={{ width: '100%', marginTop: '8px', padding: '6px', borderRadius: '8px', background: 'var(--red-bg)', border: '0.5px solid var(--red)', color: 'var(--red)', fontSize: '10px', textAlign: 'center' }}>
            {freezeError}
          </div>
        )}
      </div>
    </div>
  );
};

export default StreakCalendarCard;
