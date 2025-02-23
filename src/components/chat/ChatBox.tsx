import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  sender: {
    username: string;
    avatar_url: string | null;
  };
}

interface SupabaseMessage {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  sender: {
    username: string;
    avatar_url: string | null;
  }[];
}

interface ChatBoxProps {
  receiverId: string;
  receiverName: string;
}

const MESSAGES_PER_PAGE = 20;

export function ChatBox({ receiverId, receiverName }: ChatBoxProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef<number>(0);

  // Fetch messages
  const fetchMessages = async (pageNumber: number = 0) => {
    try {
      setLoadingMore(true);
      const { data, error } = await supabase
        .from('messages')
        .select(
          `
          id,
          content,
          sender_id,
          receiver_id,
          created_at,
          sender:profiles!sender_id(username, avatar_url)
        `
        )
        .or(
          `and(sender_id.eq.${user?.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user?.id})`
        )
        .order('created_at', { ascending: false })
        .range(pageNumber * MESSAGES_PER_PAGE, (pageNumber + 1) * MESSAGES_PER_PAGE - 1);

      if (error) throw error;

      const supabaseMessages = (data || []) as SupabaseMessage[];
      const newMessages: Message[] = supabaseMessages.map(msg => ({
        ...msg,
        sender: msg.sender[0],
      }));

      setMessages(prev => {
        const combined = pageNumber === 0 ? newMessages : [...prev, ...newMessages];
        return combined.sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });
      setHasMore(newMessages.length === MESSAGES_PER_PAGE);

      if (pageNumber === 0) {
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
    } finally {
      setLoadingMore(false);
    }
  };

  // Initialize real-time subscription
  useEffect(() => {
    if (!user) return;

    fetchMessages();

    const subscription = supabase
      .channel(`messages:${user.id}:${receiverId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${user.id},receiver_id=eq.${receiverId}`,
        },
        payload => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          scrollToBottom();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${receiverId},receiver_id=eq.${user.id}`,
        },
        payload => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, receiverId]);

  // Handle scroll for loading more messages
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop === 0 && !loadingMore && hasMore) {
        prevScrollHeightRef.current = container.scrollHeight;
        setPage(prev => prev + 1);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loadingMore, hasMore]);

  // Load more messages when page changes
  useEffect(() => {
    if (page > 0) {
      fetchMessages(page);
    }
  }, [page]);

  // Maintain scroll position when loading more messages
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container && prevScrollHeightRef.current) {
      container.scrollTop = container.scrollHeight - prevScrollHeightRef.current;
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    try {
      setSending(true);
      const { error } = await supabase.from('messages').insert({
        content: newMessage.trim(),
        sender_id: user.id,
        receiver_id: receiverId,
      });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <Card className="p-6 text-center">
        <p className="text-accent-metallic">Please sign in to use the chat.</p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="p-4 border-b border-accent-metallic-dark/10">
        <h3 className="text-lg font-semibold text-accent-metallic-light">
          Chat with {receiverName}
        </h3>
      </div>

      {/* Messages Container */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Loading More Indicator */}
        {loadingMore && (
          <div className="flex justify-center py-2">
            <Loader className="w-5 h-5 text-accent-metallic animate-spin" />
          </div>
        )}

        {/* Messages */}
        <AnimatePresence>
          {messages.map(message => {
            const isOwn = message.sender_id === user.id;
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  'flex items-end space-x-2',
                  isOwn ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                )}
              >
                <div className="flex flex-col space-y-1 max-w-[70%]">
                  <div
                    className={cn(
                      'rounded-lg px-4 py-2',
                      isOwn
                        ? 'bg-accent-purple text-white'
                        : 'bg-background-secondary text-accent-metallic-light'
                    )}
                  >
                    {message.content}
                  </div>
                  <span className="text-xs text-accent-metallic px-2">
                    {format(new Date(message.created_at), 'HH:mm')}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-accent-metallic-dark/10">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 input"
            disabled={sending}
          />
          <Button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="min-w-[44px] h-[44px] p-0 flex items-center justify-center"
          >
            {sending ? <Loader className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
        {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
      </form>
    </Card>
  );
}
