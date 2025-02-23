import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import ReactMarkdown from 'react-markdown';

interface PostPreviewProps {
  post: {
    title: string;
    content: string;
    category: string;
    tags: string[];
    mediaAttachments: File[];
  };
}

export function PostPreview({ post }: PostPreviewProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-accent-metallic-light mb-4">
          {post.title || 'Untitled'}
        </h2>

        <div className="prose prose-invert max-w-none mb-6">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {post.mediaAttachments.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {post.mediaAttachments.map((file, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden">
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(file)}
                    controls
                    className="w-full h-48 object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-4">
          <span className="px-2 py-1 rounded-full bg-accent-purple/10 text-accent-purple-light text-sm">
            {post.category}
          </span>

          {post.tags.map((tag, index) => (
            <span key={index} className="text-sm text-accent-metallic">
              #{tag}
            </span>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
