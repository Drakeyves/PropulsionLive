import { motion } from 'framer-motion';
import { Users, Clock, BookOpen, Link as LinkIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface Instructor {
  name: string;
  role: string;
  bio: string;
  image: string;
  credentials: string[];
}

interface Module {
  title: string;
  duration: string;
  lessons: {
    title: string;
    duration: string;
    type: 'video' | 'quiz' | 'project';
  }[];
}

interface Success {
  name: string;
  role: string;
  company: string;
  image: string;
  story: string;
  achievement: string;
}

interface CourseLayoutProps {
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites: string[];
  learningOutcomes: string[];
  modules: Module[];
  instructors: Instructor[];
  pricing: {
    price: string;
    features: string[];
  };
  successStories: Success[];
  certification: {
    type: string;
    description: string;
    validity: string;
  };
  stats: {
    students: number;
    rating: number;
    reviews: number;
    completion: number;
  };
  relatedCourses: {
    title: string;
    description: string;
    image: string;
    level: string;
    duration: string;
  }[];
}

export function CourseLayout({
  title,
  subtitle,
  description,
  duration,
  level,
  prerequisites,
  learningOutcomes,
  modules,
  instructors,
  pricing,
  successStories,
  certification,
  stats,
  relatedCourses,
}: CourseLayoutProps) {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto text-center py-16 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-accent-metallic-light mb-4">
            {title}
          </h1>
          <p className="text-xl text-accent-metallic mb-4">{subtitle}</p>
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-accent-purple-light" />
              <span className="text-accent-metallic-light">{duration}</span>
            </div>
            <div className="flex items-center space-x-2">
              <LinkIcon className="w-5 h-5 text-accent-purple-light" />
              <span className="text-accent-metallic-light">{level}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-accent-purple-light" />
              <span className="text-accent-metallic-light">{stats.students}+ enrolled</span>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button size="lg">Enroll Now</Button>
            <Button variant="outline" size="lg">
              Preview Course
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Course Overview */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-accent-metallic-light mb-4">
                Course Overview
              </h2>
              <p className="text-accent-metallic whitespace-pre-line">{description}</p>
            </Card>

            {/* Learning Outcomes */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-accent-metallic-light mb-4">
                What You'll Learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <LinkIcon className="w-5 h-5 text-accent-purple-light mt-1" />
                    <span className="text-accent-metallic">{outcome}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Prerequisites */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-accent-metallic-light mb-4">Prerequisites</h2>
              <ul className="space-y-2">
                {prerequisites.map((prerequisite, index) => (
                  <li key={index} className="flex items-center space-x-3 text-accent-metallic">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-purple-light" />
                    <span>{prerequisite}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Stats */}
            <Card className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-metallic-light">
                    {stats.rating}
                  </div>
                  <div className="text-sm text-accent-metallic">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-metallic-light">
                    {stats.reviews}
                  </div>
                  <div className="text-sm text-accent-metallic">Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-metallic-light">
                    {stats.students}
                  </div>
                  <div className="text-sm text-accent-metallic">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-metallic-light">
                    {stats.completion}%
                  </div>
                  <div className="text-sm text-accent-metallic">Completion</div>
                </div>
              </div>
            </Card>

            {/* Pricing */}
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-accent-metallic-light">{pricing.price}</div>
                <div className="text-accent-metallic">One-time payment</div>
              </div>
              <ul className="space-y-3 mb-6">
                {pricing.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <LinkIcon className="w-5 h-5 text-accent-purple-light" />
                    <span className="text-accent-metallic">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button fullWidth>Enroll Now</Button>
            </Card>

            {/* Certification */}
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <LinkIcon className="w-8 h-8 text-accent-purple-light" />
                <h3 className="text-xl font-bold text-accent-metallic-light">Certification</h3>
              </div>
              <p className="text-accent-metallic mb-4">{certification.description}</p>
              <div className="text-sm text-accent-metallic">Valid for {certification.validity}</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Course Curriculum */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-accent-metallic-light text-center mb-12">
          Course Curriculum
        </h2>
        <div className="space-y-6">
          {modules.map((module, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-accent-metallic-light">{module.title}</h3>
                <div className="text-accent-metallic">{module.duration}</div>
              </div>
              <div className="space-y-4">
                {module.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lessonIndex}
                    className="flex items-center justify-between p-4 rounded-lg bg-background/50"
                  >
                    <div className="flex items-center space-x-4">
                      {lesson.type === 'video' && (
                        <LinkIcon className="w-5 h-5 text-accent-purple-light" />
                      )}
                      {lesson.type === 'quiz' && (
                        <BookOpen className="w-5 h-5 text-accent-purple-light" />
                      )}
                      {lesson.type === 'project' && (
                        <LinkIcon className="w-5 h-5 text-accent-purple-light" />
                      )}
                      <span className="text-accent-metallic">{lesson.title}</span>
                    </div>
                    <span className="text-accent-metallic">{lesson.duration}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Instructors */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-accent-metallic-light text-center mb-12">
          Meet Your Instructors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {instructors.map((instructor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-accent-metallic-light">
                      {instructor.name}
                    </h3>
                    <div className="text-accent-metallic">{instructor.role}</div>
                  </div>
                </div>
                <p className="text-accent-metallic mb-4">{instructor.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {instructor.credentials.map((credential, credIndex) => (
                    <span
                      key={credIndex}
                      className="px-2 py-1 rounded-full bg-accent-purple/10 text-accent-purple-light text-sm"
                    >
                      {credential}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Success Stories */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-accent-metallic-light text-center mb-12">
          Student Success Stories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {successStories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img src={story.image} alt={story.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <div className="font-semibold text-accent-metallic-light">{story.name}</div>
                    <div className="text-sm text-accent-metallic">
                      {story.role} at {story.company}
                    </div>
                  </div>
                </div>
                <p className="text-accent-metallic mb-4">{story.story}</p>
                <div className="text-accent-purple-light font-semibold">{story.achievement}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Related Courses */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-accent-metallic-light text-center mb-12">
          Related Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedCourses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:transform hover:scale-[1.02] transition-transform duration-200">
                <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-accent-metallic-light mb-2">
                    {course.title}
                  </h3>
                  <p className="text-accent-metallic mb-4">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-accent-metallic">{course.level}</span>
                    <span className="text-accent-metallic">{course.duration}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4">
        <Card className="p-12 text-center">
          <h2 className="text-3xl font-bold text-accent-metallic-light mb-4">
            Start Your Learning Journey
          </h2>
          <p className="text-xl text-accent-metallic mb-8">
            Join thousands of students already learning with us
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg">Enroll Now</Button>
            <Button variant="outline" size="lg">
              Download Syllabus
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
