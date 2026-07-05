import { useEffect, useState } from 'react';

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    // older versions stored the value JSON-encoded ('"dark"'), so strip quotes
    const theme = stored?.replace(/"/g, '') ?? null;
    const dark = theme === null ? window.matchMedia('(prefers-color-scheme: dark)').matches : theme === 'dark';
    setIsDarkMode(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  };

  return { isDarkMode, toggleDarkMode };
}
