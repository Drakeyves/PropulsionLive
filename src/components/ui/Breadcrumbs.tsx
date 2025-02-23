import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BreadcrumbsProps {
  className?: string;
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <nav
      className={cn(
        "flex items-center space-x-2 text-sm text-accent-metallic",
        className
      )}
      aria-label="Breadcrumbs"
    >
      <Link
        to="/"
        className={cn(
          "flex items-center hover:text-accent-purple-light",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-accent-purple/20 rounded"
        )}
      >
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>

      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;

        return (
          <React.Fragment key={path}>
            <ChevronRight className="w-4 h-4 text-accent-metallic-dark" />
            <Link
              to={path}
              className={cn(
                "capitalize",
                isLast
                  ? "text-accent-metallic-light pointer-events-none"
                  : "hover:text-accent-purple-light transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-accent-purple/20 rounded"
              )}
              aria-current={isLast ? 'page' : undefined}
            >
              {segment}
            </Link>
          </React.Fragment>
        );
      })}
    </nav>
  );
}