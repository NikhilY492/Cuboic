import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GeofenceGate } from './GeofenceGate';
import { useGeofence } from '../hooks/useGeofence';

// Mock the hook
vi.mock('../hooks/useGeofence', () => ({
    useGeofence: vi.fn()
}));

const mockUseGeofence = useGeofence as any as jest.Mock;

describe('GeofenceGate', () => {
    const defaultProps = {
        lat: 10.0,
        lng: 76.0,
        radius: 50,
        enabled: true,
        onEscapeHatch: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders children transparently when geofencing is disabled', () => {
        mockUseGeofence.mockReturnValue({ status: 'inside', distance: null, check: vi.fn() });
        render(
            <GeofenceGate {...defaultProps} enabled={false}>
                <div data-testid="child-content">Secret Menu</div>
            </GeofenceGate>
        );
        expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    it('renders children transparently when lat/lng are missing', () => {
        mockUseGeofence.mockReturnValue({ status: 'inside', distance: null, check: vi.fn() });
        render(
            <GeofenceGate {...defaultProps} lat={null}>
                <div data-testid="child-content">Secret Menu</div>
            </GeofenceGate>
        );
        expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    it('shows checking UI when status is idle or checking', () => {
        mockUseGeofence.mockReturnValue({ status: 'checking', distance: null, check: vi.fn() });
        render(
            <GeofenceGate {...defaultProps}>
                <div data-testid="child-content">Secret Menu</div>
            </GeofenceGate>
        );
        expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
        expect(screen.getByText('Checking your location…')).toBeInTheDocument();
    });

    it('renders children when status is inside', () => {
        mockUseGeofence.mockReturnValue({ status: 'inside', distance: 0, check: vi.fn() });
        render(
            <GeofenceGate {...defaultProps}>
                <div data-testid="child-content">Secret Menu</div>
            </GeofenceGate>
        );
        expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    it('shows outside UI and distance when status is outside', () => {
        const checkMock = vi.fn();
        mockUseGeofence.mockReturnValue({ status: 'outside', distance: 150, check: checkMock });
        render(
            <GeofenceGate {...defaultProps}>
                <div data-testid="child-content">Secret Menu</div>
            </GeofenceGate>
        );
        
        expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
        expect(screen.getByText("You're not at the restaurant")).toBeInTheDocument();
        expect(screen.getByText('You are ~150 m away')).toBeInTheDocument();
        
        // Test retry button
        fireEvent.click(screen.getByText('📡 Retry Location Check'));
        expect(checkMock).toHaveBeenCalled();
        
        // Test escape hatch
        fireEvent.click(screen.getByText('Ask staff to place order'));
        expect(defaultProps.onEscapeHatch).toHaveBeenCalled();
    });

    it('shows denied UI when permission is denied', () => {
        mockUseGeofence.mockReturnValue({ status: 'denied', distance: null, check: vi.fn() });
        render(
            <GeofenceGate {...defaultProps}>
                <div data-testid="child-content">Secret Menu</div>
            </GeofenceGate>
        );
        expect(screen.getByText('Location access denied')).toBeInTheDocument();
    });

    it('shows unavailable UI when GPS is unavailable', () => {
        mockUseGeofence.mockReturnValue({ status: 'unavailable', distance: null, check: vi.fn() });
        render(
            <GeofenceGate {...defaultProps}>
                <div data-testid="child-content">Secret Menu</div>
            </GeofenceGate>
        );
        expect(screen.getByText('Location unavailable')).toBeInTheDocument();
    });
});
