import React, { useRef } from 'react';
import { useFilteredTasks } from '../../hooks/useFilteredTasks';
import { PRIORITY_COLORS } from '../../utils/task';
import { today } from '../../utils/date';
import { USERS } from '../../data/generator';
import { getInitials } from '../../utils/task';

const DAY_WIDTH = 32; // px per day

function getDaysArray(year: number, month: number): Date[] {
  const days: Date[] = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function dayOffset(dateStr: string, monthStart: Date): number {
  const d = new Date(dateStr);
  return Math.floor((d.getTime() - monthStart.getTime()) / 86400000);
}

export const TimelineView: React.FC = () => {
  const tasks = useFilteredTasks();
  const scrollRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const days = getDaysArray(year, month);
  const monthStart = new Date(year, month, 1);
  const todayStr = today();

  const totalWidth = days.length * DAY_WIDTH;
  const todayIdx = days.findIndex((d) => d.toISOString().split('T')[0] === todayStr);

  const LABEL_WIDTH = 200; // left column for task name
  const ROW_HEIGHT = 40;
  const HEADER_HEIGHT = 48;

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-2xl border border-white/5 bg-surface-1">
      {/* Month title */}
      <div className="px-5 py-3 border-b border-white/5 bg-surface-2 flex items-center justify-between">
        <span className="font-display font-semibold text-gray-200">
          {now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </span>
        <span className="text-xs text-gray-500 font-mono">{tasks.length} tasks</span>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Fixed task name column */}
        <div
          className="flex-shrink-0 border-r border-white/5"
          style={{ width: LABEL_WIDTH }}
        >
          {/* Header spacer */}
          <div style={{ height: HEADER_HEIGHT }} className="border-b border-white/5 bg-surface-2" />
          {/* Task names */}
          <div className="overflow-y-hidden" style={{ maxHeight: `calc(100% - ${HEADER_HEIGHT}px)` }}>
            {tasks.map((task) => {
              const user = USERS.find((u) => u.id === task.assigneeId);
              return (
                <div
                  key={task.id}
                  style={{ height: ROW_HEIGHT }}
                  className="flex items-center gap-2 px-3 border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  {user && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0"
                      style={{ backgroundColor: user.color + '30', color: user.color }}
                    >
                      {getInitials(user.name)}
                    </div>
                  )}
                  <span className="text-xs text-gray-400 truncate">{task.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scrollable timeline area */}
        <div ref={scrollRef} className="flex-1 overflow-auto timeline-scroll">
          <div style={{ width: totalWidth, minWidth: totalWidth }}>
            {/* Day headers */}
            <div
              className="flex border-b border-white/5 bg-surface-2 sticky top-0 z-10"
              style={{ height: HEADER_HEIGHT }}
            >
              {days.map((d, i) => {
                const isToday = d.toISOString().split('T')[0] === todayStr;
                const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                return (
                  <div
                    key={i}
                    style={{ width: DAY_WIDTH, minWidth: DAY_WIDTH }}
                    className={`flex flex-col items-center justify-center border-r border-white/5 text-center ${
                      isToday ? 'bg-accent-blue/10' : isWeekend ? 'bg-white/[0.02]' : ''
                    }`}
                  >
                    <span className={`text-[9px] font-mono ${isToday ? 'text-accent-blue font-bold' : 'text-gray-600'}`}>
                      {d.toLocaleDateString('en-IN', { weekday: 'narrow' })}
                    </span>
                    <span className={`text-xs font-semibold ${isToday ? 'text-accent-blue' : isWeekend ? 'text-gray-500' : 'text-gray-400'}`}>
                      {d.getDate()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Task rows */}
            <div style={{ position: 'relative' }}>
              {/* Today vertical line */}
              {todayIdx >= 0 && (
                <div
                  className="absolute top-0 bottom-0 z-20 pointer-events-none"
                  style={{
                    left: todayIdx * DAY_WIDTH + DAY_WIDTH / 2,
                    width: 2,
                    background: 'linear-gradient(180deg, #4f8ef7 0%, #4f8ef780 100%)',
                  }}
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent-blue" />
                </div>
              )}

              {/* Weekend column highlights */}
              {days.map((d, i) => {
                const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                return isWeekend ? (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 bg-white/[0.015] pointer-events-none"
                    style={{ left: i * DAY_WIDTH, width: DAY_WIDTH }}
                  />
                ) : null;
              })}

              {tasks.map((task) => {
                const color = PRIORITY_COLORS[task.priority];

                // Calculate bar position
                const effectiveStart = task.startDate ?? task.dueDate;
                const startDay = Math.max(0, dayOffset(effectiveStart, monthStart));
                const endDay = Math.min(days.length - 1, dayOffset(task.dueDate, monthStart));
                const barWidth = task.startDate
                  ? Math.max(1, endDay - startDay + 1) * DAY_WIDTH - 4
                  : DAY_WIDTH - 4; // single-day marker
                const barLeft = startDay * DAY_WIDTH + 2;
                const isSingleDay = !task.startDate;

                // If task is outside this month, skip rendering bar
                const isVisible =
                  dayOffset(task.dueDate, monthStart) >= 0 &&
                  dayOffset(effectiveStart, monthStart) < days.length;

                return (
                  <div
                    key={task.id}
                    style={{ height: ROW_HEIGHT }}
                    className="relative border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    {isVisible && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 rounded flex items-center px-1.5 overflow-hidden"
                        style={{
                          left: barLeft,
                          width: barWidth,
                          height: isSingleDay ? 20 : 24,
                          backgroundColor: color + (isSingleDay ? '40' : '25'),
                          border: `1.5px solid ${color}${isSingleDay ? '80' : '50'}`,
                        }}
                        title={task.title}
                      >
                        {!isSingleDay && (
                          <span className="text-[9px] font-medium truncate" style={{ color }}>
                            {task.title}
                          </span>
                        )}
                        {isSingleDay && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
