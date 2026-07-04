import { renderHook, act } from '@testing-library/react-native';
import { useOptimisticMutation } from './useOptimisticMutation';
import { useMutationQueue } from './useMutationQueue';
import { Alert } from 'react-native';

// Mock dependencies
jest.mock('react-native', () => ({
    Alert: { alert: jest.fn() }
}));

jest.mock('./useMutationQueue', () => ({
    useMutationQueue: jest.fn()
}));

describe('useOptimisticMutation', () => {
    let mockEnqueue: jest.Mock;
    let mockDrain: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockEnqueue = jest.fn().mockReturnValue({ id: 'mut-1' });
        mockDrain = jest.fn().mockResolvedValue(undefined);

        (useMutationQueue as jest.Mock).mockReturnValue({
            enqueue: mockEnqueue,
            drain: mockDrain,
            isOnline: true
        });
    });

    it('optimistically updates state, enqueues, and drains when online', async () => {
        const initialState = { count: 0 };
        const onStateUpdate = jest.fn();

        const { result } = renderHook(() => 
            useOptimisticMutation(initialState, onStateUpdate)
        );

        await act(async () => {
            await result.current.execute(
                'UPDATE_STATUS' as any,
                { id: '1', status: 'Confirmed' },
                1,
                (prev) => ({ ...prev, count: prev.count + 1 })
            );
        });

        // 1. Optimistic Update
        expect(onStateUpdate).toHaveBeenCalledWith({ count: 1 });
        
        // 2. Queueing
        expect(mockEnqueue).toHaveBeenCalledWith(
            'UPDATE_STATUS', 
            { id: '1', status: 'Confirmed' }, 
            1
        );

        // 3. Sync
        expect(mockDrain).toHaveBeenCalled();
        expect(result.current.isPending).toBe(false);
    });

    it('keeps optimistic state but does not drain when offline', async () => {
        (useMutationQueue as jest.Mock).mockReturnValue({
            enqueue: mockEnqueue,
            drain: mockDrain,
            isOnline: false
        });

        const initialState = { count: 0 };
        const onStateUpdate = jest.fn();

        const { result } = renderHook(() => 
            useOptimisticMutation(initialState, onStateUpdate)
        );

        await act(async () => {
            await result.current.execute(
                'UPDATE_STATUS' as any,
                {},
                undefined,
                (prev) => ({ ...prev, count: prev.count + 1 })
            );
        });

        // Optimistic UI happens
        expect(onStateUpdate).toHaveBeenCalledWith({ count: 1 });
        
        // Enqueue happens
        expect(mockEnqueue).toHaveBeenCalled();

        // But NO drain
        expect(mockDrain).not.toHaveBeenCalled();
    });

    it('rolls back state and shows alert on STALE_VERSION conflict', async () => {
        mockDrain.mockRejectedValue(new Error('STALE_VERSION'));

        const initialState = { count: 0 };
        const onStateUpdate = jest.fn();
        const onConflictCallback = jest.fn();

        const { result } = renderHook(() => 
            useOptimisticMutation(initialState, onStateUpdate, onConflictCallback)
        );

        await act(async () => {
            await result.current.execute(
                'UPDATE_STATUS' as any,
                {},
                1,
                (prev) => ({ ...prev, count: prev.count + 1 })
            );
        });

        // Optimistic UI happened
        expect(onStateUpdate).toHaveBeenCalledWith({ count: 1 });

        // Rollback happened
        expect(onStateUpdate).toHaveBeenLastCalledWith({ count: 0 });

        // Alert shown
        expect(Alert.alert).toHaveBeenCalledWith(
            "Order Updated",
            "This order was modified by someone else. Your changes could not be applied.",
            [{ text: "OK", onPress: onConflictCallback }]
        );
    });

    it('rolls back state but keeps mutation in queue for network errors', async () => {
        mockDrain.mockRejectedValue(new Error('Network Error'));

        const initialState = { count: 0 };
        const onStateUpdate = jest.fn();

        const { result } = renderHook(() => 
            useOptimisticMutation(initialState, onStateUpdate)
        );

        await act(async () => {
            await result.current.execute(
                'UPDATE_STATUS' as any,
                {},
                1,
                (prev) => ({ ...prev, count: prev.count + 1 })
            );
        });

        // Optimistic UI happened
        expect(onStateUpdate).toHaveBeenCalledWith({ count: 1 });

        // Rollback happened due to error
        expect(onStateUpdate).toHaveBeenLastCalledWith({ count: 0 });

        // No alert for regular network errors
        expect(Alert.alert).not.toHaveBeenCalled();
    });
});
