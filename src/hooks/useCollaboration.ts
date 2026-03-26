import { useState, useEffect, useRef } from 'react';
import { USERS } from '../data/generator';
import type { CollaboratorPresence } from '../types';
import { useFilteredTasks } from './useFilteredTasks';

const COLLAB_USERS = USERS.slice(0, 4); // 4 simulated collaborators

export function useCollaboration() {
  const tasks = useFilteredTasks();
  const taskIds = tasks.map((t) => t.id);
  const taskIdsRef = useRef(taskIds);
  taskIdsRef.current = taskIds;

  const [presences, setPresences] = useState<CollaboratorPresence[]>(() =>
    COLLAB_USERS.map((u, i) => ({
      userId: u.id,
      taskId: taskIdsRef.current[i] ?? null,
      action: 'viewing' as const,
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPresences((prev) =>
        prev.map((p) => {
          // ~30% chance to move
          if (Math.random() > 0.3) return p;
          const ids = taskIdsRef.current;
          if (!ids.length) return { ...p, taskId: null };
          const newTaskId = ids[Math.floor(Math.random() * ids.length)];
          const action = Math.random() > 0.7 ? ('editing' as const) : ('viewing' as const);
          return { ...p, taskId: newTaskId, action };
        })
      );
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const activeCount = presences.filter((p) => p.taskId !== null).length;

  return { presences, activeCount };
}
