import React from 'react';
import type { Task } from '../../types';
import { Avatar } from '../ui/Avatar';
import { PriorityBadge } from '../ui/PriorityBadge';
import { DueDateLabel } from '../ui/DueDateLabel';
import { isOverdue } from '../../utils/date';
import type { CollaboratorPresence } from '../../types';
import { USERS } from '../../data/generator';
import { getInitials } from '../../utils/task';

interface TaskCardProps {
  task: Task;
  presences: CollaboratorPresence[];
  onDragStart: (e: React.DragEvent | React.PointerEvent, taskId: string) => void;
  isDragging: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, presences, onDragStart, isDragging }) => {
  const taskPresences = presences.filter((p) => p.taskId === task.id);
  const overdue = isOverdue(task.dueDate);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className={`card p-3 cursor-grab active:cursor-grabbing select-none transition-all duration-150 hover:border-white/10 hover:bg-surface-3 group ${
        isDragging ? 'drag-card' : ''
      } ${overdue ? 'border-red-500/20' : ''}`}
      data-task-id={task.id}
    >
      {/* Collaboration indicators */}
      {taskPresences.length > 0 && (
        <div className="flex items-center gap-1 mb-2 animate-fade-in">
          {taskPresences.slice(0, 2).map((p) => {
            const user = USERS.find((u) => u.id === p.userId);
            if (!user) return null;
            return (
              <div
                key={p.userId}
                className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold collab-indicator transition-all duration-500"
                style={{
                  backgroundColor: user.color,
                  color: '#fff',
                  boxShadow: `0 0 6px ${user.color}`,
                }}
                title={`${user.name} is ${p.action}`}
              >
                {getInitials(user.name)[0]}
              </div>
            );
          })}
          {taskPresences.length > 2 && (
            <div className="w-4 h-4 rounded-full bg-surface-4 border border-white/20 flex items-center justify-center text-[8px] text-gray-400">
              +{taskPresences.length - 2}
            </div>
          )}
        </div>
      )}

      <p className="text-sm text-gray-200 font-medium leading-snug mb-2.5 group-hover:text-white transition-colors">
        {task.title}
      </p>

      <div className="flex items-center justify-between gap-2">
        <PriorityBadge priority={task.priority} />
        <DueDateLabel dateStr={task.dueDate} />
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <Avatar userId={task.assigneeId} size="sm" />
        <span className="text-[10px] text-gray-600 font-mono">#{task.id.split('-')[1]}</span>
      </div>
    </div>
  );
};
