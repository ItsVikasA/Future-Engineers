'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Download } from 'lucide-react';
import toast from 'react-hot-toast';

interface PDFViewerProps {
  fileUrl: string;
  fileName: string;
  title: string;
}

export function PDFViewer({ fileUrl, fileName, title }: PDFViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePreview = () => {
    setIsOpen(true);
  };

  const handleDownload = async () => {
    try {
      const loadingToast = toast.loading('📥 Preparing download...');
      
      // Clean title for filename
      const cleanFileName = (fileName || title || 'document').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 50) + '.pdf';
      
      // For Cloudinary files, we need to handle them differently
      if (fileUrl.includes('cloudinary.com')) {
        // Ensure the URL has proper flags for download with filename
        let downloadUrl = fileUrl;
        
        // If it's a Cloudinary URL, make sure it has the right flags
        if (downloadUrl.includes('/upload/')) {
          // Add download flag with filename if not present
          if (!downloadUrl.includes('fl_attachment')) {
            const cleanName = cleanFileName.replace('.pdf', '');
            downloadUrl = downloadUrl.replace('/upload/', `/upload/fl_attachment:${cleanName}.pdf/`);
          }
        }
        
        console.log('Downloading from URL:', downloadUrl);
        
        // Try direct download first
        try {
          const response = await fetch(downloadUrl, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Accept': 'application/pdf,*/*',
            },
          });
          
          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = cleanFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          } else {
            throw new Error('Fetch failed');
          }
        } catch (fetchError) {
          // Fallback to direct link click
          console.log('Fetch failed, trying direct link:', fetchError);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = cleanFileName;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        
        toast.dismiss(loadingToast);
        toast.success('✅ Download started successfully!', {
          duration: 3000,
        });
      } else {
        // For other URLs, use fetch method
        const response = await fetch(fileUrl, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'application/pdf,*/*',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        
        if (blob.size === 0) {
          throw new Error('Downloaded file is empty');
        }
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || 'document.pdf';
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }, 100);
        
        toast.dismiss(loadingToast);
        toast.success('✅ Download started successfully!', {
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.dismiss();
      toast.error(`❌ Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        duration: 4000,
      });
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
        <DialogContent className="max-w-4xl w-full h-[80vh] bg-black/90 border-white/20" aria-describedby={`pdf-description-${title.replace(/\s+/g, '-')}`}>
          <DialogHeader>
            <DialogTitle className="text-white">{title}</DialogTitle>
          </DialogHeader>
          <div className="sr-only" id={`pdf-description-${title.replace(/\s+/g, '-')}`}>
            PDF viewer for {title}. Use the toolbar to navigate and download the document.
          </div>
          <div className="flex-1 bg-white rounded-lg overflow-hidden">
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center">
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
            <Button
              onClick={handleDownload}
              variant="outline"
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black"
            >
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
