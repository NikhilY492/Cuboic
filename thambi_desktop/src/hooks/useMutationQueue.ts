import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/apiClient';
import toast from 'react-hot-toast';

export type MutationType = 'UPDATE_STATUS' | 'MARK_PAID_BULK';

export interface QueuedMutation {
  id: string;
  type: MutationType;
  payload: any;
  version?: number;
  timestamp: number;
}

const QUEUE_KEY = 'thambi_desktop_mutation_queue';

export function useMutationQueue(onSyncSuccess?: () => void) {
  const [queue, setQueue] = useState<QueuedMutation[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(QUEUE_KEY);
    if (stored) {
      try {
        setQueue(JSON.parse(stored));
      } catch (e) {
        setQueue([]);
      }
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }, [queue]);


  const enqueue = useCallback((type: MutationType, payload: any, version?: number) => {
    const mutation: QueuedMutation = {
      id: Math.random().toString(36).substring(7),
      type,
      payload,
      version,
      timestamp: Date.now(),
    };

    setQueue(prev => {
      const isDuplicate = prev.some(
        m => m.type === type && JSON.stringify(m.payload) === JSON.stringify(payload)
      );
      if (isDuplicate) return prev;
      return [...prev, mutation];
    });

    if (!navigator.onLine) {
        toast.error('Offline. Action saved to queue.', { icon: '📡', id: 'offline-toast' });
    }

    return mutation;
  }, []);

  const drain = useCallback(async (onSyncSuccess?: () => void) => {
    if (!navigator.onLine || syncing) return;
    
    const stored = localStorage.getItem(QUEUE_KEY);
    if (!stored) return;
    let currentQueue: QueuedMutation[] = [];
    try {
      currentQueue = JSON.parse(stored);
    } catch (e) { return; }

    if (currentQueue.length === 0) return;

    setSyncing(true);
    let conflictCount = 0;
    let successCount = 0;

    for (const m of currentQueue) {
      try {
        if (m.type === 'UPDATE_STATUS') {
          await apiClient.patch(`/orders/${m.payload.orderId}/status`, {
            status: m.payload.status,
            version: m.version,
          });
        } else if (m.type === 'MARK_PAID_BULK') {
          await apiClient.patch('/orders/mark-paid-bulk', {
            orderIds: m.payload.orderIds,
          }, { params: { restaurantId: m.payload.restaurantId } });
        }

        setQueue(prev => prev.filter(q => q.id !== m.id));
        successCount++;
      } catch (e: any) {
        const status = e.response?.status;
        if (status === 409) {
          setQueue(prev => prev.filter(q => q.id !== m.id));
          conflictCount++;
        } else if (status >= 400 && status < 500) {
          setQueue(prev => prev.filter(q => q.id !== m.id));
          console.error('Unrecoverable error in queue:', e);
        } else {
          // Network error or 5xx, keep in queue
          break;
        }
      }
    }

    setSyncing(false);

    if (conflictCount > 0) {
      toast.error(`${conflictCount} change(s) failed. Order was modified elsewhere.`);
      if (onSyncSuccess) onSyncSuccess(); // Still want to reload data to get true state
    } else if (successCount > 0) {
      if (onSyncSuccess) onSyncSuccess();
    }
  }, [syncing]);

  useEffect(() => {
    if (isOnline) {
      drain(onSyncSuccess);
    }
  }, [isOnline, drain, queue.length, onSyncSuccess]);

  return { queue, enqueue, drain, isOnline };
}
