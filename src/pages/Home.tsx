import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Rocket,
  Users,
  Target,
  Bot,
  Clock,
  AlertTriangle,
  TrendingUp,
  LineChart,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/auth/AuthModal';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

interface HomeProps {
  preview?: boolean;
}

export function Home({ preview = false }: HomeProps) {
  const { user, initialized, loading } = useAuth();
  const location = useLocation();
  const returnTo = location.state?.returnTo;
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [memberCount, setMemberCount] = useState(150);
  const [spotsRemaining, setSpotsRemaining] = useState(500);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.log('Supabase not configured, using default values');
      return;
    }

    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000;

    async function fetchMemberCount() {
      try {
        setIsLoading(true);
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (error) throw error;

        if (isMounted) {
          const currentCount = count || 0;
          setMemberCount(currentCount);
          setSpotsRemaining(Math.max(500 - currentCount, 0));
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching member count:', error.message);
        }

        if (isMounted && retryCount < maxRetries) {
          retryCount++;
          setTimeout(fetchMemberCount, retryDelay * Math.pow(2, retryCount - 1));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchMemberCount();

    const subscription = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
        },
        () => {
          if (isMounted) {
            fetchMemberCount();
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (initialized && !loading && user && !preview) {
    console.log('Redirecting from home to:', returnTo || '/dashboard');
    return <Navigate to={returnTo || '/dashboard'} replace state={undefined} />;
  }

  const valueProps = [
    {
      icon: TrendingUp,
      title: 'AI Wave Early Access',
      description: 'Get in before the AI bubble pops and prices skyrocket',
      color: 'purple',
    },
    {
      icon: Bot,
      title: 'AI Business Builder',
      description: 'Launch your AI venture while the market is hot',
      color: 'teal',
    },
    {
      icon: Users,
      title: 'Elite Network Access',
      description: 'Connect with serious AI entrepreneurs & builders',
      color: 'gold',
    },
    {
      icon: LineChart,
      title: 'Market Timing',
      description: 'Position yourself before mass AI adoption hits',
      color: 'purple',
    },
  ];

  const successStories = [
    {
      name: 'Michael R.',
      role: 'AI Startup Founder',
      quote: 'Launched my AI SaaS in 4 weeks, already at $30K MRR',
      metrics: ['$30K MRR', '4 Weeks', '2 Enterprise Deals'],
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    },
    {
      name: 'Sarah L.',
      role: 'AI Consultant',
      quote: 'Built an AI consulting business before the market got saturated',
      metrics: ['$20K/Month', '15 Clients', '90% Success Rate'],
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
  ];

  const urgencyPoints = [
    {
      icon: AlertTriangle,
      title: 'AI Bubble Warning',
      description:
        'Market signals indicate the AI hype is peaking - act now before the bubble pops',
    },
    {
      icon: Clock,
      title: 'Limited Time Window',
      description: 'Early adopter advantages disappear once mass adoption begins',
    },
    {
      icon: Target,
      title: 'Strategic Timing',
      description: 'Position yourself before the market gets saturated',
    },
  ];

  return (
    <div className="min-h-screen w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-1.2.1&auto=format&fit=crop&q=80&w=2000"
            alt="AI Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>

        <div className="relative max-w-7xl mx-auto w-full py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            {/* Brand */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Rocket className="w-12 h-12 text-accent-purple animate-rocket" />
              <h2 className="text-2xl font-bold gradient-text">The Propulsion Society</h2>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Gain Your <span className="gradient-text">AI Edge Before It's Too Late</span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-accent-metallic-light/80 font-medium">
                Propulsion Society Tools, Community & Courses To Excel
              </p>
            </div>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-accent-metallic">
              Your Last Chance to Ride the AI Wave & Build Your Future
              <br />
              <span className="text-accent-purple-light font-semibold">
                {isLoading ? (
                  'Calculating remaining spots...'
                ) : spotsRemaining > 0 ? (
                  <>Only {spotsRemaining} Founding Member Spots Left!</>
                ) : (
                  <>Founding Member Spots Full - Join Waitlist</>
                )}
              </span>
            </p>

            {/* Trust Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { label: 'Active Members', value: isLoading ? '150+' : `${memberCount}+` },
                { label: 'Success Rate', value: '94%' },
                { label: 'Average MRR', value: '$25K+' },
                { label: 'Time to Launch', value: '4 Weeks' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-accent-metallic-light mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-accent-metallic">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center space-y-4"
              >
                <div className="flex items-center gap-2 text-lg md:text-xl">
                  <AlertTriangle className="w-5 h-5 text-accent-purple-light" />
                  <span className="text-accent-metallic">
                    {isLoading ? (
                      'Loading availability...'
                    ) : spotsRemaining > 0 ? (
                      <>
                        Last <span className="text-accent-purple-light font-bold">Free</span>{' '}
                        Lifetime Access Spots
                      </>
                    ) : (
                      <>Join the Waitlist for Next Opening</>
                    )}
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center space-y-4"
              >
                <Button
                  size="lg"
                  onClick={() => {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }}
                  rightIcon={<ArrowRight className="w-6 h-6" />}
                  className="text-lg md:text-xl py-6 px-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  {isLoading
                    ? 'JOIN NOW'
                    : spotsRemaining > 0
                      ? 'SECURE YOUR FOUNDING MEMBER SPOT'
                      : 'JOIN THE WAITLIST'}
                </Button>
                <p className="text-accent-metallic">
                  Future Price: <span className="line-through">$997/month</span> -
                  <span className="text-accent-teal-light font-bold">
                    {isLoading ? ' Loading...' : spotsRemaining > 0 ? ' FREE' : ' Waitlist Only'}
                  </span>
                  {spotsRemaining > 0 && ' for First 500 Members'}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-accent-metallic-light mb-4">
              What You Get Inside
            </h2>
            <p className="text-xl text-accent-metallic">
              Everything you need to capitalize on the AI boom before it's too late
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {valueProps.map((prop, index) => (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full group">
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div
                        className={cn(
                          'p-3 rounded-lg',
                          prop.color === 'purple' && 'bg-accent-purple/10',
                          prop.color === 'teal' && 'bg-accent-teal/10',
                          prop.color === 'gold' && 'bg-accent-gold/10'
                        )}
                      >
                        <prop.icon
                          className={cn(
                            'w-8 h-8',
                            prop.color === 'purple' && 'text-accent-purple-light',
                            prop.color === 'teal' && 'text-accent-teal-light',
                            prop.color === 'gold' && 'text-accent-gold-light'
                          )}
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-accent-metallic-light mb-2">
                          {prop.title}
                        </h3>
                        <p className="text-accent-metallic">{prop.description}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-24 px-4 bg-background-secondary/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-accent-metallic-light mb-4">
              Early Adopters Winning Big
            </h2>
            <p className="text-xl text-accent-metallic">
              Members who got in early are already seeing massive results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <img
                        src={`${story.image}?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                        alt={story.name}
                        className="w-16 h-16 rounded-full"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-accent-metallic-light">
                          {story.name}
                        </h3>
                        <p className="text-accent-metallic">{story.role}</p>
                      </div>
                    </div>
                    <blockquote className="text-xl text-accent-metallic-light mb-6">
                      "{story.quote}"
                    </blockquote>
                    <div className="grid grid-cols-3 gap-4">
                      {story.metrics.map(metric => (
                        <div
                          key={metric}
                          className="text-center p-3 rounded-lg bg-accent-purple/10"
                        >
                          <span className="text-sm text-accent-purple-light">{metric}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-accent-metallic-light mb-4">
              Why You Must Act Now
            </h2>
            <p className="text-xl text-accent-metallic">
              The AI gold rush won't last forever - position yourself before it's too late
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {urgencyPoints.map((point, index) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full group">
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 rounded-lg bg-accent-purple/10">
                        <point.icon className="w-6 h-6 text-accent-purple-light" />
                      </div>
                      <h3 className="text-xl font-semibold text-accent-metallic-light">
                        {point.title}
                      </h3>
                    </div>
                    <p className="text-accent-metallic">{point.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/20 via-accent-teal/20 to-accent-purple/20 animate-pulse-soft" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(13,13,20,0.8)_100%)]" />
            </div>
            <div className="relative p-12 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="inline-block p-3 rounded-full bg-accent-purple/10 mb-4">
                  <AlertTriangle className="w-8 h-8 text-accent-purple-light animate-pulse" />
                </div>

                <h2 className="text-4xl font-bold text-accent-metallic-light">
                  The AI Gold Rush Is <span className="text-accent-purple-light">Almost Over</span>
                </h2>

                <p className="text-xl text-accent-metallic max-w-2xl mx-auto">
                  {spotsRemaining > 0 ? (
                    <>
                      Only{' '}
                      <span className="text-accent-purple-light font-bold">{spotsRemaining}</span>{' '}
                      founding member spots remain. Lock in your position before the AI market
                      matures and prices surge.
                    </>
                  ) : (
                    <>
                      All founding member spots are filled. Join the waitlist now to be notified
                      when new spots become available.
                    </>
                  )}
                </p>

                <div className="flex flex-col items-center gap-4 mt-8">
                  <Button
                    size="lg"
                    onClick={() => {
                      setAuthMode('signup');
                      setShowAuthModal(true);
                    }}
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    className="min-w-[300px] py-6 text-lg transform hover:scale-105 transition-all duration-300 shadow-glow hover:shadow-glow-lg"
                  >
                    {spotsRemaining > 0 ? <>CLAIM YOUR SPOT NOW</> : <>JOIN THE WAITLIST</>}
                  </Button>

                  <div className="flex items-center gap-2 text-accent-metallic">
                    <Clock className="w-4 h-4 text-accent-purple-light" />
                    <span>Limited Time Offer</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </Card>
        </div>
      </section>

      {/* Sticky Bottom CTA */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 p-4 bg-background-secondary/80 backdrop-blur-lg border-t border-accent-metallic-dark/10 z-50"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:block">
            <p className="text-accent-metallic-light font-semibold">
              ⚠️ AI Bubble Alert:
              <span className="text-accent-purple-light ml-2">
                {spotsRemaining > 0 ? `${spotsRemaining} Founding Spots Left` : 'Waitlist Only'}
              </span>
            </p>
          </div>
          <Button
            onClick={() => {
              setAuthMode('signup');
              setShowAuthModal(true);
            }}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="flex-1 md:flex-none"
          >
            {spotsRemaining > 0
              ? `SECURE YOUR SPOT – ${spotsRemaining} LEFT! 🚀`
              : 'JOIN WAITLIST NOW! 🚀'}
          </Button>
        </div>
      </motion.div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onModeChange={setAuthMode}
        />
      )}
    </div>
  );
}
