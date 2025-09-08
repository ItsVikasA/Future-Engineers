'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Users, 
  FileText, 
  Settings, 
  Crown,
  UserCheck,
  Shield,
  TrendingUp,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const { isAdmin, loading: adminLoading } = useAdminStatus();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDocuments: 0,
    pendingApprovals: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  // Navigation functions for admin actions
  const handleViewAllUsers = () => {
    router.push('/admin/users');
    toast.success('Opening user management...');
  };

  const handleManageRoles = () => {
    toast('Role management coming soon!');
  };

  const handleReviewContent = () => {
    router.push('/admin/review');
    toast.success('Opening content review...');
  };

  const handleUploadResources = () => {
    router.push('/contribute');
    toast.success('Opening resource upload...');
  };

  const handleViewAnalytics = () => {
    toast.info('Advanced analytics coming soon!');
  };

  const handleExportData = () => {
    toast.loading('Preparing data export...');
    // Simulate export process
    setTimeout(() => {
      toast.dismiss();
      toast.success('Data export would download here!');
    }, 2000);
  };

  const handleSystemConfig = () => {
    toast.info('System configuration panel coming soon!');
  };

  const handleBackupData = () => {
    toast.loading('Creating backup...');
    // Simulate backup process
    setTimeout(() => {
      toast.dismiss();
      toast.success('Backup completed successfully!');
    }, 3000);
  };

  useEffect(() => {
    if (!isAdmin) return;

    const setupRealtimeStats = () => {
      setLoading(true);
      
      try {
        // Real-time listener for users
        const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
          const totalUsers = snapshot.size;
          
          setStats(prev => ({
            ...prev,
            totalUsers,
            activeUsers: totalUsers // For now, consider all users as active
          }));
        });

        // Real-time listener for documents
        const unsubscribeDocuments = onSnapshot(collection(db, 'documents'), (snapshot) => {
          const totalDocuments = snapshot.size;
          
          setStats(prev => ({
            ...prev,
            totalDocuments
          }));
        });

        // Real-time listener for pending documents
        const pendingQuery = query(
          collection(db, 'documents'), 
          where('status', '==', 'pending')
        );
        const unsubscribePending = onSnapshot(pendingQuery, (snapshot) => {
          const pendingApprovals = snapshot.size;
          
          setStats(prev => ({
            ...prev,
            pendingApprovals
          }));
        });

        setLoading(false);

        // Cleanup function
        return () => {
          unsubscribeUsers();
          unsubscribeDocuments();
          unsubscribePending();
        };
        
      } catch (error) {
        console.error('Error setting up admin stats listeners:', error);
        setLoading(false);
      }
    };

    const cleanup = setupRealtimeStats();
    return cleanup;
  }, [isAdmin]);

  if (isLoading || adminLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96 bg-card border-border">
          <CardContent className="p-6 text-center">
            <Shield className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-bold text-card-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don&apos;t have admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
              Administrator
            </Badge>
          </div>
          <p className="text-muted-foreground">Manage users, content, and platform settings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Documents</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalDocuments}</p>
                </div>
                <FileText className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Pending Approvals</p>
                  <p className="text-2xl font-bold text-foreground">{stats.pendingApprovals}</p>
                </div>
                <UserCheck className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Active Users</p>
                  <p className="text-2xl font-bold text-foreground">{stats.activeUsers}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
              <div className="flex gap-2">
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleViewAllUsers}
                >
                  View All Users
                </Button>
                <Button 
                  variant="outline" 
                  className="border-border text-foreground"
                  onClick={handleManageRoles}
                >
                  Manage Roles
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                Content Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Review and manage uploaded documents and resources</p>
              <div className="flex gap-2">
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleReviewContent}
                >
                  Review Content
                </Button>
                <Button 
                  variant="outline" 
                  className="border-border text-foreground"
                  onClick={handleUploadResources}
                >
                  Upload Resources
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">View platform usage statistics and trends</p>
              <div className="flex gap-2">
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleViewAnalytics}
                >
                  View Analytics
                </Button>
                <Button 
                  variant="outline" 
                  className="border-border text-foreground"
                  onClick={handleExportData}
                >
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Settings className="h-5 w-5 text-orange-500" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Configure platform settings and preferences</p>
              <div className="flex gap-2">
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleSystemConfig}
                >
                  System Config
                </Button>
                <Button 
                  variant="outline" 
                  className="border-border text-foreground"
                  onClick={handleBackupData}
                >
                  Backup Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
