import React, { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import { BASE_URL } from '../api/client';

type EventMap = Record<string, (...args: any[]) => void>;

// ─── Context ─────────────────────────────────────────────────────────────────

const SocketContext = createContext<Socket | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface SocketProviderProps {
    restaurantId: string | null | undefined;
    children: ReactNode;
}

/**
 * Maintains a single shared WebSocket connection for the entire app.
 * Place this above the NavigationContainer so all screens share one socket.
 */
export function SocketProvider({ restaurantId, children }: SocketProviderProps) {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        if (!restaurantId) return;

        const s = io(BASE_URL, { transports: ['websocket'] });

        s.on('connect', () => {
            if (__DEV__) console.log(`[Socket] Connected: ${s.id} → room: ${restaurantId}`);
            s.emit('join', { restaurantId });
        });

        s.on('disconnect', (reason) => {
            if (__DEV__) console.log(`[Socket] Disconnected: ${reason}`);
        });

        s.on('connect_error', (error) => {
            if (__DEV__) console.error('[Socket] Connection error:', error);
        });

        setSocket(s);

        return () => {
            s.disconnect();
            setSocket(null);
        };
    }, [restaurantId]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Subscribe to socket events from the shared connection.
 * Handlers are always fresh (via ref), so no stale closure issues.
 */
export function useSocketEvent(
    restaurantId: string | null | undefined,
    events: EventMap
) {
    const socket = useContext(SocketContext);
    // Keep a ref so the stable socket listener always calls the latest handler
    const eventsRef = useRef(events);
    eventsRef.current = events;

    useEffect(() => {
        if (!socket || !restaurantId) return;

        // Create stable wrappers that delegate to the latest handler via ref
        const stableHandlers: Record<string, (...args: any[]) => void> = {};
        Object.keys(eventsRef.current).forEach(event => {
            stableHandlers[event] = (...args: any[]) => eventsRef.current[event]?.(...args);
            const fullEvent = `${event}:${restaurantId}`;
            if (__DEV__) console.log(`[Socket] Registering: ${fullEvent}`);
            socket.on(fullEvent, stableHandlers[event]);
        });

        return () => {
            Object.keys(stableHandlers).forEach(event => {
                socket.off(`${event}:${restaurantId}`, stableHandlers[event]);
            });
        };
    }, [socket, restaurantId]);
}
