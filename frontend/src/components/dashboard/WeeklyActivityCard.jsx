import React from 'react';

const WeeklyActivityCard = ({ weeklyActivity = [], loading = false }) => {
  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '14px 16px' }}>
        <h4 style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
          Weekly activity
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '28px', height: '12px', backgroundColor: 'var(--bg-item)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
              <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--bg-item)', borderRadius: '3px', animation: 'pulse 1.5s infinite' }}></div>
              <div style={{ width: '16px', height: '12px', backgroundColor: 'var(--bg-item)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!weeklyActivity || weeklyActivity.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '14px 16px' }}>
        <h4 style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
          Weekly activity
        </h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', padding: '24px 0' }}>
          No weekly activity tracked yet. Keep code solving!
        </p>
      </div>
    );
  }

  const maxSolved = Math.max(...weeklyActivity.map(d => d.solved), 1);
  const getHonestyColor = (pct) => {
    if (pct >= 80) return 'var(--green)';
    if (pct >= 60) return 'var(--orange)';
    return 'var(--red)';
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '14px 16px' }} className="h-full flex flex-col justify-between">
      <div>
        <h4 style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
          Weekly activity
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {weeklyActivity.map(dayInfo => {
            const solved = dayInfo.solved || 0;
            const avgHonesty = dayInfo.avgHonesty || 0;
            const pct = Math.min(100, Math.round((solved / maxSolved) * 100));

            return (
              <div key={dayInfo.day} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: '0.5px solid var(--border)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', width: '28px', flexShrink: 0 }}>
                  {dayInfo.day}
                </span>

                <div style={{ flex: 1, height: '6px', background: 'var(--bg-item)', borderRadius: '3px' }}>
                  <div style={{
                    width: solved === 0 ? '0%' : `${pct}%`,
                    height: '6px', 
                    borderRadius: '3px', 
                    background: 'var(--purple)',
                    transition: 'width 0.5s ease'
                  }} />
                </div>

                <span style={{ fontSize: '11px', color: solved === 0 ? 'var(--red)' : 'var(--text-muted)', width: '16px', textAlign: 'right', flexShrink: 0 }}>
                  {solved}
                </span>

                <span style={{ fontSize: '10px', width: '60px', textAlign: 'right', flexShrink: 0, color: solved === 0 ? 'var(--text-muted)' : getHonestyColor(avgHonesty) }}>
                  {solved === 0 ? 'missed' : `${avgHonesty}% honest`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeeklyActivityCard;
