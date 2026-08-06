import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'dark' | 'biotech';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-biotech');
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'biotech' : 'dark'));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
