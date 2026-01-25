import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ease-in-out"
      style={{
        backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
        borderColor: isDark ? '#334155' : '#cbd5e1',
      }}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      aria-label={`Toggle ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* Background gradient overlay */}
      <div
        className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #334155 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%)',
          opacity: 0.5,
        }}
      />

      {/* Icon container with animation */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <div
          className="absolute inset-0 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center"
          style={{
            opacity: isDark ? 0 : 1,
            transform: isDark ? 'rotate(180deg) scale(0.5)' : 'rotate(0deg) scale(1)',
          }}
        >
          <Sun
            className="w-5 h-5 transition-colors duration-300"
            style={{ color: '#f59e0b' }}
          />
        </div>

        <div
          className="absolute inset-0 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center"
          style={{
            opacity: isDark ? 1 : 0,
            transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(-180deg) scale(0.5)',
          }}
        >
          <Moon
            className="w-5 h-5 transition-colors duration-300"
            style={{ color: '#60a5fa' }}
          />
        </div>
      </div>

      {/* Hover effect */}
      <div
        className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(100, 116, 139, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(15, 23, 42, 0.05) 0%, transparent 70%)',
        }}
      />
    </button>
  );
};

export default ThemeToggle;
