'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PDFViewer } from '@/components/PDFViewer';
import { useAuthStore } from '@/stores/authStore';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Eye, Download, CheckCircle, XCircle, Clock, FileText, User, Trash2, BarChart, TrendingUp, Activity, Layers } from 'lucide-react';
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
  downloads: number;
  likes: number;
  views: number;
  storageType?: string;
}

export default function Dashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const { isAdmin } = useAdminStatus();
  const [pendingDocuments, setPendingDocuments] = useState<Document[]>([]);
  const [myDocuments, setMyDocuments] = useState<Document[]>([]);

  // Helper function to handle Firestore timestamp conversion
  const getDateFromTimestamp = (timestamp: { toDate(): Date } | Date): Date => {
    if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    return timestamp instanceof Date ? timestamp : new Date();
  };

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Listen to pending documents for admin review
    const pendingQuery = query(
      collection(db, 'documents'),
      where('status', '==', 'pending'),
      orderBy('uploadedAt', 'desc')
    );

    const unsubscribePending = onSnapshot(pendingQuery, (snapshot) => {
      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Document[];
      setPendingDocuments(documents);
    });

    // Listen to my documents - Use simple query without orderBy to avoid index issues
    const myQuery = query(
      collection(db, 'documents'),
      where('uploaderEmail', '==', user.email)
    );

    const unsubscribeMyDocs = onSnapshot(myQuery, (snapshot) => {
      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Document[];
      
      // Sort client-side to avoid composite index requirement
      documents.sort((a, b) => {
        const dateA = getDateFromTimestamp(a.uploadedAt);
        const dateB = getDateFromTimestamp(b.uploadedAt);
        return dateB.getTime() - dateA.getTime();
      });
      
      setMyDocuments(documents);
    });

    return () => {
      unsubscribePending();
      unsubscribeMyDocs();
    };
  }, [isAuthenticated, user]);

  const handleApprove = async (documentId: string) => {
    try {
      await updateDoc(doc(db, 'documents', documentId), {
        status: 'approved'
      });
      toast.success('✅ Document approved successfully!', {
        duration: 3000,
      });
    } catch (error) {
      console.error('Error approving document:', error);
      toast.error('❌ Failed to approve document', {
        duration: 4000,
      });
    }
  };

  const handleReject = async (documentId: string) => {
    try {
      await updateDoc(doc(db, 'documents', documentId), {
        status: 'rejected'
      });
      toast.success('❌ Document rejected successfully!', {
        duration: 3000,
      });
    } catch (error) {
      console.error('Error rejecting document:', error);
      toast.error('❌ Failed to reject document', {
        duration: 4000,
      });
    }
  };

  const handleDelete = async (documentId: string, title: string) => {
    // Only allow admins to delete
    if (!isAdmin) {
      toast.error('❌ Only administrators can delete documents', {
        duration: 4000,
      });
      return;
    }

    // Custom styled confirmation using toast
    const confirmDelete = () => new Promise<boolean>((resolve) => {
      toast((t) => (
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-2">
            <div className="bg-red-100 rounded-full p-2">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Delete Document</p>
              <p className="text-sm text-gray-600">Are you sure you want to delete &quot;{title}&quot;?</p>
            </div>
          </div>
          <div className="flex space-x-2 justify-end">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ), {
        duration: Infinity,
        style: {
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          maxWidth: '400px',
        }
      });
    });

    const shouldDelete = await confirmDelete();
    if (!shouldDelete) return;

    try {
      await deleteDoc(doc(db, 'documents', documentId));
      toast.success(() => (
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 rounded-full p-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Document Deleted</p>
            <p className="text-sm text-gray-600">&quot;{title}&quot; has been removed successfully</p>
          </div>
        </div>
      ), {
        duration: 4000,
        style: {
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error(() => (
        <div className="flex items-center space-x-3">
          <div className="bg-red-100 rounded-full p-2">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">Delete Failed</p>
            <p className="text-sm text-gray-600">Could not delete the document. Please try again.</p>
          </div>
        </div>
      ), {
        duration: 5000,
        style: {
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }
      });
    }
  };

  const formatDate = (timestamp: { toDate(): Date } | Date): string => {
    const date = getDateFromTimestamp(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number): string => {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
          <p className="text-gray-400">You need to be logged in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      <Header />
      
      {/* Floating Decorative Elements - Enhanced with Many More Icons */}
      <div className="absolute top-28 right-12 opacity-10 animate-float pointer-events-none">
        <FileText className="w-28 h-28 text-blue-500" />
      </div>
      <div className="absolute top-1/3 left-20 opacity-10 animate-float-delayed pointer-events-none">
        <BarChart className="w-32 h-32 text-green-500" />
      </div>
      <div className="absolute bottom-28 right-32 opacity-10 animate-float pointer-events-none">
        <TrendingUp className="w-24 h-24 text-purple-500" />
      </div>
      <div className="absolute bottom-1/3 left-16 opacity-10 animate-float-delayed pointer-events-none">
        <Activity className="w-26 h-26 text-orange-500" />
      </div>
      <div className="absolute top-1/2 right-24 opacity-10 animate-float pointer-events-none">
        <Layers className="w-20 h-20 text-pink-500" />
      </div>
      <div className="absolute bottom-32 left-24 opacity-10 animate-float-delayed pointer-events-none">
        <CheckCircle className="w-22 h-22 text-yellow-500" />
      </div>
      <div className="absolute top-1/4 right-40 opacity-8 animate-float pointer-events-none">
        <Download className="w-24 h-24 text-cyan-500" />
      </div>
      <div className="absolute bottom-1/4 left-32 opacity-8 animate-float-delayed pointer-events-none">
        <Eye className="w-22 h-22 text-emerald-500" />
      </div>
      <div className="absolute top-2/3 left-12 opacity-8 animate-float pointer-events-none">
        <User className="w-24 h-24 text-indigo-500" />
      </div>
      <div className="absolute bottom-2/3 right-20 opacity-8 animate-float-delayed pointer-events-none">
        <Clock className="w-20 h-20 text-violet-500" />
      </div>
      <div className="absolute top-1/2 left-1/3 opacity-8 animate-float pointer-events-none">
        <FileText className="w-22 h-22 text-teal-500" />
      </div>
      <div className="absolute bottom-1/2 right-1/3 opacity-8 animate-float-delayed pointer-events-none">
        <BarChart className="w-20 h-20 text-amber-500" />
      </div>
      <div className="absolute top-3/4 right-36 opacity-7 animate-float pointer-events-none">
        <TrendingUp className="w-18 h-18 text-lime-500" />
      </div>
      <div className="absolute bottom-3/4 left-40 opacity-7 animate-float-delayed pointer-events-none">
        <Activity className="w-18 h-18 text-rose-500" />
      </div>
      <div className="absolute top-1/3 left-1/4 opacity-7 animate-float pointer-events-none">
        <Layers className="w-16 h-16 text-fuchsia-500" />
      </div>
      
      <main className="container mx-auto px-4 py-8 sm:py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-xl">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                  Welcome Back, {user?.displayName || 'Student'}!
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Manage your uploads and track your contributions
                </p>
              </div>
            </div>
          </div>
          
          {/* Stats Cards - Enhanced Design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/20 transition-all group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground flex items-center gap-2 text-sm sm:text-base">
                    <div className="p-2 bg-orange-500/20 rounded-lg group-hover:scale-110 transition-transform">
                      <Clock className="w-5 h-5 text-orange-500" />
                    </div>
                    Pending
                  </CardTitle>
                  {pendingDocuments.length > 0 && (
                    <Badge variant="secondary" className="bg-orange-500/20 text-orange-600">New</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl sm:text-4xl font-bold text-orange-500">{pendingDocuments.length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Awaiting review</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/20 transition-all group">
              <CardHeader className="pb-3">
                <CardTitle className="text-foreground flex items-center gap-2 text-sm sm:text-base">
                  <div className="p-2 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  My Uploads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl sm:text-4xl font-bold text-blue-500">{myDocuments.length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Total contributions</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/30 hover:shadow-lg hover:shadow-green-500/20 transition-all group">
              <CardHeader className="pb-3">
                <CardTitle className="text-foreground flex items-center gap-2 text-sm sm:text-base">
                  <div className="p-2 bg-green-500/20 rounded-lg group-hover:scale-110 transition-transform">
                    <Download className="w-5 h-5 text-green-500" />
                  </div>
                  Downloads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl sm:text-4xl font-bold text-green-500">
                  {myDocuments.reduce((sum, doc) => sum + (doc.downloads || 0), 0)}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Total downloads</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20 transition-all group">
              <CardHeader className="pb-3">
                <CardTitle className="text-foreground flex items-center gap-2 text-sm sm:text-base">
                  <div className="p-2 bg-purple-500/20 rounded-lg group-hover:scale-110 transition-transform">
                    <Eye className="w-5 h-5 text-purple-500" />
                  </div>
                  Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl sm:text-4xl font-bold text-purple-500">
                  {myDocuments.reduce((sum, doc) => sum + (doc.views || 0), 0)}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Content views</p>
              </CardContent>
            </Card>
          </div>

          {/* Pending Documents Section - Improved */}
          {pendingDocuments.length > 0 && (
            <div className="mb-8 sm:mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 text-foreground">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-500" />
                  </div>
                  Pending Review
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-600">
                    {pendingDocuments.length}
                  </Badge>
                </h2>
              </div>
              
              <div className="grid gap-4 sm:gap-6">
                {pendingDocuments.map((document) => (
                  <Card key={document.id} className="bg-card/80 backdrop-blur-sm border-2 border-orange-500/30 hover:border-orange-500/50 transition-all hover:shadow-lg hover:shadow-orange-500/10">
                    <CardHeader className="pb-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg sm:text-xl text-foreground mb-2">{document.title}</CardTitle>
                          <CardDescription className="text-muted-foreground text-sm sm:text-base">
                            {document.description}
                          </CardDescription>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="outline" className="text-orange-500 border-orange-500 bg-orange-500/5">
                              <Clock className="w-3 h-3 mr-1" />
                              {document.documentType}
                            </Badge>
                            <Badge variant="outline" className="text-blue-500 border-blue-500 bg-blue-500/5">
                              {document.semester}
                            </Badge>
                            <Badge variant="outline" className="text-purple-500 border-purple-500 bg-purple-500/5">
                              {formatFileSize(document.fileSize)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <PDFViewer 
                            fileUrl={document.fileUrl}
                            fileName={document.fileName}
                            title={document.title}
                          />
                          <Button 
                            onClick={() => handleApprove(document.id)}
                            variant="outline" 
                            size="sm"
                            className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all hover:scale-105"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            onClick={() => handleReject(document.id)}
                            variant="outline" 
                            size="sm"
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all hover:scale-105"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          {isAdmin && (
                            <Button 
                              onClick={() => handleDelete(document.id, document.title)}
                              variant="outline" 
                              size="sm"
                              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all hover:scale-105"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="border-t border-border/50 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                        <div className="space-y-1">
                          <p><strong className="text-foreground">Subject:</strong> {document.subject}</p>
                          <p><strong className="text-foreground">Course:</strong> {document.course}</p>
                          <p><strong className="text-foreground">University:</strong> {document.university}</p>
                        </div>
                        <div className="space-y-1">
                          <p><strong className="text-foreground">Uploaded by:</strong> {document.uploaderName}</p>
                          <p><strong className="text-foreground">Email:</strong> {document.uploaderEmail}</p>
                          <p><strong className="text-foreground">Date:</strong> {formatDate(document.uploadedAt)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* My Documents Section - Improved */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 text-foreground">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
                My Documents
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-600">
                  {myDocuments.length}
                </Badge>
              </h2>
            </div>
            
            {myDocuments.length === 0 ? (
              <Card className="bg-card/50 backdrop-blur-sm border-border">
                <CardContent className="text-center py-12 sm:py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Documents Yet</h3>
                  <p className="text-muted-foreground mb-6">You haven&apos;t uploaded any documents yet. Start contributing!</p>
                  <Button asChild>
                    <Link href="/contribute">Upload Document</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:gap-6">
                {myDocuments.map((document) => (
                  <Card key={document.id} className="bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 transition-all hover:shadow-lg group">
                    <CardHeader className="pb-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg sm:text-xl text-foreground">{document.title}</CardTitle>
                            {document.status === 'approved' && (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                            {document.status === 'rejected' && (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                          <CardDescription className="text-muted-foreground text-sm sm:text-base">
                            {document.description}
                          </CardDescription>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge 
                              variant="outline" 
                              className={`${
                                document.status === 'approved' 
                                  ? 'text-green-500 border-green-500 bg-green-500/5' 
                                  : document.status === 'rejected'
                                  ? 'text-red-500 border-red-500 bg-red-500/5'
                                  : 'text-orange-500 border-orange-500 bg-orange-500/5'
                              }`}
                            >
                              {document.status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-blue-400 border-blue-400 bg-blue-400/5">
                              {document.documentType}
                            </Badge>
                            <Badge variant="outline" className="text-purple-400 border-purple-400 bg-purple-400/5">
                              {formatFileSize(document.fileSize)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <PDFViewer 
                            fileUrl={document.fileUrl}
                            fileName={document.fileName}
                            title={document.title}
                          />
                          {isAdmin && (
                            <Button 
                              onClick={() => handleDelete(document.id, document.title)}
                              variant="outline" 
                              size="sm"
                              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all hover:scale-105"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="border-t border-border/50 pt-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div className="p-3 rounded-lg bg-blue-500/5">
                          <p className="text-xs text-muted-foreground mb-1">Subject</p>
                          <p className="text-sm font-medium text-foreground">{document.subject}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-green-500/5">
                          <p className="text-xs text-muted-foreground mb-1">Downloads</p>
                          <p className="text-sm font-bold text-green-500">{document.downloads || 0}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-purple-500/5">
                          <p className="text-xs text-muted-foreground mb-1">Views</p>
                          <p className="text-sm font-bold text-purple-500">{document.views || 0}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-orange-500/5">
                          <p className="text-xs text-muted-foreground mb-1">Uploaded</p>
                          <p className="text-sm font-medium text-foreground">{formatDate(document.uploadedAt).split(',')[0]}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
