import React, { useState, useRef, useCallback } from 'react';
import { useAppStore } from '../../store/appStore';
import { useFilteredTasks } from '../../hooks/useFilteredTasks';
import { useCollaboration } from '../../hooks/useCollaboration';
import { KanbanColumn } from './KanbanColumn';
import { ALL_STATUSES } from '../../utils/task';
import type { Status } from '../../types';

interface DragState {
  taskId: string;
  sourceStatus: Status;
  cardHeight: number;
  ghostEl: HTMLElement | null;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  offsetX: number;
  offsetY: number;
}

export const KanbanView: React.FC = () => {
  const { moveTask } = useAppStore();
  const tasks = useFilteredTasks();
  const { presences } = useCollaboration();

  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<Status | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(null);
  const [placeholderHeight, setPlaceholderHeight] = useState(120);

  const dragState = useRef<DragState | null>(null);
  const ghostRef = useRef<HTMLElement | null>(null);

  const tasksByStatus = (status: Status) => tasks.filter((t) => t.status === status);

  // ─HTML5 Drag Events ───────────────────────────────────────────────────────
  const handleDragStart = useCallback(
    (e: React.DragEvent | React.PointerEvent, taskId: string) => {
      if ('dataTransfer' in e) {
        (e as React.DragEvent).dataTransfer.effectAllowed = 'move';
        (e as React.DragEvent).dataTransfer.setData('text/plain', taskId);

        const card = (e.target as HTMLElement).closest('[data-task-id]') as HTMLElement;
        const rect = card?.getBoundingClientRect();
        if (rect) setPlaceholderHeight(rect.height);

        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        dragState.current = {
          taskId,
          sourceStatus: task.status,
          cardHeight: rect?.height ?? 120,
          ghostEl: null,
          startX: (e as React.DragEvent).clientX,
          startY: (e as React.DragEvent).clientY,
          currentX: (e as React.DragEvent).clientX,
          currentY: (e as React.DragEvent).clientY,
          offsetX: (e as React.DragEvent).clientX - (rect?.left ?? 0),
          offsetY: (e as React.DragEvent).clientY - (rect?.top ?? 0),
        };

        // Create ghost element
        if (card) {
          const ghost = card.cloneNode(true) as HTMLElement;
          ghost.style.cssText = `
            position: fixed;
            top: -9999px;
            left: -9999px;
            width: ${rect.width}px;
            opacity: 0.85;
            transform: rotate(1.5deg) scale(1.03);
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            pointer-events: none;
            z-index: 9999;
            border-radius: 12px;
          `;
          document.body.appendChild(ghost);
          ghostRef.current = ghost;
          dragState.current.ghostEl = ghost;

          try {
            (e as React.DragEvent).dataTransfer.setDragImage(ghost, dragState.current.offsetX, dragState.current.offsetY);
          } catch (_) { /* ignore */ }
        }

        setDraggingTaskId(taskId);
      }
    },
    [tasks]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, status: Status) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setDropTarget(status);

      const columnTasks = tasksByStatus(status);
      const colEl = e.currentTarget as HTMLElement;
      const cards = colEl.querySelectorAll('[data-task-id]');

      let insertIdx = columnTasks.length;
      for (let i = 0; i < cards.length; i++) {
        const rect = cards[i].getBoundingClientRect();
        if (e.clientY < rect.top + rect.height / 2) {
          insertIdx = i;
          break;
        }
      }
      setPlaceholderIndex(insertIdx);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tasks]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, status: Status) => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData('text/plain');
      if (taskId) {
        moveTask(taskId, status);
      }
      cleanup();
    },
    [moveTask]
  );

  const handleDragEnd = useCallback(() => {
    cleanup();
  }, []);

  const cleanup = () => {
    if (ghostRef.current) {
      ghostRef.current.remove();
      ghostRef.current = null;
    }
    dragState.current = null;
    setDraggingTaskId(null);
    setDropTarget(null);
    setPlaceholderIndex(null);
  };

  return (
    <div
      className="flex gap-4 h-full overflow-x-auto pb-4"
      onDragEnd={handleDragEnd}
    >
      {ALL_STATUSES.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          tasks={tasksByStatus(status)}
          draggingTaskId={draggingTaskId}
          presences={presences}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragLeave={() => {
            if (dropTarget === status) setDropTarget(null);
          }}
          isDropTarget={dropTarget === status}
          placeholderHeight={placeholderHeight}
          placeholderIndex={dropTarget === status ? placeholderIndex : null}
        />
      ))}
    </div>
  );
};
