import React from 'react';
import type { Task, Status } from '../../types';
import { STATUS_LABELS, STATUS_COLORS } from '../../utils/task';
import { TaskCard } from './TaskCard';
import type { CollaboratorPresence } from '../../types';

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  draggingTaskId: string | null;
  presences: CollaboratorPresence[];
  onDragStart: (e: React.DragEvent | React.PointerEvent, taskId: string) => void;
  onDragOver: (e: React.DragEvent, status: Status) => void;
  onDrop: (e: React.DragEvent, status: Status) => void;
  onDragLeave: () => void;
  isDropTarget: boolean;
  placeholderHeight: number;
  placeholderIndex: number | null;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  tasks,
  draggingTaskId,
  presences,
  onDragStart,
  onDragOver,
  onDrop,
  onDragLeave,
  isDropTarget,
  placeholderHeight,
  placeholderIndex,
}) => {
  const color = STATUS_COLORS[status];

  return (
    <div
      className={`flex flex-col rounded-2xl border transition-all duration-200 min-w-[280px] max-w-[320px] w-full ${
        isDropTarget ? 'drag-over-column border-accent-blue/30' : 'border-white/5 bg-surface-1'
      }`}
      onDragOver={(e) => onDragOver(e, status)}
      onDrop={(e) => onDrop(e, status)}
      onDragLeave={onDragLeave}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="font-display text-sm font-semibold text-gray-200">
            {STATUS_LABELS[status]}
          </span>
        </div>
        <span
          className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: color + '20', color }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Cards scroll area */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 min-h-[200px] max-h-[calc(100vh-280px)]">
        {tasks.length === 0 && !isDropTarget && (
          <div className="flex flex-col items-center justify-center h-full py-10 text-center">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: color + '15' }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 font-medium">No tasks here</p>
            <p className="text-xs text-gray-600 mt-1">Drop a card to move it</p>
          </div>
        )}

        {tasks.map((task, idx) => (
          <React.Fragment key={task.id}>
            {placeholderIndex === idx && draggingTaskId && (
              <div
                className="drag-placeholder transition-all duration-150"
                style={{ height: placeholderHeight }}
              />
            )}
            <TaskCard
              task={task}
              presences={presences}
              onDragStart={onDragStart}
              isDragging={task.id === draggingTaskId}
            />
          </React.Fragment>
        ))}
        {placeholderIndex === tasks.length && draggingTaskId && (
          <div
            className="drag-placeholder transition-all duration-150"
            style={{ height: placeholderHeight }}
          />
        )}
      </div>
    </div>
  );
};
