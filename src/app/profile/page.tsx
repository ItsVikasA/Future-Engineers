'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/authStore';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { collection, query, where, onSnapshot, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Eye, 
  Download, 
  Mail, 
  Calendar, 
  FileText, 
  Award, 
  Clock, 
  Trash2,
  Edit3,
  MapPin,
  GraduationCap,
  TrendingUp,
  Users,
  Settings,
  Shield,
  Crown,
  Linkedin,
  Github,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Document {
  id: string;
  title: string;
  description: string;
  subject: string;
  university: string;
  course: string;
  semester: string;
  documentType: string;
  uploadedBy: string;
  uploaderName: string;
  uploaderEmail: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: { toDate(): Date } | Date;
  views: number;
  downloads: number;
}

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore();
  const { isAdmin } = useAdminStatus();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    photoURL: '',
    bio: '',
    university: '',
    course: '',
    semester: '',
    location: '',
    joinedAt: new Date(),
    reputation: 0,
    uploads: 0,
    downloads: 0,
    role: 'Student',
    socialMedia: {
      linkedin: '',
      github: '',
      portfolio: ''
    }
  });

  // Helper function to handle Firestore timestamp conversion
  const getDateFromTimestamp = (timestamp: { toDate(): Date } | Date): Date => {
    if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    return timestamp as Date;
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  // Load profile data from Firebase
  useEffect(() => {
    if (!user?.email) return;

    const loadProfileData = async () => {
      try {
        const userDocRef = doc(db, 'users', user.email);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfileData(prev => ({
            ...prev,
            displayName: user.displayName || userData.displayName || 'Anonymous User',
            email: user.email || '',
            photoURL: user.photoURL || userData.photoURL || '',
            bio: userData.bio || 'Engineering student passionate about learning and sharing knowledge.',
            university: userData.university || '',
            course: userData.course || '',
            semester: userData.semester || '',
            location: userData.location || 'India',
            joinedAt: userData.createdAt ? userData.createdAt.toDate() : new Date(),
            reputation: isAdmin ? 9999 : (userData.reputation || 0),
            role: isAdmin ? 'Admin' : 'Student',
            socialMedia: {
              linkedin: userData.socialMedia?.linkedin || userData.linkedin || '',
              github: userData.socialMedia?.github || userData.github || '',
              portfolio: userData.socialMedia?.portfolio || userData.portfolio || ''
            }
          }));
        } else {
          // Set default values if no profile exists
          setProfileData(prev => ({
            ...prev,
            displayName: user.displayName || 'Anonymous User',
            email: user.email || '',
            photoURL: user.photoURL || '',
            bio: 'Engineering student passionate about learning and sharing knowledge.',
            reputation: isAdmin ? 9999 : 0,
            role: isAdmin ? 'Admin' : 'Student'
          }));
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
        // Set basic user data on error
        setProfileData(prev => ({
          ...prev,
          displayName: user.displayName || 'Anonymous User',
          email: user.email || '',
          photoURL: user.photoURL || '',
          role: isAdmin ? 'Admin' : 'Student'
        }));
      }
    };

    loadProfileData();
  }, [user, isAdmin]);

  // Fetch user's documents and calculate stats
  useEffect(() => {
    if (!user) return;

    // Remove orderBy to avoid composite index requirement  
    const documentsQuery = query(
      collection(db, 'documents'),
      where('uploadedBy', '==', user.email)
    );

    const unsubscribe = onSnapshot(documentsQuery, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Document[];
      
      // Sort client-side by uploadedAt descending
      docs.sort((a, b) => {
        const dateA = getDateFromTimestamp(a.uploadedAt);
        const dateB = getDateFromTimestamp(b.uploadedAt);
        return dateB.getTime() - dateA.getTime();
      });
      
      setDocuments(docs);
      
      // Update profile stats
      const approvedDocs = docs.filter(doc => doc.status === 'approved');
      const totalDownloads = docs.reduce((sum, doc) => sum + (doc.downloads || 0), 0);
      
      setProfileData(prev => ({
        ...prev,
        uploads: approvedDocs.length,
        downloads: totalDownloads
      }));
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Delete document function
  const handleDeleteDocument = async (docId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await deleteDoc(doc(db, 'documents', docId));
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  // Filter documents based on search and status
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.course.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: documents.length,
    pending: documents.filter(doc => doc.status === 'pending').length,
    approved: documents.filter(doc => doc.status === 'approved').length,
    rejected: documents.filter(doc => doc.status === 'rejected').length,
    totalViews: documents.reduce((sum, doc) => sum + (doc.views || 0), 0),
    totalDownloads: documents.reduce((sum, doc) => sum + (doc.downloads || 0), 0),
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header with Role Distinction */}
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-gray-200 dark:border-gray-600 mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8">
                {/* Profile Picture and Basic Info */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 w-full">
                  <div className="relative">
                    <Avatar className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 border-4 border-purple-500/30">
                      <AvatarImage src={profileData.photoURL} alt={profileData.displayName} />
                      <AvatarFallback className="text-2xl sm:text-3xl bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                        {profileData.displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isAdmin && (
                      <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1 sm:p-2">
                        <Crown className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 w-full text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white truncate">{profileData.displayName}</h1>
                      <div className="flex justify-center sm:justify-start">
                        {isAdmin ? (
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 flex items-center gap-1 text-xs sm:text-sm">
                            <Shield className="h-3 w-3" />
                            Administrator
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-primary text-primary text-xs sm:text-sm">
                            <GraduationCap className="h-3 w-3 mr-1" />
                            Student
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-700 dark:text-gray-200 gap-2 justify-center sm:justify-start">
                      <Mail className="h-4 w-4" />
                      {profileData.email}
                    </div>
                    
                    {profileData.location && (
                      <div className="flex items-center text-gray-700 dark:text-gray-200 gap-2 justify-center sm:justify-start">
                        <MapPin className="h-4 w-4" />
                        {profileData.location}
                      </div>
                    )}
                    
                    <div className="flex items-center text-gray-600 dark:text-gray-300 gap-2 justify-center sm:justify-start">
                      <Calendar className="h-4 w-4" />
                      Member since {profileData.joinedAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex-1 lg:flex lg:justify-end w-full">
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Link href="/profile/edit" className="w-full sm:w-auto">
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 w-full justify-center">
                        <Edit3 className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="w-full sm:w-auto">
                        <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black flex items-center gap-2 w-full justify-center">
                          <Settings className="h-4 w-4" />
                          Admin Panel
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              {profileData.bio && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-800 dark:text-gray-100 text-sm sm:text-base md:text-lg leading-relaxed font-medium break-words">{profileData.bio}</p>
                </div>
              )}

              {/* Academic Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profileData.university && (
                    <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                      <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <span className="text-sm font-medium">{profileData.university}</span>
                    </div>
                  )}
                  {profileData.course && (
                    <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <span className="text-sm font-medium">{profileData.course}</span>
                    </div>
                  )}
                  {profileData.semester && (
                    <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                      <Clock className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-sm font-medium">Semester {profileData.semester}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Media Links */}
              {(profileData.socialMedia.linkedin || profileData.socialMedia.github || profileData.socialMedia.portfolio) && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connect with me</h3>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {profileData.socialMedia.linkedin && (
                      <a
                        href={profileData.socialMedia.linkedin.startsWith('http') ? profileData.socialMedia.linkedin : `https://${profileData.socialMedia.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors text-sm font-medium"
                      >
                        <Linkedin className="h-4 w-4" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {profileData.socialMedia.github && (
                      <a
                        href={profileData.socialMedia.github.startsWith('http') ? profileData.socialMedia.github : `https://${profileData.socialMedia.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-900 rounded-lg text-white transition-colors text-sm font-medium"
                      >
                        <Github className="h-4 w-4" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {profileData.socialMedia.portfolio && (
                      <a
                        href={profileData.socialMedia.portfolio.startsWith('http') ? profileData.socialMedia.portfolio : `https://${profileData.socialMedia.portfolio}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors text-sm font-medium"
                      >
                        <Globe className="h-4 w-4" />
                        <span>Portfolio</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Stats Section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 mb-8">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <CardContent className="p-3 sm:p-4 md:p-6 text-center">
                <Award className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-yellow-600 dark:text-yellow-400" />
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{profileData.reputation}</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Reputation</div>
                {isAdmin && <Badge className="mt-1 sm:mt-2 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 text-xs">MAX</Badge>}
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <CardContent className="p-3 sm:p-4 md:p-6 text-center">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-blue-600 dark:text-blue-400" />
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Total Uploads</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <CardContent className="p-3 sm:p-4 md:p-6 text-center">
                <Download className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-green-600 dark:text-green-400" />
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDownloads}</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Downloads</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <CardContent className="p-3 sm:p-4 md:p-6 text-center">
                <Eye className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-purple-600 dark:text-purple-400" />
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stats.totalViews}</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Views</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <CardContent className="p-3 sm:p-4 md:p-6 text-center">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-yellow-600 dark:text-yellow-400" />
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Pending</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800 transition-colors">
              <CardContent className="p-3 sm:p-4 md:p-6 text-center">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 sm:mb-3 text-emerald-600 dark:text-emerald-400" />
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stats.approved}</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Approved</div>
              </CardContent>
            </Card>
          </div>

          {/* Admin-specific Quick Actions */}
          {isAdmin && (
            <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border-yellow-500/30 mb-8">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Administrator Tools
                </CardTitle>
                <CardDescription className="text-yellow-300/80">
                  Quick access to admin functions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <Link href="/admin/users">
                    <Button variant="outline" className="w-full border-yellow-500/50 text-yellow-400 hover:bg-yellow-500 hover:text-black h-16 flex-col gap-1">
                      <Users className="h-5 w-5" />
                      <span className="text-sm">Manage Users</span>
                    </Button>
                  </Link>
                  <Link href="/admin">
                    <Button variant="outline" className="w-full border-yellow-500/50 text-yellow-400 hover:bg-yellow-500 hover:text-black h-16 flex-col gap-1">
                      <FileText className="h-5 w-5" />
                      <span className="text-sm">Content Review</span>
                    </Button>
                  </Link>
                  <Link href="/admin/analytics">
                    <Button variant="outline" className="w-full border-yellow-500/50 text-yellow-400 hover:bg-yellow-500 hover:text-black h-16 flex-col gap-1">
                      <TrendingUp className="h-5 w-5" />
                      <span className="text-sm">Analytics</span>
                    </Button>
                  </Link>
                  <Link href="/admin/settings">
                    <Button variant="outline" className="w-full border-yellow-500/50 text-yellow-400 hover:bg-yellow-500 hover:text-black h-16 flex-col gap-1">
                      <Settings className="h-5 w-5" />
                      <span className="text-sm">Settings</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search your documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 h-12"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[150px]"
              aria-label="Filter documents by status"
            >
              <option value="all" className="bg-white dark:bg-gray-700">All Status</option>
              <option value="pending" className="bg-white dark:bg-gray-700">Pending</option>
              <option value="approved" className="bg-white dark:bg-gray-700">Approved</option>
              <option value="rejected" className="bg-white dark:bg-gray-700">Rejected</option>
            </select>
          </div>

          {/* Enhanced Documents List */}
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-gray-200 dark:border-gray-600">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Your Documents ({filteredDocuments.length})
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Manage and track your uploaded documents
                  </CardDescription>
                </div>
                <Link href="/contribute">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                    Upload New Document
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300">Loading your documents...</p>
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 mx-auto text-gray-500 dark:text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Documents Found</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'No documents match your current filters'
                      : 'You haven\'t uploaded any documents yet'
                    }
                  </p>
                  {!searchTerm && statusFilter === 'all' && (
                    <Link href="/contribute">
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        Upload Your First Document
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredDocuments.map((document) => (
                    <div key={document.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex flex-col gap-4">
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-3">
                              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white leading-snug break-words">{document.title}</h3>
                              <div className="flex justify-start sm:justify-end">
                                <Badge 
                                  variant={
                                    document.status === 'approved' ? 'default' :
                                    document.status === 'pending' ? 'secondary' : 'destructive'
                                  }
                                  className={
                                    document.status === 'approved' ? 'bg-green-600 hover:bg-green-700 text-white text-xs' :
                                    document.status === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700 text-white text-xs' :
                                    'bg-red-600 hover:bg-red-700 text-white text-xs'
                                  }
                                >
                                  {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          
                          <p className="text-gray-700 dark:text-gray-200 mb-4 leading-relaxed text-sm sm:text-base break-words">{document.description}</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                <FileText className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                <span className="font-medium">Subject:</span>
                                <span className="truncate">{document.subject}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                <span className="font-medium">Course:</span>
                                <span className="truncate">{document.course}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                <span className="font-medium">Semester:</span>
                                <span className="truncate">{document.semester}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                <span className="font-medium">Uploaded:</span>
                                <span className="truncate">{getDateFromTimestamp(document.uploadedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span>{document.views || 0} views</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span>{document.downloads || 0} downloads</span>
                            </div>
                            <Badge variant="outline" className="text-xs w-fit">
                              {document.documentType}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteDocument(document.id, document.title)}
                            className="bg-red-600/80 hover:bg-red-600 border-0 w-full sm:w-auto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
