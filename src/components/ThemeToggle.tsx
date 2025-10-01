'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';
import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering theme-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  // During SSR and initial render, show a neutral state
  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-9 w-9 px-0 bg-accent/50 hover:bg-accent border border-border backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:rotate-12 relative group"
        aria-label="Toggle theme"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] absolute transition-all duration-300 rotate-0 scale-100 opacity-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={cycleTheme}
      className="h-9 w-9 px-0 bg-accent/50 hover:bg-accent border border-border backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:rotate-12 relative group"
      aria-label={`Current theme: ${theme}. Click to change.`}
    >
      {/* Light Mode Icon */}
      <Sun className={`h-[1.2rem] w-[1.2rem] absolute transition-all duration-300 ${
        theme === 'light' 
          ? 'rotate-0 scale-100 opacity-100' 
          : 'rotate-90 scale-0 opacity-0'
      }`} />
      
      {/* Dark Mode Icon */}
      <Moon className={`h-[1.2rem] w-[1.2rem] absolute transition-all duration-300 ${
        theme === 'dark' 
          ? 'rotate-0 scale-100 opacity-100' 
          : '-rotate-90 scale-0 opacity-0'
      }`} />
      
      {/* System Mode Icon */}
      <Monitor className={`h-[1.2rem] w-[1.2rem] absolute transition-all duration-300 ${
        theme === 'system' 
          ? 'rotate-0 scale-100 opacity-100' 
          : 'rotate-90 scale-0 opacity-0'
      }`} />
      
      {/* Tooltip on hover */}
      <span className="sr-only">Toggle theme: {theme}</span>
    </Button>
  );
}
