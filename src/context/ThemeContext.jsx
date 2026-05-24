import { createContext, useContext, useEffect, useState } from 'react';

const THEME_KEY = 'admin_theme';
const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState(() => {
        if (typeof window === 'undefined') return 'admin';
        return localStorage.getItem(THEME_KEY) || 'admin';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    const toggleTheme = () => {
        setThemeState((t) => (t === 'admin' ? 'admin-dark' : 'admin'));
    };

    const isDark = theme === 'admin-dark';

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider');
    return ctx;
};
