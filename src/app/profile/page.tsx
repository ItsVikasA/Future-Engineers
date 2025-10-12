'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
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
  Edit,
  MapPin,
  GraduationCap,
  TrendingUp,
  Users,
  Settings,
  Crown,
  Linkedin,
  Github,
  Globe,
  User,
  BookOpen,
  Target,
  Zap,
  Heart
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Document {
  id: string;
  title: string;
  description: string;
  subject: string;
  college: string;
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
    bannerURL: '', // Add banner URL
    bio: '',
    college: '',
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
  const getDateFromTimestamp = (timestamp: { toDate(): Date } | Date | number): Date => {
    if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    if (typeof timestamp === 'number') {
      return new Date(timestamp);
    }
    return timestamp as Date;
  };

  // Helper function to get initials from name or email
  const getInitials = (nameOrEmail: string): string => {
    if (!nameOrEmail) return '?';
    const parts = nameOrEmail.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameOrEmail.substring(0, 2).toUpperCase();
  };

  // Helper function to format college name and check if it's BGMIT
  const formatCollegeName = (college: string): { displayName: string; isBGMIT: boolean } => {
    if (!college) return { displayName: '', isBGMIT: false };
    
    const bgmitVariants = [
      'biluru gurubasva mahaswamiji institute of technology',
      'biluru gurubasva mahaswamiji institute of technoly',
      'bgmit',
      'b.g.m.i.t',
      'mudhol'
    ];
    
    const collegeLower = college.toLowerCase();
    const isBGMIT = bgmitVariants.some(variant => collegeLower.includes(variant));
    
    return {
      displayName: isBGMIT ? 'BGMIT' : college,
      isBGMIT
    };
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
            bannerURL: userData.bannerURL || '', // Load banner URL
            bio: userData.bio || 'Engineering student passionate about learning and sharing knowledge.',
            college: userData.college || '',
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      <Header />
      
      {/* Floating Decorative Elements - Enhanced with Many More Icons */}
      <div className="absolute top-24 right-20 opacity-10 animate-float pointer-events-none">
        <User className="w-32 h-32 text-blue-500" />
      </div>
      <div className="absolute top-1/3 left-16 opacity-10 animate-float-delayed pointer-events-none">
        <Award className="w-28 h-28 text-purple-500" />
      </div>
      <div className="absolute bottom-32 right-28 opacity-10 animate-float pointer-events-none">
        <Target className="w-26 h-26 text-green-500" />
      </div>
      <div className="absolute bottom-1/4 left-24 opacity-10 animate-float-delayed pointer-events-none">
        <Zap className="w-24 h-24 text-yellow-500" />
      </div>
      <div className="absolute top-1/2 right-36 opacity-10 animate-float pointer-events-none">
        <Heart className="w-20 h-20 text-pink-500" />
      </div>
      <div className="absolute bottom-40 left-12 opacity-10 animate-float-delayed pointer-events-none">
        <Crown className="w-22 h-22 text-orange-500" />
      </div>
      <div className="absolute top-1/4 right-32 opacity-8 animate-float pointer-events-none">
        <Settings className="w-24 h-24 text-cyan-500" />
      </div>
      <div className="absolute bottom-1/3 left-32 opacity-8 animate-float-delayed pointer-events-none">
        <TrendingUp className="w-22 h-22 text-emerald-500" />
      </div>
      <div className="absolute top-2/3 left-20 opacity-8 animate-float pointer-events-none">
        <Users className="w-24 h-24 text-indigo-500" />
      </div>
      <div className="absolute bottom-2/3 right-24 opacity-8 animate-float-delayed pointer-events-none">
        <GraduationCap className="w-20 h-20 text-violet-500" />
      </div>
      <div className="absolute top-1/2 left-1/4 opacity-8 animate-float pointer-events-none">
        <BookOpen className="w-22 h-22 text-teal-500" />
      </div>
      <div className="absolute bottom-1/2 right-1/4 opacity-8 animate-float-delayed pointer-events-none">
        <Mail className="w-20 h-20 text-amber-500" />
      </div>
      <div className="absolute top-3/4 right-40 opacity-7 animate-float pointer-events-none">
        <Calendar className="w-18 h-18 text-rose-500" />
      </div>
      <div className="absolute bottom-3/4 left-36 opacity-7 animate-float-delayed pointer-events-none">
        <MapPin className="w-18 h-18 text-lime-500" />
      </div>
      <div className="absolute top-1/3 left-1/3 opacity-7 animate-float pointer-events-none">
        <Github className="w-20 h-20 text-slate-500" />
      </div>
      <div className="absolute bottom-1/3 right-1/3 opacity-7 animate-float-delayed pointer-events-none">
        <Globe className="w-18 h-18 text-sky-500" />
      </div>
      <div className="absolute top-1/4 left-1/2 opacity-7 animate-float pointer-events-none">
        <Linkedin className="w-16 h-16 text-blue-400" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="space-y-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Profile Hero Card - LinkedIn Style */}
              <Card className="bg-card/50 backdrop-blur-sm border-primary/10 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Banner Section - LinkedIn style with prominent mobile display */}
                <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20">
                  {profileData.bannerURL ? (
                    <Image 
                      src={profileData.bannerURL} 
                      alt="Profile Banner" 
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20" />
                  )}
                </div>
                
                {/* Profile Content */}
                <CardContent className="p-0">
                  {/* Profile Picture overlapping banner */}
                  <div className="px-4 sm:px-6 md:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 sm:-mt-20 md:-mt-24 mb-4">
                      {/* Avatar Section */}
                      <div className="flex-shrink-0 mb-4 sm:mb-0">
                        <div className="relative">
                          <Avatar className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 border-4 border-card shadow-2xl bg-card ring-2 ring-primary/20">
                            <AvatarImage src={profileData.photoURL || ''} alt={profileData.displayName || 'User'} />
                            <AvatarFallback className="text-2xl sm:text-3xl md:text-4xl bg-gradient-to-br from-primary to-purple-600 text-white">
                              {getInitials(profileData.displayName || profileData.email)}
                            </AvatarFallback>
                          </Avatar>
                          {isAdmin && (
                            <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-2 sm:p-3 shadow-lg animate-pulse">
                              <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons - Better mobile layout */}
                      <div className="flex gap-2 sm:mb-6 w-full sm:w-auto">
                        <Link href="/profile/edit" className="flex-1 sm:flex-initial">
                          <Button className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white transition-all duration-300 hover:scale-105 shadow-lg">
                            <Edit className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Edit Profile</span>
                            <span className="sm:hidden">Edit</span>
                          </Button>
                        </Link>
                        {isAdmin && (
                          <Link href="/admin" className="flex-1 sm:flex-initial">
                            <Button variant="outline" className="w-full sm:w-auto border-yellow-500/50 text-yellow-600 hover:bg-yellow-500 hover:text-white hover:scale-105 transition-all duration-300 shadow-lg">
                              <Crown className="h-4 w-4 sm:mr-2" />
                              <span className="hidden sm:inline">Admin Panel</span>
                              <span className="sm:hidden">Admin</span>
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Profile Details */}
                    <div className="pb-4 sm:pb-6 space-y-3 sm:space-y-4">
                      {/* Name and Badges */}
                      <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2 flex-wrap">
                          {profileData.displayName || 'User'}
                          {isAdmin && (
                            <Badge className="text-xs sm:text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                              <Crown className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                          {!isAdmin && (
                            <Badge className="text-xs sm:text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                              Student
                            </Badge>
                          )}
                        </h1>
                        
                        {/* Bio/Role */}
                        {profileData.bio && (
                          <p className="text-muted-foreground text-sm sm:text-base mb-3 leading-relaxed">
                            {profileData.bio}
                          </p>
                        )}
                        
                        {/* College & Course */}
                        {(profileData.college || profileData.course) && (
                          <div className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground mb-2">
                            <GraduationCap className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            <span className="leading-snug flex items-center gap-2 flex-wrap">
                              {profileData.course && <span className="font-medium">{profileData.course}</span>}
                              {profileData.course && profileData.college && <span> • </span>}
                              {profileData.college && (
                                <>
                                  {formatCollegeName(profileData.college).isBGMIT ? (
                                    <span className="flex items-center gap-1.5">
                                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30">
                                        <GraduationCap className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                      </span>
                                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                                        {formatCollegeName(profileData.college).displayName}
                                      </span>
                                    </span>
                                  ) : (
                                    <span>{profileData.college}</span>
                                  )}
                                </>
                              )}
                            </span>
                          </div>
                        )}

                        {/* Contact Info - Stacked on mobile */}
                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-x-4 text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="break-all">{profileData.email}</span>
                          </div>
                          {profileData.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                              <span>{profileData.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>Joined {profileData.joinedAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Social Links - LinkedIn Style - Better mobile spacing */}
                      {(profileData.socialMedia.linkedin || profileData.socialMedia.github || profileData.socialMedia.portfolio) && (
                        <div className="flex flex-wrap gap-2 pt-3 border-t border-border/50">
                          {profileData.socialMedia.linkedin && (
                            <a
                              href={profileData.socialMedia.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors text-xs sm:text-sm"
                            >
                              <Linkedin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              <span>LinkedIn</span>
                            </a>
                          )}
                          {profileData.socialMedia.github && (
                            <a
                              href={profileData.socialMedia.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-md bg-gray-500/10 hover:bg-gray-500/20 text-gray-700 dark:text-gray-300 transition-colors text-xs sm:text-sm"
                            >
                              <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              <span>GitHub</span>
                            </a>
                          )}
                          {profileData.socialMedia.portfolio && (
                            <a
                              href={profileData.socialMedia.portfolio}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-md bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 transition-colors text-xs sm:text-sm"
                            >
                              <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              <span>Portfolio</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards Row - Better mobile grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {/* Reputation Card */}
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-shadow">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <Award className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-1 sm:mb-2 text-primary" />
                    <p className="text-xl sm:text-2xl font-bold text-primary">{profileData.reputation}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Reputation</p>
                  </CardContent>
                </Card>

                {/* Uploads Card */}
                <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 hover:shadow-lg transition-shadow">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <FileText className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-1 sm:mb-2 text-green-600" />
                    <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.approved}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Uploads</p>
                  </CardContent>
                </Card>

                {/* Views Card */}
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:shadow-lg transition-shadow">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <Eye className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-1 sm:mb-2 text-blue-600" />
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.totalViews}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Views</p>
                  </CardContent>
                </Card>

                {/* Downloads Card */}
                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20 hover:shadow-lg transition-shadow">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <Download className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-1 sm:mb-2 text-purple-600" />
                    <p className="text-xl sm:text-2xl font-bold text-purple-600">{stats.totalDownloads}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Downloads</p>
                  </CardContent>
                </Card>
              </div>

              {/* Rest of the content */}
              {/* Bio Section - Moved below stats */}
              {profileData.bio && profileData.bio !== 'Engineering student passionate about learning and sharing knowledge.' && (
                <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      About
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{profileData.bio}</p>
                  </CardContent>
                </Card>
              )}

              {/* Academic Information */}
              {(profileData.college || profileData.course || profileData.semester) && (
                <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      Academic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {profileData.college && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-all">
                          <div className="p-2 rounded-lg bg-blue-500/20">
                            <GraduationCap className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">College</p>
                            {formatCollegeName(profileData.college).isBGMIT ? (
                              <div className="flex items-center gap-2 mt-0.5">
                                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
                                  <GraduationCap className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <p className="font-semibold text-sm text-blue-600 dark:text-blue-400">
                                  {formatCollegeName(profileData.college).displayName}
                                </p>
                              </div>
                            ) : (
                              <p className="font-medium text-sm">{profileData.college}</p>
                            )}
                          </div>
                        </div>
                      )}
                      {profileData.course && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all">
                          <div className="p-2 rounded-lg bg-purple-500/20">
                            <BookOpen className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Course</p>
                            <p className="font-medium text-sm">{profileData.course}</p>
                          </div>
                        </div>
                      )}
                      {profileData.semester && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all">
                          <div className="p-2 rounded-lg bg-green-500/20">
                            <Clock className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Semester</p>
                            <p className="font-medium text-sm">{profileData.semester}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Documents Section continues... */}
              
              {/* Stats Cards - 6 Column Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20 hover:scale-105 transition-transform duration-300 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Award className="h-8 w-8 mx-auto mb-3 text-yellow-600" />
                    <div className="text-3xl font-bold mb-1">{profileData.reputation}</div>
                    <div className="text-sm text-muted-foreground">Reputation</div>
                    {isAdmin && <Badge className="mt-2 bg-yellow-500/20 text-yellow-700">MAX</Badge>}
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:scale-105 transition-transform duration-300 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <FileText className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                    <div className="text-3xl font-bold mb-1">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Total Uploads</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 hover:scale-105 transition-transform duration-300 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Download className="h-8 w-8 mx-auto mb-3 text-green-600" />
                    <div className="text-3xl font-bold mb-1">{stats.totalDownloads}</div>
                    <div className="text-sm text-muted-foreground">Downloads</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20 hover:scale-105 transition-transform duration-300 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Eye className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                    <div className="text-3xl font-bold mb-1">{stats.totalViews}</div>
                    <div className="text-sm text-muted-foreground">Views</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20 hover:scale-105 transition-transform duration-300 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 mx-auto mb-3 text-orange-600" />
                    <div className="text-3xl font-bold mb-1">{stats.pending}</div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 hover:scale-105 transition-transform duration-300 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-3 text-emerald-600" />
                    <div className="text-3xl font-bold mb-1">{stats.approved}</div>
                    <div className="text-sm text-muted-foreground">Approved</div>
                  </CardContent>
                </Card>
              </div>

              {/* Admin Quick Actions */}
              {isAdmin && (
                <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30 hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-600" />
                      <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Administrator Tools</span>
                    </CardTitle>
                    <CardDescription>Quick access to admin functions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Link href="/admin/users">
                        <Button variant="outline" className="w-full border-yellow-500/50 hover:bg-yellow-500/20 hover:border-yellow-500 h-16 flex-col gap-1 hover:scale-105 transition-all">
                          <Users className="h-5 w-5 text-yellow-600" />
                          <span className="text-sm">Manage Users</span>
                        </Button>
                      </Link>
                      <Link href="/admin">
                        <Button variant="outline" className="w-full border-yellow-500/50 hover:bg-yellow-500/20 hover:border-yellow-500 h-16 flex-col gap-1 hover:scale-105 transition-all">
                          <FileText className="h-5 w-5 text-yellow-600" />
                          <span className="text-sm">Content Review</span>
                        </Button>
                      </Link>
                      <Link href="/admin/analytics">
                        <Button variant="outline" className="w-full border-yellow-500/50 hover:bg-yellow-500/20 hover:border-yellow-500 h-16 flex-col gap-1 hover:scale-105 transition-all">
                          <TrendingUp className="h-5 w-5 text-yellow-600" />
                          <span className="text-sm">Analytics</span>
                        </Button>
                      </Link>
                      <Link href="/admin/settings">
                        <Button variant="outline" className="w-full border-yellow-500/50 hover:bg-yellow-500/20 hover:border-yellow-500 h-16 flex-col gap-1 hover:scale-105 transition-all">
                          <Settings className="h-5 w-5 text-yellow-600" />
                          <span className="text-sm">Settings</span>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search your documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12 bg-card/50 backdrop-blur-sm border-primary/20 focus:border-primary/50 transition-colors"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 h-12 bg-card/50 backdrop-blur-sm border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 min-w-[150px] transition-all"
                  aria-label="Filter documents by status"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Documents List */}
              <Card className="bg-card/50 backdrop-blur-sm border-primary/10 hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <FileText className="h-6 w-6" />
                        Your Documents ({filteredDocuments.length})
                      </CardTitle>
                      <CardDescription>Manage and track your uploaded documents</CardDescription>
                    </div>
                    <Link href="/contribute">
                      <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white hover:scale-105 transition-all shadow-lg">
                        <FileText className="h-4 w-4 mr-2" />
                        Upload New Document
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredDocuments.length === 0 ? (
                    <div className="text-center py-16">
                      <FileText className="h-20 w-20 mx-auto text-muted-foreground/50 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Documents Found</h3>
                      <p className="text-muted-foreground mb-6">
                        {searchTerm || statusFilter !== 'all' 
                          ? 'No documents match your current filters'
                          : 'You haven\'t uploaded any documents yet'
                        }
                      </p>
                      {!searchTerm && statusFilter === 'all' && (
                        <Link href="/contribute">
                          <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white hover:scale-105 transition-all shadow-lg">
                            <FileText className="h-4 w-4 mr-2" />
                            Upload Your First Document
                          </Button>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredDocuments.map((document) => (
                        <Card key={document.id} className="bg-background/50 border-primary/10 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex flex-col gap-4">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                <h3 className="text-lg font-semibold break-words flex-1">{document.title}</h3>
                                <Badge 
                                  className={
                                    document.status === 'approved' 
                                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-md' :
                                    document.status === 'pending' 
                                      ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white border-0 shadow-md' :
                                      'bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-md'
                                  }
                                >
                                  {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                                </Badge>
                              </div>
                            
                              <p className="text-muted-foreground leading-relaxed break-words">{document.description}</p>
                            
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    <div className="p-1.5 rounded bg-blue-500/10">
                                      <FileText className="h-3.5 w-3.5 text-blue-600" />
                                    </div>
                                    <span className="font-medium">Subject:</span>
                                    <span className="text-muted-foreground truncate">{document.subject}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <div className="p-1.5 rounded bg-purple-500/10">
                                      <GraduationCap className="h-3.5 w-3.5 text-purple-600" />
                                    </div>
                                    <span className="font-medium">Course:</span>
                                    <span className="text-muted-foreground truncate">{document.course}</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    <div className="p-1.5 rounded bg-green-500/10">
                                      <Clock className="h-3.5 w-3.5 text-green-600" />
                                    </div>
                                    <span className="font-medium">Semester:</span>
                                    <span className="text-muted-foreground truncate">{document.semester}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <div className="p-1.5 rounded bg-pink-500/10">
                                      <Calendar className="h-3.5 w-3.5 text-pink-600" />
                                    </div>
                                    <span className="font-medium">Uploaded:</span>
                                    <span className="text-muted-foreground truncate">{getDateFromTimestamp(document.uploadedAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                            
                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border/50">
                                <div className="flex items-center gap-1.5">
                                  <Eye className="h-4 w-4 text-purple-600" />
                                  <span className="font-medium">{document.views || 0}</span>
                                  <span>views</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Download className="h-4 w-4 text-green-600" />
                                  <span className="font-medium">{document.downloads || 0}</span>
                                  <span>downloads</span>
                                </div>
                                <Badge variant="outline" className="ml-auto">
                                  {document.documentType}
                                </Badge>
                              </div>

                              <div className="flex justify-end pt-2">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteDocument(document.id, document.title)}
                                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 hover:scale-105 transition-all shadow-lg"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}



