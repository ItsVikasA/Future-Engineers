'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BrowsePDFViewer } from '@/components/BrowsePDFViewer';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { Search, Filter, Download, Eye, Heart, Trash2, BookOpen, FileText, Star, Award, Sparkles } from 'lucide-react';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface Document {
  id: string;
  title: string;
  description?: string; // Optional for backward compatibility
  subject: string;
  university: string;
  branch: string;
  semester: string | number; // Support both for backward compatibility
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

  // Helper function to format semester for display
  const formatSemester = (semester: string | number): string => {
    let semNum: number;
    if (typeof semester === 'number') {
      semNum = semester;
    } else if (typeof semester === 'string') {
      const match = semester.match(/^(\d+)/);
      semNum = match ? parseInt(match[1], 10) : 0;
    } else {
      return 'Unknown Semester';
    }
    
    const suffix = (semNum % 100 >= 11 && semNum % 100 <= 13) ? 'th' :
                   (semNum % 10 === 1) ? 'st' :
                   (semNum % 10 === 2) ? 'nd' :
                   (semNum % 10 === 3) ? 'rd' : 'th';
    return `${semNum}${suffix} Semester`;
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
      
      // Debug logging
      console.log('🔍 Browse Page Debug Info:');
      console.log('Total Documents Found:', docs.length);
      console.log('Documents:', docs);
      console.log('Sample Document:', docs[0]);
    });

    return () => unsubscribe();
  }, []);

  // Filter and sort documents
  useEffect(() => {
    let filtered = documents;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(doc => {
        // Search through title, description, subject, branch, and university
        const titleMatch = (doc.title?.toLowerCase() || '').includes(searchLower);
        const descriptionMatch = (doc.description?.toLowerCase() || '').includes(searchLower);
        const subjectMatch = (doc.subject?.toLowerCase() || '').includes(searchLower);
        const branchMatch = (doc.branch?.toLowerCase() || '').includes(searchLower);
        const universityMatch = (doc.university?.toLowerCase() || '').includes(searchLower);
        
        // Search through semester (both number and formatted string)
        let semesterMatch = false;
        if (typeof doc.semester === 'number') {
          // Search by semester number (e.g., "1", "2", "3")
          semesterMatch = doc.semester.toString().includes(searchLower);
          // Also match formatted strings like "1st", "2nd", "3rd"
          const formattedSem = formatSemester(doc.semester).toLowerCase();
          semesterMatch = semesterMatch || formattedSem.includes(searchLower);
        } else if (typeof doc.semester === 'string') {
          semesterMatch = doc.semester.toLowerCase().includes(searchLower);
        }
        
        // Extract and search subject code (e.g., "BCS301" from "BCS301 - Data Structures")
        let subjectCodeMatch = false;
        if (doc.subject) {
          const subjectCodeRegex = /^([A-Z]{2,4}\d{3,4}[A-Z]?)/i;
          const match = doc.subject.match(subjectCodeRegex);
          if (match) {
            const subjectCode = match[1].toLowerCase();
            subjectCodeMatch = subjectCode.includes(searchLower);
          }
        }
        
        return titleMatch || descriptionMatch || subjectMatch || branchMatch || 
               universityMatch || semesterMatch || subjectCodeMatch;
      });
    }

    // Apply semester filter
    if (selectedSemester !== 'All Semesters') {
      // Convert selected semester to number for comparison
      const semesterNum = parseInt(selectedSemester, 10);
      filtered = filtered.filter(doc => {
        // Handle both string and number semester values for backward compatibility
        if (typeof doc.semester === 'number') {
          return doc.semester === semesterNum;
        } else if (typeof doc.semester === 'string') {
          // Extract number from string like "1st Semester" or compare directly
          const match = doc.semester.match(/^(\d+)/);
          const docSemesterNum = match ? parseInt(match[1], 10) : 0;
          return docSemesterNum === semesterNum;
        }
        return false;
      });
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

  // Prepare normalized groups for rendering so JSX stays simple and syntax-safe.
  const normalizedGroups = (() => {
    const normalize = (s: string) => s
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const grouped: Record<string, { key: string; originals: Record<string, number>; docs: Document[] }> = {};
    filteredDocuments.forEach(d => {
      const raw = d.branch || 'Other';
      const key = normalize(raw || 'Other') || 'other';
      if (!grouped[key]) grouped[key] = { key, originals: {}, docs: [] };
      grouped[key].docs.push(d);
      grouped[key].originals[raw] = (grouped[key].originals[raw] || 0) + 1;
    });

    const displayNameFor = (group: { key: string; originals: Record<string, number> }) => {
      const originals = group.originals;
      const entries = Object.entries(originals);
      if (entries.length === 0) return group.key.replace(/\b\w/g, c => c.toUpperCase());
      entries.sort((a, b) => b[1] - a[1]);
      return entries[0][0];
    };

    return Object.values(grouped).map(g => ({ key: g.key, display: displayNameFor(g), docs: g.docs }));
  })();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-lg">Loading documents...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      <Header />
      
      {/* Floating Decorative Elements - Enhanced with More Icons */}
      <div className="absolute top-20 right-10 opacity-10 animate-float pointer-events-none">
        <BookOpen className="w-32 h-32 text-blue-500" />
      </div>
      <div className="absolute top-40 left-20 opacity-10 animate-float-delayed pointer-events-none">
        <FileText className="w-24 h-24 text-green-500" />
      </div>
      <div className="absolute bottom-40 right-32 opacity-10 animate-float pointer-events-none">
        <Star className="w-28 h-28 text-yellow-500" />
      </div>
      <div className="absolute bottom-20 left-40 opacity-10 animate-float-delayed pointer-events-none">
        <Award className="w-20 h-20 text-purple-500" />
      </div>
      <div className="absolute top-1/2 left-10 opacity-10 animate-float pointer-events-none">
        <Sparkles className="w-16 h-16 text-pink-500" />
      </div>
      <div className="absolute top-1/3 right-40 opacity-8 animate-float-delayed pointer-events-none">
        <Search className="w-24 h-24 text-cyan-500" />
      </div>
      <div className="absolute bottom-1/3 left-32 opacity-8 animate-float pointer-events-none">
        <Download className="w-22 h-22 text-indigo-500" />
      </div>
      <div className="absolute top-1/4 left-1/4 opacity-8 animate-float-delayed pointer-events-none">
        <Eye className="w-20 h-20 text-teal-500" />
      </div>
      <div className="absolute bottom-1/4 right-1/4 opacity-8 animate-float pointer-events-none">
        <Heart className="w-18 h-18 text-rose-500" />
      </div>
      <div className="absolute top-2/3 right-20 opacity-8 animate-float-delayed pointer-events-none">
        <Filter className="w-20 h-20 text-violet-500" />
      </div>
      <div className="absolute bottom-1/2 left-16 opacity-8 animate-float pointer-events-none">
        <BookOpen className="w-26 h-26 text-emerald-500" />
      </div>
      <div className="absolute top-1/2 right-1/3 opacity-7 animate-float-delayed pointer-events-none">
        <FileText className="w-18 h-18 text-amber-500" />
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full mb-4">
              <Search className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-primary">Browse Resources</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Engineering Resources
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover and download high-quality academic resources shared by future engineers
            </p>
          </div>

          {/* Search and Filters Card */}
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                {/* Enhanced Search Bar */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
                    <Input 
                      placeholder="Search by subject, code, semester, or branch..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-14 bg-background/50 border-primary/20 text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-primary/50 transition-all text-base"
                    />
                  </div>
                </div>
                
                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Filter className="h-4 w-4 text-primary" />
                    <span>Filters:</span>
                  </div>
                  
                  <select 
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    aria-label="Select semester"
                    className="flex-1 h-11 px-4 bg-background/50 border border-primary/20 rounded-lg text-foreground hover:bg-background/80 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer transition-all"
                  >
                    <option value="All Semesters">All Semesters</option>
                    <option value="1">1st Semester</option>
                    <option value="2">2nd Semester</option>
                    <option value="3">3rd Semester</option>
                    <option value="4">4th Semester</option>
                    <option value="5">5th Semester</option>
                    <option value="6">6th Semester</option>
                    <option value="7">7th Semester</option>
                    <option value="8">8th Semester</option>
                  </select>
                  
                  <select 
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    aria-label="Select document type"
                    className="flex-1 h-11 px-4 bg-background/50 border border-primary/20 rounded-lg text-foreground hover:bg-background/80 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer transition-all"
                  >
                    <option value="All Types">All Types</option>
                    <option value="Notes">Notes</option>
                    <option value="Lab Manual">Lab Manual</option>
                    <option value="Question Paper">Question Paper</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Syllabus">Syllabus</option>
                  </select>

                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort documents by"
                    className="flex-1 h-11 px-4 bg-background/50 border border-primary/20 rounded-lg text-foreground hover:bg-background/80 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer transition-all"
                  >
                    <option value="Most Recent">Most Recent</option>
                    <option value="Most Downloaded">Most Downloaded</option>
                    <option value="Most Liked">Most Liked</option>
                    <option value="Title A-Z">Title A-Z</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Found <span className="font-bold text-primary text-lg">{filteredDocuments.length}</span> {filteredDocuments.length === 1 ? 'resource' : 'resources'}
          </p>
        </div>

        {/* Documents Grid grouped by branch */}
        <div className="space-y-8">
          {filteredDocuments.length > 0 ? (
            normalizedGroups.length > 0 ? (
              normalizedGroups.map((group) => (
                <div key={group.key}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-1 bg-gradient-to-b from-primary to-purple-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold">{group.display}</h2>
                    <Badge className="bg-primary/10 text-primary border-0">
                      {group.docs.length} {group.docs.length === 1 ? 'item' : 'items'}
                    </Badge>
                  </div>
                  
                  <div className="grid gap-4">
                    {group.docs.map((doc) => (
                      <Card key={doc.id} className="bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 hover:shadow-xl transition-all duration-300 group overflow-hidden">
                        <CardHeader className="p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors mb-3">
                                {doc.title}
                              </CardTitle>
                              {doc.description && (
                                <CardDescription className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                  {doc.description}
                                </CardDescription>
                              )}
                              
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0">
                                  {doc.documentType}
                                </Badge>
                                <Badge variant="outline" className="border-primary/30 text-foreground">
                                  {doc.subject}
                                </Badge>
                                <Badge variant="outline" className="border-green-500/30 text-green-600">
                                  {formatSemester(doc.semester)}
                                </Badge>
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                <span className="truncate max-w-[200px]">{doc.university}</span>
                                <span>•</span>
                                <span className="truncate max-w-[150px]">by {doc.uploaderEmail || doc.uploaderName}</span>
                                <span>•</span>
                                <span>{formatDate(doc.uploadedAt)}</span>
                              </div>
                            </div>
                            
                            <div className="flex sm:flex-col gap-2 shrink-0">
                              <BrowsePDFViewer documentId={doc.id} fileUrl={doc.fileUrl} title={doc.title} />
                              {isAdmin && (
                                <Button 
                                  onClick={() => handleDelete(doc.id, doc.title)} 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                >
                                  <Trash2 className="w-4 h-4 sm:mr-2" />
                                  <span className="hidden sm:inline">Delete</span>
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="px-6 pb-6 pt-0 border-t border-border/30">
                          <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-full bg-green-500/10">
                                <Download className="h-4 w-4 text-green-600" />
                              </div>
                              <span className="font-medium">{doc.downloads || 0}</span>
                              <span className="text-xs">downloads</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-full bg-blue-500/10">
                                <Eye className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="font-medium">{doc.views || 0}</span>
                              <span className="text-xs">views</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-full bg-pink-500/10">
                                <Heart className="h-4 w-4 text-pink-600" />
                              </div>
                              <span className="font-medium">{doc.likes || 0}</span>
                              <span className="text-xs">likes</span>
                            </div>
                            <div className="ml-auto text-sm font-medium text-muted-foreground">
                              {(doc.fileSize / 1024 / 1024).toFixed(1)} MB
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
                <CardContent className="p-12 text-center">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                    <Search className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">No documents found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search criteria or filters</p>
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedSemester('All Semesters');
                      setSelectedType('All Types');
                      setSortBy('Most Recent');
                    }}
                    className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            )
          ) : (
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
              <CardContent className="p-12 text-center">
                <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                  <Search className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No documents available</h3>
                <p className="text-muted-foreground">Be the first to share resources with the community!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
