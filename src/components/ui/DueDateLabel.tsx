import React from 'react';
import { formatDueDate, isOverdue, isDueToday } from '../../utils/date';

interface DueDateLabelProps {
  dateStr: string;
  className?: string;
}

export const DueDateLabel: React.FC<DueDateLabelProps> = ({ dateStr, className = '' }) => {
  const label = formatDueDate(dateStr);
  const overdue = isOverdue(dateStr);
  const dueToday = isDueToday(dateStr);

  let colorClass = 'text-gray-400';
  if (overdue) colorClass = 'text-red-400';
  else if (dueToday) colorClass = 'text-amber-400';

  return (
    <span className={`text-xs font-mono ${colorClass} ${className}`}>
      {label}
    </span>
  );
};
