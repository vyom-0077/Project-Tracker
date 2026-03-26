import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useFilteredTasks } from '../../hooks/useFilteredTasks';
import { useAppStore } from '../../store/appStore';
import { Avatar } from '../ui/Avatar';
import { PriorityBadge } from '../ui/PriorityBadge';
import { DueDateLabel } from '../ui/DueDateLabel';
import { StatusDropdown } from './StatusDropdown';
import type { SortField, SortDirection } from '../../types';

const ROW_HEIGHT = 52; // px per row
const BUFFER = 5;      // rows above/below viewport

function SortIcon({ field, sort }: { field: SortField; sort: { field: SortField; direction: SortDirection } }) {
  if (sort.field !== field) {
    return (
      <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
  }
  return sort.direction === 'asc' ? (
    <svg className="w-3 h-3 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  ) : (
    <svg className="w-3 h-3 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export const ListView: React.FC = () => {
  const tasks = useFilteredTasks();
  const { sort, setSort } = useAppStore();

  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600);

  // Measure container height
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const h = entries[0]?.contentRect.height;
      if (h) setContainerHeight(h);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop((e.target as HTMLDivElement).scrollTop);
  }, []);

  const totalHeight = tasks.length * ROW_HEIGHT;
  const visibleCount = Math.ceil(containerHeight / ROW_HEIGHT);

  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const endIndex = Math.min(tasks.length - 1, startIndex + visibleCount + BUFFER * 2);
  const visibleTasks = tasks.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * ROW_HEIGHT;

  const handleSort = (field: SortField) => {
    if (sort.field === field) {
      setSort({ field, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      setSort({ field, direction: 'asc' });
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-2xl border border-white/5 bg-surface-1">
      {/* Header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3 border-b border-white/5 bg-surface-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
        <button
          className={`flex items-center gap-1.5 text-left hover:text-gray-300 transition-colors ${sort.field === 'title' ? 'text-accent-blue' : ''}`}
          onClick={() => handleSort('title')}
        >
          Task <SortIcon field="title" sort={sort} />
        </button>
        <button
          className={`flex items-center gap-1.5 hover:text-gray-300 transition-colors ${sort.field === 'priority' ? 'text-accent-blue' : ''}`}
          onClick={() => handleSort('priority')}
        >
          Priority <SortIcon field="priority" sort={sort} />
        </button>
        <span>Assignee</span>
        <button
          className={`flex items-center gap-1.5 hover:text-gray-300 transition-colors ${sort.field === 'dueDate' ? 'text-accent-blue' : ''}`}
          onClick={() => handleSort('dueDate')}
        >
          Due Date <SortIcon field="dueDate" sort={sort} />
        </button>
        <span>Status</span>
      </div>

      {/* Task count */}
      <div className="px-5 py-2 border-b border-white/5 bg-surface-1">
        <span className="text-xs text-gray-500 font-mono">
          {tasks.length} tasks
          {tasks.length === 0 ? '' : ` · showing ${startIndex + 1}–${Math.min(endIndex + 1, tasks.length)}`}
        </span>
      </div>

      {/* Empty state */}
      {tasks.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface-3 border border-white/5 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-gray-400 font-medium mb-1">No tasks match your filters</p>
          <p className="text-gray-600 text-sm mb-4">Try adjusting your filter criteria</p>
          <button
            onClick={() => useAppStore.getState().clearFilters()}
            className="px-4 py-2 rounded-lg bg-accent-blue/15 text-accent-blue text-sm font-medium border border-accent-blue/30 hover:bg-accent-blue/25 transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Virtual scroll container */}
      {tasks.length > 0 && (
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto virtual-scroll-container"
          onScroll={handleScroll}
        >
          {/* Total height spacer */}
          <div style={{ height: totalHeight, position: 'relative' }}>
            {/* Rendered rows */}
            <div style={{ transform: `translateY(${offsetY}px)` }}>
              {visibleTasks.map((task) => (
                <div
                  key={task.id}
                  style={{ height: ROW_HEIGHT }}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 items-center px-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                >
                  <span className="text-sm text-gray-300 truncate group-hover:text-white transition-colors" title={task.title}>
                    {task.title}
                  </span>
                  <div>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <Avatar userId={task.assigneeId} size="sm" />
                  <DueDateLabel dateStr={task.dueDate} />
                  <StatusDropdown taskId={task.id} currentStatus={task.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
