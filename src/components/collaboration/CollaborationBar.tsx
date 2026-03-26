import React from 'react';
import { useCollaboration } from '../../hooks/useCollaboration';
import { USERS } from '../../data/generator';
import { getInitials } from '../../utils/task';

export const CollaborationBar: React.FC = () => {
  const { presences, activeCount } = useCollaboration();

  const activePresences = presences.filter((p) => p.taskId !== null);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        {activePresences.map((p) => {
          const user = USERS.find((u) => u.id === p.userId);
          if (!user) return null;
          return (
            <div
              key={p.userId}
              className="relative w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold font-mono transition-all duration-500"
              style={{
                backgroundColor: user.color + '25',
                color: user.color,
                border: `2px solid ${user.color}`,
                boxShadow: p.action === 'editing' ? `0 0 8px ${user.color}80` : 'none',
              }}
              title={`${user.name} is ${p.action}`}
            >
              {getInitials(user.name)}
              {p.action === 'editing' && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-surface-0 animate-pulse-soft"
                  style={{ backgroundColor: user.color }}
                />
              )}
            </div>
          );
        })}
      </div>
      <span className="text-xs text-gray-500">
        <span className="text-gray-300 font-medium">{activeCount}</span>{' '}
        {activeCount === 1 ? 'person' : 'people'} viewing
      </span>
    </div>
  );
};
