import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  Settings,
  Award,
  BookOpen,
  Target,
  Users,
  LogOut,
  Star,
  Clock,
  Zap,
  Brain,
  Trophy,
  Flame,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/utils';

export function Profile() {
  const { profile, signOut } = useAuth();

  const stats = [
    { icon: BookOpen, label: 'Courses Completed', value: '8', trend: '+2 this month' },
    { icon: Target, label: 'Goals Achieved', value: '12', trend: '75% success rate' },
    { icon: Users, label: 'Network Size', value: '245', trend: '+45 new connections' },
    { icon: Award, label: 'Achievements', value: '15', trend: '3 pending' },
  ];

  const achievements = [
    {
      icon: Star,
      title: 'Fast Learner',
      description: 'Completed 5 courses in record time',
      date: '2 days ago',
      color: 'purple',
    },
    {
      icon: Brain,
      title: 'AI Master',
      description: 'Achieved expert status in AI fundamentals',
      date: '1 week ago',
      color: 'teal',
    },
    {
      icon: Trophy,
      title: 'Top Contributor',
      description: 'Among top 10% of community contributors',
      date: '2 weeks ago',
      color: 'gold',
    },
  ];

  const activityFeed = [
    {
      type: 'course',
      icon: BookOpen,
      title: 'Completed Advanced Neural Networks',
      timestamp: '3 hours ago',
    },
    {
      type: 'achievement',
      icon: Trophy,
      title: 'Earned "AI Innovator" badge',
      timestamp: 'Yesterday',
    },
    {
      type: 'community',
      icon: MessageSquare,
      title: 'Posted solution in AI Ethics forum',
      timestamp: '2 days ago',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A0F35] to-[#121212] p-8 border border-accent-purple/10"
      >
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-accent-purple to-accent-purple-light p-1">
                <div className="w-full h-full rounded-full bg-background overflow-hidden">
                  <img
                    src={profile?.avatar_url || '/default-avatar.png'}
                    alt={profile?.username || 'User avatar'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background flex items-center justify-center">
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-white">{profile?.username || 'User'}</h1>
                <Badge variant="premium" className="animate-pulse">
                  PRO
                </Badge>
              </div>
              <div className="flex items-center space-x-2 text-accent-metallic mt-1">
                <Clock className="w-4 h-4" />
                <span>
                  Member since {new Date(profile?.created_at || Date.now()).toLocaleDateString()}
                </span>
                <span>•</span>
                <Zap className="w-4 h-4 text-[#FFD700]" />
                <span className="text-[#FFD700]">Power User</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="lg"
              className="group relative overflow-hidden border-accent-purple/20 hover:border-accent-purple/40"
            >
              <Settings className="w-5 h-5 mr-2" />
              <span>Edit Profile</span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/0 via-accent-purple/10 to-accent-purple/0 group-hover:translate-x-full duration-1000 ease-in-out" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={signOut}
              className="group relative overflow-hidden border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-500"
            >
              <LogOut className="w-5 h-5 mr-2" />
              <span>Sign Out</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 group-hover:translate-x-full duration-1000 ease-in-out" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              hover
              className="h-full group transition-all duration-300 hover:border-accent-purple/50"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-[#8000FF] to-[#FF00FF] bg-opacity-10">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent-metallic-light group-hover:text-white transition-colors">
                      {stat.value}
                    </div>
                    <div className="text-accent-metallic">{stat.label}</div>
                    <div className="text-sm text-accent-purple-light mt-1">{stat.trend}</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Achievements and Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Achievements */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-accent-metallic-light flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-[#FFD700]" />
            <span>Recent Achievements</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="group">
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div
                        className={cn(
                          'p-3 rounded-lg',
                          achievement.color === 'purple' && 'bg-accent-purple/10',
                          achievement.color === 'teal' && 'bg-accent-teal/10',
                          achievement.color === 'gold' && 'bg-accent-gold/10'
                        )}
                      >
                        <achievement.icon
                          className={cn(
                            'w-6 h-6',
                            achievement.color === 'purple' && 'text-accent-purple-light',
                            achievement.color === 'teal' && 'text-accent-teal-light',
                            achievement.color === 'gold' && 'text-accent-gold-light'
                          )}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-accent-metallic-light group-hover:text-white transition-colors">
                          {achievement.title}
                        </h3>
                        <p className="text-accent-metallic">{achievement.description}</p>
                        <p className="text-sm text-accent-metallic-dark mt-2">{achievement.date}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-accent-metallic-light flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-accent-purple-light" />
            <span>Activity Feed</span>
          </h2>
          <Card className="overflow-hidden">
            <div className="p-6 space-y-4">
              {activityFeed.map((activity, index) => (
                <motion.div
                  key={activity.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="p-2 rounded-lg bg-accent-purple/10">
                    <activity.icon className="w-4 h-4 text-accent-purple-light" />
                  </div>
                  <div>
                    <p className="text-accent-metallic-light">{activity.title}</p>
                    <p className="text-sm text-accent-metallic">{activity.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
