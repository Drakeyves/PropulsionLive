import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
}

export function Input({
  className,
  leftIcon,
  rightIcon,
  error,
  ...props
}: InputProps) {
  return (
    <div className="relative">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-metallic-dark">
          {leftIcon}
        </div>
      )}
      <input
        className={cn(
          'input',
          leftIcon && 'pl-10',
          rightIcon && 'pr-10',
          error && 'border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-metallic-dark">
          {rightIcon}
        </div>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}