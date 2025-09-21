'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDocuments } from '@/hooks/useDocuments';
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
  Calculator
} from 'lucide-react';
import academicResourcesData from '@/data/academicResources.json';

interface Category {
  name: string;
  slug: string;
  resources: any[];
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
  const data = academicResourcesData as AcademicResourcesData;
  
  // Fetch all approved documents to get accurate counts
  const { documents } = useDocuments({ status: 'approved' });

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
            Comprehensive study materials organized by engineering branches
          </p>
        </div>

        {/* Resources Content - 7 Branch Grid Layout */}
        <div className="space-y-8">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Engineering Branches
            </h2>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              {MAIN_BRANCHES.length} Branches
            </Badge>
          </div>

          {/* 7 Branch Grid - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MAIN_BRANCHES.map((branchName) => {
              const semesterData = allBranches[branchName] || {};
              const availableSemesters = Object.keys(semesterData).map(Number).sort();
              
              // Calculate actual document counts for this branch
              const branchDocuments = documents.filter(doc => doc.branch === branchName);
              const totalResources = branchDocuments.length;
              
              // Get semester-wise document counts
              const semesterDocumentCounts = availableSemesters.reduce((acc, sem) => {
                const semesterKey = `${sem}th Semester`;
                const count = branchDocuments.filter(doc => doc.semester === semesterKey).length;
                acc[sem] = count;
                return acc;
              }, {} as Record<number, number>);
              
              return (
                <Card key={branchName} className="bg-card/50 backdrop-blur-sm border-border h-fit">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex flex-col items-center gap-3 text-foreground text-center">
                      <div className="p-3 rounded-full bg-primary/20">
                        {branchIcons[branchName] || <BookOpen className="w-6 h-6" />}
                      </div>
                      <h3 className="text-sm font-semibold leading-tight">
                        {branchName}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {availableSemesters.length} Sem Available
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* All Semesters Grid for this Branch */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-foreground text-center mb-3">
                        Select Semester
                      </h4>
                      
                      {/* 8 Semester Grid - 2x4 layout */}
                      <div className="grid grid-cols-2 gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => {
                          const hasData = availableSemesters.includes(semester);
                          const semesterResources = semesterDocumentCounts[semester] || 0;
                          const hasDocuments = semesterResources > 0;
                          
                          return (
                            <Button
                              key={semester}
                              variant="outline"
                              size="sm"
                              className={`${
                                hasDocuments
                                  ? 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                                  : hasData
                                    ? 'border-muted-foreground text-muted-foreground hover:bg-muted hover:text-muted-foreground'
                                    : 'border-gray-400 text-gray-400 opacity-50 cursor-not-allowed'
                              } h-8 text-xs flex flex-col items-center justify-center p-1`}
                              onClick={() => handleSemesterSelect(branchName, semester)}
                              disabled={!hasData}
                            >
                              <span>Sem {semester}</span>
                              <span className="text-[10px] opacity-70">
                                {semesterResources}
                              </span>
                            </Button>
                          );
                        })}
                      </div>

                      {/* Semester Selection Info */}
                      <div className="border-t border-border pt-4 mt-4">
                        <div className="text-center py-4 text-muted-foreground">
                          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-xs mb-2">Click on a semester to view resources</p>
                          <p className="text-xs text-primary">
                            {totalResources} resources available
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="text-center py-6">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {MAIN_BRANCHES.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Branches</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="text-center py-6">
              <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">
                {documents.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Resources</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardContent className="text-center py-6">
              <GraduationCap className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">8</div>
              <div className="text-sm text-muted-foreground">Semesters</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
