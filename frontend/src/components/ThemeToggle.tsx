import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useStore } from '../hooks/useStore';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
};

export default ThemeToggle;
