'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PDFViewer } from '@/components/PDFViewer';
import { useAuthStore } from '@/stores/authStore';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Eye, Download, CheckCircle, XCircle, Clock, FileText, User, Trash2 } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            Dashboard
          </h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-black/20 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Pending Review
                </CardTitle>
                <CardDescription className="text-gray-400">Documents awaiting approval</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-400">{pendingDocuments.length}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/20 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  My Uploads
                </CardTitle>
                <CardDescription className="text-gray-400">Documents you&apos;ve contributed</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-400">{myDocuments.length}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/20 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Total Downloads
                </CardTitle>
                <CardDescription className="text-gray-400">Downloads of your content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-400">
                  {myDocuments.reduce((sum, doc) => sum + (doc.downloads || 0), 0)}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/20 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Total Views
                </CardTitle>
                <CardDescription className="text-gray-400">Views on your documents</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-400">
                  {myDocuments.reduce((sum, doc) => sum + (doc.views || 0), 0)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Pending Documents Section */}
          {pendingDocuments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-400" />
                Pending Review ({pendingDocuments.length})
              </h2>
              
              <div className="grid gap-4">
                {pendingDocuments.map((document) => (
                  <Card key={document.id} className="bg-black/20 border-orange-500/30">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{document.title}</CardTitle>
                          <CardDescription className="text-gray-400 mt-1">
                            {document.description}
                          </CardDescription>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="outline" className="text-orange-400 border-orange-400">
                              {document.documentType}
                            </Badge>
                            <Badge variant="outline" className="text-blue-400 border-blue-400">
                              {document.semester}
                            </Badge>
                            <Badge variant="outline" className="text-purple-400 border-purple-400">
                              {formatFileSize(document.fileSize)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <PDFViewer 
                            fileUrl={document.fileUrl}
                            fileName={document.fileName}
                            title={document.title}
                          />
                          <Button 
                            onClick={() => handleApprove(document.id)}
                            variant="outline" 
                            size="sm"
                            className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            onClick={() => handleReject(document.id)}
                            variant="outline" 
                            size="sm"
                            className="border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          {isAdmin && (
                            <Button 
                              onClick={() => handleDelete(document.id, document.title)}
                              variant="outline" 
                              size="sm"
                              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-400">
                        <p><strong>Subject:</strong> {document.subject}</p>
                        <p><strong>Course:</strong> {document.course}</p>
                        <p><strong>University:</strong> {document.university}</p>
                        <p><strong>Uploaded by:</strong> {document.uploaderName} ({document.uploaderEmail})</p>
                        <p><strong>Uploaded:</strong> {formatDate(document.uploadedAt)}</p>
                        <p><strong>File:</strong> {document.fileName}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* My Documents Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-400" />
              My Documents ({myDocuments.length})
            </h2>
            
            {myDocuments.length === 0 ? (
              <Card className="bg-black/20 border-white/10">
                <CardContent className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">You haven&apos;t uploaded any documents yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {myDocuments.map((document) => (
                  <Card key={document.id} className="bg-black/20 border-white/10">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-white">{document.title}</CardTitle>
                          <CardDescription className="text-gray-400 mt-1">
                            {document.description}
                          </CardDescription>
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge 
                              variant="outline" 
                              className={`${
                                document.status === 'approved' 
                                  ? 'text-green-400 border-green-400' 
                                  : document.status === 'rejected'
                                  ? 'text-red-400 border-red-400'
                                  : 'text-orange-400 border-orange-400'
                              }`}
                            >
                              {document.status}
                            </Badge>
                            <Badge variant="outline" className="text-blue-400 border-blue-400">
                              {document.documentType}
                            </Badge>
                            <Badge variant="outline" className="text-purple-400 border-purple-400">
                              {formatFileSize(document.fileSize)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
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
                              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-400 grid grid-cols-2 gap-4">
                        <div>
                          <p><strong>Subject:</strong> {document.subject}</p>
                          <p><strong>Course:</strong> {document.course}</p>
                          <p><strong>Semester:</strong> {document.semester}</p>
                        </div>
                        <div>
                          <p><strong>Downloads:</strong> {document.downloads || 0}</p>
                          <p><strong>Views:</strong> {document.views || 0}</p>
                          <p><strong>Uploaded:</strong> {formatDate(document.uploadedAt)}</p>
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
    </div>
  );
}