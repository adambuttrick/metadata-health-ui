import { ReactNode, ElementType } from 'react';
import React from 'react';
import { cn } from '@/lib/utils';

interface StackProps {
  spacing: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

const stackSpacing = {
  sm: 'space-y-3 sm:space-y-4',
  md: 'space-y-4 sm:space-y-6',
  lg: 'space-y-6 sm:space-y-8'
};

export function Stack({ 
  spacing, 
  children, 
  className,
  as: Component = 'div'
}: StackProps) {
  const Comp = Component as ElementType;
  return (
    <Comp className={cn(stackSpacing[spacing], className)}>
      {children}
    </Comp>
  );
}
