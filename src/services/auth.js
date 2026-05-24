const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
const SESSION_KEY = 'admin_session';

export const login = (username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const session = {
            username,
            role: 'admin',
            loginAt: Date.now(),
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return { success: true, user: session };
    }
    return { success: false, error: 'Usuario o contraseña incorrectos.' };
};

export const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
};

export const getSession = () => {
    try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const isAuthenticated = () => getSession()?.role === 'admin';
