import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  ThumbsUp,
  Share2,
  Plus,
  Users,
  Calendar,
  X,
  Send,
  AlertTriangle,
  RefreshCw,
  Rocket,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { PostEditor } from '../components/posts/PostEditor';
import ReactMarkdown from 'react-markdown';

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  author: {
    username: string;
    avatar_url: string | null;
  };
}

interface PostResponse {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
  author: {
    username: string;
    avatar_url: string | null;
  }[];
}

export function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showPostEditor, setShowPostEditor] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Refs for tracking mounted state and fetch status
  const isMounted = useRef(true);
  const isFetching = useRef(false);
  const subscriptionRef = useRef<any>(null);

  const categories = ['All', 'Success Stories', 'Questions & Help', 'Resources', 'Announcements'];

  // Welcome message component
  const WelcomeMessage = () => (
    <Card className="mb-6">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-lg bg-accent-purple/10">
            <Rocket className="w-8 h-8 text-accent-purple-light" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-accent-metallic-light mb-4">
              Welcome to The Propulsion Society! 🚀
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-accent-metallic mb-4">
                As your administrators, we're excited to have you join our community dedicated to
                all things propulsion engineering and technology. Here's what you can expect:
              </p>
              <ul className="space-y-2 text-accent-metallic">
                <li>📚 Share and discuss propulsion innovations</li>
                <li>🔧 Technical discussions and problem-solving</li>
                <li>👥 Network with fellow propulsion enthusiasts</li>
                <li>📢 Latest industry news and developments</li>
                <li>💡 Project collaborations and ideas</li>
              </ul>
              <p className="text-accent-metallic mt-4">
                Please introduce yourself and share your interests in propulsion technology. Feel
                free to start discussions or ask questions about any propulsion-related topics.
              </p>
              <div className="mt-6 p-4 rounded-lg bg-background/50 border border-accent-metallic-dark/10">
                <h3 className="text-lg font-semibold text-accent-metallic-light mb-2">
                  Community Guidelines:
                </h3>
                <ul className="list-disc list-inside space-y-1 text-accent-metallic">
                  <li>Be respectful and professional</li>
                  <li>Share knowledge constructively</li>
                  <li>Credit sources when applicable</li>
                  <li>Keep discussions on-topic</li>
                </ul>
              </div>
              <p className="text-accent-metallic mt-4">
                Welcome aboard! Let's advance propulsion technology together.
              </p>
              <p className="text-accent-metallic-light font-medium mt-2">
                -The Propulsion Society Admin Team
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  // Enhanced fetchPosts with better error handling and race condition prevention
  const fetchPosts = useCallback(
    async (retry = false) => {
      if (!supabase) {
        console.error('Supabase client not initialized');
        return;
      }

      // Prevent concurrent fetches
      if (isFetching.current) return;
      isFetching.current = true;

      if (retry) {
        setRetryCount(prev => prev + 1);
      } else {
        setRetryCount(0);
      }

      try {
        setError(null);

        let query = supabase
          .from('posts')
          .select(
            `
          id,
          title,
          content,
          category,
          tags,
          likes_count,
          comments_count,
          created_at,
          author:profiles(username, avatar_url)
        `
          )
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (selectedCategory && selectedCategory !== 'All') {
          query = query.eq('category', selectedCategory);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        // Transform the data to match our Post interface
        const transformedPosts: Post[] =
          (data as PostResponse[])?.map(post => ({
            ...post,
            author: post.author[0] || { username: 'Unknown', avatar_url: null },
          })) || [];

        // Only update state if component is still mounted
        if (isMounted.current) {
          setPosts(transformedPosts);
          setError(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);

        if (isMounted.current) {
          setError('Failed to load posts. Please try again.');
          setLoading(false);

          // Implement exponential backoff for retries with a maximum of 3 attempts
          if (retryCount < 3) {
            const timeout = Math.pow(2, retryCount) * 1000;
            setTimeout(() => {
              if (isMounted.current) fetchPosts(true);
            }, timeout);
          }
        }
      } finally {
        isFetching.current = false;
      }
    },
    [selectedCategory, retryCount]
  );

  // Set up real-time subscription with better error handling
  useEffect(() => {
    if (isSubscribed || !supabase) return;

    const setupSubscription = async () => {
      try {
        if (subscriptionRef.current) {
          await subscriptionRef.current.unsubscribe();
        }

        subscriptionRef.current = supabase
          .channel('posts_channel')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'posts',
            },
            payload => {
              if (isMounted.current && !isFetching.current) {
                fetchPosts();
              }
            }
          )
          .subscribe(status => {
            if (status === 'SUBSCRIBED' && isMounted.current) {
              setIsSubscribed(true);
            }
          });
      } catch (error) {
        console.error('Subscription error:', error);
        if (isMounted.current) {
          setTimeout(() => {
            if (isMounted.current) setupSubscription();
          }, 5000);
        }
      }
    };

    setupSubscription();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      isMounted.current = false;
    };
  }, [selectedCategory, supabase, isSubscribed, fetchPosts]);

  // Initial fetch with cleanup
  useEffect(() => {
    fetchPosts();

    return () => {
      isMounted.current = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [selectedCategory]);

  async function likePost(postId: string) {
    if (!user || !supabase) {
      console.error('User not authenticated or Supabase client not initialized');
      return;
    }

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) {
        console.error('Post not found');
        return;
      }

      const { error } = await supabase
        .from('posts')
        .update({ likes_count: post.likes_count + 1 })
        .eq('id', postId);

      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-gradient-to-br from-background-secondary to-background border border-accent-metallic-dark/10"
      >
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-accent-metallic-light mb-4">Community Hub</h1>
          <p className="text-accent-metallic">
            Connect with ambitious entrepreneurs, share insights, and accelerate your growth through
            meaningful interactions.
          </p>
        </div>
      </motion.div>

      {/* Welcome Message */}
      <WelcomeMessage />

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mt-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category === 'All' ? null : category)}
            className={cn(
              'px-4 py-2 rounded-lg whitespace-nowrap',
              'transition-colors duration-200',
              selectedCategory === category || (category === 'All' && !selectedCategory)
                ? 'bg-accent-purple text-white'
                : 'bg-background-secondary text-accent-metallic hover:text-accent-purple-light'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex gap-8 mt-8">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">{error}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchPosts()}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Retry
              </Button>
            </motion.div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-accent-purple border-t-transparent rounded-full" />
              <p className="text-accent-metallic mt-4">Loading posts...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && posts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <h2 className="text-2xl font-bold text-accent-metallic-light mb-4">
                Be the first to share something!
              </h2>
              <p className="text-accent-metallic mb-8">
                Start a discussion, share your insights, or ask a question.
              </p>
              {user ? (
                <Button
                  onClick={() => setShowPostEditor(true)}
                  leftIcon={<Plus className="w-5 h-5" />}
                >
                  Create Post
                </Button>
              ) : (
                <p className="text-accent-metallic">Sign in to start posting in the community.</p>
              )}
            </motion.div>
          )}

          {/* Posts Feed */}
          {!loading &&
            !error &&
            posts.map(post => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card hover>
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-accent-purple/10 flex items-center justify-center">
                        {post.author.avatar_url ? (
                          <img
                            src={post.author.avatar_url}
                            alt={post.author.username}
                            className="w-full h-full rounded-full"
                          />
                        ) : (
                          <Users className="w-6 h-6 text-accent-purple-light" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-accent-metallic-light">
                          {post.author.username}
                        </div>
                        <div className="text-sm text-accent-metallic">
                          {new Date(post.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-accent-metallic-light mb-4">
                      {post.title}
                    </h2>

                    <div className="prose prose-invert max-w-none mb-4">
                      <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 rounded-full bg-accent-purple/10 text-accent-purple-light text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center space-x-6 text-sm">
                      <button
                        onClick={() => likePost(post.id)}
                        className="flex items-center space-x-2 text-accent-metallic hover:text-accent-purple-light transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes_count}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-accent-metallic hover:text-accent-purple-light transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments_count}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-accent-metallic hover:text-accent-purple-light transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:flex flex-col w-80 space-y-6">
          {/* Community Stats */}
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-accent-metallic-light">Community Stats</h3>
                <Users className="w-4 h-4 text-accent-metallic" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-accent-metallic">Active Members</span>
                  <span className="text-accent-metallic-light">500+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accent-metallic">Posts Today</span>
                  <span className="text-accent-metallic-light">{posts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-accent-metallic">Active Discussions</span>
                  <span className="text-accent-metallic-light">
                    {posts.filter(p => p.comments_count > 0).length}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Guidelines */}
          <Card>
            <div className="p-4">
              <h3 className="font-medium text-accent-metallic-light mb-4">Community Guidelines</h3>
              <ul className="space-y-2 text-sm text-accent-metallic">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-purple-light" />
                  <span>Be respectful and professional</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-purple-light" />
                  <span>Share valuable insights</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-purple-light" />
                  <span>Keep discussions relevant</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-purple-light" />
                  <span>Help others learn and grow</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>

      {/* Floating Action Button */}
      {user && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          aria-label="Create new post"
          title="Create new post"
          onClick={() => setShowPostEditor(true)}
          className={cn(
            'fixed bottom-8 right-8 p-4 rounded-full',
            'bg-accent-purple text-white',
            'shadow-lg hover:shadow-xl',
            'transform hover:-translate-y-1',
            'transition-all duration-200'
          )}
        >
          <span className="sr-only">Create new post</span>
          <Plus className="w-6 h-6" aria-hidden="true" />
        </motion.button>
      )}

      {/* Post Editor Modal */}
      <AnimatePresence>
        {showPostEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl relative"
            >
              <button
                onClick={() => setShowPostEditor(false)}
                className="absolute -top-12 right-0 p-2 text-accent-metallic hover:text-accent-metallic-light"
              >
                <X className="w-6 h-6" />
              </button>
              <PostEditor
                onClose={() => {
                  setShowPostEditor(false);
                  fetchPosts();
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
