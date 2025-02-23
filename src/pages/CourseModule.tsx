import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ModuleContent } from '../components/courses/ModuleContent';
import { ModuleList } from '../components/courses/ModuleList';
import { useCourse } from '../contexts/CourseContext';
import { Card } from '../components/ui/Card';

export function CourseModule() {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const { selectedCourse, selectedModule, selectCourse, selectModule, loading, error } =
    useCourse();

  useEffect(() => {
    async function initializeCourse() {
      if (!courseId) {
        navigate('/courses');
        return;
      }

      try {
        await selectCourse(courseId);
        if (moduleId) {
          await selectModule(moduleId);
        }
      } catch (error) {
        console.error('Error loading course:', error);
        navigate('/courses');
      }
    }

    initializeCourse();
  }, [courseId, moduleId, navigate, selectCourse, selectModule]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6 animate-pulse">
          <div className="h-8 bg-accent-metallic-dark/10 rounded w-1/3 mb-4" />
          <div className="h-4 bg-accent-metallic-dark/10 rounded w-2/3" />
        </Card>
      </div>
    );
  }

  if (error || !selectedCourse) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-accent-metallic-light mb-2">
          Error Loading Course
        </h2>
        <p className="text-accent-metallic mb-4">{error || 'Course not found'}</p>
        <button
          onClick={() => navigate('/courses')}
          className="text-accent-purple hover:text-accent-purple-light"
        >
          Return to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2">
        {selectedModule && (
          <ModuleContent
            moduleId={selectedModule.id}
            title={selectedModule.title}
            description={selectedModule.description}
            videoUrl={selectedModule.videoUrl}
            resources={selectedModule.resources}
          />
        )}
      </div>

      {/* Module List Sidebar */}
      <div className="lg:col-span-1">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-accent-metallic-light mb-4">Course Modules</h2>
          <ModuleList modules={selectedCourse.modules || []} courseId={selectedCourse.id} />
        </Card>
      </div>
    </div>
  );
}
