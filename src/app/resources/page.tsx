'use client';

// Link not used in this file
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDocuments } from '@/hooks/useDocuments';
import type { Document } from '@/hooks/useDocuments';
import { 
  BookOpen, 
  FileText, 
  GraduationCap,
  Cpu,
  Zap,
  Cog,
  Building,
  Atom,
  Heart,
  Calculator,
  Layers,
  Code,
  Lightbulb
} from 'lucide-react';
import academicResourcesData from '@/data/academicResources.json';

interface Category {
  name: string;
  slug: string;
  resources: Document[];
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
  'Electrical and Electronics Engineering': <Zap className="w-5 h-5" />,
  'Artificial Intelligence and Data Science': <Cpu className="w-5 h-5" />,
  'Artificial Intelligence and Machine Learning': <Cpu className="w-5 h-5" />,
  'Information Science Engineering': <Cpu className="w-5 h-5" />,
  'Chemical Engineering': <Atom className="w-5 h-5" />,
  'Biomedical Engineering': <Heart className="w-5 h-5" />,
  'Mathematics': <Calculator className="w-5 h-5" />,
};


export default function AcademicResourcesPage() {
  const router = useRouter();
  const data = academicResourcesData as unknown as AcademicResourcesData;
  
  // Fetch all approved documents to get accurate counts
  const { documents } = useDocuments({ status: 'approved' });

  // Debug logging
  useEffect(() => {
    console.log('🔍 Resources Page Debug Info:');
    console.log('Total Documents Found:', documents.length);
    console.log('Documents:', documents);
    console.log('Sample Document:', documents[0]);
  }, [documents]);

  // Define the 8 branches we want to display
  const MAIN_BRANCHES = [
    'Computer Science & Engineering',
    'Electronics & Communication Engineering', 
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical and Electronics Engineering',
    'Artificial Intelligence and Data Science',
    'Artificial Intelligence and Machine Learning',
    'Information Science Engineering'
  ];

  // Group all branches across all semesters
  const allBranches: {[branchName: string]: {[semester: number]: Branch}} = {};
  
  data.semesters.forEach(semesterData => {
    semesterData.branches.forEach(branch => {
      if (!allBranches[branch.name]) {
        allBranches[branch.name] = {};
      }
      allBranches[branch.name][semesterData.semester] = branch;
    });
  });

  const handleSemesterSelect = (branchName: string, semester: number) => {
    // Navigate to the semester detail page
    const encodedBranchName = encodeURIComponent(branchName);
    router.push(`/resources/${encodedBranchName}/${semester}`);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      <Header />
      
      {/* Floating Decorative Elements - Enhanced with Many More Icons */}
      <div className="absolute top-20 right-16 opacity-10 animate-float pointer-events-none">
        <GraduationCap className="w-32 h-32 text-blue-500" />
      </div>
      <div className="absolute top-1/4 left-12 opacity-10 animate-float-delayed pointer-events-none">
        <BookOpen className="w-28 h-28 text-green-500" />
      </div>
      <div className="absolute bottom-24 right-24 opacity-10 animate-float pointer-events-none">
        <Layers className="w-26 h-26 text-purple-500" />
      </div>
      <div className="absolute bottom-1/3 left-20 opacity-10 animate-float-delayed pointer-events-none">
        <Code className="w-24 h-24 text-orange-500" />
      </div>
      <div className="absolute top-1/2 right-32 opacity-10 animate-float pointer-events-none">
        <Lightbulb className="w-22 h-22 text-yellow-500" />
      </div>
      <div className="absolute bottom-36 left-16 opacity-10 animate-float-delayed pointer-events-none">
        <FileText className="w-20 h-20 text-pink-500" />
      </div>
      <div className="absolute top-1/3 right-40 opacity-8 animate-float pointer-events-none">
        <Cpu className="w-26 h-26 text-cyan-500" />
      </div>
      <div className="absolute bottom-1/4 left-28 opacity-8 animate-float-delayed pointer-events-none">
        <Zap className="w-24 h-24 text-emerald-500" />
      </div>
      <div className="absolute top-2/3 left-10 opacity-8 animate-float pointer-events-none">
        <Cog className="w-22 h-22 text-indigo-500" />
      </div>
      <div className="absolute bottom-2/3 right-20 opacity-8 animate-float-delayed pointer-events-none">
        <Building className="w-20 h-20 text-violet-500" />
      </div>
      <div className="absolute top-1/2 left-1/4 opacity-8 animate-float pointer-events-none">
        <Atom className="w-24 h-24 text-teal-500" />
      </div>
      <div className="absolute bottom-1/2 right-1/4 opacity-8 animate-float-delayed pointer-events-none">
        <Calculator className="w-20 h-20 text-amber-500" />
      </div>
      <div className="absolute top-3/4 right-28 opacity-7 animate-float pointer-events-none">
        <Heart className="w-18 h-18 text-rose-500" />
      </div>
      <div className="absolute bottom-3/4 left-32 opacity-7 animate-float-delayed pointer-events-none">
        <BookOpen className="w-18 h-18 text-lime-500" />
      </div>
      <div className="absolute top-1/4 left-1/3 opacity-7 animate-float pointer-events-none">
        <GraduationCap className="w-20 h-20 text-fuchsia-500" />
      </div>
      <div className="absolute bottom-1/4 right-1/3 opacity-7 animate-float-delayed pointer-events-none">
        <Layers className="w-16 h-16 text-sky-500" />
      </div>
      
      <main className="container mx-auto px-4 py-8 sm:py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 mb-4 animate-bounce">
            <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
            Engineering Resources
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Access semester-wise study materials, notes, and question papers for all engineering branches
          </p>
          <div className="flex items-center justify-center gap-3 sm:gap-4 pt-4">
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-primary/10 hover:bg-primary/20 transition-colors">
              <BookOpen className="w-4 h-4 mr-2" />
              {MAIN_BRANCHES.length} Branches
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-primary/10 hover:bg-primary/20 transition-colors">
              <FileText className="w-4 h-4 mr-2" />
              {documents.length} Resources
            </Badge>
          </div>
        </div>

        {/* Engineering Branches Grid - Improved Modern Design */}
        <div className="space-y-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Select Your Branch
            </h2>
            <Badge variant="outline" className="text-sm border-primary/30 text-primary">
              {MAIN_BRANCHES.length} Available
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {MAIN_BRANCHES.map((branchName, index) => {
              const semesterData = allBranches[branchName] || {};
              const availableSemesters = Object.keys(semesterData).map(Number).sort();
              
              // Calculate actual document counts for this branch
              const branchDocuments = documents.filter(doc => {
                const docBranch = doc.branch || (doc as Document & { course?: string }).course || '';
                return docBranch === branchName;
              });
              const totalResources = branchDocuments.length;
              
              const ordinal = (n: number) => {
                if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
                switch (n % 10) {
                  case 1: return `${n}st`;
                  case 2: return `${n}nd`;
                  case 3: return `${n}rd`;
                  default: return `${n}th`;
                }
              };

              // Get semester-wise counts
              const allSemesterCounts = [1, 2, 3, 4, 5, 6, 7, 8].reduce((acc, sem) => {
                const count = branchDocuments.filter(doc => {
                  if (typeof doc.semester === 'number') {
                    return doc.semester === sem;
                  } else if (typeof doc.semester === 'string') {
                    const semesterKey = `${ordinal(sem)} Semester`;
                    return doc.semester === semesterKey;
                  }
                  return false;
                }).length;
                acc[sem] = count;
                return acc;
              }, {} as Record<number, number>);
              
              return (
                <Card 
                  key={branchName} 
                  className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 bg-card/80 backdrop-blur-sm hover:-translate-y-1"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardHeader className="relative pb-4 p-5">
                    {/* Icon with Animation */}
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 group-hover:from-primary/30 group-hover:to-purple-500/30 transition-all duration-300 mb-4 mx-auto group-hover:scale-110 group-hover:rotate-3">
                      {branchIcons[branchName] || <BookOpen className="w-7 h-7 text-primary" />}
                    </div>
                    
                    {/* Branch Name */}
                    <CardTitle className="text-center">
                      <h3 className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center px-2">
                        {branchName}
                      </h3>
                    </CardTitle>
                    
                    {/* Resource Count Badge */}
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <Badge 
                        variant="outline" 
                        className="border-primary/30 text-primary bg-primary/5 group-hover:bg-primary/10 transition-colors text-[10px] sm:text-xs px-2 py-1"
                      >
                        {availableSemesters.length} Sem • {totalResources} Files
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="relative space-y-3 pt-4 border-t border-border/50 p-3 sm:p-5">
                    {/* Semester Selection Title */}
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground mb-2 sm:mb-3">
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Select Semester</span>
                    </div>
                    
                    {/* Semester Grid - 2 columns, 4 rows */}
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                        const hasData = availableSemesters.includes(sem);
                        const semesterResources = allSemesterCounts[sem] || 0;
                        const hasDocuments = semesterResources > 0;
                        
                        return (
                          <button
                            key={sem}
                            onClick={() => hasData && handleSemesterSelect(branchName, sem)}
                            disabled={!hasData}
                            className={`
                              relative group/btn overflow-hidden rounded-lg border-2 transition-all duration-200 p-2 sm:p-3
                              ${hasDocuments
                                ? 'border-primary/40 bg-gradient-to-br from-primary/10 to-purple-500/10 hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 hover:scale-105 cursor-pointer' 
                                : hasData
                                  ? 'border-border/50 bg-muted/30 hover:bg-muted/50 cursor-pointer'
                                  : 'border-border/30 bg-muted/20 cursor-not-allowed opacity-40'
                              }
                            `}
                          >
                            <div className="relative text-center">
                              {/* Sem Number */}
                              <div className={`text-xs sm:text-sm font-bold mb-0.5 sm:mb-1 ${hasDocuments ? 'text-primary' : hasData ? 'text-foreground' : 'text-muted-foreground'}`}>
                                Sem {sem}
                              </div>
                              
                              {/* Resource Count */}
                              <div className={`text-[9px] sm:text-[10px] font-medium ${hasDocuments ? 'text-primary' : 'text-muted-foreground'}`}>
                                {hasDocuments ? `${semesterResources} files` : hasData ? 'Available' : 'Soon'}
                              </div>
                              
                              {/* Hover Glow Effect */}
                              {hasDocuments && (
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 rounded-lg -z-10" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Bottom Total */}
                    <div className="flex items-center justify-center pt-2 sm:pt-3 mt-2 border-t border-border/30">
                      <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                        <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 inline mr-1 text-red-500" />
                        {totalResources} total resources
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Statistics Section - Redesigned */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
            <CardContent className="text-center py-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20 mb-3">
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {MAIN_BRANCHES.length}
              </div>
              <div className="text-sm text-muted-foreground">Engineering Branches</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20 transition-all">
            <CardContent className="text-center py-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/20 mb-3">
                <FileText className="h-6 w-6 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {documents.length}
              </div>
              <div className="text-sm text-muted-foreground">Study Materials</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/20 transition-all">
            <CardContent className="text-center py-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-pink-500/20 mb-3">
                <GraduationCap className="h-6 w-6 text-pink-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">8</div>
              <div className="text-sm text-muted-foreground">Semesters Covered</div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action - Enhanced */}
        <Card className="mt-12 sm:mt-16 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/30 overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <CardContent className="relative p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-purple-500/30 mb-6 animate-pulse">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Can&apos;t find what you&apos;re looking for?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
              Help fellow engineers by contributing your notes, question papers, and study materials.
              Your contribution makes a difference!
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:scale-105"
              onClick={() => router.push('/contribute')}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Contribute Resources
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
