'use client';

import { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { Camera, Save, X, User, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';

interface UserProfile {
  displayName: string;
  email: string;
  photoURL: string;
  bio: string;
  university: string;
  course: string;
  semester: string;
  location: string;
  joinedAt: Date;
  reputation: number;
  uploads: number;
  downloads: number;
}

export default function ProfileEditPage() {
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    displayName: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || '',
    bio: '',
    university: '',
    course: '',
    semester: '',
    location: '',
    joinedAt: new Date(),
    reputation: 0,
    uploads: 0,
    downloads: 0
  });

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
      // Create a reference to the user's profile image
      const imageRef = ref(storage, `profile-images/${user.uid}`);
      
      // Upload the file
      await uploadBytes(imageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(imageRef);
      
      // Update profile state
      setProfile(prev => ({ ...prev, photoURL: downloadURL }));
      
      toast.success('Photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Update Firebase Auth profile
      if (user?.uid) {
        await updateProfile(auth.currentUser!, {
          displayName: profile.displayName,
          photoURL: profile.photoURL
        });

        // Update Firestore user document
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          displayName: profile.displayName,
          photoURL: profile.photoURL,
          bio: profile.bio,
          university: profile.university,
          course: profile.course,
          semester: profile.semester,
          location: profile.location,
          updatedAt: new Date()
        });

        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Edit Profile</h1>
            <p className="text-gray-400">Update your profile information and preferences</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
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
                  <div className="grid md:grid-cols-2 gap-4">
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

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        University
                      </label>
                      <Input
                        value={profile.university}
                        onChange={(e) => setProfile(prev => ({ ...prev, university: e.target.value }))}
                        placeholder="Your university"
                        className="bg-black/20 border-white/10 text-white placeholder-gray-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Course
                      </label>
                      <Input
                        value={profile.course}
                        onChange={(e) => setProfile(prev => ({ ...prev, course: e.target.value }))}
                        placeholder="Your course/degree"
                        className="bg-black/20 border-white/10 text-white placeholder-gray-500"
                      />
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
