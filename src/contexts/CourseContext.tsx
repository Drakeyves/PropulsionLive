import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type {
  Course,
  Module,
  CourseProgress,
  CourseState,
  CourseAction,
} from '../lib/types/course';
import { useAuth } from './AuthContext';

const initialState: CourseState = {
  selectedCourse: null,
  selectedModule: null,
  progress: null,
  loading: false,
  error: null,
};

function courseReducer(state: CourseState, action: CourseAction): CourseState {
  switch (action.type) {
    case 'SET_COURSE':
      return { ...state, selectedCourse: action.payload, error: null };
    case 'SET_MODULE':
      return { ...state, selectedModule: action.payload, error: null };
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: state.progress
          ? { ...state.progress, ...action.payload }
          : (action.payload as CourseProgress),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

interface CourseContextType extends CourseState {
  selectCourse: (courseId: string) => Promise<void>;
  selectModule: (moduleId: string) => Promise<void>;
  markModuleComplete: (moduleId: string) => Promise<void>;
  updateProgress: (progress: Partial<CourseProgress>) => Promise<void>;
  saveNote: (moduleId: string, content: string) => Promise<void>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(courseReducer, initialState);
  const { user } = useAuth();

  // Load progress from local storage on mount
  useEffect(() => {
    if (user) {
      const savedProgress = localStorage.getItem(`courseProgress_${user.id}`);
      if (savedProgress) {
        dispatch({ type: 'UPDATE_PROGRESS', payload: JSON.parse(savedProgress) });
      }
    }
  }, [user]);

  // Sync progress with Supabase
  useEffect(() => {
    if (state.progress && user) {
      const syncProgress = async () => {
        try {
          await supabase.from('course_progress').upsert({
            user_id: user.id,
            course_id: state.progress.courseId,
            completed_modules: state.progress.completedModules,
            last_accessed_module: state.progress.lastAccessedModule,
            last_accessed_at: state.progress.lastAccessedAt,
            progress: state.progress.progress,
            notes: state.progress.notes,
          });

          // Save to local storage for offline access
          localStorage.setItem(`courseProgress_${user.id}`, JSON.stringify(state.progress));
        } catch (error) {
          console.error('Error syncing progress:', error);
        }
      };

      syncProgress();
    }
  }, [state.progress, user]);

  const selectCourse = async (courseId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Fetch course details
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;

      dispatch({ type: 'SET_COURSE', payload: course });

      // Fetch or initialize progress
      if (user) {
        const { data: progress, error: progressError } = await supabase
          .from('course_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .single();

        if (!progressError && progress) {
          dispatch({ type: 'UPDATE_PROGRESS', payload: progress });
        } else {
          // Initialize new progress
          const newProgress: CourseProgress = {
            userId: user.id,
            courseId,
            completedModules: [],
            lastAccessedModule: '',
            lastAccessedAt: new Date().toISOString(),
            progress: 0,
          };
          dispatch({ type: 'UPDATE_PROGRESS', payload: newProgress });
        }
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error loading course' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const selectModule = async (moduleId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const { data: module, error } = await supabase
        .from('modules')
        .select('*')
        .eq('id', moduleId)
        .single();

      if (error) throw error;

      dispatch({ type: 'SET_MODULE', payload: module });

      if (state.progress && user) {
        dispatch({
          type: 'UPDATE_PROGRESS',
          payload: {
            lastAccessedModule: moduleId,
            lastAccessedAt: new Date().toISOString(),
          },
        });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error loading module' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const markModuleComplete = async (moduleId: string) => {
    if (!state.progress || !user) return;

    try {
      const completedModules = [...state.progress.completedModules];
      if (!completedModules.includes(moduleId)) {
        completedModules.push(moduleId);
      }

      const progress = Math.round(
        (completedModules.length / (state.selectedCourse?.moduleCount || 1)) * 100
      );

      dispatch({
        type: 'UPDATE_PROGRESS',
        payload: {
          completedModules,
          progress,
          lastAccessedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error updating progress' });
    }
  };

  const updateProgress = async (progress: Partial<CourseProgress>) => {
    if (!user) return;
    dispatch({ type: 'UPDATE_PROGRESS', payload: progress });
  };

  const saveNote = async (moduleId: string, content: string) => {
    if (!state.progress || !user) return;

    try {
      const notes = [...(state.progress.notes || [])];
      const noteIndex = notes.findIndex(note => note.moduleId === moduleId);
      const timestamp = new Date().toISOString();

      if (noteIndex >= 0) {
        notes[noteIndex] = { ...notes[noteIndex], content, timestamp };
      } else {
        notes.push({ moduleId, content, timestamp });
      }

      dispatch({
        type: 'UPDATE_PROGRESS',
        payload: { notes },
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error saving note' });
    }
  };

  return (
    <CourseContext.Provider
      value={{
        ...state,
        selectCourse,
        selectModule,
        markModuleComplete,
        updateProgress,
        saveNote,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
}
