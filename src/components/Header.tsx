'use client';

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
import { LogIn, User, Settings, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import toast from 'react-hot-toast';

export function Header() {
  const { signInWithGoogle, logout } = useAuth();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const { isAdmin } = useAdminStatus();

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
    <header className="bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 dark:from-slate-900/98 dark:via-purple-900/98 dark:to-slate-900/98 light:from-white/95 light:via-purple-50/95 light:to-white/95 backdrop-blur-lg border-b border-white/10 dark:border-white/10 light:border-gray-200/50 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="h-10 w-10 bg-white dark:bg-white light:bg-gradient-to-br light:from-purple-100 light:to-white rounded-lg p-1 shadow-lg group-hover:scale-105 transition-transform duration-200">
                <Image 
                  src="/images/logo.png" 
                  alt="Future Engineers Logo" 
                  width={32} 
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-200"></div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 dark:from-white dark:to-gray-300 light:from-gray-900 light:to-purple-700 bg-clip-text text-transparent">
              Future Engineers
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 dark:text-gray-300 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-purple-600 transition-all duration-200 hover:scale-105 font-medium">
              Home
            </Link>
            <Link href="/browse" className="text-gray-300 dark:text-gray-300 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-purple-600 transition-all duration-200 hover:scale-105 font-medium">
              Browse
            </Link>
            <Link href="/resources" className="text-gray-300 dark:text-gray-300 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-purple-600 transition-all duration-200 hover:scale-105 font-medium">
              Resources
            </Link>
            <Link href="/contribute" className="text-gray-300 dark:text-gray-300 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-purple-600 transition-all duration-200 hover:scale-105 font-medium">
              Contribute
            </Link>
            <Link href="/leaderboard" className="text-gray-300 dark:text-gray-300 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-purple-600 transition-all duration-200 hover:scale-105 font-medium">
              Leaderboard
            </Link>
            {isAuthenticated && isAdmin && (
              <Link href="/admin" className="text-red-300 dark:text-red-300 light:text-red-500 hover:text-red-200 dark:hover:text-red-200 light:hover:text-red-600 transition-all duration-200 hover:scale-105 font-medium">
                Admin
              </Link>
            )}
          </nav>

          {/* User Authentication & Theme Toggle */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isLoading ? (
              <div className="h-10 w-10 animate-pulse bg-white/20 rounded-full" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/10">
                    <Avatar className="h-10 w-10 border-2 border-white/20">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                        {user.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white/95 dark:bg-gray-900/95 light:bg-white/98 backdrop-blur-lg border border-gray-200 dark:border-white/10 light:border-gray-200 text-gray-900 dark:text-white light:text-gray-900 shadow-xl animate-fade-in-up" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-3">
                    <p className="text-sm font-medium leading-none text-gray-900 dark:text-white light:text-gray-900">{user.displayName}</p>
                    <p className="text-xs leading-none text-gray-600 dark:text-gray-400 light:text-gray-600">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" className="text-xs bg-purple-100 dark:bg-purple-500/20 light:bg-purple-100 text-purple-700 dark:text-purple-300 light:text-purple-700 border-purple-200 dark:border-purple-500/30 light:border-purple-200">
                        {user.role}
                      </Badge>
                      <span className="text-xs text-gray-600 dark:text-gray-400 light:text-gray-600">
                        {user.reputation} pts
                      </span>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-white/10 light:bg-gray-200" />
                  <DropdownMenuItem className="text-gray-700 dark:text-gray-300 light:text-gray-700 hover:bg-gray-100 dark:hover:bg-white/10 light:hover:bg-gray-100 hover:text-gray-900 dark:hover:text-white light:hover:text-gray-900">
                    <Link href="/profile" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-700 dark:text-gray-300 light:text-gray-700 hover:bg-gray-100 dark:hover:bg-white/10 light:hover:bg-gray-100 hover:text-gray-900 dark:hover:text-white light:hover:text-gray-900">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  {(user.role === 'Admin' || user.role === 'Moderator') && (
                    <DropdownMenuItem className="text-gray-700 dark:text-gray-300 light:text-gray-700 hover:bg-gray-100 dark:hover:bg-white/10 light:hover:bg-gray-100 hover:text-gray-900 dark:hover:text-white light:hover:text-gray-900">
                      <Link href="/dashboard" className="flex items-center w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-white/10 light:bg-gray-200" />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 dark:text-red-400 light:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 light:hover:bg-red-50 hover:text-red-700 dark:hover:text-red-300 light:hover:text-red-700">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleSignIn} className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-600 dark:to-blue-600 dark:hover:from-purple-700 dark:hover:to-blue-700 light:from-purple-600 light:to-blue-600 light:hover:from-purple-700 light:hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
