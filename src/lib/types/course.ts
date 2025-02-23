export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number; // in minutes
  moduleCount: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  instructor: {
    id: string;
    name: string;
    avatar: string;
  };
  modules?: Module[]; // Make modules optional since they might be loaded separately
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration: number;
  order: number;
  videoUrl: string;
  transcript: string;
  resources: Resource[];
}

export type Resource = {
  id: string;
  title: string;
  url: string;
  type: 'link' | 'file' | 'pdf' | 'code';
  description?: string;
};

export interface CourseProgress {
  userId: string;
  courseId: string;
  completedModules: string[]; // module IDs
  lastAccessedModule: string;
  lastAccessedAt: string;
  progress: number; // 0-100
  notes?: {
    moduleId: string;
    content: string;
    timestamp: string;
  }[];
}

export interface CourseState {
  selectedCourse: Course | null;
  selectedModule: Module | null;
  progress: CourseProgress | null;
  loading: boolean;
  error: string | null;
}

export type CourseAction =
  | { type: 'SET_COURSE'; payload: Course }
  | { type: 'SET_MODULE'; payload: Module }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<CourseProgress> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };
