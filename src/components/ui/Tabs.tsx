import React from 'react';
import { cn } from '../../lib/utils';

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  activeTab?: string;
  setActiveTab?: (value: string) => void;
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  activeTab?: string;
}

export function Tabs({ defaultValue, className, children, ...props }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  return (
    <div className={cn('w-full', className)} {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            activeTab,
            setActiveTab,
          });
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <div
      className={cn('inline-flex items-center justify-center rounded-lg bg-muted p-1', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  className,
  children,
  activeTab,
  setActiveTab,
  ...props
}: TabsTriggerProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        activeTab === value
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-muted-hover',
        className
      )}
      onClick={() => setActiveTab?.(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children, activeTab, ...props }: TabsContentProps) {
  if (activeTab !== value) return null;

  return (
    <div
      className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
