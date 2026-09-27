import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { ObjectiveTier } from '../types';
import { AchievementToast } from '../components/AchievementToast';

export interface ToastItem {
  id: string;
  title: string;
  tier: ObjectiveTier;
  description?: string;
  duration: number;
}

export interface ToastContextType {
  triggerAchievement: (
    title: string,
    tier: ObjectiveTier | string,
    description?: string
  ) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const MAX_VISIBLE_TOASTS = 3;
const DEFAULT_DURATION = 4500; // 4.5 seconds

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismissToast = useCallback((id: string) => {
    // Clear timer if active
    if (timersRef.current.has(id)) {
      clearTimeout(timersRef.current.get(id));
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const triggerAchievement = useCallback(
    (title: string, tier: ObjectiveTier | string, description?: string) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const normalizedTier: ObjectiveTier =
        ['platinum', 'gold', 'silver', 'bronze'].includes(tier.toLowerCase())
          ? (tier.toLowerCase() as ObjectiveTier)
          : 'bronze';

      const newToast: ToastItem = {
        id,
        title,
        tier: normalizedTier,
        description,
        duration: DEFAULT_DURATION,
      };

      setToasts((prev) => {
        // Enforce max 3 simultaneously visible
        const next = [...prev, newToast];
        if (next.length > MAX_VISIBLE_TOASTS) {
          const removed = next.slice(0, next.length - MAX_VISIBLE_TOASTS);
          removed.forEach((item) => {
            if (timersRef.current.has(item.id)) {
              clearTimeout(timersRef.current.get(item.id));
              timersRef.current.delete(item.id);
            }
          });
          return next.slice(-MAX_VISIBLE_TOASTS);
        }
        return next;
      });

      // Schedule auto-dismiss
      const timer = setTimeout(() => {
        dismissToast(id);
      }, DEFAULT_DURATION);

      timersRef.current.set(id, timer);
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ triggerAchievement, dismissToast }}>
      {children}

      {/* Floating Notifications Viewport (Top-Right HUD Stack) */}
      <div 
        aria-live="polite"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-[calc(100vw-2rem)] w-full sm:w-auto"
      >
        {toasts.map((toast) => (
          <AchievementToast
            key={toast.id}
            id={toast.id}
            title={toast.title}
            tier={toast.tier}
            description={toast.description}
            duration={toast.duration}
            onClose={() => dismissToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
