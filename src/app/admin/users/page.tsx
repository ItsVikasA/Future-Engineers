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
  Trash2,
  GraduationCap,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isAdmin?: boolean;
  college?: string;
  course?: string;
  semester?: string;
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
  const [collegeFilter, setCollegeFilter] = useState<'all' | 'bgmit' | 'others'>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [semesterFilter, setSemesterFilter] = useState<string>('all');

  // Helper function to check if user is from BGMIT
  const isBGMITStudent = (college?: string): boolean => {
    if (!college) return false;
    
    const bgmitVariants = [
      'biluru gurubasva mahaswamiji institute of technology',
      'biluru gurubasva mahaswamiji institute of technoly',
      'bgmit',
      'b.g.m.i.t',
      'mudhol',
      'bagalkot',
      'bagalakot'
    ];
    
    const collegeLower = college.toLowerCase();
    return bgmitVariants.some(variant => collegeLower.includes(variant));
  };

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

  const filteredUsers = users.filter(u => {
    // Search filter
    const matchesSearch = u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.displayName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // College filter
    let matchesCollege = true;
    if (collegeFilter === 'bgmit') {
      matchesCollege = isBGMITStudent(u.college);
    } else if (collegeFilter === 'others') {
      matchesCollege = !isBGMITStudent(u.college);
    }
    
    // Branch filter (only for BGMIT students)
    let matchesBranch = true;
    if (collegeFilter === 'bgmit' && branchFilter !== 'all' && u.course) {
      matchesBranch = u.course.toLowerCase().includes(branchFilter.toLowerCase());
    }
    
    // Semester filter (only for BGMIT students)
    let matchesSemester = true;
    if (collegeFilter === 'bgmit' && semesterFilter !== 'all' && u.semester) {
      matchesSemester = u.semester === semesterFilter;
    }
    
    return matchesSearch && matchesCollege && matchesBranch && matchesSemester;
  });

  // Separate BGMIT students
  const bgmitStudents = users.filter(u => isBGMITStudent(u.college));
  const otherStudents = users.filter(u => !isBGMITStudent(u.college));
  
  // Predefined branches for BGMIT
  const allBranches = [
    'Computer Science and Engineering',
    'Electronics and Communication Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical and Electronics Engineering',
    'Information Science and Engineering'
  ];
  
  // Predefined semesters (1-8)
  const allSemesters = ['1', '2', '3', '4', '5', '6', '7', '8'];
  
  // Get branches that have at least one student (for display purposes)
  const activeBranches = Array.from(new Set(bgmitStudents.map(u => u.course).filter(Boolean))) as string[];
  const activeSemesters = Array.from(new Set(bgmitStudents.map(u => u.semester).filter(Boolean))).sort() as string[];
  
  // Combine predefined + active branches (remove duplicates)
  const uniqueBranches = [...new Set([...allBranches, ...activeBranches])];
  const uniqueSemesters = allSemesters;

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
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/admin')}
              className="border-border w-fit"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                User Management
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">Manage user accounts, roles, and permissions</p>
            </div>
          </div>

          {/* Search and Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="lg:col-span-3">
              <Card className="bg-card border-border">
                <CardContent className="p-3 sm:p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users by email or name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background border-border text-sm sm:text-base"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-card border-border">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-foreground">{users.length}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Total Users</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{bgmitStudents.length}</div>
                <div className="text-xs sm:text-sm text-blue-600 font-medium flex items-center justify-center gap-1">
                  <GraduationCap className="h-3 w-3" />
                  BGMIT Students
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={collegeFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setCollegeFilter('all');
                setBranchFilter('all');
                setSemesterFilter('all');
              }}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              All Users ({users.length})
            </Button>
            <Button
              variant={collegeFilter === 'bgmit' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setCollegeFilter('bgmit');
                setBranchFilter('all');
                setSemesterFilter('all');
              }}
              className="flex items-center gap-2"
            >
              <GraduationCap className="h-4 w-4" />
              BGMIT Students ({bgmitStudents.length})
            </Button>
            <Button
              variant={collegeFilter === 'others' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setCollegeFilter('others');
                setBranchFilter('all');
                setSemesterFilter('all');
              }}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Other Colleges ({otherStudents.length})
            </Button>
          </div>

          {/* BGMIT Branch and Semester Filters */}
          {collegeFilter === 'bgmit' && (
            <div className="mb-6">
              <Card className="bg-blue-500/5 border-blue-500/20">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Branch Dropdown */}
                    <div>
                      <label htmlFor="branch-filter" className="text-sm font-medium text-foreground mb-2 block">
                        <GraduationCap className="h-4 w-4 inline mr-1" />
                        Filter by Branch
                      </label>
                      <select
                        id="branch-filter"
                        value={branchFilter}
                        onChange={(e) => setBranchFilter(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="all">All Branches ({bgmitStudents.length})</option>
                        {uniqueBranches.map((branch) => {
                          const count = bgmitStudents.filter(u => u.course === branch).length;
                          return (
                            <option key={branch} value={branch}>
                              {branch} {count > 0 ? `(${count})` : ''}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* Semester Dropdown */}
                    <div>
                      <label htmlFor="semester-filter" className="text-sm font-medium text-foreground mb-2 block">
                        <Filter className="h-4 w-4 inline mr-1" />
                        Filter by Semester
                      </label>
                      <select
                        id="semester-filter"
                        value={semesterFilter}
                        onChange={(e) => setSemesterFilter(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="all">All Semesters ({bgmitStudents.length})</option>
                        {uniqueSemesters.map((semester) => {
                          const count = bgmitStudents.filter(u => u.semester === semester).length;
                          return (
                            <option key={semester} value={semester}>
                              Semester {semester} {count > 0 ? `(${count})` : ''}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  {/* Active Filters Display */}
                  {(branchFilter !== 'all' || semesterFilter !== 'all') && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted-foreground">Active filters:</span>
                      {branchFilter !== 'all' && (
                        <Badge variant="secondary" className="text-xs">
                          Branch: {branchFilter}
                        </Badge>
                      )}
                      {semesterFilter !== 'all' && (
                        <Badge variant="secondary" className="text-xs">
                          Semester: {semesterFilter}
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setBranchFilter('all');
                          setSemesterFilter('all');
                        }}
                        className="text-xs h-6 px-2"
                      >
                        Clear all
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Users List */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                {collegeFilter === 'all' && 'All Users'}
                {collegeFilter === 'bgmit' && (
                  <>
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    BGMIT Students
                  </>
                )}
                {collegeFilter === 'others' && 'Other Colleges'}
              </CardTitle>
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
                <div className="space-y-3 sm:space-y-4">
                  {filteredUsers.map((userData) => (
                    <div key={userData.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                          <AvatarImage src={userData.photoURL} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm sm:text-base">
                            {userData.displayName?.charAt(0) || userData.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
                              {userData.displayName || 'No Name'}
                            </h3>
                            {userData.isAdmin && (
                              <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30 text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Admin
                              </Badge>
                            )}
                            {isBGMITStudent(userData.college) && (
                              <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30 text-xs">
                                <GraduationCap className="h-3 w-3 mr-1" />
                                BGMIT
                              </Badge>
                            )}
                            {isBGMITStudent(userData.college) && userData.course && (
                              <Badge variant="outline" className="text-xs">
                                {userData.course}
                              </Badge>
                            )}
                            {isBGMITStudent(userData.college) && userData.semester && (
                              <Badge variant="outline" className="text-xs">
                                Sem {userData.semester}
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                            <span className="flex items-center gap-1 truncate">
                              <Mail className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{userData.email}</span>
                            </span>
                            {userData.college && (
                              <span className="flex items-center gap-1 truncate">
                                <GraduationCap className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{isBGMITStudent(userData.college) ? 'BGMIT' : userData.college}</span>
                              </span>
                            )}
                            {userData.createdAt && (
                              <span className="flex items-center gap-1 whitespace-nowrap">
                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                Joined {new Date(userData.createdAt.toDate()).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        {!userData.isAdmin ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMakeAdmin(userData.id, userData.email)}
                            className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white text-xs sm:text-sm flex-1 sm:flex-initial"
                          >
                            <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="hidden sm:inline">Make Admin</span>
                            <span className="sm:hidden">Admin</span>
                          </Button>
                        ) : userData.id !== user?.email && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveAdmin(userData.id, userData.email)}
                            className="border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white text-xs sm:text-sm flex-1 sm:flex-initial"
                          >
                            <UserX className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="hidden sm:inline">Remove Admin</span>
                            <span className="sm:hidden">Remove</span>
                          </Button>
                        )}
                        
                        {userData.id !== user?.email && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(userData.id, userData.email)}
                            className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                            title="Delete User"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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
