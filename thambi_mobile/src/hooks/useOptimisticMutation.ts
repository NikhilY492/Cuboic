import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useMutationQueue, MutationType } from './useMutationQueue';

export function useOptimisticMutation<T>(
    initialState: T,
    onStateUpdate: (newState: T) => void,
    onConflictCallback?: () => void
) {
    const { enqueue, drain, isOnline } = useMutationQueue();
    // Keep track of any in-flight mutations for UI feedback (e.g. opacity: 0.85)
    const [isPending, setIsPending] = useState(false);

    const execute = useCallback(async (
        type: MutationType,
        payload: any,
        version: number | undefined,
        optimisticStateFn: (prev: T) => T
    ) => {
        // 1. Snapshot
        const snapshot = initialState;
        
        // 2. Optimistic UI
        const nextState = optimisticStateFn(snapshot);
        onStateUpdate(nextState);
        setIsPending(true);

        // 3. Enqueue
        const mutation = enqueue(type, payload, version);

        // 4. Try drain immediately if online
        if (isOnline) {
            try {
                await drain();
                setIsPending(false);
            } catch (e: any) {
                if (e.message === 'STALE_VERSION') {
                    // 409 Conflict logic
                    onStateUpdate(snapshot); // Rollback
                    setIsPending(false);
                    Alert.alert(
                        "Order Updated",
                        "This order was modified by someone else. Your changes could not be applied.",
                        [{ text: "OK", onPress: onConflictCallback }]
                    );
                } else {
                    // Keep in queue, rollback optimistic UI
                    onStateUpdate(snapshot);
                    setIsPending(false);
                }
            }
        } else {
            // Offline - UI stays optimistic, will drain later
            setIsPending(false);
        }
    }, [initialState, onStateUpdate, enqueue, drain, isOnline, onConflictCallback]);

    return { execute, isPending };
}
