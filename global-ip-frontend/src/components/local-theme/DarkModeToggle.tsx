import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface Props {
  isDark: boolean;
  onToggle: () => void;
}

export const DarkModeToggle: React.FC<Props> = ({ isDark, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      title={isDark ? 'Switch to light' : 'Switch to dark'}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700"
    >
      {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
      <span className="text-sm">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
};

export default DarkModeToggle;
