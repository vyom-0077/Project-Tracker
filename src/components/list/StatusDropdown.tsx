import React, { useState, useRef, useEffect } from 'react';
import type { Status } from '../../types';
import { ALL_STATUSES, STATUS_LABELS, STATUS_BG, STATUS_COLORS } from '../../utils/task';
import { useAppStore } from '../../store/appStore';

interface StatusDropdownProps {
  taskId: string;
  currentStatus: Status;
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({ taskId, currentStatus }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { updateTaskStatus } = useAppStore();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (status: Status) => {
    updateTaskStatus(taskId, status);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${STATUS_BG[currentStatus]}`}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: STATUS_COLORS[currentStatus] }}
        />
        {STATUS_LABELS[currentStatus]}
        <svg className={`w-3 h-3 opacity-60 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-surface-3 border border-white/10 rounded-xl shadow-2xl py-1 min-w-[140px] animate-slide-in">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => handleSelect(s)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/5 transition-colors ${
                s === currentStatus ? 'text-white' : 'text-gray-400'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[s] }} />
              {STATUS_LABELS[s]}
              {s === currentStatus && (
                <svg className="w-3 h-3 ml-auto text-accent-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
