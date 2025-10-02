'use client';

// Admin review page for document management and approval
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuthStore } from '@/stores/authStore';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, orderBy, increment, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  ArrowLeft,
  Search,
  FileText,
  Check,
  X,
  Eye,
  Download,
  Clock,
  Calendar,
  User,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [previewDialog, setPreviewDialog] = useState<{ isOpen: boolean; document: Document | null }>({
    isOpen: false,
    document: null
  });

  // Redirect if not admin
  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isAdmin, router]);

  // Fetch documents
  useEffect(() => {
    const q = query(
      collection(db, 'documents'),
      orderBy('uploadedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Document[];
      setDocuments(docs);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleApprove = async (docId: string, title: string) => {
    try {
      // Get the document to find the uploader
      const docRef = doc(db, 'documents', docId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        toast.error('Document not found');
        return;
      }

      const docData = docSnap.data();
      const uploaderId = docData.uploadedBy;

      // Approve the document
      await updateDoc(docRef, {
        status: 'approved'
      });

      // Update user's reputation and contribution count
      if (uploaderId) {
        const userRef = doc(db, 'users', uploaderId);
        await updateDoc(userRef, {
          reputation: increment(10), // Award 10 reputation points
          contributions: increment(1) // Increment contribution count
        });
        console.log(`✅ Updated reputation for user: ${uploaderId}`);
      }

      toast.success(`✅ Approved: ${title}`);
    } catch (error) {
      console.error('Error approving document:', error);
      toast.error('❌ Failed to approve document');
    }
  };

  const handleReject = async (docId: string, title: string) => {
    try {
      // Get the document to find the uploader
      const docRef = doc(db, 'documents', docId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        toast.error('Document not found');
        return;
      }

      const docData = docSnap.data();
      const uploaderId = docData.uploadedBy;

      // Reject the document
      await updateDoc(docRef, {
        status: 'rejected'
      });

      // Optionally: Deduct reputation on rejection (can be removed if not desired)
      if (uploaderId) {
        const userRef = doc(db, 'users', uploaderId);
        await updateDoc(userRef, {
          reputation: increment(-2) // Small penalty for rejected content
        });
        console.log(`⚠️ Updated reputation for rejected upload: ${uploaderId}`);
      }

      toast.success(`❌ Rejected: ${title}`);
    } catch (error) {
      console.error('Error rejecting document:', error);
      toast.error('❌ Failed to reject document');
    }
  };

  const handleDelete = async (docId: string, title: string) => {
    try {
      await deleteDoc(doc(db, 'documents', docId));
      toast.success(`🗑️ Deleted: ${title}`);
    } catch {
      toast.error('❌ Failed to delete document');
    }
  };

  const handleViewDocument = (document: Document) => {
    setPreviewDialog({ isOpen: true, document });
  };

  const handleDownloadFromPreview = async () => {
    if (!previewDialog.document) return;
    
    const { fileUrl, title } = previewDialog.document;
    
    try {
      // Clean title for filename
      const fileName = title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 50) + '.pdf';
      
      // Fix folder name in URL if needed
      let downloadUrl = fileUrl;
      if (downloadUrl.includes('/student-notes/')) {
        downloadUrl = downloadUrl.replace('/student-notes/', '/future_engineers/');
      }
      
      // Create download link
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success(`✅ Download started: ${title}`);
      setPreviewDialog({ isOpen: false, document: null });
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

  // Filter documents based on search query and status
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.uploaderName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: { toDate: () => Date } | Date): string => {
    const date = timestamp && typeof timestamp === 'object' && 'toDate' in timestamp 
      ? timestamp.toDate() 
      : new Date(timestamp);
    return date.toLocaleDateString();
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">You need admin privileges to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin')}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Review</h1>
            <p className="text-gray-600 dark:text-gray-400">Review and manage uploaded documents</p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-white/20 dark:border-gray-700/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>
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
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 border-white/20 dark:border-gray-700/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <FileText className="h-5 w-5" />
              Documents
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {filteredDocuments.length} of {documents.length} documents
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="text-gray-500 dark:text-gray-400">Loading documents...</div>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-500 dark:text-gray-400">No documents found</div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDocuments.map((document) => (
                  <div key={document.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {document.title}
                          </h3>
                          <Badge className={`${getStatusColor(document.status)} border`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(document.status)}
                              <span className="capitalize">{document.status}</span>
                            </div>
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {document.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" />
                            {document.subject}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {document.uploaderName}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(document.uploadedAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {formatFileSize(document.fileSize)}
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
                              onClick={() => handleViewDocument(document)}
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
                              onClick={() => handleViewDocument(document)}
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

      {/* Preview Dialog - Similar to Browse Page */}
      <Dialog open={previewDialog.isOpen} onOpenChange={(open) => setPreviewDialog({ isOpen: open, document: null })}>
        <DialogContent className="max-w-4xl w-full h-[80vh] bg-black/90 border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">
              {previewDialog.document?.title || 'Document Preview'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">PDF Document</h3>
                <p className="text-gray-600 mb-2 font-medium">{previewDialog.document?.title}</p>
                <p className="text-gray-500 mb-6 text-sm">
                  Click below to download this PDF document for review
                </p>
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 italic">
                    PDF viewing is disabled to prevent unwanted downloads.
                  </p>
                  <Button
                    onClick={handleDownloadFromPreview}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button 
              onClick={handleDownloadFromPreview} 
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
