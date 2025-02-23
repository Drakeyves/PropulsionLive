import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, initialized } = useAuth();
  const location = useLocation();

  // Only show loading spinner during initial auth check
  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If user is not authenticated and we're not already on the home page
  if (!user && location.pathname !== '/') {
    console.log('Redirecting to home from:', location.pathname);
    return <Navigate to="/" state={{ returnTo: location.pathname }} replace />;
  }

  // If requireAdmin is true, check if user has admin role
  if (requireAdmin && user) {
    const isAdmin = user.app_metadata?.role === 'admin';
    if (!isAdmin) {
      console.log('Non-admin user attempting to access admin route');
      return <Navigate to="/dashboard" replace />;
    }
  }

  // User is authenticated (and is admin if required), render children
  return <>{children}</>;
}
