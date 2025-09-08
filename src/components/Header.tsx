'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/features/auth/AuthProvider';
import { useAuthStore } from '@/stores/authStore';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { LogIn, User, Settings, LogOut, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import toast from 'react-hot-toast';

export function Header() {
  const { signInWithGoogle, logout } = useAuth();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const { isAdmin } = useAdminStatus();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignIn = async () => {
    try {
      const loadingToast = toast.loading('Signing you in...');
      await signInWithGoogle();
      toast.dismiss(loadingToast);
      toast.success('🎉 Welcome! You\'re now signed in!', {
        duration: 4000,
      });
    } catch (error: unknown) {
      console.error('Failed to sign in:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
      toast.error(`❌ Sign-in failed: ${errorMessage}`, {
        duration: 5000,
      });
    }
  };

  const handleSignOut = async () => {
    try {
      const loadingToast = toast.loading('Signing you out...');
      await logout();
      toast.dismiss(loadingToast);
      toast.success('👋 Successfully signed out!', {
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to sign out:', error);
      toast.error('❌ Failed to sign out. Please try again.', {
        duration: 4000,
      });
    }
  };

  return (
    <header className="bg-card/95 backdrop-blur-lg border-b border-border sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="h-8 w-8 md:h-10 md:w-10 bg-background rounded-lg p-1 shadow-lg group-hover:scale-105 transition-transform duration-200 border border-border">
                <Image 
                  src="/images/logo.png" 
                  alt="Future Engineers Logo" 
                  width={32} 
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-200"></div>
            </div>
            <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Future Engineers
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 font-medium">
              Home
            </Link>
            <Link href="/browse" className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 font-medium">
              Browse
            </Link>
            <Link href="/resources" className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 font-medium">
              Resources
            </Link>
            <Link href="/contribute" className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 font-medium">
              Contribute
            </Link>
            <Link href="/leaderboard" className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105 font-medium">
              Leaderboard
            </Link>
            {isAuthenticated && isAdmin && (
              <Link href="/admin" className="text-destructive hover:text-destructive/80 transition-all duration-200 hover:scale-105 font-medium">
                Admin
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button & User Auth */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <ThemeToggle />
            
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            {isLoading ? (
              <div className="h-10 w-10 animate-pulse bg-muted rounded-full" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-accent">
                    <Avatar className="h-10 w-10 border-2 border-border">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                        {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-popover backdrop-blur-lg border border-border text-popover-foreground shadow-xl animate-fade-in-up" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-3">
                    <p className="text-sm font-medium leading-none text-foreground">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {user.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {user.reputation} pts
                      </span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  {(user.role === 'Admin' || user.role === 'Moderator') && (
                    <DropdownMenuItem>
                      <Link href="/dashboard" className="flex items-center w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive hover:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleSignIn} className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border mt-4 pt-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/browse" 
                className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse
              </Link>
              <Link 
                href="/resources" 
                className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Resources
              </Link>
              <Link 
                href="/contribute" 
                className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contribute
              </Link>
              <Link 
                href="/leaderboard" 
                className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Leaderboard
              </Link>
              {isAuthenticated && isAdmin && (
                <Link 
                  href="/admin" 
                  className="text-destructive hover:text-destructive/80 transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              {!isAuthenticated && (
                <Button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSignIn();
                  }} 
                  className="flex items-center justify-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 mt-4"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
