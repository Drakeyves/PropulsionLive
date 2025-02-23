import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Clock, Pin, Eye, Plus, AlertTriangle, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ThreadEditor } from './ThreadEditor';
import ReactMarkdown from 'react-markdown';

interface Author {
  username: string;
  avatar_url: string | null;
}

interface ThreadPost {
  id: string;
  content: string;
  author: Author;
  created_at: string;
  edited_at: string | null;
}

interface Thread {
  id: string;
  title: string;
  pinned: boolean;
  author: Author;
  created_at: string;
  last_activity_at: string;
  views_count: number;
  replies_count: number;
  status: 'open' | 'closed' | 'resolved';
  category: string;
}

const ITEMS_PER_PAGE = 20;

export function ThreadList() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [pinnedThread, setPinnedThread] = useState<Thread | null>(null);
  const [pinnedPost, setPinnedPost] = useState<ThreadPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);
  const cache = useRef<Map<string, Thread[]>>(new Map());

  const fetchThreads = useCallback(async (pageIndex: number) => {
    try {
      setError(null);
      setLoadingMore(true);

      const { data: pinnedData, error: pinnedError } = await supabase
        .from('threads')
        .select(
          `
          id,
          title,
          pinned,
          author:profiles(username, avatar_url),
          created_at,
          last_activity_at,
          views_count,
          replies_count,
          status,
          category
        `
        )
        .eq('pinned', true)
        .eq('status', 'active')
        .single();

      if (pinnedError) throw pinnedError;
      setPinnedThread(
        pinnedData
          ? ({
              ...pinnedData,
              author: {
                username: pinnedData.author[0].username,
                avatar_url: pinnedData.author[0].avatar_url,
              },
            } as Thread)
          : null
      );

      if (pinnedData) {
        const { data: pinnedPostData, error: postError } = await supabase
          .from('thread_posts')
          .select('*, author:profiles(*)')
          .eq('pinned', true)
          .single();

        if (postError) throw postError;
        const formattedPinnedPost: ThreadPost = {
          id: pinnedPostData.id,
          content: pinnedPostData.content,
          author: pinnedPostData.author[0],
          created_at: pinnedPostData.created_at,
          edited_at: pinnedPostData.edited_at,
        };
        setPinnedPost(formattedPinnedPost);
      }

      const { data, error } = await supabase
        .from('threads')
        .select('*, author:profiles(*)')
        .eq('status', 'active')
        .eq('pinned', false)
        .order('last_activity_at', { ascending: false })
        .range(pageIndex * ITEMS_PER_PAGE, (pageIndex + 1) * ITEMS_PER_PAGE - 1);

      if (error) throw error;

      if (data) {
        const formattedThreads: Thread[] = data.map(thread => ({
          ...thread,
          author: thread.author[0],
        }));

        setThreads(prev => {
          return pageIndex === 0 ? formattedThreads : [...prev, ...formattedThreads];
        });
        setHasMore(data.length === ITEMS_PER_PAGE);
        cache.current.set(`page-${pageIndex}`, formattedThreads);
      }
    } catch (error) {
      console.error('Error fetching threads:', error);
      setError('Failed to load threads');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Infinite scroll setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore]);

  // Fetch threads when page changes
  useEffect(() => {
    const cachedData = cache.current.get(`page-${page}`);
    if (cachedData) {
      setThreads(prev => (page === 0 ? cachedData : [...prev, ...cachedData]));
    } else {
      fetchThreads(page);
    }
  }, [page, fetchThreads]);

  // Real-time updates
  useEffect(() => {
    const subscription = supabase
      .channel('threads_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'threads' }, () => {
        // Clear cache and refetch first page
        cache.current.clear();
        setPage(0);
        fetchThreads(0);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchThreads]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-accent-purple border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span className="text-red-400">{error}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchThreads(0)}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pinned Thread */}
      {pinnedThread && pinnedPost && (
        <Card className="border-accent-purple/20">
          <div className="p-4 bg-accent-purple/5 rounded-t-lg border-b border-accent-purple/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Pin className="w-4 h-4 text-accent-purple-light" />
              <span className="text-sm font-medium text-accent-purple-light">
                Pinned Announcement
              </span>
            </div>
            <span className="text-sm text-accent-metallic">
              {format(new Date(pinnedPost.created_at), 'MMM d, yyyy')}
            </span>
          </div>
          <div className="p-6">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{pinnedPost.content}</ReactMarkdown>
            </div>
          </div>
        </Card>
      )}

      {/* Create Thread Button */}
      {user && (
        <div className="flex justify-end">
          <Button onClick={() => setShowEditor(true)} leftIcon={<Plus className="w-5 h-5" />}>
            Create Thread
          </Button>
        </div>
      )}

      {/* Thread List */}
      <div className="space-y-4">
        {threads.map(thread => (
          <motion.div
            key={thread.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card hover className="group">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-accent-metallic-light mb-2">
                      {thread.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-accent-metallic">
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{thread.replies_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{thread.views_count}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{format(new Date(thread.last_activity_at), 'MMM d, HH:mm')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 rounded-full bg-accent-purple/10 text-accent-purple-light text-sm">
                      {thread.category}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Infinite Scroll Observer */}
        <div ref={observerTarget} className="h-4" />

        {/* Loading More Indicator */}
        {loadingMore && (
          <div className="flex justify-center py-4">
            <div className="animate-spin w-6 h-6 border-2 border-accent-purple border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {/* Thread Editor Modal */}
      <AnimatePresence>
        {showEditor && (
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
              className="w-full max-w-4xl"
            >
              <ThreadEditor onClose={() => setShowEditor(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
