import { useEffect, useRef } from 'react';
import { Objective } from '../types';
import { useToast } from '../context/ToastContext';

/**
 * Monitors the objectives array for state transitions.
 * When an objective transitions from incomplete to completed (progress === maxProgress or completed: true),
 * it triggers a Cyberpunk Achievement Toast.
 */
export const useAchievementWatcher = (objectives: Objective[]) => {
  const { triggerAchievement } = useToast();
  const prevStatusRef = useRef<Map<string, { completed: boolean; progress: number }> | null>(null);

  useEffect(() => {
    // On first mount, snapshot initial state without firing toasts
    if (prevStatusRef.current === null) {
      const initialSnapshot = new Map<string, { completed: boolean; progress: number }>();
      objectives.forEach((obj) => {
        initialSnapshot.set(obj.id, {
          completed: obj.completed,
          progress: obj.progress,
        });
      });
      prevStatusRef.current = initialSnapshot;
      return;
    }

    const previousMap = prevStatusRef.current;
    const currentSnapshot = new Map<string, { completed: boolean; progress: number }>();

    objectives.forEach((obj) => {
      const prev = previousMap.get(obj.id);
      currentSnapshot.set(obj.id, {
        completed: obj.completed,
        progress: obj.progress,
      });

      // Transition detection: was incomplete, now complete
      const wasIncomplete = prev
        ? !prev.completed || (obj.maxProgress > 0 && prev.progress < obj.maxProgress)
        : false;
      
      const isNowComplete =
        obj.completed || (obj.maxProgress > 0 && obj.progress >= obj.maxProgress);

      if (prev && wasIncomplete && isNowComplete) {
        triggerAchievement(obj.title, obj.tier, obj.description);
      }
    });

    prevStatusRef.current = currentSnapshot;
  }, [objectives, triggerAchievement]);
};
