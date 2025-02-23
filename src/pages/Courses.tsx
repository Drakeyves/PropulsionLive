import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  Clock,
  Filter,
  Users,
  GraduationCap,
  BookOpen,
  BarChart2,
  ArrowRight,
  Search,
  Trophy,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  instructor?: string;
  rating: number;
  students: string;
  progress?: number;
  image: string;
  tags?: string[];
  price: string;
  status: 'available' | 'coming_soon' | 'in_progress';
  modules: string[];
  category: string;
  lastAccessed?: string;
}

type CategoryType = 'all' | 'ai-business' | 'automation' | 'marketing' | 'sales';
type LevelType = 'all' | 'beginner' | 'intermediate' | 'advanced';

export function Courses() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [selectedLevel, setSelectedLevel] = useState<LevelType>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Enhanced courses data with progress for logged-in user
  const courses: Course[] = [
    {
      id: 'ai-startup-accelerator',
      title: 'AI Startup Accelerator',
      category: 'ai-business',
      description:
        'Learn how to build, launch, and scale an AI-powered startup from scratch. Master the fundamentals of AI entrepreneurship and create sustainable business models.',
      image:
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&q=80',
      duration: '12 weeks',
      modules: [
        'AI-Powered Business Ideation',
        'Rapid Prototyping with No-Code/Low-Code',
        'Automated Growth & Marketing Strategies',
        'AI Sales Funnels & Lead Gen',
      ],
      students: '450+',
      rating: 4.9,
      status: 'in_progress',
      price: 'Free for first 500',
      level: 'intermediate',
      progress: 45,
      lastAccessed: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
      id: 'ai-workflow-automation',
      title: 'Mastering AI Workflow Automation',
      category: 'automation',
      description:
        'Discover how to automate tasks and scale your business using AI workflows. Learn to build efficient systems that save time and increase productivity.',
      image:
        'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&q=80',
      duration: '8 weeks',
      modules: [
        'AI Productivity Hacks & Tools',
        'Automating Customer Service & Sales',
        'AI-Driven Task & Project Management',
        'Building Scalable AI Systems',
      ],
      students: '380+',
      rating: 4.8,
      status: 'available',
      price: 'Free for first 500',
      level: 'intermediate',
    },
    {
      id: 'ai-content-creator',
      title: 'The AI-Powered Content Creator',
      category: 'marketing',
      description:
        'Leverage AI tools to generate high-quality content for marketing & branding. Master the art of creating compelling content at scale.',
      image:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&q=80',
      duration: '6 weeks',
      modules: [
        'AI Copywriting & Blog Generation',
        'AI Video Creation & Editing',
        'AI-Powered Social Media Growth',
        'Automating Email & Ad Campaigns',
      ],
      students: '520+',
      rating: 4.7,
      status: 'available',
      price: 'Free',
      level: 'beginner',
    },
    {
      id: 'ai-marketing-lead-gen',
      title: 'AI-Driven Marketing & Lead Generation',
      category: 'marketing',
      description:
        'Use AI to supercharge customer acquisition and scale lead generation. Learn advanced techniques for automated marketing and lead nurturing.',
      image:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&q=80',
      duration: '10 weeks',
      modules: [
        'AI Market Research & Audience Targeting',
        'Automated Outreach & CRM Systems',
        'AI-Powered Funnel Optimization',
        'AI Ad Copy & SEO Automation',
      ],
      students: '200+',
      rating: 4.9,
      status: 'coming_soon',
      price: 'Premium Only',
      level: 'advanced',
    },
    {
      id: 'ai-wealth-creation',
      title: 'The Millionaire Mindset – AI & Wealth Creation',
      category: 'ai-business',
      description:
        'Develop high-performance habits & leverage AI for financial independence. Learn strategies for building sustainable wealth using AI tools.',
      image:
        'https://images.unsplash.com/photo-1579226905180-636b76d96082?ixlib=rb-1.2.1&auto=format&fit=crop&q=80',
      duration: '12 weeks',
      modules: [
        'AI-Driven Investment Strategies',
        'AI for Productivity & Wealth-Building',
        'Creating Scalable Passive Income Streams',
        'High-Performance Execution & Mindset',
      ],
      students: '150+',
      rating: 4.8,
      status: 'coming_soon',
      price: 'Free for first 500',
      level: 'advanced',
    },
    {
      id: 'ai-sales-persuasion',
      title: 'AI for Sales & Persuasion',
      category: 'sales',
      description:
        'Master the art of using AI to enhance sales, negotiation, and closing techniques. Transform your sales process with AI-powered strategies.',
      image:
        'https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-1.2.1&auto=format&fit=crop&q=80',
      duration: '8 weeks',
      modules: [
        'AI-Generated Sales Scripts & Pitches',
        'AI-Enhanced Negotiation Strategies',
        'AI-Powered Client Follow-Ups & Retention',
        'Building a High-Converting AI Sales Funnel',
      ],
      students: '180+',
      rating: 4.7,
      status: 'coming_soon',
      price: 'Premium Only',
      level: 'intermediate',
    },
  ];

  // Filter and search logic
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [courses, searchQuery, selectedCategory, selectedLevel]);

  // Separate in-progress courses
  const inProgressCourses = useMemo(() => {
    return filteredCourses.filter(course => course.status === 'in_progress');
  }, [filteredCourses]);

  const availableCourses = useMemo(() => {
    return filteredCourses.filter(course => course.status !== 'in_progress');
  }, [filteredCourses]);

  const handleStartCourse = (course: Course) => {
    if ((course.status === 'available' || course.status === 'in_progress') && course.id) {
      navigate(`/courses/${course.id}/module-1`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-accent-purple/10 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex flex-col space-y-4">
            {/* Enhanced Title and Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1 max-w-2xl">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#8000FF] to-[#FF00FF] text-transparent bg-clip-text">
                  Master AI Technology
                </h1>
                <p className="text-xl text-accent-metallic mt-2">
                  Transform your future with cutting-edge AI courses designed for modern innovators
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center space-x-2 text-accent-metallic">
                    <GraduationCap className="w-5 h-5 text-accent-purple-light" />
                    <span>{courses.length} Expert-Led Courses</span>
                  </div>
                  <div className="flex items-center space-x-2 text-accent-metallic">
                    <Users className="w-5 h-5 text-accent-purple-light" />
                    <span>2000+ Active Learners</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 w-full md:w-72">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 bg-background-secondary rounded-lg border border-accent-purple/20 focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-accent-metallic-light placeholder-accent-metallic/50"
                  />
                  <Search className="absolute right-3 top-3.5 w-5 h-5 text-accent-metallic" />
                </div>
              </div>
            </div>

            {/* Enhanced Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center space-x-2 border-accent-purple/30"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter Courses</span>
                  {(selectedCategory !== 'all' || selectedLevel !== 'all') && (
                    <Badge variant="premium" className="ml-2">
                      {filteredCourses.length}
                    </Badge>
                  )}
                </Button>
                {/* Quick Filter Pills */}
                <div className="flex items-center gap-2">
                  <Badge
                    variant={selectedLevel === 'beginner' ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedLevel(selectedLevel === 'beginner' ? 'all' : 'beginner')
                    }
                  >
                    Beginner
                  </Badge>
                  <Badge
                    variant={selectedCategory === 'ai-business' ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === 'ai-business' ? 'all' : 'ai-business'
                      )
                    }
                  >
                    Business
                  </Badge>
                </div>
              </div>
            </div>

            {/* Existing Filter Panel */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {/* Categories */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-accent-metallic-light">
                        Category
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: 'all', label: 'All' },
                          { value: 'ai-business', label: 'AI Business' },
                          { value: 'automation', label: 'Automation' },
                          { value: 'marketing', label: 'Marketing' },
                          { value: 'sales', label: 'Sales' },
                        ].map(category => (
                          <Button
                            key={category.value}
                            variant={selectedCategory === category.value ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory(category.value as CategoryType)}
                          >
                            {category.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Levels */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-accent-metallic-light">
                        Skill Level
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { value: 'all', label: 'All Levels' },
                          { value: 'beginner', label: 'Beginner' },
                          { value: 'intermediate', label: 'Intermediate' },
                          { value: 'advanced', label: 'Advanced' },
                        ].map(level => (
                          <Button
                            key={level.value}
                            variant={selectedLevel === level.value ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedLevel(level.value as LevelType)}
                          >
                            {level.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-12 gap-8">
          {/* Course Grid - Main Content */}
          <div className="col-span-12 lg:col-span-9 space-y-8">
            {/* Featured Courses */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-accent-metallic-light flex items-center space-x-2">
                <Trophy className="w-6 h-6 text-[#FFD700]" />
                <span>Featured Courses</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableCourses
                  .filter(course => course.rating >= 4.8)
                  .slice(0, 2)
                  .map((course, index) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      index={index}
                      onStart={handleStartCourse}
                      featured
                    />
                  ))}
              </div>
            </section>

            {/* All Courses */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-accent-metallic-light flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-accent-purple-light" />
                <span>All Courses</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableCourses
                  .filter(course => course.rating < 4.8)
                  .map((course, index) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      index={index}
                      onStart={handleStartCourse}
                    />
                  ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* Continue Learning Panel (if courses in progress) */}
            {inProgressCourses.length > 0 && (
              <Card className="bg-gradient-to-br from-background-secondary to-background border-accent-purple/20">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-accent-metallic-light mb-4 flex items-center space-x-2">
                    <BarChart2 className="w-5 h-5 text-accent-purple-light" />
                    <span>Continue Learning</span>
                  </h3>
                  <div className="space-y-4">
                    {inProgressCourses.map(course => (
                      <div
                        key={course.id}
                        className="p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors cursor-pointer"
                        onClick={() => handleStartCourse(course)}
                      >
                        <h4 className="font-medium text-accent-metallic-light line-clamp-1">
                          {course.title}
                        </h4>
                        {course.progress && (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center justify-between text-xs text-accent-metallic">
                              <span>Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <div className="progress-bar-sm">
                              <div className={`progress-bar-fill w-[${course.progress}%]`} />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Course Stats */}
            <Card className="bg-gradient-to-br from-background-secondary to-background border-accent-purple/20">
              <div className="p-4 space-y-4">
                <h3 className="text-lg font-semibold text-accent-metallic-light">Popular Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {['AI Business', 'Automation', 'Marketing', 'Sales'].map(topic => (
                    <Badge key={topic} variant="secondary" className="px-3 py-1">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CourseCardProps {
  course: Course;
  index: number;
  onStart: (course: Course) => void;
  featured?: boolean;
}

function CourseCard({ course, index, onStart, featured }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        hover
        className={cn(
          'group h-full transition-all duration-300',
          featured ? 'border-accent-purple' : 'hover:border-accent-purple/50'
        )}
      >
        <div className="relative h-48 rounded-t-lg overflow-hidden">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

          {/* Category and Level Badge */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
            <Badge variant="premium" className="text-sm">
              {course.category.split('-').join(' ').toUpperCase()}
            </Badge>
            <Badge
              variant="secondary"
              className={cn(
                'text-sm',
                course.level === 'beginner' && 'bg-green-500/10 text-green-400',
                course.level === 'intermediate' && 'bg-yellow-500/10 text-yellow-400',
                course.level === 'advanced' && 'bg-red-500/10 text-red-400'
              )}
            >
              {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Course Progress (if in progress) */}
          {course.status === 'in_progress' && course.progress && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-accent-metallic">Progress</span>
                <span className="text-accent-purple-light font-medium">{course.progress}%</span>
              </div>
              <div className="progress-bar">
                <div className={`progress-bar-fill w-[${course.progress}%]`} />
              </div>
            </div>
          )}

          {/* Course Info */}
          <div>
            <h3 className="text-xl font-bold text-accent-metallic-light group-hover:text-accent-purple-light transition-colors">
              {course.title}
            </h3>

            <div className="mt-2 flex items-center space-x-4 text-sm text-accent-metallic">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>{course.modules.length} modules</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{course.rating}</span>
              </div>
            </div>
          </div>

          {/* Course Description (truncated) */}
          <p className="text-sm text-accent-metallic line-clamp-2">{course.description}</p>

          {/* Action Button */}
          <div className="pt-4">
            <Button
              variant={course.status === 'in_progress' ? 'primary' : 'secondary'}
              fullWidth
              rightIcon={<ArrowRight className="w-4 h-4" />}
              disabled={course.status === 'coming_soon'}
              onClick={() => onStart(course)}
              className={cn(
                course.status === 'in_progress' &&
                  'bg-gradient-to-r from-[#8000FF] to-[#FF00FF] hover:from-[#00FFFF] hover:to-[#8000FF]'
              )}
            >
              {course.status === 'in_progress'
                ? 'Continue Learning'
                : course.status === 'coming_soon'
                  ? 'Join Waitlist'
                  : 'Start Learning'}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
