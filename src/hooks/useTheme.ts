import { useState } from 'react';

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(() => checkIsDarkMode());

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  };

  return { isDarkMode, toggleDarkMode };
}

function checkIsDarkMode() {
  const stored = localStorage.getItem('theme');
  const theme = stored?.replace(/"/g, '') ?? null;
  const dark = theme === null ? window.matchMedia('(prefers-color-scheme: dark)').matches : theme === 'dark';

  // they wont forgive me for this but it works (smh my h)
  document.documentElement.classList.toggle('dark', dark);

  return dark;
}
