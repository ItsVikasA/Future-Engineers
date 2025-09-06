import { create } from 'zustand';
import { Document, University, Course } from '@/types';

interface ContentState {
  universities: University[];
  courses: Course[];
  documents: Document[];
  selectedUniversity: University | null;
  selectedCourse: Course | null;
  selectedSemester: number | null;
  searchQuery: string;
  filters: {
    documentType: string[];
    tags: string[];
    status: string;
  };
  setUniversities: (universities: University[]) => void;
  setCourses: (courses: Course[]) => void;
  setDocuments: (documents: Document[]) => void;
  setSelectedUniversity: (university: University | null) => void;
  setSelectedCourse: (course: Course | null) => void;
  setSelectedSemester: (semester: number | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<ContentState['filters']>) => void;
  clearFilters: () => void;
}

export const useContentStore = create<ContentState>((set) => ({
  universities: [],
  courses: [],
  documents: [],
  selectedUniversity: null,
  selectedCourse: null,
  selectedSemester: null,
  searchQuery: '',
  filters: {
    documentType: [],
    tags: [],
    status: 'approved',
  },
  setUniversities: (universities) => set({ universities }),
  setCourses: (courses) => set({ courses }),
  setDocuments: (documents) => set({ documents }),
  setSelectedUniversity: (university) => set({ selectedUniversity: university }),
  setSelectedCourse: (course) => set({ selectedCourse: course }),
  setSelectedSemester: (semester) => set({ selectedSemester: semester }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  clearFilters: () =>
    set({
      filters: {
        documentType: [],
        tags: [],
        status: 'approved',
      },
    }),
}));
