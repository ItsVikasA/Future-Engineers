'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DocumentData {
  id: string;
  title?: string;
  fileName: string;
  branch: string;
  semester: string | number;
  subject: string;
  documentType: string;
  status: string;
  uploaderName?: string;
  uploadedBy: string;
  fileSize: number;
  university: string;
  fileUrl: string;
  [key: string]: unknown;
}

export default function DebugDB() {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllDocuments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'documents'));
        const docs: DocumentData[] = [];
        querySnapshot.forEach((doc) => {
          docs.push({
            id: doc.id,
            ...doc.data(),
          } as DocumentData);
        });
        setDocuments(docs);
        console.log('📊 All Documents in Database:', docs);
      } catch (error) {
        console.error('❌ Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDocuments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading database...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Database Debug View</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Total Documents:</strong> {documents.length}</p>
            <p><strong>Approved:</strong> {documents.filter(d => d.status === 'approved').length}</p>
            <p><strong>Pending:</strong> {documents.filter(d => d.status === 'pending').length}</p>
            <p><strong>Rejected:</strong> {documents.filter(d => d.status === 'rejected').length}</p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardHeader>
                <CardTitle className="text-lg">{doc.title || doc.fileName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>ID:</strong> {doc.id}</p>
                    <p><strong>Branch:</strong> {doc.branch}</p>
                    <p><strong>Semester:</strong> {doc.semester} (type: {typeof doc.semester})</p>
                    <p><strong>Subject:</strong> {doc.subject}</p>
                    <p><strong>Type:</strong> {doc.documentType}</p>
                  </div>
                  <div>
                    <p><strong>Status:</strong> <span className={`font-bold ${doc.status === 'approved' ? 'text-green-500' : doc.status === 'pending' ? 'text-yellow-500' : 'text-red-500'}`}>{doc.status}</span></p>
                    <p><strong>Uploaded By:</strong> {doc.uploaderName || doc.uploadedBy}</p>
                    <p><strong>File Size:</strong> {(doc.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                    <p><strong>University:</strong> {doc.university}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground break-all"><strong>File URL:</strong> {doc.fileUrl}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {documents.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-xl text-muted-foreground">No documents found in database</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
