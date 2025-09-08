'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } fr    try {
      // Fix folder name in URL if needed
      let viewUrl = fileUrl;
      if (viewUrl.includes('/student-notes/')) {
        viewUrl = viewUrl.replace('/student-notes/', '/future_engineers/');
      }
      
      // For Cloudinary URLs, remove any download flags and add viewer-friendly parameters
      if (viewUrl.includes('cloudinary.com')) {
        // Remove download flags and add inline viewing parameters
        viewUrl = viewUrl.replace(/fl_attachment[^/]*/, '').replace(/,fl_attachment/, '');
        // Add inline flag to prevent download
        if (viewUrl.includes('/upload/')) {
          viewUrl = viewUrl.replace('/upload/', '/upload/fl_inline/');
        }
      }
      
      // Open in new tab for viewing
      window.open(viewUrl, '_blank', 'noopener,noreferrer');
      
      toast.success(`📄 Opening ${title} for preview`);
    } catch (error) {
      console.error('View error:', error);
      toast.error('❌ Failed to open document');
    }ader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/authStore';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  ArrowLeft,
  Search,
  FileText,
  Check,
  X,
  Eye,
  Clock,
  Calendar,
  User,
  Book,
  GraduationCap,
  Trash2
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
  uploadedAt: { toDate: () => Date };
  views?: number;
  downloads?: number;
}

export default function ContentReview() {
  const { isAuthenticated } = useAuthStore();
  const isAdmin = useAdminStatus();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin');
      return;
    }

    let q;
    if (filterStatus === 'all') {
      q = query(collection(db, 'documents'), orderBy('uploadedAt', 'desc'));
    } else {
      q = query(
        collection(db, 'documents'), 
        where('status', '==', filterStatus),
        orderBy('uploadedAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Document[];
      
      setDocuments(docsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin, router, filterStatus]);

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.uploaderEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = async (docId: string, title: string) => {
    try {
      await updateDoc(doc(db, 'documents', docId), {
        status: 'approved'
      });
      toast.success(`Approved: ${title}`);
    } catch {
      toast.error('Failed to approve document');
    }
  };

  const handleReject = async (docId: string, title: string) => {
    try {
      await updateDoc(doc(db, 'documents', docId), {
        status: 'rejected'
      });
      toast.success(`Rejected: ${title}`);
    } catch {
      toast.error('Failed to reject document');
    }
  };

  const handleDelete = async (docId: string, title: string) => {
    if (confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      try {
        await deleteDoc(doc(db, 'documents', docId));
        toast.success(`Deleted: ${title}`);
      } catch {
        toast.error('Failed to delete document');
      }
    }
  };

  const handleViewDocument = (fileUrl: string, fileName: string, title: string) => {
    try {
      // Clean filename for download
      const cleanFileName = title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 50) + '.pdf';
      
      // Create download link
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = cleanFileName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`� Downloading ${title}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('❌ Download failed');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'approved': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-600 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'approved': return <Check className="h-3 w-3" />;
      case 'rejected': return <X className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
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

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'pending').length,
    approved: documents.filter(d => d.status === 'approved').length,
    rejected: documents.filter(d => d.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
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
                <FileText className="h-8 w-8 text-green-500" />
                Content Review
              </h1>
              <p className="text-muted-foreground">Review and manage uploaded documents</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Documents</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                <div className="text-sm text-muted-foreground">Approved</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                <div className="text-sm text-muted-foreground">Rejected</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background border-border"
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex gap-2">
                  {['all', 'pending', 'approved', 'rejected'].map((status) => (
                    <Button
                      key={status}
                      variant={filterStatus === status ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterStatus(status as 'all' | 'pending' | 'approved' | 'rejected')}
                      className="capitalize"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documents List */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Documents</CardTitle>
              <CardDescription>
                {filteredDocuments.length} of {documents.length} documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">Loading documents...</div>
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Documents Found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No documents match your search criteria.' : 'No documents uploaded yet.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredDocuments.map((document) => (
                    <div key={document.id} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-foreground truncate">{document.title}</h3>
                            <Badge className={getStatusColor(document.status)}>
                              {getStatusIcon(document.status)}
                              <span className="ml-1 capitalize">{document.status}</span>
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {document.description}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Book className="h-3 w-3" />
                              <span>{document.subject}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              <span>{document.course}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{document.uploaderEmail}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{document.uploadedAt.toDate().toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {/* Only show essential actions based on document status */}
                          {document.status === 'pending' ? (
                            // For pending documents: View, Approve, Reject
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDocument(document.fileUrl, document.fileName, document.title)}
                                className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApprove(document.id, document.title)}
                                className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                                title="Approve"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(document.id, document.title)}
                                className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                                title="Reject"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            // For approved/rejected documents: View, Delete
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDocument(document.fileUrl, document.fileName, document.title)}
                                className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(document.id, document.title)}
                                className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
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
