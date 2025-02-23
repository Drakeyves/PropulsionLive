import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-6 rounded-xl",
        "bg-gradient-to-br from-background-secondary to-background",
        "border border-accent-metallic-dark/10",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-accent-metallic-light">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-accent-metallic">
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    </motion.div>
  );
}