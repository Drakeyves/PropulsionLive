import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  PenTool as Tools,
  Users,
  User,
  Settings,
  MessageSquarePlus,
  X,
  Brain,
  Target,
  Rocket,
  BarChart,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

const menuItems = [
  {
    icon: Home,
    label: 'Dashboard',
    path: '/dashboard',
    description: 'Overview and quick actions',
  },
  {
    icon: Rocket,
    label: 'AI Startup',
    path: '/courses',
    description: 'Launch your AI venture',
  },
  {
    icon: Brain,
    label: 'AI Tools',
    path: '/tools',
    description: 'Powerful AI solutions',
  },
  {
    icon: Users,
    label: 'Community',
    path: '/community',
    description: 'Connect and learn',
  },
  {
    icon: Target,
    label: 'Goals',
    path: '/goals',
    description: 'Track your progress',
  },
  {
    icon: BarChart,
    label: 'Analytics',
    path: '/analytics',
    description: 'Performance insights',
  },
];

const bottomMenuItems = [
  {
    icon: User,
    label: 'Profile',
    path: '/profile',
    description: 'Your account',
  },
  {
    icon: Settings,
    label: 'Settings',
    path: '/settings',
    description: 'Preferences',
  },
];

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const [activeItem, setActiveItem] = useState<string>('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState({ label: '', description: '' });
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0 });
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const currentPath = location.pathname;
    const matchingItem = [...menuItems, ...bottomMenuItems].find(item => item.path === currentPath);
    if (matchingItem) {
      setActiveItem(matchingItem.path);
    }
  }, [location]);

  const handleMouseEnter = (
    item: { label: string; description: string },
    event: React.MouseEvent
  ) => {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    setTooltipPosition({ top: rect.top });
    setTooltipContent({ label: item.label, description: item.description });
    setShowTooltip(true);
  };

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        'fixed left-0 top-16 bottom-0 w-16 z-50',
        'bg-background-secondary/80 backdrop-blur-md',
        'border-r border-accent-metallic-dark/10',
        'flex flex-col items-center py-4'
      )}
    >
      <nav className="flex-1 w-full">
        <ul className="space-y-2">
          {menuItems.map(item => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  'relative flex items-center justify-center w-full h-12',
                  'text-accent-metallic hover:text-accent-purple-light',
                  'transition-all duration-200',
                  activeItem === item.path && [
                    'text-accent-purple-light',
                    'after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2',
                    'after:h-8 after:w-0.5 after:bg-accent-purple-light',
                    'after:rounded-full',
                  ]
                )}
                onMouseEnter={e => handleMouseEnter(item, e)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <item.icon className="w-5 h-5" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className="w-full pt-4 border-t border-accent-metallic-dark/10">
        <ul className="space-y-2">
          {bottomMenuItems.map(item => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  'relative flex items-center justify-center w-full h-12',
                  'text-accent-metallic hover:text-accent-purple-light',
                  'transition-all duration-200',
                  activeItem === item.path && [
                    'text-accent-purple-light',
                    'after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2',
                    'after:h-8 after:w-0.5 after:bg-accent-purple-light',
                    'after:rounded-full',
                  ]
                )}
                onMouseEnter={e => handleMouseEnter(item, e)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <item.icon className="w-5 h-5" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Tooltip */}
      <div
        className={cn(
          'fixed left-16 ml-2 px-3 py-2 rounded-lg',
          'bg-background-secondary border border-accent-metallic-dark/10',
          'pointer-events-none transition-all duration-200',
          showTooltip ? 'opacity-100' : 'opacity-0',
          `top-[${tooltipPosition.top}px]`
        )}
      >
        <div className="text-sm font-medium text-accent-metallic-light">{tooltipContent.label}</div>
        <div className="text-xs text-accent-metallic">{tooltipContent.description}</div>
      </div>
    </aside>
  );
}
