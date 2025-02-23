import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import {
  supabase,
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  onAuthStateChange,
} from '../lib/supabase';
import type { Profile } from '../lib/supabase';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProfile(null);
    }
  }

  // Wrap the signIn function to ensure proper state updates
  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await signIn(email, password);
      if (result.error) throw result.error;

      // Set user immediately for better UX
      if (result.data?.user) {
        setUser(result.data.user);
        await fetchProfile(result.data.user.id);
      }

      return result;
    } catch (err) {
      console.error('Sign in error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        setLoading(true);
        // Check for existing session
        const { user: currentUser } = await getCurrentUser();

        if (currentUser && mounted) {
          setUser(currentUser);
          await fetchProfile(currentUser.id);
        }

        if (mounted) {
          setInitialized(true);
          setError(null);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initialize();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = onAuthStateChange(async (event: string, session: Session | null) => {
      if (!mounted) return;

      try {
        console.log('Auth state changed:', event, session?.user?.id);
        setLoading(true);

        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setError(null);
      } catch (err) {
        console.error('Error handling auth state change:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile,
    loading,
    error,
    initialized,
    signIn: handleSignIn,
    signUp,
    signOut,
  };

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
