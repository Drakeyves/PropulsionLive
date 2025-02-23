import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface ThreadEditorProps {
  onClose: () => void;
}

export function ThreadEditor({ onClose }: ThreadEditorProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const categories = ['General', 'Technical Discussion', 'Questions', 'Resources', 'Announcements'];

  async function handleSubmit() {
    if (!title || !content) {
      setError('Please fill in all fields');
      return;
    }

    if (!supabase) {
      setError('Database connection error');
      return;
    }

    if (!user) {
      setError('You must be logged in to create a thread');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const { data: thread, error: threadError } = await supabase
        .from('threads')
        .insert({
          title,
          author_id: user.id,
          category,
        })
        .select()
        .single();

      if (threadError) throw threadError;

      const { error: postError } = await supabase.from('thread_posts').insert({
        thread_id: thread.id,
        author_id: user.id,
        content,
      });

      if (postError) throw postError;

      onClose();
    } catch (err) {
      setError('Failed to create thread. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-accent-metallic-light">Create New Thread</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-accent-metallic hover:text-accent-metallic-light transition-colors"
            aria-label="Close thread editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Thread title"
              className={cn(
                'w-full px-4 py-2 rounded-lg',
                'bg-background/50 border border-accent-metallic-dark/20',
                'text-accent-metallic-light placeholder-accent-metallic-dark',
                'focus:outline-none focus:ring-2 focus:ring-accent-purple/20'
              )}
            />
          </div>

          <div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your post..."
              className={cn(
                'w-full px-4 py-3 rounded-lg',
                'bg-background/50 border border-accent-metallic-dark/20',
                'text-accent-metallic-light placeholder-accent-metallic-dark',
                'focus:outline-none focus:ring-2 focus:ring-accent-purple/20',
                'resize-none min-h-[200px]'
              )}
            />
          </div>

          <div>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className={cn(
                'w-full px-4 py-2 rounded-lg',
                'bg-background/50 border border-accent-metallic-dark/20',
                'text-accent-metallic-light',
                'focus:outline-none focus:ring-2 focus:ring-accent-purple/20'
              )}
              aria-label="Select thread category"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={saving} leftIcon={<Send className="w-4 h-4" />}>
            Create Thread
          </Button>
        </div>
      </div>
    </Card>
  );
}
