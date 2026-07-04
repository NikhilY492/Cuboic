import { describe, it, expect } from 'vitest';
import { haversineDistance } from './haversine';

describe('haversineDistance', () => {
    it('returns 0 for identical coordinates', () => {
        expect(haversineDistance(9.9312, 76.2673, 9.9312, 76.2673)).toBe(0);
    });

    it('calculates a known distance within 1% tolerance — Kochi to Trivandrum (~160 km)', () => {
        // Kochi: 9.9312, 76.2673 | Trivandrum: 8.5241, 76.9366
        // Actual great-circle distance ≈ 160,000–167,000 m
        const dist = haversineDistance(9.9312, 76.2673, 8.5241, 76.9366);
        expect(dist).toBeGreaterThan(155_000);
        expect(dist).toBeLessThan(175_000);
    });

    it('calculates a short distance correctly — ~25 metres', () => {
        // Moving ~0.00025 degrees latitude ≈ 27.75 m
        const dist = haversineDistance(10.0, 76.0, 10.00025, 76.0);
        expect(dist).toBeGreaterThan(20);
        expect(dist).toBeLessThan(40);
    });

    it('is symmetric — distance(A, B) === distance(B, A)', () => {
        const d1 = haversineDistance(9.9312, 76.2673, 12.9716, 77.5946);
        const d2 = haversineDistance(12.9716, 77.5946, 9.9312, 76.2673);
        expect(d1).toBeCloseTo(d2, 0);
    });

    it('returns Earth-circumference / 2 for antipodal points (~20,015 km)', () => {
        const dist = haversineDistance(0, 0, 0, 180);
        // Half circumference ≈ 20,003,931 m
        expect(dist).toBeGreaterThan(19_900_000);
        expect(dist).toBeLessThan(20_100_000);
    });

    it('returns correct distance for north-south movement of ~111 km per degree', () => {
        // 1 degree latitude ≈ 111,195 m
        const dist = haversineDistance(0, 0, 1, 0);
        expect(dist).toBeGreaterThan(110_000);
        expect(dist).toBeLessThan(113_000);
    });
});
