import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useGeofence } from './useGeofence';

// ── Geolocation mock helpers ──────────────────────────────────────────────

function mockGeolocationSuccess(lat: number, lng: number) {
    const getCurrentPosition = vi.fn((success: PositionCallback) => {
        success({
            coords: {
                latitude: lat,
                longitude: lng,
                accuracy: 5,
                altitude: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null,
            },
            timestamp: Date.now(),
        } as GeolocationPosition);
    });
    Object.defineProperty(global.navigator, 'geolocation', {
        value: { getCurrentPosition },
        writable: true,
        configurable: true,
    });
    return getCurrentPosition;
}

function mockGeolocationError(code: number) {
    const getCurrentPosition = vi.fn((_success: PositionCallback, error: PositionErrorCallback) => {
        error({ code, message: 'test error', PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 } as GeolocationPositionError);
    });
    Object.defineProperty(global.navigator, 'geolocation', {
        value: { getCurrentPosition },
        writable: true,
        configurable: true,
    });
}

function removeGeolocation() {
    Object.defineProperty(global.navigator, 'geolocation', {
        value: undefined,
        writable: true,
        configurable: true,
    });
}

// ── Tests ─────────────────────────────────────────────────────────────────

describe('useGeofence', () => {
    const RESTAURANT_LAT = 9.9312;
    const RESTAURANT_LNG = 76.2673;

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns "inside" immediately when geofencing is disabled', () => {
        const { result } = renderHook(() =>
            useGeofence({ lat: RESTAURANT_LAT, lng: RESTAURANT_LNG, radius: 25, enabled: false }),
        );
        expect(result.current.status).toBe('inside');
        expect(result.current.distance).toBeNull();
    });

    it('returns "inside" immediately when lat/lng are null even if enabled', () => {
        const { result } = renderHook(() =>
            useGeofence({ lat: null, lng: null, radius: 25, enabled: true }),
        );
        expect(result.current.status).toBe('inside');
    });

    it('returns "unavailable" when navigator.geolocation is not present', async () => {
        removeGeolocation();
        const { result } = renderHook(() =>
            useGeofence({ lat: RESTAURANT_LAT, lng: RESTAURANT_LNG, radius: 25, enabled: true }),
        );
        await waitFor(() => expect(result.current.status).toBe('unavailable'));
    });

    it('returns "denied" when the user denies location permission', async () => {
        mockGeolocationError(GeolocationPositionError.PERMISSION_DENIED);
        const { result } = renderHook(() =>
            useGeofence({ lat: RESTAURANT_LAT, lng: RESTAURANT_LNG, radius: 25, enabled: true }),
        );
        await waitFor(() => expect(result.current.status).toBe('denied'));
    });

    it('returns "unavailable" for non-permission geolocation errors', async () => {
        mockGeolocationError(GeolocationPositionError.POSITION_UNAVAILABLE);
        const { result } = renderHook(() =>
            useGeofence({ lat: RESTAURANT_LAT, lng: RESTAURANT_LNG, radius: 25, enabled: true }),
        );
        await waitFor(() => expect(result.current.status).toBe('unavailable'));
    });

    it('returns "inside" when the device is within the radius', async () => {
        // Same coords as restaurant → 0 m distance
        mockGeolocationSuccess(RESTAURANT_LAT, RESTAURANT_LNG);
        const { result } = renderHook(() =>
            useGeofence({ lat: RESTAURANT_LAT, lng: RESTAURANT_LNG, radius: 25, enabled: true }),
        );
        await waitFor(() => expect(result.current.status).toBe('inside'));
        expect(result.current.distance).toBe(0);
    });

    it('returns "outside" when device is farther than the radius', async () => {
        // Move ~500 m away
        mockGeolocationSuccess(RESTAURANT_LAT + 0.005, RESTAURANT_LNG);
        const { result } = renderHook(() =>
            useGeofence({ lat: RESTAURANT_LAT, lng: RESTAURANT_LNG, radius: 25, enabled: true }),
        );
        await waitFor(() => expect(result.current.status).toBe('outside'));
        expect(result.current.distance).toBeGreaterThan(25);
    });

    it('the check() function re-triggers a GPS call', async () => {
        const mock = mockGeolocationSuccess(RESTAURANT_LAT, RESTAURANT_LNG);
        const { result } = renderHook(() =>
            useGeofence({ lat: RESTAURANT_LAT, lng: RESTAURANT_LNG, radius: 25, enabled: true }),
        );
        await waitFor(() => expect(result.current.status).toBe('inside'));

        act(() => { result.current.check(); });

        expect(mock).toHaveBeenCalledTimes(2);
    });

    it('does not check geolocation when enabled transitions from true to false', async () => {
        const mock = mockGeolocationSuccess(RESTAURANT_LAT, RESTAURANT_LNG);
        const { result, rerender } = renderHook(
            ({ enabled }) => useGeofence({ lat: RESTAURANT_LAT, lng: RESTAURANT_LNG, radius: 25, enabled }),
            { initialProps: { enabled: true } },
        );
        await waitFor(() => expect(result.current.status).toBe('inside'));

        const callsBefore = mock.mock.calls.length;
        rerender({ enabled: false });
        expect(mock.mock.calls.length).toBe(callsBefore); // no new GPS call
        expect(result.current.status).toBe('inside'); // still inside (disabled = pass-through)
    });
});
