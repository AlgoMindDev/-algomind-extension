import React from 'react';
import { Target, Award, ShieldAlert } from 'lucide-react';

const CompanyReadiness = ({ problems = [] }) => {
  
  const calculateReadiness = (categories = []) => {
    const solvedMatched = problems.filter(p => 
      categories.some(cat => p.category?.toLowerCase() === cat.toLowerCase())
    );
    
    return Math.min(100, solvedMatched.length * 15 || 25);
  };

  const companies = [
    { name: 'Amazon', categories: ['Arrays', 'DP', 'Linked List'], target: 'Amazon SDE' },
    { name: 'Google', categories: ['Graphs', 'Trees', 'Backtracking'], target: 'Google SWE' },
    { name: 'Microsoft', categories: ['Strings', 'Binary Search', 'Trees'], target: 'Microsoft SE' },
    { name: 'Uber', categories: ['Graphs', 'DP', 'Greedy'], target: 'Uber Backend SDE' },
    { name: 'Meta', categories: ['Arrays', 'Strings', 'Graphs'], target: 'Meta SWE' }
  ].map(company => ({
    ...company,
    percentage: calculateReadiness(company.categories)
  }));

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', border: '0.5px solid var(--border)' }} className="p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
            <Target className="h-4 w-4 text-[var(--purple)]" />
            Target Company Readiness Index
          </h3>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Calculated based on pattern coverage stats</p>
        </div>
      </div>

      {}
      <div className="space-y-4">
        {companies.map(company => {
          const color = company.percentage >= 75 ? 'var(--green)' : company.percentage >= 50 ? 'var(--amber)' : 'var(--red)';
          return (
            <div key={company.name} className="p-3 bg-[var(--bg-item)] border border-[var(--border)] rounded-xl">
              <div className="flex justify-between items-center mb-1.5 text-xs">
                <div>
                  <span className="font-bold text-[var(--text-primary)]">{company.name}</span>
                  <span className="text-[9px] text-[var(--text-muted)] ml-2">({company.target})</span>
                </div>
                <span className="font-bold" style={{ color }}>{company.percentage}%</span>
              </div>
              <div className="w-full bg-[var(--bg-deep)] h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${company.percentage}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompanyReadiness;
