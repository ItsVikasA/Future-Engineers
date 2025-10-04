'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { Camera, Save, X, User, Award, ChevronDown, Linkedin, Github, Globe, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';

const KARNATAKA_COLLEGES = [
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
  "K V G College of Engineering, Dakshin Kannad"
];

const ENGINEERING_COURSES = [
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

interface UserProfile {
  displayName: string;
  email: string;
  photoURL: string;
  bannerURL: string; // Add banner URL
  bio: string;
  college: string;
  course: string;
  semester: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  joinedAt: Date;
  reputation: number;
  uploads: number;
  downloads: number;
}

export default function ProfileEditPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null); // Add banner input ref
  const [loading, setLoading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false); // Add banner uploading state
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    displayName: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || '',
    bannerURL: '', // Add banner URL
    bio: '',
    college: '',
    course: '',
    semester: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
    joinedAt: new Date(),
    reputation: 0,
    uploads: 0,
    downloads: 0
  });

  // Load existing profile data
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user?.email) return;
      
      try {
        const userDocRef = doc(db, 'users', user.email);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfile(prev => ({
            ...prev,
            displayName: userData.displayName || user.displayName || '',
            bio: userData.bio || '',
            college: userData.college || '',
            course: userData.course || '',
            semester: userData.semester || '',
            location: userData.location || '',
            linkedin: userData.linkedin || '',
            github: userData.github || '',
            portfolio: userData.portfolio || '',
            photoURL: userData.photoURL || user.photoURL || '',
            bannerURL: userData.bannerURL || '' // Load banner URL
          }));
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };

    loadProfileData();
  }, [user]);

  // Filter colleges based on search input
  const filteredColleges = KARNATAKA_COLLEGES.filter(college => 
    college.toLowerCase().includes(profile.college.toLowerCase())
  ).slice(0, 10);

  // Filter courses based on search input
  const filteredCourses = ENGINEERING_COURSES.filter(course => 
    course.toLowerCase().includes(profile.course.toLowerCase())
  ).slice(0, 10);

  const handleSelectCollege = (college: string) => {
    setProfile(prev => ({ ...prev, college }));
    setShowCollegeDropdown(false);
  };

  const handleSelectCourse = (course: string) => {
    setProfile(prev => ({ ...prev, course }));
    setShowCourseDropdown(false);
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    const fields = [
      profile.displayName,
      profile.bio,
      profile.college,
      profile.course,
      profile.semester,
      profile.location,
      profile.linkedin,
      profile.github,
      profile.portfolio,
      profile.photoURL
    ];
    
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    const totalFields = fields.length;
    
    return Math.round((filledFields / totalFields) * 100);
  };

  const completionPercentage = calculateProfileCompletion();

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size should be less than 5MB');
      return;
    }

    setPhotoUploading(true);
    
    try {
      // Upload to Cloudinary via API route
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.uid);
      formData.append('uploadType', 'profile'); // Add upload type for differentiation

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      
      if (result.success && result.fileUrl) {
        // Update profile state with Cloudinary URL
        setProfile(prev => ({ ...prev, photoURL: result.fileUrl }));
        toast.success('Photo uploaded successfully!');
      } else {
        throw new Error('Upload failed - no URL returned');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload photo');
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit for banner
      toast.error('Banner image size should be less than 10MB');
      return;
    }

    setBannerUploading(true);
    
    try {
      // Upload to Cloudinary via API route
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.uid);
      formData.append('uploadType', 'banner'); // Add upload type for differentiation

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      
      if (result.success && result.fileUrl) {
        // Update profile state with Cloudinary URL
        setProfile(prev => ({ ...prev, bannerURL: result.fileUrl }));
        toast.success('Banner uploaded successfully!');
      } else {
        throw new Error('Upload failed - no URL returned');
      }
    } catch (error) {
      console.error('Error uploading banner:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload banner');
    } finally {
      setBannerUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !user.email) return;
    
    setLoading(true);
    
    try {
      // Update Firebase Auth profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: profile.displayName,
          photoURL: profile.photoURL
        });
      }

      // Use email directly as document ID (matching AuthProvider pattern)
      const userDocRef = doc(db, 'users', user.email);
      
      // Check if document exists
      const userDoc = await getDoc(userDocRef);
      
      const userData = {
        displayName: profile.displayName,
        email: profile.email,
        photoURL: profile.photoURL,
        bannerURL: profile.bannerURL, // Add banner URL
        bio: profile.bio,
        college: profile.college,
        course: profile.course,
        semester: profile.semester,
        location: profile.location,
        socialMedia: {
          linkedin: profile.linkedin,
          github: profile.github,
          portfolio: profile.portfolio
        },
        // Keep individual fields for backward compatibility
        linkedin: profile.linkedin,
        github: profile.github,
        portfolio: profile.portfolio,
        updatedAt: new Date()
      };

      if (userDoc.exists()) {
        // Update existing document
        await updateDoc(userDocRef, userData);
        toast.success('✅ Profile updated successfully!');
        
        // Redirect to profile page after a short delay
        setTimeout(() => {
          router.push('/profile');
        }, 1000);
      } else {
        // Create new document if it doesn't exist (shouldn't happen normally)
        await setDoc(userDocRef, {
          ...userData,
          uid: user.uid,
          role: 'Student',
          reputation: 0,
          badges: [],
          joinedAt: new Date(),
          lastActive: new Date(),
          emailVerified: auth.currentUser?.emailVerified || false
        });
        toast.success('✅ Profile created and updated successfully!');
        
        // Redirect to profile page after a short delay
        setTimeout(() => {
          router.push('/profile');
        }, 1000);
      }

      // Update the auth store to reflect changes immediately
      useAuthStore.getState().setUser({
        ...user,
        displayName: profile.displayName,
        photoURL: profile.photoURL
      });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('❌ Failed to update profile. Please try again.', {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Edit Profile</h1>
            <p className="text-gray-400 text-sm sm:text-base">Update your profile information and preferences</p>
            
            {/* Profile Completion Bar */}
            <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Profile Completion
                </span>
                <span className="text-sm font-semibold text-white">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    completionPercentage === 100 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : completionPercentage >= 70 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                      : 'bg-gradient-to-r from-orange-500 to-red-500'
                  }`}
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              {completionPercentage === 100 && (
                <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                  ✨ Congratulations! Your profile is 100% complete!
                </p>
              )}
              {completionPercentage < 100 && (
                <p className="text-gray-400 text-xs mt-2">
                  Complete all fields including social links to reach 100%
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Profile Photo Section */}
            <div className="lg:col-span-1">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Profile Photo
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Upload a professional photo
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar className="h-32 w-32 border-4 border-purple-500/30">
                      <AvatarImage src={profile.photoURL} alt="Profile" />
                      <AvatarFallback className="text-2xl bg-purple-600">
                        {profile.displayName?.charAt(0)?.toUpperCase() || <User className="h-8 w-8" />}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={photoUploading}
                      className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 p-2 rounded-full border-2 border-white/20 transition-colors"
                      title="Change profile photo"
                      aria-label="Change profile photo"
                    >
                      <Camera className="h-4 w-4 text-white" />
                    </button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    title="Select profile photo"
                    aria-label="Select profile photo file"
                  />
                  
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={photoUploading}
                    variant="outline"
                    className="w-full border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black"
                  >
                    {photoUploading ? 'Uploading...' : 'Change Photo'}
                  </Button>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Max size: 5MB • JPG, PNG, GIF
                  </p>
                </CardContent>
              </Card>

              {/* Banner Photo Section */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 mt-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Profile Banner
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Upload a banner image for your profile (4:1 ratio recommended)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative mb-4 rounded-lg overflow-hidden border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 transition-colors" style={{ paddingTop: '25%' }}>
                    {profile.bannerURL ? (
                      <Image 
                        src={profile.bannerURL} 
                        alt="Profile Banner Preview" 
                        fill
                        className="object-cover absolute top-0 left-0"
                        sizes="400px"
                      />
                    ) : (
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No banner uploaded</span>
                      </div>
                    )}
                    <button
                      onClick={() => bannerInputRef.current?.click()}
                      disabled={bannerUploading}
                      className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 p-2 rounded-lg border border-white/20 transition-colors z-10"
                      title="Change banner"
                      aria-label="Change profile banner"
                    >
                      <Camera className="h-4 w-4 text-white" />
                    </button>
                  </div>
                  
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                    title="Select banner image"
                    aria-label="Select banner image file"
                  />
                  
                  <Button
                    onClick={() => bannerInputRef.current?.click()}
                    disabled={bannerUploading}
                    variant="outline"
                    className="w-full border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black"
                  >
                    {bannerUploading ? 'Uploading...' : profile.bannerURL ? 'Change Banner' : 'Upload Banner'}
                  </Button>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Max size: 10MB • JPG, PNG, WebP • Recommended: 1584x396px
                  </p>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 mt-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Profile Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Reputation</span>
                    <Badge variant="secondary">{profile.reputation} pts</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Uploads</span>
                    <Badge variant="outline">{profile.uploads}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Downloads</span>
                    <Badge variant="outline">{profile.downloads}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Member Since</span>
                    <span className="text-sm text-white">
                      {profile.joinedAt.getFullYear()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Information */}
            <div className="lg:col-span-2">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Display Name
                      </label>
                      <Input
                        value={profile.displayName}
                        onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                        placeholder="Your display name"
                        className="bg-black/20 border-white/10 text-white placeholder-gray-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <Input
                        value={profile.email}
                        disabled
                        className="bg-black/20 border-white/10 text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      rows={3}
                      className="w-full bg-black/20 border border-white/10 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        College
                      </label>
                      <div className="relative">
                        <Input
                          value={profile.college}
                          onChange={(e) => {
                            setProfile(prev => ({ ...prev, college: e.target.value }));
                            setShowCollegeDropdown(e.target.value.length > 0);
                          }}
                          onFocus={() => setShowCollegeDropdown(profile.college.length > 0)}
                          onBlur={() => setTimeout(() => setShowCollegeDropdown(false), 200)}
                          placeholder="Start typing to search colleges..."
                          className="bg-black/20 border-white/10 text-white placeholder-gray-500 pr-10"
                        />
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                      {showCollegeDropdown && filteredColleges.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-white/20 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {filteredColleges.map((college, index) => (
                            <div
                              key={index}
                              onClick={() => handleSelectCollege(college)}
                              className="px-3 py-2 hover:bg-white/10 cursor-pointer text-white text-sm border-b border-white/10 last:border-b-0"
                            >
                              {college}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Course
                      </label>
                      <div className="relative">
                        <Input
                          value={profile.course}
                          onChange={(e) => {
                            setProfile(prev => ({ ...prev, course: e.target.value }));
                            setShowCourseDropdown(e.target.value.length > 0);
                          }}
                          onFocus={() => setShowCourseDropdown(profile.course.length > 0)}
                          onBlur={() => setTimeout(() => setShowCourseDropdown(false), 200)}
                          placeholder="Start typing to search courses..."
                          className="bg-black/20 border-white/10 text-white placeholder-gray-500 pr-10"
                        />
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Semester
                      </label>
                      <select
                        value={profile.semester}
                        onChange={(e) => setProfile(prev => ({ ...prev, semester: e.target.value }))}
                        className="w-full bg-black/20 border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        title="Select your current semester"
                        aria-label="Select your current semester"
                      >
                        <option value="">Select Semester</option>
                        {[1,2,3,4,5,6,7,8].map(sem => (
                          <option key={sem} value={sem} className="bg-gray-800">Semester {sem}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Location
                      </label>
                      <Input
                        value={profile.location}
                        onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="City, Country"
                        className="bg-black/20 border-white/10 text-white placeholder-gray-500"
                      />
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Globe className="h-5 w-5 text-purple-400" />
                      Social Media & Portfolio Links
                    </h3>
                    
                    <div className="grid md:grid-cols-1 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                          <Linkedin className="h-4 w-4 text-blue-500" />
                          LinkedIn Profile
                        </label>
                        <Input
                          value={profile.linkedin}
                          onChange={(e) => setProfile(prev => ({ ...prev, linkedin: e.target.value }))}
                          placeholder="https://linkedin.com/in/yourprofile"
                          className="bg-black/20 border-white/10 text-white placeholder-gray-500"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                          <Github className="h-4 w-4 text-gray-400" />
                          GitHub Profile
                        </label>
                        <Input
                          value={profile.github}
                          onChange={(e) => setProfile(prev => ({ ...prev, github: e.target.value }))}
                          placeholder="https://github.com/yourusername"
                          className="bg-black/20 border-white/10 text-white placeholder-gray-500"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                          <Globe className="h-4 w-4 text-green-500" />
                          Personal Portfolio
                        </label>
                        <Input
                          value={profile.portfolio}
                          onChange={(e) => setProfile(prev => ({ ...prev, portfolio: e.target.value }))}
                          placeholder="https://yourportfolio.com"
                          className="bg-black/20 border-white/10 text-white placeholder-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    
                    <Button
                      onClick={() => window.history.back()}
                      variant="outline"
                      className="border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
