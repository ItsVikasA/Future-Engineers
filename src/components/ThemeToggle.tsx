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
          className="h-9 w-9 px-0 bg-accent/50 hover:bg-accent border border-border backdrop-blur-sm transition-all duration-200"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-popover border border-border shadow-xl backdrop-blur-xl"
      >
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className={`cursor-pointer hover:bg-accent transition-colors ${
            theme === 'light' ? 'bg-primary/10 text-primary' : ''
          }`}
        >
          <Sun className="mr-3 h-4 w-4" />
          <span className="font-medium">Light</span>
          {theme === 'light' && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary"></div>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className={`cursor-pointer hover:bg-accent transition-colors ${
            theme === 'dark' ? 'bg-primary/10 text-primary' : ''
          }`}
        >
          <Moon className="mr-3 h-4 w-4" />
          <span className="font-medium">Dark</span>
          {theme === 'dark' && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary"></div>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className={`cursor-pointer hover:bg-accent transition-colors ${
            theme === 'system' ? 'bg-primary/10 text-primary' : ''
          }`}
        >
          <Monitor className="mr-3 h-4 w-4" />
          <span className="font-medium">System</span>
          {theme === 'system' && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary"></div>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
