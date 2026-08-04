import React, { useState, useEffect } from 'react';
import { IconSparkles } from '@tabler/icons-react';
import api from '../../utils/api.js';

const AIInsightCard = ({ context = {}, loading = false, userId, onTopicClick }) => {
  const [quote, setQuote] = useState('');
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [error, setError] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const cacheKey = userId ? `algomind_insight_${userId}_${todayStr}` : '';

  const weakTopic = context?.weakTopic || 'General';

  const fetchDailyInsight = async (forceRefresh = false) => {
    if (!userId || !context) return;

    
    if (!forceRefresh && cacheKey) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setQuote(cached);
        return;
      }
    }

    setLoadingQuote(true);
    setError('');
    try {
      const res = await api.post('/ai/daily-insight', { context });
      const newQuote = res.data?.data?.quote || `Stay focused on ${weakTopic} problems. Spaced recall builds robust programming mastery.`;
      
      setQuote(newQuote);
      if (cacheKey) {
        localStorage.setItem(cacheKey, newQuote);
      }
    } catch (err) {
      console.error('[AI Insight Request Error]:', err);
      setError('Could not fetch daily insight.');
      setQuote(`Focus on ${weakTopic} today. Revision keeps your coding sharp!`);
    } finally {
      setLoadingQuote(false);
    }
  };

  useEffect(() => {
    if (!loading && context && userId) {
      fetchDailyInsight();
    }
  }, [loading, context, userId]);

  const handleRefresh = () => {
    fetchDailyInsight(true);
  };

  const isCardLoading = loading || loadingQuote;

  return (
    <div 
      style={{ 
        backgroundColor: 'var(--bg-card)', 
        border: '0.5px solid var(--border)', 
        borderLeft: '3px solid var(--purple)', 
        borderRadius: '12px', 
        padding: '14px 16px' 
      }}
    >
      {}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--purple-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconSparkles size={14} color="var(--purple)" />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>Today's insight</span>
        </div>
        <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '20px', fontWeight: 500 }} className="bg-[#1e1a3d] text-[#a78bfa] dark:bg-[#1e1a3d] dark:text-[#a78bfa]">
          Gemini
        </span>
      </div>

      {/* Quote text / Loading skeleton */}
      {isCardLoading ? (
        <div 
          style={{ height: '48px', background: 'var(--bg-item)', borderRadius: '6px', animation: 'pulse 1.5s infinite', marginBottom: '12px' }} 
        />
      ) : (
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
          {quote}
        </p>
      )}

      {/* Action buttons */}
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => onTopicClick && onTopicClick(weakTopic)}
          style={{ 
            fontSize: '11px', 
            padding: '4px 10px', 
            borderRadius: '7px', 
            border: '0.5px solid var(--border)', 
            color: 'var(--text-secondary)', 
            background: 'transparent', 
            cursor: 'pointer' 
          }}
          className="hover:bg-[var(--bg-hover)] transition-colors"
        >
          Show {weakTopic} problems
        </button>
        <button 
          onClick={handleRefresh}
          disabled={isCardLoading}
          style={{ 
            fontSize: '11px', 
            padding: '4px 10px', 
            borderRadius: '7px', 
            border: '0.5px solid var(--border)', 
            color: 'var(--text-secondary)', 
            background: 'transparent', 
            cursor: 'pointer' 
          }}
          className="hover:bg-[var(--bg-hover)] transition-colors"
        >
          Refresh insight
        </button>
      </div>
    </div>
  );
};

export default AIInsightCard;
