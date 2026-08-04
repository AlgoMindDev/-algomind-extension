import React, { useState } from 'react';
import { Calendar, Flame } from 'lucide-react';

const HeatmapCard = ({ heatmap = [], totalRevisions = 0, streak = 0, loading = false }) => {
  
  const defaultRange = totalRevisions < 20 ? '4w' : '6m';
  const [rangeMode, setRangeMode] = useState(defaultRange);

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#101522]/60 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
          Revision Activity
        </h4>
        <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  
  const colsCount = rangeMode === '4w' ? 4 : rangeMode === '3m' ? 13 : 26;
  const daysCount = colsCount * 7;

  
  const cells = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    let count = 0;
    if (Array.isArray(heatmap)) {
      const match = heatmap.find(item => item.date === dateStr);
      count = match ? match.count : 0;
    } else if (heatmap && typeof heatmap === 'object') {
      count = heatmap[dateStr] || 0;
    }
    cells.push({
      date: dateStr,
      count
    });
  }

  
  const activeDays = cells.filter(c => c.count > 0).length;

  
  const monthLabels = [];
  let prevMonth = -1;
  const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  for (let col = 0; col < colsCount; col++) {
    const cellIdx = col * 7;
    if (cellIdx < cells.length) {
      const cellDate = new Date(cells[cellIdx].date + 'T00:00:00');
      const curMonth = cellDate.getMonth();
      if (curMonth !== prevMonth) {
        monthLabels.push({
          col,
          label: monthNamesShort[curMonth]
        });
        prevMonth = curMonth;
      }
    }
  }

  
  const getCellBgClass = (count) => {
    if (count === 0) return 'bg-slate-100 dark:bg-slate-800/60 border border-slate-200/50 dark:border-white/5';
    if (count <= 2) return 'bg-emerald-200 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/50';
    if (count <= 5) return 'bg-emerald-400 dark:bg-emerald-600 border border-emerald-500 shadow-sm';
    return 'bg-emerald-600 dark:bg-emerald-400 border border-emerald-700 dark:border-emerald-300 shadow-md';
  };

  return (
    <div className="bg-white dark:bg-[#101522]/60 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm space-y-5 text-slate-900 dark:text-white">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 dark:border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-500" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Revision Activity</h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            {activeDays} active revision days in selected range
          </p>
        </div>

        <div className="flex items-center gap-3">
          {}
          <div className="flex items-center bg-slate-100 dark:bg-[#0b1020] border border-slate-200 dark:border-white/10 rounded-xl p-0.5 text-[10px] font-bold">
            <button
              onClick={() => setRangeMode('4w')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                rangeMode === '4w' ? 'bg-white dark:bg-[#101522] text-indigo-600 dark:text-[#a78bfa] shadow-sm' : 'text-slate-500'
              }`}
            >
              4 Weeks
            </button>
            <button
              onClick={() => setRangeMode('3m')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                rangeMode === '3m' ? 'bg-white dark:bg-[#101522] text-indigo-600 dark:text-[#a78bfa] shadow-sm' : 'text-slate-500'
              }`}
            >
              3 Months
            </button>
            <button
              onClick={() => setRangeMode('6m')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                rangeMode === '6m' ? 'bg-white dark:bg-[#101522] text-indigo-600 dark:text-[#a78bfa] shadow-sm' : 'text-slate-500'
              }`}
            >
              6 Months
            </button>
          </div>

          {}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-[10px] px-2.5 py-1 rounded-lg font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              {totalRevisions} reviews
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-lg font-bold bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Flame size={11} /> {streak}d streak
            </span>
          </div>
        </div>
      </div>

      {}
      <div className="w-full space-y-2">
        
        {}
        <div className="flex items-center gap-2 pl-8 pr-1">
          <div 
            className="grid gap-2 text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 w-full"
            style={{ gridTemplateColumns: `repeat(${colsCount}, minmax(0, 1fr))` }}
          >
            {Array(colsCount).fill(null).map((_, colIdx) => {
              const labelItem = monthLabels.find(item => item.col === colIdx);
              return (
                <span key={colIdx} className="text-center truncate">
                  {labelItem ? labelItem.label : ''}
                </span>
              );
            })}
          </div>
        </div>

        {}
        <div className="flex items-center gap-2 w-full">
          {}
          <div className="flex flex-col justify-between h-28 sm:h-32 text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 pr-1 py-1 shrink-0 select-none">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {}
          <div 
            className="grid gap-2 grid-flow-col w-full"
            style={{ 
              gridTemplateRows: 'repeat(7, minmax(0, 1fr))',
              gridTemplateColumns: `repeat(${colsCount}, minmax(0, 1fr))` 
            }}
          >
            {cells.map((cell) => (
              <div
                key={cell.date}
                title={`${cell.date} — ${cell.count} revisions`}
                className={`h-3.5 sm:h-4 w-full rounded-sm transition-all hover:scale-110 cursor-pointer ${getCellBgClass(cell.count)}`}
              />
            ))}
          </div>
        </div>

      </div>

      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-200/60 dark:border-white/5 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
        {activeDays < 7 ? (
          <p className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <span>✨</span> Your activity map will fill in as you keep reviewing.
          </p>
        ) : (
          <p className="text-slate-500">Consistent daily reviews build long-term memory strength.</p>
        )}

        {}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <span>Less</span>
          <div className="w-3 h-3 rounded-xs bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-white/5" />
          <div className="w-3 h-3 rounded-xs bg-emerald-200 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700/50" />
          <div className="w-3 h-3 rounded-xs bg-emerald-400 dark:bg-emerald-600 border border-emerald-500" />
          <div className="w-3 h-3 rounded-xs bg-emerald-600 dark:bg-emerald-400 border border-emerald-700 dark:border-emerald-300" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default HeatmapCard;
