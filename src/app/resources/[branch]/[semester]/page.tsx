'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// ...existing code...
import { useDocumentsByCategory } from '@/hooks/useDocuments';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Download, 
  ArrowLeft,
  GraduationCap,
  Cpu,
  Zap,
  Cog,
  Building,
  
  Eye,
  Calendar,
  User,
  
  CheckCircle,
  XCircle
} from 'lucide-react';
// ...existing code...
import academicResourcesData from '@/data/academicResources.json';

interface Resource {
  title: string;
  type: 'pdf' | 'video_playlist' | 'document' | 'link';
  url: string;
  uploadedBy?: string;
  uploadDate?: string;
  description?: string;
}

interface Category {
  name: string;
  slug: string;
  resources: Resource[];
}

interface Branch {
  name: string;
  categories: Category[];
}

interface Semester {
  semester: number;
  branches: Branch[];
}

interface AcademicResourcesData {
  pageTitle: string;
  semesters: Semester[];
}

const branchIcons: { [key: string]: React.ReactNode } = {
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
    case 'pdf':
      return <FileText className="w-5 h-5" />;
    case 'video_playlist':
      return <Video className="w-5 h-5" />;
    case 'document':
      return <BookOpen className="w-5 h-5" />;
    default:
      return <BookOpen className="w-5 h-5" />;
  }
};

// ...existing code...

export default function SemesterDetailPage() {
  // ...existing code... (auth not required in this view)
  const params = useParams();
  const [branchData, setBranchData] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);

  const branchName = decodeURIComponent(params.branch as string);
  const semester = parseInt(params.semester as string);

  // Get the correct semester format
  const getSemesterFormat = (sem: number) => {
    if (sem % 100 >= 11 && sem % 100 <= 13) return `${sem}th Semester`;
    switch (sem % 10) {
      case 1: return `${sem}st Semester`;
      case 2: return `${sem}nd Semester`;
      case 3: return `${sem}rd Semester`;
      default: return `${sem}th Semester`;
    }
  };

  // Fetch uploaded documents for this branch and semester
  const { documentsByCategory, documents, loading: documentsLoading, error } = useDocumentsByCategory({
    branch: branchName,
    semester: getSemesterFormat(semester),
    status: 'approved'
  });
  

  useEffect(() => {
    const data = academicResourcesData as AcademicResourcesData;
    const semesterData = data.semesters.find(s => s.semester === semester);
    
    if (semesterData) {
      const branch = semesterData.branches.find(b => b.name === branchName);
      setBranchData(branch || null);
    }
    
    setLoading(false);
  }, [branchName, semester]);

  // ...existing code...

  const totalResources = documents.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading resources...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!branchData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Resource Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The requested branch or semester could not be found.
            </p>
            <Link href="/resources">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Resources
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <Link href="/resources">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Back to Resources
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="p-3 sm:p-4 rounded-full bg-primary/20">
              {branchIcons[branchName] || <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />}
            </div>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground break-words">
                {branchName}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                <Badge variant="secondary" className="bg-primary/20 text-primary w-fit">
                  Semester {semester}
                </Badge>
                <Badge variant="outline" className="w-fit">
                  {totalResources} Resources
                </Badge>
              </div>
            </div>
          </div>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
            Study materials and resources for {branchName} - Semester {semester}
          </p>
        </div>

        {/* Resources by Category */}
        {documentsLoading ? (
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading resources...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="text-center py-12">
              <XCircle className="h-16 w-16 mx-auto mb-4 text-destructive opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Error Loading Resources
              </h3>
              <p className="text-muted-foreground mb-6">
                {error}
              </p>
            </CardContent>
          </Card>
        ) : totalResources === 0 ? (
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Resources Available
              </h3>
              <p className="text-muted-foreground mb-6">
                No study materials have been uploaded for this semester yet.
              </p>
              <Link href="/contribute">
                <Button>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Contribute Resources
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(documentsByCategory).map(([categoryName, categoryDocuments]) => (
              <Card key={categoryName} className="bg-card/50 backdrop-blur-sm border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {getResourceIcon('document')}
                    <span>{categoryName}</span>
                    <Badge variant="outline" className="ml-auto">
                      {categoryDocuments.length} {categoryDocuments.length === 1 ? 'Resource' : 'Resources'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {categoryDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-card/30 border border-border/50 hover:bg-card/50 transition-colors gap-3 sm:gap-4"
                      >
                        <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <div className="p-2 rounded bg-primary/10 flex-shrink-0">
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-foreground mb-1 text-sm sm:text-base break-words">
                              {doc.title}
                            </h4>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                              <Badge 
                                variant="outline" 
                                className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs w-fit"
                              >
                                {doc.documentType.toUpperCase()}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span className="truncate">{doc.uploadedBy}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span className="truncate">{doc.uploadedAt?.toDate?.()?.toLocaleDateString() || 'Unknown date'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span>Approved</span>
                              </div>
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
                              <span className="font-medium">{doc.subject}</span>
                              {doc.nestedSubject && (
                                <span> • {doc.nestedSubject}</span>
                              )}
                              <span> • {(doc.fileSize / 1024 / 1024).toFixed(1)} MB</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(doc.fileUrl, '_blank')}
                            className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white flex-1 sm:flex-none text-xs"
                          >
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground flex-1 sm:flex-none text-xs"
                            onClick={() => {
          // Clean filename and append VICKY
          const cleanFileName = doc.fileName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 50);
          const fileNameWithVicky = `${cleanFileName}_VICKY.pdf`;
          
          const link = document.createElement('a');
          link.href = doc.fileUrl;
          link.download = fileNameWithVicky;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
                            }}
                          >
                            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Contribute Section */}
        <Card className="mt-6 sm:mt-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="text-center py-6 sm:py-8">
            <BookOpen className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-primary" />
            <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
              Have Study Materials?
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              Help fellow students by contributing your notes, lab manuals, and question papers.
            </p>
            <Link href="/contribute">
              <Button size="lg" className="w-full sm:w-auto">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Contribute Resources
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
