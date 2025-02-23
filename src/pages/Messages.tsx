import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { ChatBox } from '../components/chat/ChatBox';
import { ChatList } from '../components/chat/ChatList';
import { useAuth } from '../contexts/AuthContext';

export function Messages() {
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    username: string;
  } | null>(null);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-accent-purple-light mx-auto mb-4" />
          <h2 className="text-xl font-bold text-accent-metallic-light mb-2">
            Sign in to Message
          </h2>
          <p className="text-accent-metallic">
            Connect with other members through real-time messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-gradient-to-br from-background-secondary to-background border border-accent-metallic-dark/10"
      >
        <h1 className="text-2xl font-bold text-accent-metallic-light mb-2">
          Messages
        </h1>
        <p className="text-accent-metallic">
          Connect and collaborate with other members
        </p>
      </motion.div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users List */}
        <div className="lg:col-span-1">
          <ChatList
            onSelectUser={(id, username) => setSelectedUser({ id, username })}
            selectedUserId={selectedUser?.id}
          />
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          {selectedUser ? (
            <ChatBox
              receiverId={selectedUser.id}
              receiverName={selectedUser.username}
            />
          ) : (
            <div className="flex items-center justify-center h-[600px] rounded-lg bg-background-secondary/50 border border-accent-metallic-dark/10">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-accent-purple-light mx-auto mb-4" />
                <h2 className="text-xl font-bold text-accent-metallic-light mb-2">
                  Select a Conversation
                </h2>
                <p className="text-accent-metallic">
                  Choose a user from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}