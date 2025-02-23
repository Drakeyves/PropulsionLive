import React, { useState } from 'react';
import {
  Bell,
  User,
  Rocket,
  LogOut,
  Settings as SettingsIcon,
  Menu,
  X,
  Shield,
  Home,
  BookOpen,
  PenTool as Tools,
  Users,
  MessageSquare,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { icon: Home, name: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, name: 'Courses', path: '/courses' },
    { icon: Tools, name: 'Tools', path: '/tools' },
    { icon: Users, name: 'Community', path: '/community' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="bg-background/60 backdrop-blur-xl border-b border-accent-purple/10 shadow-[0_0_30px_-15px_rgba(128,0,255,0.3)]">
        <div className="max-w-full mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to={user ? '/dashboard' : '/'} className="flex items-center space-x-3 group">
              <div className="relative">
                <motion.div
                  animate={{
                    rotate: [-45, -40, -45],
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Rocket className="w-8 h-8 text-accent-purple" />
                </motion.div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-accent-purple rounded-full animate-ping" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-accent-purple via-accent-purple-light to-accent-teal bg-clip-text text-transparent group-hover:to-accent-purple transition-all duration-300">
                  The Propulsion Society
                </span>
                <span className="text-xs text-accent-metallic">Accelerate Your Future</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      'flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                      'hover:bg-accent-purple/10 hover:text-accent-purple-light',
                      'relative overflow-hidden group',
                      isActive
                        ? 'bg-accent-purple/10 text-accent-purple-light'
                        : 'text-accent-metallic'
                    )}
                  >
                    <item.icon className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-purple to-accent-purple-light"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  {/* Messages */}
                  <button
                    onClick={() => navigate('/messages')}
                    className={cn(
                      'p-2 rounded-full transition-all duration-300 relative group',
                      location.pathname === '/messages'
                        ? 'bg-accent-purple/10 text-accent-purple-light'
                        : 'text-accent-metallic hover:text-accent-purple-light hover:bg-accent-purple/5'
                    )}
                    aria-label="Messages"
                  >
                    <MessageSquare className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent-purple rounded-full animate-pulse" />
                  </button>

                  {/* Notifications */}
                  <button
                    className="p-2 rounded-full hover:bg-accent-purple/5 transition-all duration-300 group"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5 text-accent-metallic-light transition-transform group-hover:scale-110" />
                  </button>
                </>
              )}

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="p-2 rounded-full bg-accent-purple/10 hover:bg-accent-purple/20 transition-all duration-300 group"
                  aria-expanded={showProfileMenu ? 'true' : 'false'}
                  aria-haspopup="true"
                  aria-label="Profile menu"
                >
                  <User className="w-5 h-5 text-accent-purple-light transition-transform group-hover:scale-110" />
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 rounded-lg bg-background/80 backdrop-blur-xl border border-accent-purple/20 shadow-[0_0_30px_-15px_rgba(128,0,255,0.3)] py-1"
                      role="menu"
                    >
                      <div className="px-4 py-2 border-b border-accent-purple/10">
                        <div className="text-sm font-medium text-accent-metallic-light">
                          {user?.email}
                        </div>
                        <div className="text-xs text-accent-metallic">Member</div>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-accent-metallic hover:bg-accent-purple/5 hover:text-accent-purple-light transition-colors group"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <User className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                          Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-2 text-sm text-accent-metallic hover:bg-accent-purple/5 hover:text-accent-purple-light transition-colors group"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <SettingsIcon className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                          Settings
                        </Link>
                        {user?.email === 'drazoyves@gmail.com' && (
                          <Link
                            to="/admin"
                            className="flex items-center px-4 py-2 text-sm text-accent-metallic hover:bg-accent-purple/5 hover:text-accent-purple-light transition-colors group"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <Shield className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                            Admin Dashboard
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-accent-purple/10 py-1">
                        <button
                          onClick={signOut}
                          className="flex items-center w-full px-4 py-2 text-sm text-accent-metallic hover:bg-accent-purple/5 hover:text-accent-purple-light transition-colors group"
                        >
                          <LogOut className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-lg hover:bg-accent-purple/5 transition-colors"
                aria-expanded={showMobileMenu ? 'true' : 'false'}
                aria-label="Toggle mobile menu"
              >
                <motion.div
                  animate={showMobileMenu ? { rotate: 90 } : { rotate: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {showMobileMenu ? (
                    <X className="w-6 h-6 text-accent-metallic-light" />
                  ) : (
                    <Menu className="w-6 h-6 text-accent-metallic-light" />
                  )}
                </motion.div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-accent-purple/10 bg-background/60 backdrop-blur-xl"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map(item => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={cn(
                        'flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors group',
                        isActive
                          ? 'bg-accent-purple/10 text-accent-purple-light'
                          : 'text-accent-metallic hover:bg-accent-purple/5 hover:text-accent-purple-light'
                      )}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <item.icon className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                      {item.name}
                    </Link>
                  );
                })}
                {/* Mobile Messages Link */}
                <Link
                  to="/messages"
                  className={cn(
                    'flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors group',
                    location.pathname === '/messages'
                      ? 'bg-accent-purple/10 text-accent-purple-light'
                      : 'text-accent-metallic hover:bg-accent-purple/5 hover:text-accent-purple-light'
                  )}
                  onClick={() => setShowMobileMenu(false)}
                >
                  <MessageSquare className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                  Messages
                </Link>
                {/* Mobile Admin Link */}
                {user?.email === 'drazoyves@gmail.com' && (
                  <Link
                    to="/admin"
                    className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-accent-metallic hover:bg-accent-purple/5 hover:text-accent-purple-light transition-colors group"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Shield className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                    Admin Dashboard
                  </Link>
                )}
                {/* Mobile Sign Out */}
                <button
                  onClick={signOut}
                  className="flex items-center w-full px-3 py-2 rounded-lg text-base font-medium text-accent-metallic hover:bg-accent-purple/5 hover:text-accent-purple-light transition-colors group"
                >
                  <LogOut className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
