import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glass?: boolean;
  noPadding?: boolean;
}

export function Card({ 
  children, 
  className, 
  hover = false,
  glass = false,
  noPadding = false,
  ...props 
}: CardProps) {
  return (
    <div
      className={cn(
        'card',
        hover && 'hover-card',
        glass && 'glass',
        !noPadding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ 
  children, 
  className,
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("mb-4", className)} 
      {...props}
    >
      {children}
    </div>
  );
};

Card.Title = function CardTitle({ 
  children, 
  className,
  ...props 
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 
      className={cn(
        "text-lg font-semibold text-accent-metallic-light",
        className
      )} 
      {...props}
    >
      {children}
    </h3>
  );
};

Card.Description = function CardDescription({ 
  children, 
  className,
  ...props 
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p 
      className={cn(
        "text-sm text-accent-metallic",
        className
      )} 
      {...props}
    >
      {children}
    </p>
  );
};

Card.Content = function CardContent({ 
  children, 
  className,
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(className)} 
      {...props}
    >
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ 
  children, 
  className,
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "mt-4 pt-4 border-t border-accent-metallic-dark/10",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};