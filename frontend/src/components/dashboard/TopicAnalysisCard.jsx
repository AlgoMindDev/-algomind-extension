import React from 'react';

const TopicAnalysisCard = ({ topicStats = [], loading = false, onTopicClick }) => {
  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '14px 16px' }}>
        <h4 style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
          Topic analysis
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '64px', height: '12px', backgroundColor: 'var(--bg-item)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
              <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--bg-item)', borderRadius: '3px', animation: 'pulse 1.5s infinite' }}></div>
              <div style={{ width: '30px', height: '12px', backgroundColor: 'var(--bg-item)', borderRadius: '4px', animation: 'pulse 1.5s infinite' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!topicStats || topicStats.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '14px 16px' }}>
        <h4 style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
          Topic analysis
        </h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', padding: '24px 0' }}>
          No topic data available yet. Solve a problem to see topic analysis!
        </p>
      </div>
    );
  }

  const getStatus = (retention) => {
    if (retention >= 75) return { label: 'Good', color: '#4ade80', bg: '#0a2e1f', barColor: '#4ade80' };
    if (retention >= 55) return { label: 'Fair', color: '#fb923c', bg: '#2d1f0a', barColor: '#fb923c' };
    return { label: 'Weak', color: '#f87171', bg: '#2e0a0a', barColor: '#f87171' };
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', border: '0.5px solid var(--border)', borderRadius: '12px', padding: '14px 16px' }}>
      <h4 style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
        Topic analysis
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {topicStats.map(item => {
          const status = getStatus(item.retention);
          const isWeak = item.retention < 55;

          return (
            <div 
              key={item.topic}
              onClick={() => onTopicClick && onTopicClick(item.topic)}
              style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                padding: '8px 10px', 
                borderBottom: '0.5px solid var(--border)',
                background: isWeak ? 'var(--red-bg)' : 'transparent',
                borderRadius: isWeak ? '8px' : '0px',
                cursor: 'pointer'
              }}
              className="hover:bg-[var(--bg-hover)] transition-colors"
            >
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)', width: '70px', flexShrink: 0 }} className="truncate">
                {item.topic}
              </span>

              {}
              <div style={{ flex: 1, height: '5px', background: 'var(--bg-item)', borderRadius: '3px' }}>
                <div style={{ width: `${item.retention}%`, height: '5px', borderRadius: '3px', background: status.barColor, transition: 'width 0.6s ease' }} />
              </div>

              <span style={{ fontSize: '11px', fontWeight: 500, color: status.barColor, width: '35px', textAlign: 'right', flexShrink: 0 }}>
                {item.retention}%
              </span>

              <span style={{ fontSize: '10px', color: 'var(--text-muted)', width: '54px', textAlign: 'right', flexShrink: 0 }}>
                {item.solved} solved
              </span>

              {}
              <span style={{ fontSize: '9px', padding: '1px 6px', borderRadius: '10px', background: status.bg, color: status.color, width: '38px', textAlign: 'center', fontWeight: 500, flexShrink: 0 }}>
                {status.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopicAnalysisCard;
