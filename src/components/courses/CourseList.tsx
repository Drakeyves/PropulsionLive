import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Book, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useCourse } from '../../contexts/CourseContext';
import type { Course } from '../../lib/types/course';

interface CourseCardProps {
  course: Course;
  onSelect: (courseId: string) => Promise<void>;
}

function CourseCard({ course, onSelect }: CourseCardProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStartLearning = async () => {
    try {
      setLoading(true);
      await onSelect(course.id);
      navigate(`/courses/${course.id}/module-1`);
    } catch (error) {
      console.error('Error starting course:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card hover className="group">
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-medium">
          {course.level}
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-accent-metallic-light mb-1">{course.title}</h3>
          <p className="text-sm text-accent-metallic line-clamp-2">{course.description}</p>
        </div>

        <div className="flex items-center justify-between text-sm text-accent-metallic">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}m</span>
            </div>
            <div className="flex items-center space-x-1">
              <Book className="w-4 h-4" />
              <span>{course.moduleCount} modules</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>4.8</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={course.instructor.avatar}
              alt={course.instructor.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-accent-metallic">{course.instructor.name}</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            loading={loading}
            onClick={handleStartLearning}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Start Learning
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory] = useState<string | null>(null);
  const { selectCourse } = useCourse();

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        let query = supabase.from('courses').select('*');

        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }

        if (searchQuery) {
          query = query.ilike('title', `%${searchQuery}%`);
        }

        const { data, error } = await query;

        if (error) throw error;
        setCourses(data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-metallic" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background/50 border border-accent-metallic-dark/20 rounded-lg text-accent-metallic-light placeholder-accent-metallic focus:outline-none focus:ring-2 focus:ring-accent-purple/20 focus:border-accent-purple/30"
          />
        </div>
        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </Button>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="w-full h-48 bg-accent-metallic-dark/10 rounded-t-lg" />
              <div className="p-4 space-y-4">
                <div className="h-6 bg-accent-metallic-dark/10 rounded w-3/4" />
                <div className="h-4 bg-accent-metallic-dark/10 rounded w-full" />
                <div className="h-4 bg-accent-metallic-dark/10 rounded w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {courses.map(course => (
            <CourseCard key={course.id} course={course} onSelect={selectCourse} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
