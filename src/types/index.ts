export type UserRole = 'Student' | 'Contributor' | 'Moderator' | 'Admin';

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  reputation: number;
  badges: Badge[];
  joinedAt: Date;
  lastActive: Date;
  emailVerified: boolean;
  bio?: string;
  university?: string;
  course?: string;
  semester?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  courses: Course[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  universityId: string;
  semesters: Semester[];
}

export interface Semester {
  id: string;
  number: 1 | 2 | 3 | 4;
  courseId: string;
  documents: Document[];
}

export type DocumentType = 'Notes' | 'Lab Manual' | 'Question Paper' | 'Assignment' | 'Syllabus';

export interface Document {
  id: string;
  title: string;
  description: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
  semesterId: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected';
  moderatedBy?: string;
  moderatedAt?: Date;
  moderationNote?: string;
  downloadCount: number;
  likes: number;
  dislikes: number;
  featured: boolean;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  documentId: string;
  createdAt: Date;
  updatedAt?: Date;
  likes: number;
  parentId?: string; // For nested comments
  replies?: Comment[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'contribution_approved' | 'contribution_rejected' | 'new_document' | 'comment_reply' | 'badge_earned';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  relatedDocumentId?: string;
  relatedCommentId?: string;
}

export interface ContributionStats {
  totalContributions: number;
  approvedContributions: number;
  pendingContributions: number;
  rejectedContributions: number;
  totalDownloads: number;
  totalLikes: number;
}
