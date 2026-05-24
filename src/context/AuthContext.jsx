import { createContext, useContext, useState, useEffect } from 'react';
import { login as authLogin, logout as authLogout, getSession } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setUser(getSession());
        setLoading(false);
    }, []);

    const login = (username, password) => {
        const result = authLogin(username, password);
        if (result.success) {
            setUser(result.user);
        }
        return result;
    };

    const logout = () => {
        authLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};
