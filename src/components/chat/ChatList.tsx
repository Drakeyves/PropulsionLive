import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

interface ChatUser {
  id: string;
  username: string;
  avatar_url: string | null;
  last_message?: {
    content: string;
    created_at: string;
  };
}

interface ChatListProps {
  onSelectUser: (userId: string, username: string) => void;
  selectedUserId?: string;
}

export function ChatList({ onSelectUser, selectedUserId }: ChatListProps) {
  const { user } = useAuth();
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchUsers = async () => {
      try {
        // Fetch all users except current user
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .neq('id', user.id)
          .order('username');

        if (usersError) throw usersError;

        // Fetch last messages for each user
        const usersWithMessages = await Promise.all(
          (usersData || []).map(async (userData) => {
            const { data: messageData } = await supabase
              .from('messages')
              .select('content, created_at')
              .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userData.id}),and(sender_id.eq.${userData.id},receiver_id.eq.${user.id})`)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();

            return {
              ...userData,
              last_message: messageData || undefined
            };
          })
        );

        setUsers(usersWithMessages);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    // Fix subscription to handle both sent and received messages
    const subscription = supabase
      .channel(`chat_list:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id=eq.${user.id},receiver_id=eq.${user.id})`
        },
        async (payload) => {
          const newMessage = payload.new as any;
          const otherUserId = newMessage.sender_id === user.id 
            ? newMessage.receiver_id 
            : newMessage.sender_id;

          setUsers(prev => prev.map(u => {
            if (u.id === otherUserId) {
              return {
                ...u,
                last_message: {
                  content: newMessage.content,
                  created_at: newMessage.created_at
                }
              };
            }
            return u;
          }));
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <Card className="p-6 text-center">
        <p className="text-accent-metallic">Please sign in to use the chat.</p>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-accent-metallic-dark/10">
        <h3 className="text-lg font-semibold text-accent-metallic-light mb-4">
          Messages
        </h3>
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin w-6 h-6 border-2 border-accent-purple border-t-transparent rounded-full" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-400">
            {error}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-accent-metallic">
            <Users className="w-8 h-8 mb-2" />
            <p>No users found</p>
          </div>
        ) : (
          <div className="divide-y divide-accent-metallic-dark/10">
            {filteredUsers.map((chatUser) => (
              <motion.button
                key={chatUser.id}
                onClick={() => onSelectUser(chatUser.id, chatUser.username)}
                className={cn(
                  "w-full p-4 text-left transition-colors hover:bg-accent-purple/5",
                  "focus:outline-none focus:bg-accent-purple/5",
                  selectedUserId === chatUser.id && "bg-accent-purple/10"
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {chatUser.avatar_url ? (
                      <img
                        src={chatUser.avatar_url}
                        alt={chatUser.username}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-accent-purple/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-accent-purple-light" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-accent-metallic-light truncate">
                        {chatUser.username}
                      </span>
                      {chatUser.last_message && (
                        <span className="text-xs text-accent-metallic">
                          {format(new Date(chatUser.last_message.created_at), 'HH:mm')}
                        </span>
                      )}
                    </div>
                    {chatUser.last_message && (
                      <p className="text-sm text-accent-metallic truncate">
                        {chatUser.last_message.content}
                      </p>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}