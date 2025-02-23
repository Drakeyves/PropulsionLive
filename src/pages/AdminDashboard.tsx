import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Settings,
  Users,
  PenTool as Tool,
  FileText,
  Plus,
  Edit,
  Trash,
  Search,
  Filter,
  AlertTriangle,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  X,
  BookOpen,
  Shield,
  Ban,
  Lock,
  Activity,
  Bell,
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { cn } from '../lib/utils';

interface AdminUser {
  id: string;
  role: 'admin' | 'super_admin';
  permissions: string[];
  created_at: string;
}

interface Course {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  enrollments: number;
  instructor: string;
  lastUpdated: string;
}

interface Tool {
  id: string;
  name: string;
  status: 'active' | 'disabled' | 'maintenance';
  users: number;
  apiKey?: string;
  lastSync: string;
}

interface SecurityIncident {
  id: string;
  type: 'ban' | 'warning' | 'block';
  target: string;
  reason: string;
  timestamp: string;
}

export function AdminDashboard() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'courses' | 'tools' | 'users' | 'security'>('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showEditor, setShowEditor] = useState(false);

  // Check admin status
  useEffect(() => {
    let isMounted = true;

    async function checkAdminStatus() {
      if (!user || !supabase) {
        if (isMounted) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }

      try {
        setError(null);
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (adminError) throw adminError;

        if (!isMounted) return;

        // Check if the user is an admin
        if (adminData) {
          setIsAdmin(true);
        } else if (user.email === 'drazoyves@gmail.com') {
          // Fallback for super admin
          setIsAdmin(true);

          if (!supabase) return;

          // Create admin user record if it doesn't exist
          const { error: createError } = await supabase
            .from('admin_users')
            .insert({
              id: user.id,
              role: 'super_admin',
            })
            .single();

          if (createError && isMounted) {
            console.error('Error creating admin record:', createError);
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error checking admin status:', error);
          setError('Failed to verify admin status. Please try again.');
          setIsAdmin(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    checkAdminStatus();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Sample data
  const courses: Course[] = useMemo(
    () => [
      {
        id: '1',
        title: 'AI Startup Accelerator',
        status: 'published',
        enrollments: 450,
        instructor: 'John Doe',
        lastUpdated: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Advanced AI Implementation',
        status: 'draft',
        enrollments: 0,
        instructor: 'Jane Smith',
        lastUpdated: new Date().toISOString(),
      },
    ],
    []
  );

  const tools: Tool[] = useMemo(
    () => [
      {
        id: '1',
        name: 'AI Workflow Automation',
        status: 'active',
        users: 120,
        apiKey: 'sk-123456',
        lastSync: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Performance Optimizer',
        status: 'active',
        users: 85,
        lastSync: new Date().toISOString(),
      },
    ],
    []
  );

  const securityIncidents: SecurityIncident[] = useMemo(
    () => [
      {
        id: '1',
        type: 'ban',
        target: 'user@example.com',
        reason: 'Suspicious activity',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'block',
        target: '192.168.1.1',
        reason: 'Multiple failed login attempts',
        timestamp: new Date().toISOString(),
      },
    ],
    []
  );

  const tabs = [
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'tools', label: 'Tools', icon: Tool },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-accent-purple border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-6 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-accent-metallic-light mb-2">Error</h2>
          <p className="text-accent-metallic mb-4">{error}</p>
          <Button
            variant="secondary"
            onClick={() => window.location.reload()}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-6 text-center max-w-md">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-accent-metallic-light mb-2">Access Denied</h2>
          <p className="text-accent-metallic mb-4">
            You don't have permission to access the admin dashboard.
          </p>
          <Button variant="secondary" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-gradient-to-br from-background-secondary to-background border border-accent-metallic-dark/10"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-accent-metallic-light mb-2">Admin Console</h1>
            <p className="text-accent-metallic">Manage courses, tools, users, and security</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" leftIcon={<Activity className="w-4 h-4" />}>
              System Status
            </Button>
            <Button variant="outline" leftIcon={<Bell className="w-4 h-4" />}>
              Notifications
            </Button>
            <Button variant="outline" leftIcon={<Settings className="w-4 h-4" />}>
              Settings
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'w-full flex items-center space-x-3 px-4 py-3 rounded-lg',
                    'transition-colors duration-200',
                    activeTab === tab.id
                      ? 'bg-accent-purple/10 text-accent-purple-light'
                      : 'text-accent-metallic hover:bg-accent-purple/5 hover:text-accent-purple-light'
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
              Filters
            </Button>
            <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowEditor(true)}>
              Add New
            </Button>
          </div>

          {/* Content List */}
          <Card>
            <div className="p-4">
              {activeTab === 'courses' && (
                <div className="space-y-4">
                  {courses.map(course => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-accent-metallic-dark/10 hover:bg-accent-purple/5 transition-colors"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-accent-metallic-light">
                          {course.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-accent-metallic">
                          <span>{course.instructor}</span>
                          <span>{course.enrollments} enrollments</span>
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-full text-xs',
                              course.status === 'published' && 'bg-green-500/10 text-green-400',
                              course.status === 'draft' && 'bg-yellow-500/10 text-yellow-400',
                              course.status === 'archived' && 'bg-red-500/10 text-red-400'
                            )}
                          >
                            {course.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" leftIcon={<Edit className="w-4 h-4" />}>
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Trash className="w-4 h-4" />}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'tools' && (
                <div className="space-y-4">
                  {tools.map(tool => (
                    <div
                      key={tool.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-accent-metallic-dark/10 hover:bg-accent-purple/5 transition-colors"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-accent-metallic-light">
                          {tool.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-accent-metallic">
                          <span>{tool.users} active users</span>
                          <span>Last sync: {format(new Date(tool.lastSync), 'MMM d, HH:mm')}</span>
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-full text-xs',
                              tool.status === 'active' && 'bg-green-500/10 text-green-400',
                              tool.status === 'disabled' && 'bg-red-500/10 text-red-400',
                              tool.status === 'maintenance' && 'bg-yellow-500/10 text-yellow-400'
                            )}
                          >
                            {tool.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Settings className="w-4 h-4" />}
                        >
                          Configure
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={
                            tool.status === 'active' ? (
                              <Lock className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )
                          }
                        >
                          {tool.status === 'active' ? 'Disable' : 'Enable'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'users' && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-accent-purple-light mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-accent-metallic-light mb-2">
                      User Management
                    </h3>
                    <p className="text-accent-metallic mb-4">
                      Manage user accounts, roles, and permissions
                    </p>
                    <div className="flex justify-center space-x-4">
                      <Button leftIcon={<Plus className="w-4 h-4" />}>Add User</Button>
                      <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
                        Export Users
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-4">
                  {securityIncidents.map(incident => (
                    <div
                      key={incident.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-accent-metallic-dark/10 hover:bg-accent-purple/5 transition-colors"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={cn(
                              'p-1 rounded',
                              incident.type === 'ban' && 'bg-red-500/10 text-red-400',
                              incident.type === 'warning' && 'bg-yellow-500/10 text-yellow-400',
                              incident.type === 'block' && 'bg-orange-500/10 text-orange-400'
                            )}
                          >
                            {incident.type === 'ban' && <Ban className="w-4 h-4" />}
                            {incident.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                            {incident.type === 'block' && <Lock className="w-4 h-4" />}
                          </span>
                          <h3 className="text-lg font-semibold text-accent-metallic-light">
                            {incident.target}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-accent-metallic">
                          <span>{incident.reason}</span>
                          <span>{format(new Date(incident.timestamp), 'MMM d, HH:mm')}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<CheckCircle className="w-4 h-4" />}
                        >
                          Resolve
                        </Button>
                        <Button variant="outline" size="sm" leftIcon={<Ban className="w-4 h-4" />}>
                          Extend
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-accent-metallic-light mb-4">Confirm Action</h3>
              <p className="text-accent-metallic mb-6">
                Are you sure you want to perform this action? This cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Handle confirmation
                    setShowConfirmDialog(false);
                  }}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
