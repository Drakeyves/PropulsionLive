import { Rocket, Gauge, Brain, Target } from 'lucide-react';

export function MainContent() {
  return (
    <main className="flex-1 pt-24 pb-8 px-4 ml-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Card */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-background-secondary to-background border border-accent-metallic-dark/10">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-accent-metallic-light mb-2">
                    Welcome to Propulsion Society
                  </h1>
                  <p className="text-accent-metallic">
                    Your journey to elite performance starts here. Explore our community, courses,
                    and tools to accelerate your growth.
                  </p>
                </div>
                <Rocket className="w-12 h-12 text-accent-purple animate-pulse" />
              </div>
            </div>

            {/* Featured Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: Gauge,
                  label: 'Performance Tracker',
                  description: 'Monitor and optimize your daily performance metrics',
                  gradient: 'from-purple-500/20 to-blue-500/20',
                },
                {
                  icon: Brain,
                  label: 'Mindset Analyzer',
                  description: 'AI-powered tool to enhance decision making',
                  gradient: 'from-purple-500/20 to-pink-500/20',
                },
                {
                  icon: Target,
                  label: 'Goal Accelerator',
                  description: 'Strategic planning and execution framework',
                  gradient: 'from-blue-500/20 to-cyan-500/20',
                },
              ].map(tool => (
                <div
                  key={tool.label}
                  className="group p-4 rounded-lg bg-background-secondary border border-accent-metallic-dark/10
                           hover:border-accent-purple/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 
                                   group-hover:opacity-100 transition-opacity duration-300`}
                    />
                    <div className="relative">
                      <div className="p-3 rounded-lg bg-accent-purple/10 w-fit">
                        <tool.icon className="w-6 h-6 text-accent-purple-light" />
                      </div>
                      <div className="mt-3">
                        <div className="text-lg font-semibold text-accent-metallic-light mb-1">
                          {tool.label}
                        </div>
                        <div className="text-sm text-accent-metallic">{tool.description}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Community Feed */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-accent-metallic-light">Community Feed</h2>
              {/* Feed items would go here */}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-background-secondary border border-accent-metallic-dark/10">
              <h3 className="text-lg font-semibold text-accent-metallic-light mb-4">
                Upcoming Events
              </h3>
              {/* Event items would go here */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
