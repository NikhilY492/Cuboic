import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getSessionId, resetSession } from './session';

beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
});

afterEach(() => {
    localStorage.clear();
});

describe('getSessionId', () => {
    it('returns a non-empty string UUID', () => {
        const id = getSessionId();
        expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it('returns the same ID on repeated calls (within session lifetime)', () => {
        const id1 = getSessionId();
        const id2 = getSessionId();
        expect(id1).toBe(id2);
    });

    it('creates a new session ID after resetSession()', () => {
        const id1 = getSessionId();
        resetSession();
        const id2 = getSessionId();
        expect(id2).not.toBe(id1);
        expect(id2).toMatch(/^[0-9a-f]{8}-/i);
    });

    it('persists session data to localStorage', () => {
        getSessionId();
        const raw = localStorage.getItem('thambi_session_data');
        expect(raw).not.toBeNull();
        const parsed = JSON.parse(raw!);
        expect(parsed).toHaveProperty('id');
        expect(parsed).toHaveProperty('expiresAt');
    });

    it('creates a new session when the stored session is expired', () => {
        // Write an expired session directly into localStorage
        const expiredData = {
            id: 'old-expired-id',
            expiresAt: Date.now() - 1000, // 1 second in the past
        };
        localStorage.setItem('thambi_session_data', JSON.stringify(expiredData));

        const id = getSessionId();
        expect(id).not.toBe('old-expired-id');
    });

    it('extends the expiresAt on each call for a valid session', () => {
        getSessionId();
        const rawBefore = JSON.parse(localStorage.getItem('thambi_session_data')!);
        const expiresBefore = rawBefore.expiresAt;

        // Advance time slightly
        vi.setSystemTime(Date.now() + 5000);
        getSessionId();
        const rawAfter = JSON.parse(localStorage.getItem('thambi_session_data')!);

        expect(rawAfter.expiresAt).toBeGreaterThan(expiresBefore);
        vi.useRealTimers();
    });
});

describe('resetSession', () => {
    it('clears the session from localStorage', () => {
        getSessionId(); // create one
        resetSession();
        expect(localStorage.getItem('thambi_session_data')).toBeNull();
    });

    it('also clears the old legacy key if present', () => {
        localStorage.setItem('thambi_session_id', 'legacy-id');
        resetSession();
        expect(localStorage.getItem('thambi_session_id')).toBeNull();
    });
});
