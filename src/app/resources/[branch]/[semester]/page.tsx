'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { useDocumentsByCategory } from '@/hooks/useDocuments';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Download, 
  ExternalLink,
  ArrowLeft,
  GraduationCap,
  Cpu,
  Zap,
  Cog,
  Building,
  LogIn,
  Eye,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
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

const getResourceColor = (type: string) => {
  switch (type) {
    case 'pdf':
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    case 'video_playlist':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'document':
      return 'bg-green-500/20 text-green-300 border-green-500/30';
    default:
      return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

export default function SemesterDetailPage() {
  const { isAuthenticated } = useAuthStore();
  const params = useParams();
  const router = useRouter();
  const [branchData, setBranchData] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);

  const branchName = decodeURIComponent(params.branch as string);
  const semester = parseInt(params.semester as string);

  // Fetch uploaded documents for this branch and semester
  const { documentsByCategory, documents, loading: documentsLoading, error } = useDocumentsByCategory({
    branch: branchName,
    semester: `${semester}th Semester`,
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

  const handleResourceClick = async (resource: Resource) => {
    if (resource.url.startsWith('http')) {
      // External links
      window.open(resource.url, '_blank');
      toast.success(`🔗 Opening ${resource.title}`, {
        duration: 3000,
      });
    } else {
      // Check authentication for file downloads
      if (!isAuthenticated) {
        toast.error('🔒 Please sign in to download files');
        return;
      }

      // Handle internal file downloads
      const loadingToast = toast.loading(`📄 Preparing download for ${resource.title}...`);
      
      try {
        // Check if file exists first
        const response = await fetch(resource.url, { method: 'HEAD' });
        toast.dismiss(loadingToast);
        
        if (response.ok) {
          // File exists, proceed with download
          // Clean filename and append VICKY
          const cleanTitle = resource.title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 50);
          const fileNameWithVicky = `${cleanTitle}_VICKY.pdf`;
          
          const link = document.createElement('a');
          link.href = resource.url;
          link.download = fileNameWithVicky;
          link.target = '_blank';
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          toast.success(`✅ Download started: ${resource.title}`, {
            duration: 4000,
          });
        } else {
          toast.error(`❌ File not available: ${resource.title}`, {
            duration: 5000,
          });
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        console.error('Download error:', error);
        toast.error(`📋 Resource coming soon! "${resource.title}" will be available in the next update.`, {
          duration: 5000,
        });
      }
    }
  };

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
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/resources">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Resources
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 rounded-full bg-primary/20">
              {branchIcons[branchName] || <GraduationCap className="w-8 h-8" />}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {branchName}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  Semester {semester}
                </Badge>
                <Badge variant="outline">
                  {totalResources} Resources
                </Badge>
              </div>
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground">
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
                    {categoryDocuments.map((document) => (
                      <div
                        key={document.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-card/30 border border-border/50 hover:bg-card/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="p-2 rounded bg-primary/10">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-foreground mb-1">
                              {document.title}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <Badge 
                                variant="outline" 
                                className="bg-blue-500/20 text-blue-300 border-blue-500/30"
                              >
                                {document.documentType.toUpperCase()}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {document.uploadedBy}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {document.uploadedAt?.toDate?.()?.toLocaleDateString() || 'Unknown date'}
                              </div>
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                Approved
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              <span className="font-medium">{document.subject}</span>
                              {document.nestedSubject && (
                                <span> • {document.nestedSubject}</span>
                              )}
                              <span> • {(document.fileSize / 1024 / 1024).toFixed(1)} MB</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(document.fileUrl, '_blank')}
                            className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                            onClick={() => {
          // Clean filename and append VICKY
          const cleanFileName = document.fileName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 50);
          const fileNameWithVicky = `${cleanFileName}_VICKY.pdf`;
          
          const link = document.createElement('a');
          link.href = document.fileUrl;
          link.download = fileNameWithVicky;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
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
        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Have Study Materials?
            </h3>
            <p className="text-muted-foreground mb-6">
              Help fellow students by contributing your notes, lab manuals, and question papers.
            </p>
            <Link href="/contribute">
              <Button size="lg">
                <BookOpen className="w-5 h-5 mr-2" />
                Contribute Resources
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
