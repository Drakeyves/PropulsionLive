import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Clock,
  Brain,
  Target,
  Zap,
  Bot,
  ChevronRight,
  ChevronLeft,
  Play,
  CheckCircle,
  Award,
  Trophy,
  Flame,
  Sparkles,
  MessageSquare,
  TrendingUp,
  User,
} from 'lucide-react';
import { format } from 'date-fns';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { supabase } from '../lib/supabase';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Tool {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  usageCount: number;
  rating: number;
  status: 'available' | 'beta' | 'coming_soon';
  url: string;
  lastUsed?: string;
}

interface CourseProgress {
  completed: number;
  total: number;
  nextModule: string;
  lastAccessed: string;
  certificateProgress?: number;
  nextMilestone?: string;
}

export function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [showMotivation] = useState(true);
  const [courseProgress] = useState<CourseProgress>({
    completed: 3,
    total: 8,
    nextModule: 'Advanced AI Implementation',
    lastAccessed: new Date().toISOString(),
    certificateProgress: 75,
    nextMilestone: 'Complete Advanced Neural Networks',
  });

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Get learning streak
  const learningStreak = 7; // This would come from your backend

  // Memoize tools with last used timestamp
  const tools: Tool[] = useMemo(
    () => [
      {
        id: 'workflow-automation',
        name: 'AI Workflow Automation',
        icon: Bot,
        description: 'Streamline operations with AI',
        usageCount: 1250,
        rating: 4.8,
        status: 'available',
        url: '/tools/workflow-automation',
        lastUsed: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
      },
      {
        id: 'performance-optimizer',
        name: 'Performance Optimizer',
        icon: Zap,
        description: 'AI-driven optimization',
        usageCount: 850,
        rating: 4.9,
        status: 'available',
        url: '/tools/performance-optimizer',
        lastUsed: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      },
      {
        id: 'strategic-planner',
        name: 'Strategic Planner',
        icon: Target,
        description: 'AI-powered insights',
        usageCount: 620,
        rating: 4.7,
        status: 'beta',
        url: '/tools/strategic-planner',
      },
      {
        id: 'ai-assistant',
        name: 'AI Assistant',
        icon: Brain,
        description: 'Personal AI assistant',
        usageCount: 1500,
        rating: 4.9,
        status: 'available',
        url: '/tools/ai-assistant',
        lastUsed: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
      },
    ],
    []
  );

  // Sort tools by last used
  const sortedTools = useMemo(() => {
    return [...tools].sort((a, b) => {
      if (!a.lastUsed) return 1;
      if (!b.lastUsed) return -1;
      return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime();
    });
  }, [tools]);

  // Handle tool click with loading state and error handling
  const handleToolClick = async (tool: Tool) => {
    if (!user || !supabase) return;

    try {
      setLoading(prev => ({ ...prev, [tool.id]: true }));

      // Log tool usage
      await supabase.from('tool_usage').insert([
        {
          user_id: user.id,
          tool_id: tool.id,
          timestamp: new Date().toISOString(),
        },
      ]);

      // Navigate to tool
      window.location.href = tool.url;
    } catch (error) {
      console.error('Error launching tool:', error);
    } finally {
      setLoading(prev => ({ ...prev, [tool.id]: false }));
    }
  };

  // Handle resume course with error handling
  const handleResumeCourse = () => {
    try {
      window.location.href = `/courses/ai-startup-accelerator/module-${courseProgress.completed + 1}`;
    } catch (error) {
      console.error('Error resuming course:', error);
    }
  };

  // Memoize chart data with cyberpunk theme
  const { progressData, chartOptions } = useMemo(
    () => ({
      progressData: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        datasets: [
          {
            label: 'Progress',
            data: [15, 35, 45, 60, 75, 85],
            borderColor: '#8000FF', // Primary Purple
            backgroundColor: 'rgba(128, 0, 255, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index' as const,
            intersect: false,
            backgroundColor: 'rgba(10, 15, 53, 0.9)', // Deep Blue
            titleColor: '#FFD700', // Gold
            bodyColor: '#FFFFFF',
            borderColor: '#00FFFF', // Neon Blue
            borderWidth: 1,
            callbacks: {
              label: (context: any) => `Progress: ${context.raw}%`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: 'rgba(0, 255, 255, 0.1)',
              borderColor: '#00FFFF',
            },
            ticks: { color: '#FFFFFF' },
          },
          x: {
            grid: { display: false },
            ticks: { color: '#FFFFFF' },
          },
        },
      },
    }),
    []
  );

  // Memoize metrics data
  const metrics = useMemo(
    () => [
      { label: 'Course Rating', value: '4.9', icon: Star },
      { label: 'Students', value: '500+', icon: User },
      { label: 'Completion Rate', value: '94%', icon: CheckCircle },
      { label: 'Success Stories', value: '50+', icon: Award },
    ],
    []
  );

  // Get recommended courses
  const recommendedCourses = [
    {
      id: 'ai-marketing',
      title: 'AI Marketing Mastery',
      progress: 0,
      duration: '6 weeks',
      level: 'Intermediate',
      matchScore: 95,
    },
    {
      id: 'data-science',
      title: 'Data Science Fundamentals',
      progress: 0,
      duration: '8 weeks',
      level: 'Beginner',
      matchScore: 88,
    },
  ];

  // Get community updates
  const communityUpdates = [
    {
      id: 1,
      type: 'discussion',
      title: 'Best practices for AI model training',
      replies: 12,
      isNew: true,
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Sarah completed Advanced Neural Networks',
      timeAgo: '2h ago',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Section with Enhanced Personalization */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A0F35] to-[#121212] p-8 border border-accent-purple/10">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-accent-purple to-accent-purple-light p-1">
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                      <User className="w-8 h-8 text-accent-purple-light" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background flex items-center justify-center">
                    <Flame className="w-4 h-4 text-orange-500" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {getGreeting()}, {user?.email?.split('@')[0] || 'Learner'}! 👋
                  </h1>
                  <div className="flex items-center space-x-2 text-accent-metallic mt-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>{learningStreak} day streak!</span>
                    <Badge variant="premium" className="ml-2">
                      Level 3
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-[#8000FF] to-[#FF00FF] hover:from-[#00FFFF] hover:to-[#8000FF] shadow-xl hover:shadow-accent-purple/20"
                rightIcon={<Play className="w-5 h-5 transition-transform group-hover:scale-110" />}
                onClick={handleResumeCourse}
              >
                Resume Learning
              </Button>
              <p className="text-sm text-accent-metallic mt-2">
                Continue with: {courseProgress.nextModule}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Course Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Progress Card */}
          <Card className="overflow-hidden border-t-4 border-t-accent-purple">
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-accent-metallic-light">
                    AI Startup Accelerator
                  </h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-4 h-4 text-accent-metallic" />
                    <span className="text-accent-metallic">
                      Last activity:{' '}
                      {format(new Date(courseProgress.lastAccessed), 'MMM d, h:mm a')}
                    </span>
                  </div>
                </div>
                <Badge variant="premium" className="text-sm px-3 py-1">
                  <Trophy className="w-4 h-4 mr-1" />
                  {courseProgress.certificateProgress}% to Certificate
                </Badge>
              </div>

              {/* Motivational Message */}
              <AnimatePresence>
                {showMotivation && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-accent-purple/10 rounded-lg p-4"
                  >
                    <div className="flex items-center space-x-3">
                      <Sparkles className="w-5 h-5 text-[#FFD700]" />
                      <div>
                        <p className="text-accent-metallic-light font-medium">
                          You're in the top 10% of learners! 🎉
                        </p>
                        <p className="text-sm text-accent-metallic">
                          Keep going! Only 2 more modules until your next achievement.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress Bar with Animation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-accent-metallic-light">Course Progress</span>
                  <span className="text-accent-purple-light font-semibold">
                    {Math.round((courseProgress.completed / courseProgress.total) * 100)}%
                  </span>
                </div>
                <div className="h-3 bg-accent-purple/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#8000FF] to-[#FF00FF]"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.round((courseProgress.completed / courseProgress.total) * 100)}%`,
                    }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {metrics.map(metric => (
                  <motion.div
                    key={metric.label}
                    className="p-4 rounded-lg bg-gradient-to-br from-[#0A0F35] to-[#121212] border border-accent-purple/10"
                    whileHover={{
                      scale: 1.02,
                      borderColor: 'rgba(128, 0, 255, 0.3)',
                      boxShadow: '0 0 15px rgba(128, 0, 255, 0.2)',
                    }}
                  >
                    <metric.icon className="w-5 h-5 text-accent-purple-light mb-2" />
                    <div className="text-xl font-bold text-accent-metallic-light">
                      {metric.value}
                    </div>
                    <div className="text-sm text-accent-metallic">{metric.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>

          {/* Recently Used Tools (Horizontal Scroll) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-accent-metallic-light">
                Recently Used Tools
              </h2>
              <Button variant="outline" size="sm" onClick={() => (window.location.href = '/tools')}>
                View All Tools
              </Button>
            </div>
            <div className="relative group">
              {/* Scroll Shadow Indicators */}
              <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
              <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />

              {/* Scroll Buttons */}
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 border border-accent-purple/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-accent-purple/10"
                onClick={() => {
                  const container = document.getElementById('tools-scroll-container');
                  if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
                }}
                aria-label="Scroll tools left"
              >
                <ChevronLeft className="w-5 h-5 text-accent-metallic-light" />
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 border border-accent-purple/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-accent-purple/10"
                onClick={() => {
                  const container = document.getElementById('tools-scroll-container');
                  if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                }}
                aria-label="Scroll tools right"
              >
                <ChevronRight className="w-5 h-5 text-accent-metallic-light" />
              </button>

              <div
                id="tools-scroll-container"
                className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-accent-purple/20 scrollbar-track-transparent scroll-smooth hide-scrollbar"
              >
                {sortedTools.map(tool => (
                  <Card
                    key={tool.id}
                    hover
                    className="flex-shrink-0 w-[300px] group/card transition-all duration-300 hover:border-accent-purple/50"
                  >
                    <div className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-[#8000FF] to-[#FF00FF] bg-opacity-10">
                          <tool.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-accent-metallic-light truncate">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-accent-metallic truncate">
                            {tool.description}
                          </p>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          loading={loading[tool.id]}
                          onClick={() => handleToolClick(tool)}
                          className="opacity-0 group-hover/card:opacity-100 transition-opacity"
                        >
                          Open
                        </Button>
                      </div>
                      {tool.lastUsed && (
                        <div className="mt-2 text-xs text-accent-metallic">
                          Last used: {format(new Date(tool.lastUsed), 'MMM d, h:mm a')}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            {/* Tools Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-background-secondary/30 rounded-lg p-3 border border-accent-purple/10">
                <div className="text-sm text-accent-metallic">Most Used Tool</div>
                <div className="text-lg font-semibold text-accent-metallic-light mt-1">
                  AI Assistant
                </div>
                <div className="text-xs text-accent-metallic">1,500 uses this month</div>
              </div>
              <div className="bg-background-secondary/30 rounded-lg p-3 border border-accent-purple/10">
                <div className="text-sm text-accent-metallic">Tools Used Today</div>
                <div className="text-lg font-semibold text-accent-metallic-light mt-1">4 Tools</div>
                <div className="text-xs text-accent-metallic">+2 from yesterday</div>
              </div>
              <div className="bg-background-secondary/30 rounded-lg p-3 border border-accent-purple/10">
                <div className="text-sm text-accent-metallic">Productivity Score</div>
                <div className="text-lg font-semibold text-accent-metallic-light mt-1">92%</div>
                <div className="text-xs text-accent-metallic">Top 5% of users</div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Learning Trends & Updates */}
        <div className="space-y-6">
          {/* Learning Trends - Now Bigger */}
          <Card className="overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-accent-metallic-light flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-accent-purple-light" />
                  <span>Learning Trends</span>
                </h2>
                <Badge variant="premium" className="text-sm">
                  Top Performer
                </Badge>
              </div>
              <div className="h-64">
                <Line data={progressData} options={chartOptions} />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-purple-light">85%</div>
                  <div className="text-sm text-accent-metallic">Weekly Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-purple-light">12hrs</div>
                  <div className="text-sm text-accent-metallic">Learning Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-purple-light">4.9</div>
                  <div className="text-sm text-accent-metallic">Avg. Score</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Recommended Courses */}
          <Card className="overflow-hidden">
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-semibold text-accent-metallic-light flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#FFD700]" />
                <span>Recommended for You</span>
              </h2>
              <div className="space-y-4">
                {recommendedCourses.map(course => (
                  <div
                    key={course.id}
                    className="p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-accent-metallic-light group-hover:text-accent-purple-light transition-colors">
                          {course.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1 text-xs text-accent-metallic">
                          <Clock className="w-3 h-3" />
                          <span>{course.duration}</span>
                          <span>•</span>
                          <span>{course.level}</span>
                        </div>
                      </div>
                      <Badge variant="premium" className="text-xs">
                        {course.matchScore}% Match
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Community Updates - Now More Compact */}
          <Card className="overflow-hidden">
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-accent-metallic-light flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-accent-purple-light" />
                  <span>Community Updates</span>
                </h2>
                <Button variant="outline" size="sm" className="text-xs">
                  View All
                </Button>
              </div>
              <div className="space-y-2">
                {communityUpdates.map(update => (
                  <div
                    key={update.id}
                    className="p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors cursor-pointer group flex items-start space-x-3"
                  >
                    {update.type === 'discussion' ? (
                      <MessageSquare className="w-4 h-4 text-accent-metallic mt-0.5" />
                    ) : (
                      <Trophy className="w-4 h-4 text-[#FFD700] mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-accent-metallic-light group-hover:text-accent-purple-light transition-colors truncate">
                        {update.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-0.5 text-xs text-accent-metallic">
                        {update.type === 'discussion' ? (
                          <>
                            <span>{update.replies} replies</span>
                            {update.isNew && (
                              <Badge variant="default" className="text-xs py-0 px-1">
                                New
                              </Badge>
                            )}
                          </>
                        ) : (
                          <span>{update.timeAgo}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
