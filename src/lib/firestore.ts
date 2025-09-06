import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Document, User, Comment, Notification } from '@/types';

// Document operations
export const getDocuments = async (filters?: {
  semesterId?: string;
  status?: string;
  documentType?: string[];
  tags?: string[];
}) => {
  const constraints = [];

  if (filters?.semesterId) {
    constraints.push(where('semesterId', '==', filters.semesterId));
  }

  if (filters?.status) {
    constraints.push(where('status', '==', filters.status));
  }

  if (filters?.documentType && filters.documentType.length > 0) {
    constraints.push(where('type', 'in', filters.documentType));
  }

  constraints.push(orderBy('uploadedAt', 'desc'));
  
  const q = query(collection(db, 'documents'), ...constraints);

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    uploadedAt: doc.data().uploadedAt?.toDate(),
    moderatedAt: doc.data().moderatedAt?.toDate(),
  })) as Document[];
};

export const getDocumentById = async (id: string): Promise<Document | null> => {
  const docRef = doc(db, 'documents', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      uploadedAt: data.uploadedAt?.toDate(),
      moderatedAt: data.moderatedAt?.toDate(),
    } as Document;
  }
  
  return null;
};

export const createDocument = async (documentData: Omit<Document, 'id' | 'uploadedAt'>) => {
  const docRef = await addDoc(collection(db, 'documents'), {
    ...documentData,
    uploadedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateDocument = async (id: string, updates: Partial<Document>) => {
  const docRef = doc(db, 'documents', id);
  await updateDoc(docRef, {
    ...updates,
    ...(updates.moderatedAt && { moderatedAt: Timestamp.now() }),
  });
};

export const deleteDocument = async (id: string) => {
  const docRef = doc(db, 'documents', id);
  await deleteDoc(docRef);
};

// User operations
export const getUserById = async (uid: string): Promise<User | null> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const data = userSnap.data();
    return {
      uid: userSnap.id,
      ...data,
      joinedAt: data.joinedAt?.toDate(),
      lastActive: data.lastActive?.toDate(),
    } as User;
  }
  
  return null;
};

export const updateUser = async (uid: string, updates: Partial<User>) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...updates,
    lastActive: Timestamp.now(),
  });
};

// Comment operations
export const getCommentsByDocumentId = async (documentId: string) => {
  const q = query(
    collection(db, 'comments'),
    where('documentId', '==', documentId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Comment[];
};

export const createComment = async (commentData: Omit<Comment, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'comments'), {
    ...commentData,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

// Notification operations
export const getUserNotifications = async (userId: string, unreadOnly = false) => {
  let q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(50)
  );

  if (unreadOnly) {
    q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  })) as Notification[];
};

export const markNotificationAsRead = async (notificationId: string) => {
  const notificationRef = doc(db, 'notifications', notificationId);
  await updateDoc(notificationRef, {
    read: true,
  });
};

export const createNotification = async (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'notifications'), {
    ...notificationData,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};
