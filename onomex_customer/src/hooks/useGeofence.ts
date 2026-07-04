import { useState, useEffect, useCallback } from 'react';
import { haversineDistance } from '../utils/haversine';

export type GeofenceStatus = 'idle' | 'checking' | 'inside' | 'outside' | 'denied' | 'unavailable';

export interface GeofenceResult {
    status: GeofenceStatus;
    distance: number | null; // metres
    check: () => void;       // manually re-trigger the check
}

interface GeofenceOptions {
    lat: number | undefined | null;
    lng: number | undefined | null;
    radius: number; // metres
    enabled: boolean;
}

export function useGeofence({ lat, lng, radius, enabled }: GeofenceOptions): GeofenceResult {
    const [status, setStatus] = useState<GeofenceStatus>('idle');
    const [distance, setDistance] = useState<number | null>(null);

    const check = useCallback(() => {
        // If geofencing is off or no coords set, treat as always inside
        if (!enabled || lat == null || lng == null) {
            setStatus('inside');
            setDistance(null);
            return;
        }

        if (!navigator.geolocation) {
            setStatus('unavailable');
            return;
        }

        setStatus('checking');

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const dist = haversineDistance(
                    pos.coords.latitude,
                    pos.coords.longitude,
                    lat,
                    lng
                );
                setDistance(Math.round(dist));
                setStatus(dist <= radius ? 'inside' : 'outside');
            },
            (err) => {
                if (err.code === GeolocationPositionError.PERMISSION_DENIED) {
                    setStatus('denied');
                } else {
                    setStatus('unavailable');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    }, [lat, lng, radius, enabled]);

    useEffect(() => {
        if (enabled && lat != null && lng != null) {
            check();
        } else if (!enabled) {
            setStatus('inside');
        }
    }, [check, enabled, lat, lng]);

    return { status, distance, check };
}
