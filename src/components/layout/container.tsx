import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  variant: 'narrow' | 'wide' | 'full';
  children: ReactNode;
  className?: string;
}

const containerVariants = {
  narrow: 'max-w-2xl',
  wide: 'max-w-5xl',
  full: 'max-w-full'
};

export function Container({ variant, children, className }: ContainerProps) {
  return (
    <div className={cn(
      'container mx-auto px-3 sm:px-4 lg:px-5 py-2 sm:py-3 lg:py-4', 
      containerVariants[variant],
      className
    )}>
      {children}
    </div>
  );
}
