'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { BrowsePDFViewer } from '@/components/BrowsePDFViewer';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { Search, Filter, Download, Eye, Heart, Trash2 } from 'lucide-react';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
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
}

export default function BrowseNotes() {
  const { isAdmin } = useAdminStatus();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('All Semesters');
  const [selectedType, setSelectedType] = useState('All Types');
  const [sortBy, setSortBy] = useState('Most Recent');
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to handle Firestore timestamp conversion
  const getDateFromTimestamp = (timestamp: { toDate(): Date } | Date): Date => {
    if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    return timestamp instanceof Date ? timestamp : new Date();
  };

  // Fetch approved documents from Firestore
  useEffect(() => {
    // Remove orderBy to avoid composite index requirement
    const documentsQuery = query(
      collection(db, 'documents'),
      where('status', '==', 'approved')
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
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter and sort documents
  useEffect(() => {
    let filtered = documents;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.university.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply semester filter
    if (selectedSemester !== 'All Semesters') {
      filtered = filtered.filter(doc => doc.semester === selectedSemester);
    }

    // Apply type filter
    if (selectedType !== 'All Types') {
      filtered = filtered.filter(doc => doc.documentType === selectedType);
    }

    // Apply sorting
    switch (sortBy) {
      case 'Most Recent':
        filtered.sort((a, b) => {
          const dateA = getDateFromTimestamp(a.uploadedAt);
          const dateB = getDateFromTimestamp(b.uploadedAt);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      case 'Most Downloaded':
        filtered.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        break;
      case 'Most Liked':
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'Title A-Z':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredDocuments(filtered);
  }, [documents, searchTerm, selectedSemester, selectedType, sortBy]);

  const handleDelete = async (documentId: string, title: string) => {
    // Only allow admins to delete
    if (!isAdmin) {
      toast.error('❌ Only administrators can delete documents', {
        duration: 4000,
      });
      return;
    }

    if (!confirm(`Are you sure you want to permanently delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'documents', documentId));
      toast.success('🗑️ Document deleted successfully!', {
        duration: 3000,
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('❌ Failed to delete document', {
        duration: 4000,
      });
    }
  };

  const formatDate = (timestamp: { toDate(): Date } | Date): string => {
    const date = getDateFromTimestamp(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-lg">Loading documents...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">Engineering Resources</h1>
          <p className="text-lg text-gray-400">
            Discover and download high-quality academic resources shared by future engineers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search notes, courses, topics..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2 border-white/30 text-white hover:bg-white/10">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <select 
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                title="Select semester"
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-md text-sm text-white"
              >
                <option value="All Semesters">All Semesters</option>
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
                <option value="3rd Semester">3rd Semester</option>
                <option value="4th Semester">4th Semester</option>
                <option value="5th Semester">5th Semester</option>
                <option value="6th Semester">6th Semester</option>
                <option value="7th Semester">7th Semester</option>
                <option value="8th Semester">8th Semester</option>
              </select>
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                title="Select document type"
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-md text-sm text-white"
              >
                <option value="All Types">All Types</option>
                <option value="Notes">Notes</option>
                <option value="Lab Manual">Lab Manual</option>
                <option value="Question Paper">Question Paper</option>
                <option value="Assignment">Assignment</option>
                <option value="Syllabus">Syllabus</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">
            Showing <span className="font-semibold text-white">{filteredDocuments.length}</span> results
          </p>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            title="Sort by"
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-md text-sm text-white"
          >
            <option value="Most Recent">Sort by: Most Recent</option>
            <option value="Most Downloaded">Sort by: Most Downloaded</option>
            <option value="Most Liked">Sort by: Most Liked</option>
            <option value="Title A-Z">Sort by: Title A-Z</option>
          </select>
        </div>

        {/* Documents Grid */}
        <div className="grid gap-6">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
              <Card key={doc.id} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl text-white group-hover:text-purple-200 transition-colors">{doc.title}</CardTitle>
                      </div>
                      <CardDescription className="text-sm text-gray-400 mb-3">
                        {doc.description}
                      </CardDescription>
                      
                      {/* Document Meta */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="text-purple-300">{doc.course} • {doc.semester}</span>
                        <span>•</span>
                        <span>{doc.university}</span>
                        <span>•</span>
                        <span>by {doc.uploaderEmail || doc.uploaderName}</span>
                        <span>•</span>
                        <span>{formatDate(doc.uploadedAt)}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">{doc.documentType}</Badge>
                        <Badge variant="outline" className="text-xs border-white/30 text-gray-400 hover:bg-white/10">
                          {doc.subject}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span>{doc.downloads || 0} downloads</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{doc.views || 0} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{doc.likes || 0} likes</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <BrowsePDFViewer 
                        documentId={doc.id}
                        fileUrl={doc.fileUrl}
                        title={doc.title}
                      />
                      {isAdmin && (
                        <Button 
                          onClick={() => handleDelete(doc.id, doc.title)}
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
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">No documents found</p>
                <p className="text-gray-500">Try adjusting your search criteria or filters</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
            Load More Documents
          </Button>
        </div>

        {/* Empty State (when no documents) */}
        {documents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}
