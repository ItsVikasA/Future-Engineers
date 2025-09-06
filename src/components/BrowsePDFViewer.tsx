'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Download } from 'lucide-react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface BrowsePDFViewerProps {
  documentId: string;
  fileUrl: string;
  title: string;
}

// Generate download URL with proper attachment headers
const getDownloadUrl = (url: string): string => {
  if (!url) return '';
  
  // Fix folder name first
  if (url.includes('/student-notes/')) {
    url = url.replace('/student-notes/', '/future_engineers/');
  }
  
  // For downloads, add fl_attachment to force download behavior
  if (url.includes('cloudinary.com') && url.includes('.pdf')) {
    const parts = url.split('/upload/');
    if (parts.length === 2) {
      const downloadUrl = `${parts[0]}/upload/fl_attachment/${parts[1]}`;
      console.log('Download URL:', downloadUrl);
      return downloadUrl;
    }
  }
  
  return url;
};

export function BrowsePDFViewer({ documentId, fileUrl, title }: BrowsePDFViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

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
    try {
      await updateDoc(doc(db, 'documents', documentId), {
        downloads: increment(1)
      });
      
      // For downloads, use URL WITH fl_attachment to force download
      const downloadUrl = getDownloadUrl(fileUrl);
      console.log('🔽 Attempting download:', downloadUrl);
      
      window.open(downloadUrl, '_blank');
      toast.success('✅ Download started!');
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
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button onClick={handleDownload} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        onClick={handleDownload}
        size="sm"
        variant="outline"
        className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black"
      >
        <Download className="w-4 h-4 mr-1" />
        Download
      </Button>
    </div>
  );
}
