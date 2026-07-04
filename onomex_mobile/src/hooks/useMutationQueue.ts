import { useState, useEffect, useCallback, useRef } from 'react';
import * as SecureStore from 'expo-secure-store';
import NetInfo from '@react-native-community/netinfo';
import { ordersApi } from '../api/orders';

export type MutationType = 'UPDATE_STATUS' | 'UPDATE_ITEMS' | 'MERGE_ORDERS';

export interface QueuedMutation {
    id: string;
    type: MutationType;
    payload: any;
    timestamp: number;
    retries: number;
    version?: number;
}

const QUEUE_KEY = 'onomex_mutation_queue';
const MAX_RETRIES = 3;
const STALE_TIMEOUT_MS = 1800000; // 30 mins

export function useMutationQueue() {
    const [queue, setQueue] = useState<QueuedMutation[]>([]);
    const [isOnline, setIsOnline] = useState(true);
    const isDraining = useRef(false);

    useEffect(() => {
        SecureStore.getItemAsync(QUEUE_KEY).then(val => {
            if (val) {
                try {
                    setQueue(JSON.parse(val));
                } catch {
                    setQueue([]);
                }
            }
        });

        const unsubscribe = NetInfo.addEventListener((state: any) => {
            setIsOnline(!!state.isConnected);
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        SecureStore.setItemAsync(QUEUE_KEY, JSON.stringify(queue));
    }, [queue]);

    const enqueue = useCallback((type: MutationType, payload: any, version?: number) => {
        const mutation: QueuedMutation = {
            id: Date.now().toString() + Math.random().toString(),
            type,
            payload,
            timestamp: Date.now(),
            retries: 0,
            version
        };
        
        setQueue(prev => {
            // Basic deduplication: if exact type and payload (JSON match) is already in queue
            const isDuplicate = prev.some(m => m.type === type && JSON.stringify(m.payload) === JSON.stringify(payload));
            if (isDuplicate) return prev;
            return [...prev, mutation];
        });
        
        return mutation;
    }, []);

    const drain = useCallback(async () => {
        if (!isOnline || isDraining.current) return;
        
        // Use a snapshot of current queue from SecureStore to avoid race conditions
        const val = await SecureStore.getItemAsync(QUEUE_KEY);
        if (!val) return;
        
        let currentQueue: QueuedMutation[] = [];
        try {
            currentQueue = JSON.parse(val);
        } catch {
            return;
        }

        if (currentQueue.length === 0) return;

        isDraining.current = true;
        let conflictCount = 0;

        for (const m of currentQueue) {
            // Drop stale mutations
            if (Date.now() - m.timestamp > STALE_TIMEOUT_MS) {
                setQueue(prev => prev.filter(q => q.id !== m.id));
                continue;
            }

            try {
                switch (m.type) {
                    case 'UPDATE_STATUS':
                        await ordersApi.updateStatus(m.payload.orderId, m.payload.status, m.version);
                        break;
                    case 'UPDATE_ITEMS':
                        await ordersApi.updateOrderItems(m.payload.orderId, m.payload.items, m.payload.notes, m.version);
                        break;
                    case 'MERGE_ORDERS':
                        await ordersApi.mergeOrders(m.payload.targetOrderId, m.payload.sourceOrderIds, m.version);
                        break;
                }
                // On success, dequeue
                setQueue(prev => prev.filter(q => q.id !== m.id));
            } catch (e: any) {
                if (e.response?.status === 409) {
                    // Stale version - drop it and mark conflict
                    setQueue(prev => prev.filter(q => q.id !== m.id));
                    conflictCount++;
                } else {
                    // Network or server error - increment retries
                    setQueue(prev => prev.map(q => {
                        if (q.id === m.id) {
                            const updated = { ...q, retries: q.retries + 1 };
                            if (updated.retries >= MAX_RETRIES) {
                                return null as any; // will be filtered out below
                            }
                            return updated;
                        }
                        return q;
                    }).filter(Boolean));
                }
            }
        }
        
        isDraining.current = false;
        
        if (conflictCount > 0) {
            console.warn(`[Queue] ${conflictCount} change(s) could not be applied — order was modified while offline.`);
        }
    }, [isOnline]);

    return { queue, enqueue, drain, isOnline };
}
