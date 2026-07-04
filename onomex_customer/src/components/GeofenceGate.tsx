import { useGeofence } from '../hooks/useGeofence';
import './GeofenceGate.css';

interface GeofenceGateProps {
    lat: number | undefined | null;
    lng: number | undefined | null;
    radius: number;
    enabled: boolean;
    children: React.ReactNode;
    /** Called when user taps the "Contact Staff" escape hatch */
    onEscapeHatch?: () => void;
}

/**
 * GeofenceGate wraps any content and renders it only when the customer
 * is within `radius` metres of the restaurant. Otherwise it renders a
 * friendly blocking screen.
 *
 * When `enabled` is false (or lat/lng are not set) the children are always shown.
 */
export function GeofenceGate({
    lat,
    lng,
    radius,
    enabled,
    children,
    onEscapeHatch,
}: GeofenceGateProps) {
    const { status, distance, check } = useGeofence({ lat, lng, radius, enabled });

    // Geofencing off or no coords — pass through transparently
    if (!enabled || lat == null || lng == null) {
        return <>{children}</>;
    }

    // Actively checking GPS
    if (status === 'idle' || status === 'checking') {
        return (
            <div className="gfg-overlay">
                <div className="gfg-card">
                    <div className="gfg-icon gfg-icon--checking">
                        <div className="gfg-spinner" />
                    </div>
                    <p className="gfg-title">Checking your location…</p>
                    <p className="gfg-sub">We need to confirm you're at the restaurant to place an order.</p>
                </div>
            </div>
        );
    }

    // Customer is inside the geofence ✅
    if (status === 'inside') {
        return <>{children}</>;
    }

    // Customer is outside the geofence
    if (status === 'outside') {
        return (
            <div className="gfg-overlay">
                <div className="gfg-card">
                    <div className="gfg-icon gfg-icon--outside">
                        📍
                    </div>
                    <p className="gfg-title">You're not at the restaurant</p>
                    <p className="gfg-sub">
                        Orders can only be placed from within {radius} m of the restaurant.
                    </p>
                    {distance != null && (
                        <span className="gfg-distance">
                            You are ~{distance} m away
                        </span>
                    )}
                    <div className="gfg-actions">
                        <button className="gfg-btn-primary" onClick={check}>
                            📡 Retry Location Check
                        </button>
                        {onEscapeHatch && (
                            <button className="gfg-btn-secondary" onClick={onEscapeHatch}>
                                Ask staff to place order
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Location permission denied
    if (status === 'denied') {
        return (
            <div className="gfg-overlay">
                <div className="gfg-card">
                    <div className="gfg-icon gfg-icon--denied">
                        🔒
                    </div>
                    <p className="gfg-title">Location access denied</p>
                    <p className="gfg-sub">
                        Please allow location access in your browser settings, then try again.
                        We only check your location to confirm you're at the restaurant.
                    </p>
                    <div className="gfg-actions">
                        <button className="gfg-btn-primary" onClick={check}>
                            Try Again
                        </button>
                        {onEscapeHatch && (
                            <button className="gfg-btn-secondary" onClick={onEscapeHatch}>
                                Ask staff to place order
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Geolocation API unavailable (non-HTTPS, old browser, etc.)
    if (status === 'unavailable') {
        return (
            <div className="gfg-overlay">
                <div className="gfg-card">
                    <div className="gfg-icon gfg-icon--unavailable">
                        📵
                    </div>
                    <p className="gfg-title">Location unavailable</p>
                    <p className="gfg-sub">
                        We couldn't access your location. This may be because the page isn't served over HTTPS, or your device doesn't support GPS.
                    </p>
                    <div className="gfg-actions">
                        <button className="gfg-btn-primary" onClick={check}>
                            Retry
                        </button>
                        {onEscapeHatch && (
                            <button className="gfg-btn-secondary" onClick={onEscapeHatch}>
                                Ask staff to place order
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Fallback — should never happen
    return <>{children}</>;
}
