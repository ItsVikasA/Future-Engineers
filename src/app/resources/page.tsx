'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Heart,
  Calculator
} from 'lucide-react';
import academicResourcesData from '@/data/academicResources.json';

interface Resource {
  title: string;
  type: 'pdf' | 'video_playlist' | 'document' | 'link';
  url: string;
}

interface Branch {
  name: string;
  resources: Resource[];
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
  const [selectedSemester, setSelectedSemester] = useState(1);
  const data = academicResourcesData as AcademicResourcesData;

  const currentSemester = data.semesters.find(sem => sem.semester === selectedSemester);

  const handleResourceClick = (resource: Resource) => {
    if (resource.url.startsWith('http')) {
      window.open(resource.url, '_blank');
    } else {
      // Handle internal file downloads
      window.open(resource.url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {data.pageTitle}
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Comprehensive study materials organized by semester and engineering branch
          </p>
        </div>

        {/* Semester Selector */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Select Semester</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {data.semesters.map((semester) => (
              <Button
                key={semester.semester}
                variant={selectedSemester === semester.semester ? "default" : "outline"}
                className={`h-12 ${
                  selectedSemester === semester.semester
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black'
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
            <h2 className="text-2xl font-semibold text-white">
              Semester {selectedSemester} Resources
            </h2>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              {currentSemester?.branches.length || 0} Branches
            </Badge>
          </div>

          {currentSemester?.branches.length === 0 ? (
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Resources Available</h3>
                <p className="text-gray-400 mb-6">
                  Resources for Semester {selectedSemester} are being prepared. Check back soon!
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Contribute Resources
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {currentSemester?.branches.map((branch, branchIndex) => (
                <Card key={branchIndex} className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white">
                      {branchIcons[branch.name] || <BookOpen className="w-5 h-5" />}
                      {branch.name}
                      <Badge variant="outline" className="ml-auto text-xs">
                        {branch.resources.length} Resources
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Study materials and resources for {branch.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {branch.resources.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                        <p>No resources available yet for this branch</p>
                        <Button variant="link" className="text-purple-400 mt-2">
                          Be the first to contribute
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {branch.resources.map((resource, resourceIndex) => (
                          <div
                            key={resourceIndex}
                            className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/10 hover:bg-black/30 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {getResourceIcon(resource.type)}
                              <div>
                                <h4 className="font-medium text-white">{resource.title}</h4>
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
                              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black"
                              onClick={() => handleResourceClick(resource)}
                            >
                              {resource.type === 'video_playlist' ? (
                                <>
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  Watch
                                </>
                              ) : (
                                <>
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </>
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
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
                    branchTotal + branch.resources.length, 0
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
