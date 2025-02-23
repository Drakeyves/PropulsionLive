import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { cn } from '../lib/utils';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user } = useAuth();
  const isLandingPage = location.pathname === '/' && !user;

  return (
    <div
      className={cn(
        'min-h-screen bg-background text-accent-metallic-light relative',
        'motion-safe:transition-colors motion-safe:duration-300'
      )}
    >
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient background */}
        <div
          className={cn(
            'absolute inset-0',
            'bg-[radial-gradient(ellipse_at_top,#8000FF15,transparent_50%),radial-gradient(ellipse_at_bottom,#FF00FF15,transparent_50%)]',
            'motion-safe:animate-gradient-shift'
          )}
        />

        {/* Grid overlay */}
        <div
          className={cn(
            'absolute inset-0',
            'bg-[linear-gradient(to_right,#20202399_1px,transparent_1px),linear-gradient(to_bottom,#20202399_1px,transparent_1px)]',
            'bg-[size:4rem_4rem]',
            'opacity-[0.05]'
          )}
        />

        {/* Accent lines */}
        <div
          className={cn(
            'absolute -top-24 left-1/4 w-96 h-96',
            'bg-accent-purple/10',
            'rounded-full',
            'blur-3xl',
            'motion-safe:animate-pulse-slow'
          )}
        />
        <div
          className={cn(
            'absolute -bottom-32 right-1/4 w-96 h-96',
            'bg-accent-purple-light/10',
            'rounded-full',
            'blur-3xl',
            'motion-safe:animate-pulse-slow motion-safe:animation-delay-2000'
          )}
        />
      </div>

      {/* Content wrapper with glass effect */}
      <div className="relative min-h-screen flex flex-col">
        {!isLandingPage && <Header />}
        <main
          className={cn('flex-1 pb-8 px-4', isLandingPage ? 'pt-0' : 'pt-24', 'relative z-10')}
          id="main-content"
          role="main"
          aria-label="Main content"
        >
          <div
            className={cn(
              'max-w-full mx-auto',
              'rounded-xl',
              !isLandingPage && 'bg-background-secondary/30 backdrop-blur-sm',
              !isLandingPage && 'shadow-[0_0_50px_-12px_rgba(128,0,255,0.15)]'
            )}
          >
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
