import React from 'react';
import type { Priority } from '../../types';
import { PRIORITY_BG } from '../../utils/task';

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${PRIORITY_BG[priority]}`}>
      {priority}
    </span>
  );
};
