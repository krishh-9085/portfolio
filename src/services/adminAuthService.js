const ADMIN_CREDENTIALS_KEY = 'portfolio_admin_credentials_v1';
const ADMIN_SESSION_KEY = 'portfolio_admin_session_v1';
const ADMIN_AUTH_EVENT = 'portfolio-admin-auth-updated';

const canUseStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
const isSha256Hex = (value) => /^[a-f0-9]{64}$/i.test(String(value || '').trim());

const getEnvCredentials = () => {
    const email = process.env.REACT_APP_ADMIN_EMAIL;
    const passwordHash = process.env.REACT_APP_ADMIN_PASSWORD_HASH;

    if (email && passwordHash) {
        return {
            email: String(email).trim().toLowerCase(),
            passwordHash: String(passwordHash).trim(),
            source: 'env'
        };
    }

    return null;
};

const readLocalCredentials = () => {
    if (!canUseStorage) {
        return null;
    }

    const raw = window.localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    if (!raw) {
        return null;
    }

    try {
        const parsed = JSON.parse(raw);
        const storedEmail = parsed?.email || parsed?.username;
        if (!storedEmail || !parsed?.passwordHash) {
            return null;
        }

        return {
            email: String(storedEmail).trim().toLowerCase(),
            passwordHash: String(parsed.passwordHash),
            source: 'local'
        };
    } catch {
        return null;
    }
};

const getActiveCredentials = () => getEnvCredentials() || readLocalCredentials();

const emitAuthChange = () => {
    if (!canUseStorage) {
        return;
    }

    window.dispatchEvent(new CustomEvent(ADMIN_AUTH_EVENT));
};

const writeSession = (email) => {
    if (!canUseStorage) {
        return;
    }

    window.localStorage.setItem(
        ADMIN_SESSION_KEY,
        JSON.stringify({ email, loggedInAt: Date.now() })
    );
};

const clearSession = () => {
    if (!canUseStorage) {
        return;
    }

    window.localStorage.removeItem(ADMIN_SESSION_KEY);
};

const readSession = () => {
    if (!canUseStorage) {
        return null;
    }

    const raw = window.localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) {
        return null;
    }

    try {
        const parsed = JSON.parse(raw);
        const sessionEmail = parsed?.email || parsed?.username;
        if (!sessionEmail) {
            return null;
        }

        return {
            email: String(sessionEmail).trim().toLowerCase(),
            loggedInAt: Number(parsed.loggedInAt || 0)
        };
    } catch {
        return null;
    }
};

const toHex = (buffer) =>
    Array.from(new Uint8Array(buffer))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');

const hashPassword = async (value) => {
    const normalizedValue = String(value || '');

    if (typeof crypto !== 'undefined' && crypto.subtle) {
        const buffer = await crypto.subtle.digest(
            'SHA-256',
            new TextEncoder().encode(normalizedValue)
        );
        return toHex(buffer);
    }

    return normalizedValue;
};

export const hasAdminCredentials = () => Boolean(getActiveCredentials());

export const isAdminAuthenticated = () => {
    const credentials = getActiveCredentials();
    const session = readSession();

    if (!credentials || !session) {
        return false;
    }

    return session.email === credentials.email;
};

export const getAdminAuthState = () => ({
    isConfigured: hasAdminCredentials(),
    isAuthenticated: isAdminAuthenticated(),
    email: isAdminAuthenticated() ? readSession()?.email || '' : ''
});

export const loginAdmin = async ({ email, password }) => {
    const credentials = getActiveCredentials();
    if (!credentials) {
        throw new Error('Admin is not configured yet.');
    }

    const normalizedEmail = String(email || '').trim().toLowerCase();
    const rawPassword = String(password || '');
    const inputHash = await hashPassword(rawPassword);

    const passwordMatches = isSha256Hex(credentials.passwordHash)
        ? inputHash === credentials.passwordHash.toLowerCase()
        : rawPassword === credentials.passwordHash;

    if (
        normalizedEmail !== credentials.email ||
        !passwordMatches
    ) {
        throw new Error('Invalid email or password.');
    }

    writeSession(credentials.email);
    emitAuthChange();
};

export const logoutAdmin = () => {
    clearSession();
    emitAuthChange();
};

export const subscribeToAdminAuth = (onData) => {
    const emit = () => {
        onData(getAdminAuthState());
    };

    emit();

    if (!canUseStorage) {
        return () => { };
    }

    const handleStorage = (event) => {
        if (
            event.key === ADMIN_CREDENTIALS_KEY ||
            event.key === ADMIN_SESSION_KEY ||
            event.key === null
        ) {
            emit();
        }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(ADMIN_AUTH_EVENT, emit);

    return () => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener(ADMIN_AUTH_EVENT, emit);
    };
};
