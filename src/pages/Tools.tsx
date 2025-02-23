import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

// UI Components
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

// Icons
import {
  Search,
  Star,
  Clock,
  Settings,
  AlertCircle,
  Users,
  Bot,
  Info,
  Sparkles,
  ChevronRight,
  Heart,
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: Exclude<CategoryType, 'all'>;
  status: 'active' | 'beta' | 'deprecated';
  lastUpdated: string;
  usageCount: number;
  rating: number;
  features: string[];
}

type CategoryType = 'all' | 'automation' | 'marketing' | 'analytics' | 'productivity';

interface ToolCardProps {
  tool: Tool;
}

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
      category: 'automation',
      status: 'active',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      usageCount: 1250,
      rating: 4.8,
      features: ['Custom Workflow Builder', 'AI Task Automation', 'Performance Analytics'],
    },
    {
      id: 'performance-optimizer',
      name: 'Performance Optimizer',
      description: 'Maximize efficiency with AI-driven performance tracking and optimization',
      category: 'analytics',
      status: 'active',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      usageCount: 850,
      rating: 4.9,
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
      .filter(tool => tool.lastUpdated)
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 3);
  }, [tools]);

  // Get featured tools (high usage and rating)
  const featuredTools = useMemo(() => {
    return tools
      .filter(tool => tool.status === 'active' && tool.rating >= 4.8)
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
                    data-expanded={showSecurityInfo}
                    aria-label="Toggle security information"
                  >
                    <Info className="w-5 h-5" aria-hidden="true" />
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
                    aria-label="Search tools"
                  />
                  <Search
                    className="absolute right-3 top-3.5 w-5 h-5 text-accent-metallic"
                    aria-hidden="true"
                  />
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

function FeaturedToolCard({ tool }: ToolCardProps) {
  return (
    <Card className="p-6 bg-background-secondary hover:bg-background-secondary/80 transition-colors border-accent-purple/20">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-gradient-to-br from-[#8000FF] to-[#FF00FF] bg-opacity-10">
            <Bot className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-accent-metallic-light">{tool.name}</h3>
            <p className="text-sm text-accent-metallic mt-1">{tool.description}</p>
          </div>
        </div>
        {tool.status === 'active' && (
          <Heart className="w-5 h-5 text-red-500" aria-label="Active tool" />
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tool.features.map((feature, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {feature}
          </Badge>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-accent-metallic" />
            <span className="text-sm text-accent-metallic">{tool.usageCount} users</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-[#FFD700]" />
            <span className="text-sm text-accent-metallic">{tool.rating}</span>
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          rightIcon={<ChevronRight className="w-4 h-4" />}
          disabled={tool.status === 'deprecated'}
        >
          {tool.status === 'deprecated' ? 'Deprecated' : 'Try Now'}
        </Button>
      </div>
    </Card>
  );
}

function RecentToolCard({ tool }: ToolCardProps) {
  return (
    <Card className="p-4 bg-background-secondary hover:bg-background-secondary/80 transition-colors border-accent-purple/20">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-[#8000FF] to-[#FF00FF] bg-opacity-10">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-accent-metallic-light truncate">
            {tool.name}
          </h3>
          {tool.lastUpdated && (
            <p className="text-xs text-accent-metallic">
              Last used: {format(new Date(tool.lastUpdated), 'MMM d, h:mm a')}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

function ToolCard({ tool }: ToolCardProps) {
  return (
    <Card className="p-4 bg-background-secondary hover:bg-background-secondary/80 transition-colors border-accent-purple/20">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[#8000FF] to-[#FF00FF] bg-opacity-10">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-semibold text-accent-metallic-light">{tool.name}</h3>
              <Badge
                variant={
                  tool.status === 'active'
                    ? 'default'
                    : tool.status === 'beta'
                      ? 'secondary'
                      : 'outline'
                }
                className="text-xs"
              >
                {tool.status}
              </Badge>
            </div>
            <p className="text-sm text-accent-metallic mt-1">{tool.description}</p>
          </div>
        </div>
        {tool.status === 'active' && <Heart className="w-4 h-4 text-red-500" />}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-accent-metallic" />
            <span className="text-xs text-accent-metallic">{tool.usageCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-[#FFD700]" />
            <span className="text-xs text-accent-metallic">{tool.rating}</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          rightIcon={<ChevronRight className="w-4 h-4" />}
          disabled={tool.status === 'deprecated'}
        >
          {tool.status === 'deprecated' ? 'Deprecated' : 'Try Now'}
        </Button>
      </div>
    </Card>
  );
}
