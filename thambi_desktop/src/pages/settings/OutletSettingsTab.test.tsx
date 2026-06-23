import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OutletSettingsTab from './OutletSettingsTab';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../api/apiClient';

// Mock contexts and API
vi.mock('../../contexts/AuthContext', () => ({
    useAuth: vi.fn(),
}));

vi.mock('../../api/apiClient', () => ({
    apiClient: {
        get: vi.fn(),
        patch: vi.fn(),
    },
}));

const mockUseAuth = useAuth as jest.Mock;
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('OutletSettingsTab', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAuth.mockReturnValue({ user: { restaurantId: 'rest-1' } });
        
        // Mock successful API responses
        mockApiClient.get.mockImplementation(async (url: string) => {
            if (url.includes('/outlets')) {
                return { data: [{ id: 'outlet-1', name: 'Downtown Branch', is_active: true }] };
            }
            if (url.includes('/restaurants/')) {
                return { data: { latitude: 9.9, longitude: 76.2, geofenceEnabled: true, geofenceRadius: 50 } };
            }
            return { data: {} };
        });
    });

    it('renders the geofencing section and outlets after loading', async () => {
        render(<OutletSettingsTab />);
        
        // Wait for loading to finish
        await waitFor(() => {
            expect(screen.queryByText(/Loading settings/i)).not.toBeInTheDocument();
        });

        // Verify geofencing fields loaded correctly
        expect(screen.getByText('Location Ordering')).toBeInTheDocument();
        expect(screen.getByDisplayValue('9.9')).toBeInTheDocument(); // Latitude
        expect(screen.getByDisplayValue('76.2')).toBeInTheDocument(); // Longitude

        // Verify outlets loaded correctly
        expect(screen.getByText('Downtown Branch')).toBeInTheDocument();
    });

    it('toggles geofence enabled state', async () => {
        render(<OutletSettingsTab />);
        await waitFor(() => expect(screen.queryByText(/Loading settings/i)).not.toBeInTheDocument());

        const saveButton = screen.getByText('Save Geofencing Settings');
        
        // Click save directly without changing anything to see if it sends the existing state
        fireEvent.click(saveButton);
        
        await waitFor(() => {
            expect(mockApiClient.patch).toHaveBeenCalledWith('/restaurants/rest-1', expect.objectContaining({
                geofenceEnabled: true,
                latitude: 9.9,
                longitude: 76.2,
            }));
        });
    });

    it('validates GPS coordinates before saving if geofencing is enabled', async () => {
        // Return null coordinates
        mockApiClient.get.mockImplementation(async (url: string) => {
            if (url.includes('/outlets')) return { data: [] };
            if (url.includes('/restaurants/')) return { data: { geofenceEnabled: true, latitude: null, longitude: null } };
            return { data: {} };
        });

        render(<OutletSettingsTab />);
        await waitFor(() => expect(screen.queryByText(/Loading settings/i)).not.toBeInTheDocument());

        const saveButton = screen.getByText('Save Geofencing Settings');
        fireEvent.click(saveButton);

        // It shouldn't call the API because validation fails
        await waitFor(() => {
            expect(mockApiClient.patch).not.toHaveBeenCalled();
        });
    });
});
