import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all border-none cursor-pointer"
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}