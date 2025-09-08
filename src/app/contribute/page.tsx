'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/Header';
import { useAuthStore } from '@/stores/authStore';
import { Upload, FileText, CheckCircle, Clock, ChevronDown } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { uploadViaAPI } from '@/lib/apiUpload';
import toast from 'react-hot-toast';
import { db } from '@/lib/firebase';

const KARNATAKA_UNIVERSITIES = [
  "A J Institute of Engineering, Dakshin Kannad",
  "Acharya Institute of Technology, Bengaluru",
  "Acharyar NRV School of Architecture, Bengaluru",
  "Adichunchanagiri Institute of Technology, Chikkamagaluru",
  "Aditya Academy of Architecture, Bengaluru",
  "Alvas Institute of Engineering, Dakshin Kannad",
  "AMG Rural College of Engineering, Dharwad",
  "Amruta Institute of Engineering, Bidadi, Bengaluru",
  "ANJUMAN Institute of Technology, Uttar Kannad",
  "APS College of Engineering, Bengaluru",
  "Appa Institute of Engineering & Technology, Kalaburagi",
  "B G S Institute of Technology, Mandya",
  "B M S (Even) College of Engineering, Bengaluru",
  "B M S College of Engineering, Bengaluru",
  "B M S College of Architecture, Bengaluru",
  "B N M Institute of Technology, Bengaluru",
  "B T L Institute of Technology Management, Bengaluru",
  "Bapuji Institute of Engineering, Davangere",
  "Basava Kalyan Engineering College, Bidar",
  "Basaveshwar Engineering College, Bagalkot",
  "BASAV Engineering School of, Vijayapura",
  "Bearys Institute of Technology, Dakshin Kannad",
  "Biluru Gurubasava Mahaswamiji Institute of Technology,Mudhol, Bagalkot",
  "BMS School of Architecture, Bengaluru",
  "Brindavan College of Engg., Bengaluru Urban",
  "C M R Institute of Technology, Bengaluru",
  "Cauvery Institute of Technology, Mandya",
  "Cambridge Institute of Technology, Bengaluru",
  "Canara Engineering College, Dakshin Kannad",
  "Channabasaveshwara Institute, Tumakuru",
  "City Engineering College, Bengaluru",
  "Dayananda Sagar College of, Bengaluru Urban",
  "Dayananda Sagar College of Architecture, Bengaluru",
  "Don Bosco Institute of Technology, Bengaluru",
  "East Point College of Engg., Bengaluru",
  "East West Institute of Technology, Bengaluru",
  "East West School of Architecture, Bengaluru",
  "East West College of Engineering, Bengaluru",
  "Ekalavya Institute of Technology, Chamarajanagar",
  "G M Institute of Technology, Davangere",
  "G Madegowda Institute of, Mandya",
  "G S S S Institute of Engineering, Mysuru",
  "Gogte Institute of Technology, Belagavi",
  "Gopalan College of Engineering, Bengaluru",
  "Gopalan School of Architecture, Bengaluru",
  "Govind B. P. Institute of Technology, Bidar",
  "Government Engineering College, Ballari",
  "Government Engineering College, Chamarajanagar",
  "Government Engineering College, Dakshin Kannad",
  "Government Engineering College, Hassan",
  "Government Engineering College, Haveri",
  "Government Engineering College, Koppal",
  "Govt. S K S J Technological Institute, Bengaluru",
  "Govt. Tool Room & Training, Bengaluru",
  "H K B K College of Engineering, Bengaluru",
  "H M S Institute of Technology, Tumkur",
  "HMS School of Architecture, Tumakuru",
  "Hirasugar Institute of Technology, Belagavi",
  "Honeywell Technologies Solutions, Bengaluru",
  "Impact College of Engineering, Bengaluru",
  "Impact School of Architecture, Bengaluru",
  "Islamiah Inst. of Technology, Bengaluru",
  "J N N College of Engineering, Shivamogga",
  "Jain Acharya Gundharnandi Maharaj, Bagalkot",
  "Jain College of Engineering, Belagavi",
  "Jain College of Engineering, Dharwad",
  "Jain Institute of Technology, Davangere",
  "JAIN COLLEGE OF ENGINEERING, Belagavi",
  "JAIN COLLEGE OF ENGINEERING, Dharwad",
  "Jnana Vikas Institute of Technology, Bengaluru",
  "J S S Academy of Technical Education, Bengaluru",
  "J S C Institute of Technology, Chickballapur",
  "Jyothy Institute of Technology, Bengaluru",
  "K L Es College of Engg. & Technology, Belagavi",
  "K N S Institute of Technology, Bengaluru",
  "K S Institute of Technology, Bengaluru",
  "K S School of Architecture, Bengaluru",
  "K S School of Engineering & Management, Bengaluru",
  "K T C Engineering College, Kalaburagi",
  "Kalpataru Institute of Technology, Tumakuru",
  "Karavali Institute of Technology, Dakshin Kannad",
  "KLE Institute of Technology, Hubli",
  "KLEs College of Engineering & Technology, Belagavi",
  "K V G College of Engineering, Dakshin Kannad",
  "Lingaraj Appa Engineering, Bidar",
  "M S Engineering College, Bengaluru",
  "M S Ramaiah Institute of Technology, Bengaluru",
  "Malnad College of Engineering, Hassan",
  "Malik Sandal Institute of Arts & Architecture, Vijayapura",
  "Maharaja Institute of Technology, Mysuru",
  "Mangalore Institute of Technology, Dakshin Kannad",
  "Mangalore Marine College and, Dakshin Kannad",
  "Maratha Mandal Engineering, Belagavi",
  "Moodalkatte Institute of Technology, Udupi",
  "Mysore College of Engineering, Mysuru",
  "Mysore School of Architecture, Mysuru",
  "Mysuru Royal Institute of, Mandya",
  "Nagarjuna College of Engg., Bengaluru",
  "NDRK Institute of Technology, Hassan",
  "NE Institute of Engineering, Mysuru",
  "Nitte Meenakshi Institute of, Bengaluru",
  "Nitte School of Architecture, Bengaluru",
  "NMAM Institute of Technology, Udupi",
  "P A College of Engineering, Mangalore",
  "PDA College of Engineering, Kalaburagi",
  "PES College of Engineering, Mandya",
  "PES Institute of Technology, Shivamogga",
  "Proudadevaraya Institute of Technology, Ballari",
  "Rajeev Institute of Technology, Hassan",
  "Rajarajeshwari College of Engineering, Bengaluru",
  "Rajiv Gandhi Institute of Technology, Bengaluru",
  "Rao Bahaddur Y Mahabaleshwa, Ballari",
  "R L Jalappa Institute of Technology, Chikballapur",
  "R N S Institute of Technology, Bengaluru",
  "R T Nagar Post, Bengaluru",
  "RD Institute of Technology, Bengaluru",
  "RNS School of Architecture, Bengaluru",
  "R V College of Architecture, Bengaluru",
  "R V College of Engineering, Bengaluru",
  "S J M Institute of Technology, Chitradurga",
  "S J B Institute of Technology, Bengaluru",
  "S J C Institute of Technology, Chickballapur",
  "S J S Academy of Technical Education, Bengaluru",
  "SJB School of Architecture, Bengaluru",
  "S G Balekundri Institute of Technology, Belagavi",
  "S K S J Technological Institute (Eve), Bengaluru",
  "S L N College of Raichur",
  "S M V School of Architecture, Bengaluru",
  "Sakshiganga College of Engineering, Mysuru",
  "Sahyadri College of Engineering, Dakshin Kannad",
  "Sampoorna Institute of Technology, Ramanagara",
  "Sapthagiri College of Engineering, Bengaluru",
  "Sathyabama Institute of Science and Technology",
  "Shaikh College of Engineering & Technology, Belagavi",
  "Shridevi Institute of Engineering, Tumakuru",
  "Shri Madhwa Vadiraja Institute of, Udupi",
  "Shree Devi Institute of Technology, Dakshin Kannad",
  "Shree Vinayaka Institute of, Kolar",
  "Shushrutha Institute of Medical Sciences and Research Centre",
  "Smt. Kamala & Sri Venkappa M Agadi, Gadag",
  "Srinivas Institute of Technology, Dakshin Kannad",
  "Sri Basaveshwara Institute of, Tumakuru",
  "Sri Krishana Institute of Technology, Bengaluru",
  "Sri Sairam College of Engineering, Bengaluru",
  "ST J Institute of Technology, Ranebennur",
  "St Joseph Engineering College, Dakshin Kannad",
  "Tontadarya College of Engineering, Gadag",
  "VTU Extension Centre, Bengaluru",
  "VTU Extension Centre, IR Rasta, Bengaluru",
  "VTU Extension Center, N M A Dakshin Kannad",
  "Vemana Institute of Technology, Bengaluru",
  "Veerappa Nisty Engineering, Kalaburagi",
  "Vijaya Vittal Institute of Technology, Bengaluru",
  "Vidya Vikas Institute of Technology, Mysuru",
  "Vishwanathrao Deshpande Institute of, Uttar Kannad",
  "Visvesvaraya Technological University, Belagavi",
  "Visvesvaraya Technological University, Chikballapur",
  "Visvesvaraya Technological University, Kalaburagi",
  "Vivekananda College of Engineering & Tech., Dakshin Kannad",
  "Vivekananda Institute of Technology, Bengaluru Rural",
  "Wadiyar Centre for Architecture, Mysuru",
  "Yenepoya Institute of Technology, Dakshin Kannad",
  "Zain University, Karnataka"
];

const ENGINEERING_COURSES = [
  // Core Engineering Branches
  "Computer Science Engineering",
  "Electronics & Communication Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Technology",
  "Electrical and Electronics Engineering",
  "Chemical Engineering",
  "Automobile Engineering",
  "Aerospace Engineering",
  "Agricultural Engineering",
  
  // Specialized and Emerging Branches
  "Biomedical Engineering",
  "Biotechnology Engineering",
  "Environmental Engineering",
  "Industrial Engineering",
  "Marine Engineering",
  "Mining Engineering",
  "Polymer Engineering",
  "Ceramic Engineering",
  "Textile Engineering",
  "Food Technology Engineering",
  
  // New and Interdisciplinary Branches
  "Artificial Intelligence and Machine Learning",
  "Data Science and Big Data Analytics",
  "Robotics Engineering",
  "Mechatronics Engineering",
  "Cybersecurity Engineering",
  "Cloud Computing Engineering",
  "Renewable Energy Engineering",
  "Nanotechnology Engineering",
  "Software Engineering",
  "Structural Engineering",
  
  // Other Engineering Disciplines
  "Power Engineering",
  "Materials Science and Engineering",
  "Petroleum Engineering",
  "Water Resources Engineering",
  "Transportation Engineering",
  "Geotechnical Engineering",
  "Wireless Communication Engineering",
  "Embedded Systems Engineering",
  "VLSI Design",
  "Marine and Naval Architecture"
];

const SEMESTERS = [
  "1st Semester",
  "2nd Semester", 
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester"
];

export default function Contribute() {
  const { user, isAuthenticated } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showSemesterDropdown, setShowSemesterDropdown] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    university: '',
    course: '',
    semester: '',
    documentType: 'Notes',
  });

  // Filter universities based on search input
  const filteredUniversities = useMemo(() => {
    if (!formData.university) return KARNATAKA_UNIVERSITIES.slice(0, 10);
    return KARNATAKA_UNIVERSITIES.filter(uni => 
      uni.toLowerCase().includes(formData.university.toLowerCase())
    ).slice(0, 10);
  }, [formData.university]);

  // Filter courses based on search input
  const filteredCourses = useMemo(() => {
    if (!formData.course) return ENGINEERING_COURSES.slice(0, 10);
    return ENGINEERING_COURSES.filter(course => 
      course.toLowerCase().includes(formData.course.toLowerCase())
    ).slice(0, 10);
  }, [formData.course]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Show/hide dropdowns based on input
    if (name === 'university') {
      setShowUniversityDropdown(value.length > 0);
    } else if (name === 'course') {
      setShowCourseDropdown(value.length > 0);
    }
  };

  const handleSelectUniversity = (university: string) => {
    setFormData(prev => ({ ...prev, university }));
    setShowUniversityDropdown(false);
  };

  const handleSelectCourse = (course: string) => {
    setFormData(prev => ({ ...prev, course }));
    setShowCourseDropdown(false);
  };

  const handleSelectSemester = (semester: string) => {
    setFormData(prev => ({ ...prev, semester }));
    setShowSemesterDropdown(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' && file.size <= 50 * 1024 * 1024) { // 50MB limit for Cloudinary
        setSelectedFile(file);
        toast.success(`📄 Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)`, {
          duration: 3000,
        });
      } else {
        toast.error('❌ Please select a PDF file under 50MB', {
          duration: 4000,
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast.error('🔒 Please log in to upload documents', {
        duration: 4000,
      });
      return;
    }

    if (!selectedFile) {
      toast.error('📄 Please select a file to upload', {
        duration: 3000,
      });
      return;
    }

    if (!formData.title || !formData.description || !formData.subject) {
      toast.error('📝 Please fill in all required fields', {
        duration: 4000,
      });
      return;
    }

    console.log('Starting upload process...');
    console.log('User:', user.uid);
    console.log('File:', selectedFile.name, selectedFile.size, selectedFile.type);
    console.log('Environment check:', {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    });

    setIsUploading(true);
    setUploadProgress(0);
    setUploadSpeed(0);
    setEstimatedTime(0);
    
    const startTime = Date.now(); // Track upload start time

    try {
      // Use API-based upload to Cloudinary (since we have credentials)
      const uploadResult = await uploadViaAPI(
        selectedFile, 
        user.uid,
        (progress: number) => {
          setUploadProgress(progress);
          // Update upload speed and time estimates based on progress
          const currentTime = Date.now();
          const elapsed = (currentTime - startTime) / 1000; // seconds
          if (elapsed > 0 && progress > 0) {
            const bytesUploaded = (selectedFile.size * progress) / 100;
            const speed = bytesUploaded / elapsed; // bytes per second
            setUploadSpeed(speed);
            
            if (progress < 100) {
              const remainingBytes = selectedFile.size - bytesUploaded;
              const remainingTime = remainingBytes / speed;
              setEstimatedTime(remainingTime);
            }
          }
        }
      );
      
      console.log('Upload result:', uploadResult);
      
      if (!uploadResult.success) {
        console.error('Upload failed:', uploadResult.error);
        toast.error(`❌ Upload failed: ${uploadResult.error || 'Unknown error'}`, {
          duration: 5000,
        });
        return;
      }
      
      // Save document metadata to Firestore
      const docData = {
        ...formData,
        uploadedBy: user.email, // Use email instead of UID for consistency
        uploaderName: user.displayName || user.email.split('@')[0],
        uploaderEmail: user.email,
        fileUrl: uploadResult.fileUrl,
        filePath: uploadResult.publicId, // Add filePath for downloads
        fileId: uploadResult.fileId,
        publicId: uploadResult.publicId, // Cloudinary public ID for management
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        status: 'pending',
        uploadedAt: new Date(),
        downloads: 0,
        likes: 0,
        views: 0,
        storageType: 'cloudinary', // Indicate this is stored in Cloudinary
      };

      setUploadProgress(90);
      await addDoc(collection(db, 'documents'), docData);
      setUploadProgress(100);

      // Reset form
      setFormData({
        title: '',
        description: '',
        subject: '',
        university: '',
        course: '',
        semester: '',
        documentType: 'Notes',
      });
      setSelectedFile(null);

      // Success notification
      toast.success('🎉 Document uploaded successfully! It will be reviewed before being published.', {
        duration: 6000,
      });
    } catch (error: unknown) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`❌ Failed to upload document: ${errorMessage}`, {
        duration: 5000,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadSpeed(0);
      setEstimatedTime(0);
    }
  };

  // Show toast for unauthenticated users
  useEffect(() => {
    if (!isAuthenticated && user === null) {
      toast.error('🔒 Please log in to contribute content', {
        duration: 4000,
      });
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
          <p className="text-muted-foreground">You need to be logged in to contribute content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Share Engineering Knowledge
          </h1>
          <p className="text-lg text-muted-foreground">
            Share your notes and help fellow engineers succeed. Your contributions build the future!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Upload Document</CardTitle>
                <CardDescription className="text-gray-400">
                  Fill in the details below to share your academic resources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                    
                    <div>
                      <Label htmlFor="title" className="text-gray-300">Document Title *</Label>
                      <Input 
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., Introduction to Computer Science - Lecture Notes"
                        className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-gray-300">Description *</Label>
                      <textarea 
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Provide a brief description of the content, topics covered, and any special notes..."
                        className="mt-1 w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder:text-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-gray-300">Subject *</Label>
                      <Input 
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="e.g., Data Structures, Database Systems, Operating Systems"
                        className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <Label htmlFor="university" className="text-gray-300">University</Label>
                        <div className="relative">
                          <Input 
                            id="university"
                            name="university"
                            value={formData.university}
                            onChange={handleInputChange}
                            onFocus={() => setShowUniversityDropdown(true)}
                            onBlur={() => setTimeout(() => setShowUniversityDropdown(false), 200)}
                            placeholder="Start typing to search universities..."
                            className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 pr-10"
                          />
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none mt-0.5" />
                        </div>
                        {showUniversityDropdown && filteredUniversities.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-white/20 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {filteredUniversities.map((university, index) => (
                              <div
                                key={index}
                                onClick={() => handleSelectUniversity(university)}
                                className="px-3 py-2 hover:bg-white/10 cursor-pointer text-white text-sm border-b border-white/10 last:border-b-0"
                              >
                                {university}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <Label htmlFor="course" className="text-gray-300">Course</Label>
                        <div className="relative">
                          <Input 
                            id="course"
                            name="course"
                            value={formData.course}
                            onChange={handleInputChange}
                            onFocus={() => setShowCourseDropdown(true)}
                            onBlur={() => setTimeout(() => setShowCourseDropdown(false), 200)}
                            placeholder="Start typing to search courses..."
                            className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 pr-10"
                          />
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none mt-0.5" />
                        </div>
                        {showCourseDropdown && filteredCourses.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-white/20 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {filteredCourses.map((course, index) => (
                              <div
                                key={index}
                                onClick={() => handleSelectCourse(course)}
                                className="px-3 py-2 hover:bg-white/10 cursor-pointer text-white text-sm border-b border-white/10 last:border-b-0"
                              >
                                {course}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <Label htmlFor="semester" className="text-gray-300">Semester</Label>
                        <div className="relative">
                          <Input 
                            id="semester"
                            name="semester"
                            value={formData.semester}
                            onChange={handleInputChange}
                            onFocus={() => setShowSemesterDropdown(true)}
                            onBlur={() => setTimeout(() => setShowSemesterDropdown(false), 200)}
                            placeholder="Select semester..."
                            className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 pr-10"
                            readOnly
                          />
                          <ChevronDown 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none mt-0.5" 
                          />
                          {showSemesterDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-white/20 rounded-md shadow-lg">
                              {SEMESTERS.map((semester, index) => (
                                <div
                                  key={index}
                                  onClick={() => handleSelectSemester(semester)}
                                  className="px-3 py-2 hover:bg-white/10 cursor-pointer text-white text-sm border-b border-white/10 last:border-b-0"
                                >
                                  {semester}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="documentType" className="text-gray-300">Document Type</Label>
                        <select 
                          id="documentType"
                          name="documentType"
                          value={formData.documentType}
                          onChange={handleInputChange}
                          title="Select document type"
                          className="mt-1 w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                        >
                          <option value="Notes" className="bg-gray-800">Notes</option>
                          <option value="Lab Manual" className="bg-gray-800">Lab Manual</option>
                          <option value="Question Paper" className="bg-gray-800">Question Paper</option>
                          <option value="Assignment" className="bg-gray-800">Assignment</option>
                          <option value="Syllabus" className="bg-gray-800">Syllabus</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">File Upload</h3>
                    
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center bg-white/5">
                      <Upload className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-white mb-2">Upload your PDF</h4>
                      <p className="text-gray-400 mb-4">
                        {selectedFile ? selectedFile.name : 'Select a PDF file to upload (Max 10MB)'}
                      </p>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload">
                        <Button 
                          type="button" 
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          Choose File
                        </Button>
                      </label>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="pt-6">
                    {isUploading && (
                      <div className="mb-4 space-y-2">
                        <div className="flex justify-between text-sm text-white/70">
                          <span>Uploading... {uploadProgress.toFixed(1)}%</span>
                          <span>
                            {uploadSpeed > 0 && (
                              <>
                                {(uploadSpeed / 1024 / 1024).toFixed(1)} MB/s
                                {estimatedTime > 0 && ` • ${Math.ceil(estimatedTime)}s remaining`}
                              </>
                            )}
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${Math.min(uploadProgress, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    <Button 
                      type="submit" 
                      disabled={isUploading || !selectedFile}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                      {isUploading ? `Uploading... ${uploadProgress.toFixed(0)}%` : 'Submit for Review'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Guidelines Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="h-5 w-5" />
                  Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Upload only PDF files</li>
                  <li>• Maximum file size: 10MB</li>
                  <li>• Ensure content is your own or you have permission</li>
                  <li>• Provide clear, descriptive titles</li>
                  <li>• Include relevant tags for better discoverability</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Clock className="h-5 w-5" />
                  Review Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-gray-300">You upload your document</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-gray-300">Our moderators review the content</p>
                      <p className="text-gray-400 text-xs">Review typically takes 24-48 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-purple-400 mt-0.5" />
                    <div>
                      <p className="text-gray-300">Document goes live for students</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
