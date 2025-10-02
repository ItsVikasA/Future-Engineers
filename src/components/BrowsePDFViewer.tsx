'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Download, LogIn } from 'lucide-react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

interface BrowsePDFViewerProps {
  documentId: string;
  fileUrl: string;
  title: string;
}

export function BrowsePDFViewer({ documentId, fileUrl, title }: BrowsePDFViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const handlePreview = async () => {
    try {
      await updateDoc(doc(db, 'documents', documentId), {
        views: increment(1)
      });
      setIsOpen(true);
    } catch (error) {
      console.error('Error updating view count:', error);
      setIsOpen(true);
    }
  };

  const handleDownload = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('🔒 Please sign in to download files');
      return;
    }

    try {
      await updateDoc(doc(db, 'documents', documentId), {
        downloads: increment(1)
      });
      
      // Clean title for filename and append VICKY
      const cleanTitle = title.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 50);
      const fileName = `${cleanTitle}_VICKY.pdf`;
      
      // Fix folder name in URL
      let downloadUrl = fileUrl;
      if (downloadUrl.includes('/student-notes/')) {
        downloadUrl = downloadUrl.replace('/student-notes/', '/future_engineers/');
      }
      
      console.log('🔽 Attempting download:', downloadUrl);
      console.log('🔽 Filename:', fileName);
      
      try {
        // Try to fetch the file and create a proper download
        const response = await fetch(downloadUrl);
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          // Show success toast with download info
          toast.success(
            () => (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span className="font-semibold">Download Started!</span>
                </div>
                <span className="text-xs opacity-90">
                  Check your downloads folder
                </span>
              </div>
            ),
            {
              duration: 4000,
              style: {
                background: '#10b981',
                color: '#fff',
                padding: '12px 16px',
              },
            }
          );

          // Show completion toast after estimated download time (3 seconds)
          setTimeout(() => {
            toast.success('📁 Download completed! Check your downloads folder.', {
              duration: 3000,
              style: {
                background: '#059669',
                color: '#fff',
              },
            });
          }, 3000);
          
        } else {
          throw new Error('Fetch failed');
        }
      } catch (fetchError) {
        console.log('Fetch method failed, trying direct download:', fetchError);
        // Fallback to direct download without Cloudinary flags
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = fileName;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Show success toast with download info
        toast.success(
          () => (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span className="font-semibold">Download Started!</span>
              </div>
              <span className="text-xs opacity-90">
                Check your downloads folder
              </span>
            </div>
          ),
          {
            duration: 4000,
            style: {
              background: '#10b981',
              color: '#fff',
              padding: '12px 16px',
            },
          }
        );

        // Show completion toast after estimated download time (3 seconds)
        setTimeout(() => {
          toast.success('📁 Download completed! Check your downloads folder.', {
            duration: 3000,
            style: {
              background: '#059669',
              color: '#fff',
            },
          });
        }, 3000);
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('❌ Download failed');
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            onClick={handlePreview}
            className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black"
          >
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl w-full h-[80vh] bg-black/90 border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">{title}</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">PDF Document</h3>
                <p className="text-gray-600 mb-2 font-medium">{title}</p>
                <p className="text-gray-500 mb-6 text-sm">
                  Click below to view or download this PDF document
                </p>
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 italic">
                    PDF viewing is disabled to prevent unwanted downloads.
                  </p>
                  <Button
                    onClick={handleDownload}
                    className={`w-full ${isAuthenticated 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-gray-500 hover:bg-gray-600 text-white'
                    }`}
                    disabled={!isAuthenticated}
                  >
                    {isAuthenticated ? (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign in to Download
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button 
              onClick={handleDownload} 
              className={`${isAuthenticated 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-gray-500 hover:bg-gray-600 text-white'
              }`}
              disabled={!isAuthenticated}
            >
              {isAuthenticated ? (
                <>
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-1" />
                  Sign in to Download
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        onClick={handleDownload}
        size="sm"
        variant="outline"
        className={`${isAuthenticated 
          ? 'border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black' 
          : 'border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-black'
        }`}
        disabled={!isAuthenticated}
      >
        {isAuthenticated ? (
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
  );
}
