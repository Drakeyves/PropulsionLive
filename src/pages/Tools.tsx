import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Star,
  Clock,
  Settings,
  Zap,
  Bot,
  Brain,
  Target,
  ChevronRight,
  Info,
  Sparkles,
  BarChart,
  MessageSquare,
  Rocket,
  Filter,
  Heart,
  AlertCircle,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: 'automation' | 'marketing' | 'analytics' | 'productivity';
  status: 'available' | 'beta' | 'coming_soon';
  usageCount: number;
  rating: number;
  lastUsed?: string;
  isFavorite?: boolean;
  url: string;
  features?: string[];
}

type CategoryType = 'all' | 'automation' | 'marketing' | 'analytics' | 'productivity';

export function Tools() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);

  const tools: Tool[] = [
    {
      id: 'ai-workflow',
      name: 'AI Workflow Automation',
      description: 'Streamline your operations with intelligent automation powered by advanced AI',
      icon: Bot,
      category: 'automation',
      status: 'available',
      usageCount: 1250,
      rating: 4.8,
      lastUsed: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isFavorite: true,
      url: '/tools/workflow',
      features: ['Custom Workflow Builder', 'AI Task Automation', 'Performance Analytics'],
    },
    {
      id: 'performance-optimizer',
      name: 'Performance Optimizer',
      description: 'Maximize efficiency with AI-driven performance tracking and optimization',
      icon: Zap,
      category: 'analytics',
      status: 'available',
      usageCount: 850,
      rating: 4.9,
      lastUsed: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      url: '/tools/optimizer',
      features: ['Real-time Analytics', 'AI Recommendations', 'Custom Reports'],
    },
    // ... add more tools
  ];

  // Filter and search logic
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [tools, searchQuery, selectedCategory]);

  // Get recently used tools
  const recentTools = useMemo(() => {
    return [...tools]
      .filter(tool => tool.lastUsed)
      .sort((a, b) => new Date(b.lastUsed!).getTime() - new Date(a.lastUsed!).getTime())
      .slice(0, 3);
  }, [tools]);

  // Get featured tools (high usage and rating)
  const featuredTools = useMemo(() => {
    return tools
      .filter(tool => tool.status === 'available' && tool.rating >= 4.8)
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 2);
  }, [tools]);

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-accent-purple/10 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex flex-col space-y-6">
            {/* Title and Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1 max-w-2xl">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#8000FF] to-[#FF00FF] text-transparent bg-clip-text">
                  AI Tools & Automation
                </h1>
                <p className="text-xl text-accent-metallic mt-2">
                  Supercharge your workflow with our suite of AI-powered tools
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center space-x-2 text-accent-metallic">
                    <Sparkles className="w-5 h-5 text-accent-purple-light" />
                    <span>{tools.length} Tools Available</span>
                  </div>
                  <button
                    className="flex items-center space-x-2 text-accent-metallic hover:text-accent-metallic-light transition-colors"
                    onClick={() => setShowSecurityInfo(!showSecurityInfo)}
                  >
                    <Info className="w-5 h-5" />
                    <span className="text-sm">Security Info</span>
                  </button>
                </div>
              </div>
              <div className="flex-shrink-0 w-full md:w-72">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 bg-background-secondary rounded-lg border border-accent-purple/20 focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/20 text-accent-metallic-light placeholder-accent-metallic/50"
                  />
                  <Search className="absolute right-3 top-3.5 w-5 h-5 text-accent-metallic" />
                </div>
              </div>
            </div>

            {/* Security Info Banner */}
            <AnimatePresence>
              {showSecurityInfo && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-lg bg-background-secondary border border-accent-purple/20">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-accent-purple-light flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-accent-metallic">
                        <p className="font-medium text-accent-metallic-light mb-1">
                          Your Security is Our Priority
                        </p>
                        <p>
                          All tools are secured with enterprise-grade encryption and comply with
                          industry standards. Your data is always protected and never shared with
                          third parties.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Category Filters */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {[
                { value: 'all', label: 'All Tools' },
                { value: 'automation', label: 'Automation' },
                { value: 'marketing', label: 'Marketing' },
                { value: 'analytics', label: 'Analytics' },
                { value: 'productivity', label: 'Productivity' },
              ].map(category => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value as CategoryType)}
                  className={cn(
                    'whitespace-nowrap',
                    selectedCategory === category.value &&
                      'bg-gradient-to-r from-[#8000FF] to-[#FF00FF] hover:from-[#00FFFF] hover:to-[#8000FF]'
                  )}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Recently Used Tools */}
        {recentTools.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-accent-metallic-light mb-4 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-accent-purple-light" />
              <span>Recently Used</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentTools.map(tool => (
                <RecentToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        )}

        {/* Featured Tools */}
        <section>
          <h2 className="text-xl font-semibold text-accent-metallic-light mb-4 flex items-center space-x-2">
            <Star className="w-5 h-5 text-[#FFD700]" />
            <span>Featured Tools</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredTools.map(tool => (
              <FeaturedToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* All Tools Grid */}
        <section>
          <h2 className="text-xl font-semibold text-accent-metallic-light mb-4 flex items-center space-x-2">
            <Settings className="w-5 h-5 text-accent-purple-light" />
            <span>All Tools</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools
              .filter(tool => !featuredTools.find(f => f.id === tool.id))
              .map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function FeaturedToolCard({ tool }: { tool: Tool }) {
  return (
    <Card
      hover
      className="group transition-all duration-300 hover:border-accent-purple/50 hover:shadow-[0_0_30px_rgba(128,0,255,0.2)]"
    >
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-[#8000FF] to-[#FF00FF] bg-opacity-10">
              <tool.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-accent-metallic-light group-hover:text-accent-purple-light transition-colors">
                {tool.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="premium" className="text-sm">
                  Featured
                </Badge>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-accent-metallic-light">{tool.rating}</span>
                </div>
              </div>
            </div>
          </div>
          {tool.isFavorite && <Heart className="w-5 h-5 text-red-500" />}
        </div>

        <p className="text-accent-metallic">{tool.description}</p>

        {tool.features && (
          <div className="space-y-2">
            {tool.features.map(feature => (
              <div
                key={feature}
                className="flex items-center space-x-2 text-sm text-accent-metallic"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-accent-purple-light" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-accent-metallic">
            {tool.usageCount.toLocaleString()} users
          </div>
          <Button
            variant="primary"
            className="bg-gradient-to-r from-[#8000FF] to-[#FF00FF] hover:from-[#00FFFF] hover:to-[#8000FF]"
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Try Now
          </Button>
        </div>
      </div>
    </Card>
  );
}

function RecentToolCard({ tool }: { tool: Tool }) {
  return (
    <Card hover className="group transition-all duration-300 hover:border-accent-purple/50">
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[#8000FF] to-[#FF00FF] bg-opacity-10">
            <tool.icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-accent-metallic-light truncate">
              {tool.name}
            </h3>
            {tool.lastUsed && (
              <p className="text-xs text-accent-metallic">
                Last used: {format(new Date(tool.lastUsed), 'MMM d, h:mm a')}
              </p>
            )}
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Open
          </Button>
        </div>
      </div>
    </Card>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Card hover className="group transition-all duration-300 hover:border-accent-purple/50">
      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#8000FF] to-[#FF00FF] bg-opacity-10">
              <tool.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-accent-metallic-light group-hover:text-accent-purple-light transition-colors">
                {tool.name}
              </h3>
              <div className="flex items-center space-x-2">
                <Badge
                  variant={
                    tool.status === 'available'
                      ? 'default'
                      : tool.status === 'beta'
                        ? 'secondary'
                        : 'outline'
                  }
                  className="text-xs"
                >
                  {tool.status.charAt(0).toUpperCase() + tool.status.slice(1)}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-accent-metallic-light">{tool.rating}</span>
                </div>
              </div>
            </div>
          </div>
          {tool.isFavorite && <Heart className="w-4 h-4 text-red-500" />}
        </div>

        <p className="text-sm text-accent-metallic line-clamp-2">{tool.description}</p>

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-accent-metallic">
            {tool.usageCount.toLocaleString()} users
          </div>
          <Button
            variant="secondary"
            size="sm"
            rightIcon={<ChevronRight className="w-4 h-4" />}
            disabled={tool.status === 'coming_soon'}
          >
            {tool.status === 'coming_soon' ? 'Coming Soon' : 'Try Now'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
