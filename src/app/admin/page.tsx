'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/authStore';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { collection, query, onSnapshot, doc, deleteDoc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Trash2, CheckCircle, XCircle, Search, FileText, Database } from 'lucide-react';
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

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { isAdmin } = useAdminStatus();
  const [allDocuments, setAllDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // Helper function to handle Firestore timestamp conversion
  const getDateFromTimestamp = (timestamp: { toDate(): Date } | Date): Date => {
    if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    return timestamp instanceof Date ? timestamp : new Date();
  };

  useEffect(() => {
    if (!isAuthenticated || !user || !isAdmin) return;

    // Listen to all documents - Remove orderBy to avoid index issues
    const allDocsQuery = query(
      collection(db, 'documents')
    );

    const unsubscribe = onSnapshot(allDocsQuery, (snapshot) => {
      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Document[];
      
      // Sort client-side by uploadedAt descending
      documents.sort((a, b) => {
        const dateA = getDateFromTimestamp(a.uploadedAt);
        const dateB = getDateFromTimestamp(b.uploadedAt);
        return dateB.getTime() - dateA.getTime();
      });
      
      setAllDocuments(documents);
      
      // Calculate stats
      const stats = {
        total: documents.length,
        pending: documents.filter(doc => doc.status === 'pending').length,
        approved: documents.filter(doc => doc.status === 'approved').length,
        rejected: documents.filter(doc => doc.status === 'rejected').length,
      };
      setStats(stats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthenticated, user, isAdmin]);

  // Filter documents based on search and status
  useEffect(() => {
    let filtered = allDocuments;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.uploaderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.uploaderEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    setFilteredDocuments(filtered);
  }, [allDocuments, searchTerm, statusFilter]);

  const handleDelete = async (documentId: string, title: string) => {
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

  const clearAllDocuments = async () => {
    if (!confirm('⚠️ DANGER: This will delete ALL documents permanently. This cannot be undone. Are you absolutely sure?')) {
      return;
    }

    if (!confirm('⚠️ FINAL WARNING: You are about to delete ALL documents in the database. Type "DELETE ALL" to confirm.')) {
      return;
    }

    try {
      const snapshot = await getDocs(collection(db, 'documents'));
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      toast.success('🗑️ All documents cleared successfully!', {
        duration: 5000,
      });
    } catch (error) {
      console.error('Error clearing documents:', error);
      toast.error('❌ Failed to clear documents', {
        duration: 4000,
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

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400">Only administrators can access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-lg">Loading admin panel...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Modern Admin Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-2">
                Manage users, content, and platform settings
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 rounded-full">
                <span className="text-black font-semibold text-sm flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Administrator
                </span>
              </div>
            </div>
          </div>
        </div>
          <p className="text-lg text-gray-400">
            Manage documents, users, and platform content
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-blue-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Documents</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-orange-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Pending Review</p>
                  <p className="text-2xl font-bold text-white">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Approved</p>
                  <p className="text-2xl font-bold text-white">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-400" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Rejected</p>
                  <p className="text-2xl font-bold text-white">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search documents, users, or subjects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  aria-label="Filter documents by status"
                >
                  <option value="all" className="bg-gray-800">All Status</option>
                  <option value="pending" className="bg-gray-800">Pending</option>
                  <option value="approved" className="bg-gray-800">Approved</option>
                  <option value="rejected" className="bg-gray-800">Rejected</option>
                </select>
              </div>
              <Button
                onClick={clearAllDocuments}
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Documents
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white">All Documents ({filteredDocuments.length})</CardTitle>
            <CardDescription className="text-gray-400">
              Manage all documents in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No documents found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDocuments.map((document) => (
                  <Card key={document.id} className="bg-black/20 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-2">{document.title}</h3>
                          <p className="text-gray-400 text-sm mb-3">{document.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
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

                          <div className="text-sm text-gray-400 space-y-1">
                            <p><strong>Uploader:</strong> {document.uploaderName} ({document.uploaderEmail})</p>
                            <p><strong>Subject:</strong> {document.subject}</p>
                            <p><strong>University:</strong> {document.university}</p>
                            <p><strong>Uploaded:</strong> {formatDate(document.uploadedAt)}</p>
                            <p><strong>Stats:</strong> {document.views || 0} views, {document.downloads || 0} downloads, {document.likes || 0} likes</p>
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          {document.status === 'pending' && (
                            <>
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
                            </>
                          )}
                          <Button 
                            onClick={() => handleDelete(document.id, document.title)}
                            variant="outline" 
                            size="sm"
                            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
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
      </div>
    </div>
  );
}
