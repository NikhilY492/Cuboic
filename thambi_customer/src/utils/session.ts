const SESSION_KEY = 'thambi_session_data';
const OLD_SESSION_KEY = 'thambi_session_id';
const SESSION_DURATION_MS = 60 * 60 * 1000; // 1 hour

interface SessionData {
    id: string;
    expiresAt: number;
}

/**
 * Returns a stable session ID for the current customer that expires after 1 hour of inactivity.
 * If one doesn't exist or is expired, it generates and saves a new one.
 */
export function getSessionId(): string {
    const raw = localStorage.getItem(SESSION_KEY);
    const now = Date.now();
    let data: SessionData | null = null;

    if (raw) {
        try {
            data = JSON.parse(raw);
        } catch (e) {
            // Probably the old plain string format
            data = null;
        }
    } else {
        // Migration from old key to new key
        const oldId = localStorage.getItem(OLD_SESSION_KEY);
        if (oldId) {
            data = { id: oldId, expiresAt: 0 }; // Will just be used to construct new session if we want, but better to just reset
            data = null; // Let's just create a fresh one
        }
    }

    if (data && data.expiresAt > now) {
        // Valid session, extend it
        data.expiresAt = now + SESSION_DURATION_MS;
        localStorage.setItem(SESSION_KEY, JSON.stringify(data));
        return data.id;
    }

    // Expired or doesn't exist, create a new one
    const newData: SessionData = {
        id: crypto.randomUUID(),
        expiresAt: now + SESSION_DURATION_MS
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(newData));
    localStorage.removeItem(OLD_SESSION_KEY); // Clean up just in case

    return newData.id;
}

/**
 * Clears the session ID, effectively resetting the customer's identity.
 * Useful if we want to force a fresh start.
 */
export function resetSession(): void {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(OLD_SESSION_KEY);
}
