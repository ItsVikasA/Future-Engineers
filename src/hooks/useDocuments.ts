import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, QueryConstraint } from 'firebase/firestore';
import type { Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Document {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  documentType: string;
  branch: string;
  semester: string;
  subject: string;
  nestedSubject?: string;
  university: string;
  uploadedBy: string;
  uploadedAt: Timestamp | null; // Firestore timestamp
  status: 'pending' | 'approved' | 'rejected';
  publicId: string;
  fileId: string;
}

export interface DocumentFilters {
  branch?: string;
  semester?: string;
  subject?: string;
  documentType?: string;
  university?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export function useDocuments(filters: DocumentFilters = {}) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);

  // Build query constraints
  const constraints: QueryConstraint[] = [];
        
        if (filters.branch) {
          constraints.push(where('branch', '==', filters.branch));
        }
        
        if (filters.semester) {
          constraints.push(where('semester', '==', filters.semester));
        }
        
        if (filters.subject) {
          constraints.push(where('subject', '==', filters.subject));
        }
        
        if (filters.documentType) {
          constraints.push(where('documentType', '==', filters.documentType));
        }
        
        if (filters.university) {
          constraints.push(where('university', '==', filters.university));
        }
        
        if (filters.status) {
          constraints.push(where('status', '==', filters.status));
        } else {
          // Default to only show approved documents
          constraints.push(where('status', '==', 'approved'));
        }

        // Add ordering
        constraints.push(orderBy('uploadedAt', 'desc'));

        const q = query(collection(db, 'documents'), ...constraints);
        const querySnapshot = await getDocs(q);
        
        const docs: Document[] = [];
        querySnapshot.forEach((doc) => {
          docs.push({
            id: doc.id,
            ...doc.data(),
          } as Document);
        });

        setDocuments(docs);
        
        // Debug logging
        console.log('🔍 useDocuments Hook Debug Info:');
        console.log('Filters:', filters);
        console.log('Query Constraints:', constraints);
        console.log('Documents Found:', docs.length);
        console.log('Sample Document:', docs[0]);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to fetch documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [filters.branch, filters.semester, filters.subject, filters.documentType, filters.university, filters.status]);

  return { documents, loading, error };
}

// Hook to get documents grouped by category
export function useDocumentsByCategory(filters: DocumentFilters = {}) {
  const { documents, loading, error } = useDocuments(filters);

  const documentsByCategory = documents.reduce((acc, doc) => {
    const category = doc.documentType;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  return { documentsByCategory, documents, loading, error };
}




