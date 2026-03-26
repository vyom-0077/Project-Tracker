import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { USERS } from '../../data/generator';
import { ALL_STATUSES, ALL_PRIORITIES, STATUS_LABELS, PRIORITY_BG } from '../../utils/task';
import type { Status, Priority } from '../../types';

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return { open, setOpen, ref };
}

interface MultiSelectProps {
  label: string;
  options: { value: string; label: string; className?: string }[];
  selected: string[];
  onChange: (vals: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ label, options, selected, onChange }) => {
  const { open, setOpen, ref } = useDropdown();
  const toggle = (val: string) => {
    onChange(selected.includes(val) ? selected.filter((v) => v !== val) : [...selected, val]);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all duration-150 ${
          selected.length
            ? 'border-accent-blue/50 bg-accent-blue/10 text-accent-blue'
            : 'border-white/10 bg-surface-2 text-gray-400 hover:text-gray-200 hover:border-white/20'
        }`}
      >
        <span>{label}</span>
        {selected.length > 0 && (
          <span className="bg-accent-blue text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {selected.length}
          </span>
        )}
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-surface-3 border border-white/10 rounded-xl shadow-2xl py-1 min-w-[160px] animate-slide-in">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 transition-colors text-sm"
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${
                selected.includes(opt.value) ? 'bg-accent-blue border-accent-blue' : 'border-white/20'
              }`}>
                {selected.includes(opt.value) && (
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                )}
              </div>
              <span className={opt.className ?? 'text-gray-300'}>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const FilterBar: React.FC = () => {
  const { filters, setFilters, clearFilters } = useAppStore();

  const hasFilters =
    filters.statuses.length > 0 ||
    filters.priorities.length > 0 ||
    filters.assignees.length > 0 ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '';

  const statusOptions = ALL_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }));
  const priorityOptions = ALL_PRIORITIES.map((p) => ({
    value: p,
    label: p.charAt(0).toUpperCase() + p.slice(1),
    className: `capitalize px-1.5 py-0.5 rounded text-xs font-semibold ${PRIORITY_BG[p as Priority]}`,
  }));
  const assigneeOptions = USERS.map((u) => ({ value: u.id, label: u.name }));

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <MultiSelect
        label="Status"
        options={statusOptions}
        selected={filters.statuses as string[]}
        onChange={(vals) => setFilters({ statuses: vals as Status[] })}
      />
      <MultiSelect
        label="Priority"
        options={priorityOptions}
        selected={filters.priorities as string[]}
        onChange={(vals) => setFilters({ priorities: vals as Priority[] })}
      />
      <MultiSelect
        label="Assignee"
        options={assigneeOptions}
        selected={filters.assignees}
        onChange={(vals) => setFilters({ assignees: vals })}
      />

      <div className="flex items-center gap-1.5">
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters({ dateFrom: e.target.value })}
          className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-surface-2 text-gray-300 text-sm focus:outline-none focus:border-accent-blue/50 transition-colors [color-scheme:dark]"
          placeholder="From"
        />
        <span className="text-gray-600 text-xs">–</span>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters({ dateTo: e.target.value })}
          className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-surface-2 text-gray-300 text-sm focus:outline-none focus:border-accent-blue/50 transition-colors [color-scheme:dark]"
          placeholder="To"
        />
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors animate-fade-in"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear filters
        </button>
      )}
    </div>
  );
};
