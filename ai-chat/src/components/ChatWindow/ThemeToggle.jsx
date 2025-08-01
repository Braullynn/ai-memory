import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button
      className="theme-toggle"
      onClick={() => setTheme(theme === 'day' ? 'night' : 'day')}
    >
      {theme === 'day' ? '🌙' : '☀️'}
    </button>
  );
}