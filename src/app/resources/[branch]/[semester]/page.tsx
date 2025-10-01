'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BrowsePDFViewer } from '@/components/BrowsePDFViewer';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  BookOpen, 
  FileText, 
  Download, 
  ArrowLeft,
  Cpu,
  Zap,
  Cog,
  Building,
  Eye,
  Heart,
  AlertCircle,
  GraduationCap
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  documentType: string;
  branch: string;
  semester: string | number;
  subject: string;
  nestedSubject?: string;
  university: string;
  uploadedBy: string;
  uploaderName?: string;
  uploaderEmail?: string;
  description?: string;
  uploadedAt: { toDate(): Date } | Date;
  status: 'pending' | 'approved' | 'rejected';
  downloads?: number;
  likes?: number;
  views?: number;
}

const branchIcons: { [key: string]: React.ReactNode} = {
  'Computer Science & Engineering': <Cpu className="w-6 h-6" />,
  'Electronics & Communication Engineering': <Zap className="w-6 h-6" />,
  'Mechanical Engineering': <Cog className="w-6 h-6" />,
  'Civil Engineering': <Building className="w-6 h-6" />,
  'Electrical and Electronics Engineering': <Zap className="w-6 h-6" />,
  'Artificial Intelligence and Data Science': <Cpu className="w-6 h-6" />,
  'Artificial Intelligence and Machine Learning': <Cpu className="w-6 h-6" />,
  'Information Science Engineering': <Cpu className="w-6 h-6" />,
};

const getResourceIcon = (type: string) => {
  switch (type) {
    case 'Notes':
      return <FileText className="w-5 h-5" />;
    case 'Lab Manual':
      return <BookOpen className="w-5 h-5" />;
    case 'Question Paper':
      return <FileText className="w-5 h-5" />;
    case 'Assignment':
      return <FileText className="w-5 h-5" />;
    case 'Syllabus':
      return <FileText className="w-5 h-5" />;
    default:
      return <BookOpen className="w-5 h-5" />;
  }
};

export default function SemesterDetailPage() {
  const params = useParams();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentsByType, setDocumentsByType] = useState<Record<string, Document[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const branchName = decodeURIComponent(params.branch as string);
  const semester = parseInt(params.semester as string);

  // Helper function to format semester for display
  const formatSemester = (sem: number) => {
    if (sem % 100 >= 11 && sem % 100 <= 13) return `${sem}th Semester`;
    switch (sem % 10) {
      case 1: return `${sem}st Semester`;
      case 2: return `${sem}nd Semester`;
      case 3: return `${sem}rd Semester`;
      default: return `${sem}th Semester`;
    }
  };

  // Helper function to format date
  const formatDate = (timestamp: { toDate(): Date } | Date): string => {
    try {
      const date = typeof timestamp === 'object' && 'toDate' in timestamp 
        ? timestamp.toDate() 
        : timestamp instanceof Date 
        ? timestamp 
        : new Date();
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return 'Unknown date';
    }
  };

  // Fetch documents from Firestore
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 Fetching documents for:');
        console.log('Branch:', branchName);
        console.log('Semester:', semester, '(type:', typeof semester, ')');

        // First, get ALL approved documents to see what's available
        const allDocsQuery = query(
          collection(db, 'documents'),
          where('status', '==', 'approved')
        );

        const allSnapshot = await getDocs(allDocsQuery);
        console.log('📊 Total approved documents in database:', allSnapshot.size);
        
        // Filter documents client-side to handle both string and number semesters
        const docs: Document[] = [];
        
        allSnapshot.forEach((doc) => {
          const docData = doc.data();
          
          // Check semester match (handle both number and string formats)
          let semesterMatches = false;
          if (typeof docData.semester === 'number') {
            semesterMatches = docData.semester === semester;
          } else if (typeof docData.semester === 'string') {
            // Extract number from string like "1st Semester" or "3rd Semester"
            const match = docData.semester.match(/^(\d+)/);
            const extractedSemester = match ? parseInt(match[1], 10) : 0;
            semesterMatches = extractedSemester === semester;
          }
          
          // Check branch match (exact or contains)
          const branchMatches = docData.branch === branchName || 
                                docData.branch?.includes('Computer Science');
          
          console.log('📄 Checking document:', {
            id: doc.id,
            branch: docData.branch,
            branchMatches,
            semester: docData.semester,
            semesterType: typeof docData.semester,
            semesterMatches,
            status: docData.status,
            title: docData.title || docData.fileName
          });
          
          if (semesterMatches && branchMatches) {
            docs.push({
              id: doc.id,
              ...docData,
            } as Document);
          }
        });

        console.log('📚 Documents found after filtering:', docs.length);
        console.log('Documents:', docs);

        // Sort documents by upload date (newest first)
        docs.sort((a, b) => {
          const dateA = typeof a.uploadedAt === 'object' && 'toDate' in a.uploadedAt 
            ? a.uploadedAt.toDate().getTime() 
            : new Date(a.uploadedAt).getTime();
          const dateB = typeof b.uploadedAt === 'object' && 'toDate' in b.uploadedAt 
            ? b.uploadedAt.toDate().getTime() 
            : new Date(b.uploadedAt).getTime();
          return dateB - dateA;
        });

        // Group documents by type
        const grouped: Record<string, Document[]> = {};
        docs.forEach((doc) => {
          const type = doc.documentType;
          if (!grouped[type]) {
            grouped[type] = [];
          }
          grouped[type].push(doc);
        });

        setDocuments(docs);
        setDocumentsByType(grouped);
      } catch (err) {
        console.error('❌ Error fetching documents:', err);
        setError('Failed to load documents. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [branchName, semester]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
              <div className="relative h-16 w-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              </div>
              <p className="text-muted-foreground font-medium">Loading resources...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto mt-20 border-destructive/20 bg-card/50 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 ring-8 ring-destructive/5 mb-4">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-3">Error Loading Resources</h1>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Link href="/resources">
                <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Resources
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8 sm:py-12">
        {/* Modern Hero Section */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/resources">
              <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:border-primary/30 transition-all duration-200">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Resources
              </Button>
            </Link>
          </div>
          
          <div className="text-center space-y-5">
            {/* Branch Icon Badge */}
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 backdrop-blur-sm ring-4 ring-primary/5 animate-in zoom-in duration-700">
              {branchIcons[branchName] || <GraduationCap className="w-8 h-8 text-primary" />}
            </div>
            
            {/* Branch Name - Gradient Text */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700">
              {branchName}
            </h1>
            
            {/* Semester Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              <BookOpen className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-primary">{formatSemester(semester)}</span>
            </div>
            
            {/* Description */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              Study materials and resources for {branchName}
            </p>
            
            {/* Stats Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-primary/20 bg-card/50 backdrop-blur-sm">
              <FileText className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium">
                {documents.length} {documents.length === 1 ? 'Resource' : 'Resources'} Available
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {documents.length === 0 ? (
          <Card className="border-dashed border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardContent className="py-16 text-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5 mb-6">
                <FileText className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">No Resources Available</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                No study materials have been uploaded for this semester yet. Be the first to contribute!
              </p>
              <Link href="/contribute">
                <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/20">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Contribute Resources
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(documentsByType).map(([docType, docs]) => (
              <Card key={docType} className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-lg hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                <CardHeader className="border-b border-border/50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      {getResourceIcon(docType)}
                    </div>
                    <CardTitle className="text-xl">{docType}</CardTitle>
                    <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary border-primary/20">
                      {docs.length} {docs.length === 1 ? 'Resource' : 'Resources'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-4">
                    {docs.map((doc) => (
                      <Card key={doc.id} className="bg-background/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0 space-y-3">
                              <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1">
                                {doc.title || doc.fileName}
                              </CardTitle>
                              {doc.description && (
                                <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                                  {doc.description}
                                </CardDescription>
                              )}
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0">
                                  {doc.documentType}
                                </Badge>
                                <Badge variant="outline" className="border-green-500/30 text-green-500 bg-green-500/5">
                                  {doc.subject}
                                </Badge>
                                {doc.nestedSubject && (
                                  <Badge variant="outline" className="border-blue-500/30 text-blue-500 bg-blue-500/5 text-xs">
                                    {doc.nestedSubject}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                <span className="truncate max-w-[200px]">{doc.university}</span>
                                <span>•</span>
                                <span className="truncate max-w-[200px]">by {doc.uploaderEmail || doc.uploaderName}</span>
                                <span>•</span>
                                <span>{formatDate(doc.uploadedAt)}</span>
                              </div>
                            </div>
                            <div className="shrink-0">
                              <BrowsePDFViewer documentId={doc.id} fileUrl={doc.fileUrl} title={doc.title || doc.fileName} />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 border-t border-border/30">
                          <div className="flex items-center gap-6 text-sm pt-4">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                                <Download className="h-4 w-4 text-green-500" />
                              </div>
                              <span className="text-muted-foreground">{doc.downloads || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <Eye className="h-4 w-4 text-blue-500" />
                              </div>
                              <span className="text-muted-foreground">{doc.views || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-pink-500/10 flex items-center justify-center">
                                <Heart className="h-4 w-4 text-pink-500" />
                              </div>
                              <span className="text-muted-foreground">{doc.likes || 0}</span>
                            </div>
                            <div className="ml-auto text-xs text-muted-foreground font-medium px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
                              {(doc.fileSize / 1024 / 1024).toFixed(1)} MB
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Enhanced Contribution CTA */}
        {documents.length > 0 && (
          <Card className="mt-10 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/20 shadow-xl">
            <CardContent className="py-10 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5 mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Have more resources to share?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Help your fellow students by contributing your notes and study materials!
              </p>
              <Link href="/contribute">
                <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Contribute Resources
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
