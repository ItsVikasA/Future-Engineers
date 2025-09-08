'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/authStore';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  ArrowLeft,
  Search,
  Users, 
  Shield,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isAdmin?: boolean;
  createdAt?: { toDate: () => Date };
  lastLoginAt?: { toDate: () => Date };
  profileCompletion?: number;
}

export default function UserManagement() {
  const { user, isAuthenticated } = useAuthStore();
  const isAdmin = useAdminStatus();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin');
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      
      setUsers(usersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin, router]);

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMakeAdmin = async (userId: string, userEmail: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isAdmin: true
      });
      toast.success(`${userEmail} is now an admin`);
    } catch {
      toast.error('Failed to update user role');
    }
  };

  const handleRemoveAdmin = async (userId: string, userEmail: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isAdmin: false
      });
      toast.success(`Removed admin role from ${userEmail}`);
    } catch {
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    if (userId === user?.email) {
      toast.error("You cannot delete your own account");
      return;
    }

    if (confirm(`Are you sure you want to delete user ${userEmail}?`)) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        toast.success(`User ${userEmail} deleted successfully`);
      } catch {
        toast.error('Failed to delete user');
      }
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Admin access required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/admin')}
              className="border-border"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Users className="h-8 w-8 text-blue-500" />
                User Management
              </h1>
              <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
            </div>
          </div>

          {/* Search and Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-3">
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users by email or name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background border-border"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{users.length}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </CardContent>
            </Card>
          </div>

          {/* Users List */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">All Users</CardTitle>
              <CardDescription>
                {filteredUsers.length} of {users.length} users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">Loading users...</div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Users Found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No users match your search criteria.' : 'No users registered yet.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((userData) => (
                    <div key={userData.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={userData.photoURL} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {userData.displayName?.charAt(0) || userData.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">
                              {userData.displayName || 'No Name'}
                            </h3>
                            {userData.isAdmin && (
                              <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
                                <Shield className="h-3 w-3 mr-1" />
                                Admin
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {userData.email}
                            </span>
                            {userData.createdAt && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Joined {new Date(userData.createdAt.toDate()).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!userData.isAdmin ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMakeAdmin(userData.id, userData.email)}
                            className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Make Admin
                          </Button>
                        ) : userData.id !== user?.email && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveAdmin(userData.id, userData.email)}
                            className="border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white"
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Remove Admin
                          </Button>
                        )}
                        
                        {userData.id !== user?.email && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(userData.id, userData.email)}
                            className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
