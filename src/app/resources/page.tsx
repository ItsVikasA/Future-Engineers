'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Download, 
  ExternalLink,
  GraduationCap,
  Cpu,
  Zap,
  Cog,
  Building,
  Atom,
  LogIn,
  Heart,
  Calculator
} from 'lucide-react';
import toast from 'react-hot-toast';
import academicResourcesData from '@/data/academicResources.json';

interface Resource {
  title: string;
  type: 'pdf' | 'video_playlist' | 'document' | 'link';
  url: string;
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
  'Computer Science & Engineering': <Cpu className="w-5 h-5" />,
  'Electronics & Communication Engineering': <Zap className="w-5 h-5" />,
  'Mechanical Engineering': <Cog className="w-5 h-5" />,
  'Civil Engineering': <Building className="w-5 h-5" />,
  'Chemical Engineering': <Atom className="w-5 h-5" />,
  'Biomedical Engineering': <Heart className="w-5 h-5" />,
  'Mathematics': <Calculator className="w-5 h-5" />,
};

const getResourceIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FileText className="w-4 h-4" />;
    case 'video_playlist':
      return <Video className="w-4 h-4" />;
    case 'category':
      return <BookOpen className="w-4 h-4" />;
    default:
      return <BookOpen className="w-4 h-4" />;
  }
};

const getResourceColor = (type: string) => {
  switch (type) {
    case 'pdf':
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    case 'video_playlist':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    default:
      return 'bg-green-500/20 text-green-300 border-green-500/30';
  }
};

export default function AcademicResourcesPage() {
  const { isAuthenticated } = useAuthStore();
  const [selectedSemester, setSelectedSemester] = useState(1);
  const data = academicResourcesData as AcademicResourcesData;

  const currentSemester = data.semesters.find(sem => sem.semester === selectedSemester);

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
          const link = document.createElement('a');
          link.href = resource.url;
          link.download = resource.title;
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">
              {data.pageTitle}
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive study materials organized by semester and engineering branch
          </p>
        </div>

        {/* Semester Selector */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Select Semester</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {data.semesters.map((semester) => (
              <Button
                key={semester.semester}
                variant={selectedSemester === semester.semester ? "default" : "outline"}
                className={`h-12 ${
                  selectedSemester === semester.semester
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                }`}
                onClick={() => setSelectedSemester(semester.semester)}
              >
                Sem {semester.semester}
              </Button>
            ))}
          </div>
        </div>

        {/* Resources Content */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Semester {selectedSemester} Resources
            </h2>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              {currentSemester?.branches.length || 0} Branches
            </Badge>
          </div>

          {currentSemester?.branches.length === 0 ? (
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardContent className="text-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Resources Available</h3>
                <p className="text-muted-foreground mb-6">
                  Resources for Semester {selectedSemester} are being prepared. Check back soon!
                </p>
                <Link href="/contribute">
                  <Button className="bg-primary hover:bg-primary/90">
                    Contribute Resources
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {currentSemester?.branches.map((branch, branchIndex) => {
                const totalResources = branch.categories.reduce((total, category) => total + category.resources.length, 0);
                
                return (
                  <Card key={branchIndex} className="bg-card/50 backdrop-blur-sm border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-foreground">
                        {branchIcons[branch.name] || <BookOpen className="w-5 h-5" />}
                        {branch.name}
                        <Badge variant="outline" className="ml-auto text-xs">
                          {totalResources} Resources
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">
                        Study materials and resources for {branch.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {branch.categories.length === 0 || totalResources === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                          <p>No resources available yet for this branch</p>
                          <Link href="/contribute">
                            <Button variant="link" className="text-primary mt-2">
                              Be the first to contribute
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {branch.categories.map((category, categoryIndex) => (
                            category.resources.length > 0 && (
                              <div key={categoryIndex} className="space-y-3">
                                <h4 className="text-lg font-semibold text-primary flex items-center gap-2">
                                  {getResourceIcon('category')}
                                  {category.name}
                                  <Badge variant="outline" className="text-xs">
                                    {category.resources.length}
                                  </Badge>
                                </h4>
                                <div className="grid gap-3 pl-4">
                                  {category.resources.map((resource, resourceIndex) => (
                                    <div
                                      key={resourceIndex}
                                      className="flex items-center justify-between p-4 rounded-lg bg-card/30 border border-border hover:bg-card/50 transition-colors"
                                    >
                                      <div className="flex items-center gap-3">
                                        {getResourceIcon(resource.type)}
                                        <div>
                                          <h5 className="font-medium text-foreground">{resource.title}</h5>
                                          <Badge 
                                            variant="outline" 
                                            className={`text-xs mt-1 ${getResourceColor(resource.type)}`}
                                          >
                                            {resource.type.replace('_', ' ').toUpperCase()}
                                          </Badge>
                                        </div>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className={`${
                                          resource.type === 'video_playlist' || isAuthenticated || resource.url.startsWith('http')
                                            ? 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                                            : 'border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-black'
                                        }`}
                                        onClick={() => handleResourceClick(resource)}
                                        disabled={!resource.url.startsWith('http') && resource.type !== 'video_playlist' && !isAuthenticated}
                                      >
                                        {resource.type === 'video_playlist' ? (
                                          <>
                                            <ExternalLink className="w-4 h-4 mr-1" />
                                            Watch
                                          </>
                                        ) : resource.url.startsWith('http') ? (
                                          <>
                                            <ExternalLink className="w-4 h-4 mr-1" />
                                            Open
                                          </>
                                        ) : isAuthenticated ? (
                                          <>
                                            <Download className="w-4 h-4 mr-1" />
                                            Download
                                          </>
                                        ) : (
                                          <>
                                            <LogIn className="w-4 h-4 mr-1" />
                                            Sign in
                                          </>
                                        )}
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Statistics Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="text-center py-6">
              <BookOpen className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {data.semesters.reduce((total, sem) => total + sem.branches.length, 0)}
              </div>
              <div className="text-sm text-gray-400">Total Branches</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="text-center py-6">
              <FileText className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {data.semesters.reduce((total, sem) => 
                  total + sem.branches.reduce((branchTotal, branch) => 
                    branchTotal + branch.categories.reduce((catTotal, category) => 
                      catTotal + category.resources.length, 0
                    ), 0
                  ), 0
                )}
              </div>
              <div className="text-sm text-gray-400">Total Resources</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="text-center py-6">
              <GraduationCap className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">8</div>
              <div className="text-sm text-gray-400">Semesters</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
