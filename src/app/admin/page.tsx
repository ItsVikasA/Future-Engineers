'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const { isAdmin, loading: adminLoading } = useAdminStatus();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDocuments: 0,
    pendingApprovals: 0,
    activeUsers: 0
  });

  useEffect(() => {
    // Simulate loading stats - replace with actual Firebase queries
    setStats({
      totalUsers: 150,
      totalDocuments: 45,
      pendingApprovals: 3,
      activeUsers: 28
    });
  }, []);

  if (isLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="w-96 bg-slate-800/50 border-slate-700">
          <CardContent className="p-6 text-center">
            <Shield className="h-16 w-16 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400">You don&apos;t have admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="h-8 w-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
              Administrator
            </Badge>
          </div>
          <p className="text-gray-400">Manage users, content, and platform settings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Documents</p>
                  <p className="text-2xl font-bold text-white">{stats.totalDocuments}</p>
                </div>
                <FileText className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending Approvals</p>
                  <p className="text-2xl font-bold text-white">{stats.pendingApprovals}</p>
                </div>
                <UserCheck className="h-8 w-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Users</p>
                  <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400">Manage user accounts, roles, and permissions</p>
              <div className="flex gap-2">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  View All Users
                </Button>
                <Button variant="outline" className="border-slate-600 text-gray-300">
                  Manage Roles
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-400" />
                Content Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400">Review and manage uploaded documents and resources</p>
              <div className="flex gap-2">
                <Button className="bg-green-600 hover:bg-green-700">
                  Review Content
                </Button>
                <Button variant="outline" className="border-slate-600 text-gray-300">
                  Upload Resources
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400">View platform usage statistics and trends</p>
              <div className="flex gap-2">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  View Analytics
                </Button>
                <Button variant="outline" className="border-slate-600 text-gray-300">
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-orange-400" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400">Configure platform settings and preferences</p>
              <div className="flex gap-2">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  System Config
                </Button>
                <Button variant="outline" className="border-slate-600 text-gray-300">
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
