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
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg supports-[backdrop-filter]:bg-black/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-white rounded-lg p-1">
              <Image 
                src="/images/logo.png" 
                alt="Future Engineers Logo" 
                width={32} 
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Future Engineers
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200 hover:scale-105">
              Home
            </Link>
            <Link href="/browse" className="text-gray-300 hover:text-white transition-colors duration-200 hover:scale-105">
              Browse
            </Link>
            <Link href="/resources" className="text-gray-300 hover:text-white transition-colors duration-200 hover:scale-105">
              Resources
            </Link>
            <Link href="/contribute" className="text-gray-300 hover:text-white transition-colors duration-200 hover:scale-105">
              Contribute
            </Link>
            <Link href="/leaderboard" className="text-gray-300 hover:text-white transition-colors duration-200 hover:scale-105">
              Leaderboard
            </Link>
            {isAuthenticated && isAdmin && (
              <Link href="/admin" className="text-red-300 hover:text-red-200 transition-colors duration-200 hover:scale-105">
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
                <DropdownMenuContent className="w-56 bg-gray-900/95 backdrop-blur-sm border-white/10 text-white" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-3">
                    <p className="text-sm font-medium leading-none text-white">{user.displayName}</p>
                    <p className="text-xs leading-none text-gray-400">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                        {user.role}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {user.reputation} pts
                      </span>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="text-gray-300 hover:bg-white/10 hover:text-white">
                    <Link href="/profile" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:bg-white/10 hover:text-white">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  {(user.role === 'Admin' || user.role === 'Moderator') && (
                    <DropdownMenuItem className="text-gray-300 hover:bg-white/10 hover:text-white">
                      <Link href="/dashboard" className="flex items-center w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-400 hover:bg-red-500/10 hover:text-red-300">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleSignIn} className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg">
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
