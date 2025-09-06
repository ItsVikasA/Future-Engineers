'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 w-9 px-0 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all duration-200"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-white" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-white" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl backdrop-blur-xl bg-opacity-95 dark:bg-opacity-95"
      >
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${
            theme === 'light' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
          }`}
        >
          <Sun className="mr-3 h-4 w-4" />
          <span className="font-medium">Light</span>
          {theme === 'light' && (
            <div className="ml-auto h-2 w-2 rounded-full bg-blue-500"></div>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${
            theme === 'dark' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
          }`}
        >
          <Moon className="mr-3 h-4 w-4" />
          <span className="font-medium">Dark</span>
          {theme === 'dark' && (
            <div className="ml-auto h-2 w-2 rounded-full bg-blue-500"></div>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${
            theme === 'system' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''
          }`}
        >
          <Monitor className="mr-3 h-4 w-4" />
          <span className="font-medium">System</span>
          {theme === 'system' && (
            <div className="ml-auto h-2 w-2 rounded-full bg-blue-500"></div>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
