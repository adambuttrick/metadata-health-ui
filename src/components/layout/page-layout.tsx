import { ReactNode } from 'react';
import { Container } from './container';
import { Text } from '../typography/typography';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  title?: string;
  description?: string;
  children: ReactNode;
  variant?: 'narrow' | 'wide' | 'full';
  className?: string;
}

export function PageLayout({ 
  title, 
  description, 
  children, 
  variant = 'wide',
  className 
}: PageLayoutProps) {
  return (
    <Container variant={variant}>
      {title && (
        <header className="mb-4 sm:mb-6 lg:mb-8 text-center">
          <Text 
            variant="h1" 
            className="text-xl sm:text-2xl lg:text-3xl font-bold text-datacite-dark-blue"
          >
            {title}
          </Text>
          {description && (
            <Text 
              variant="body" 
              className="mt-2 sm:mt-3 text-base sm:text-lg text-gray-700"
            >
              {description}
            </Text>
          )}
        </header>
      )}
      <main className={cn('w-full', className)}>
        {children}
      </main>
    </Container>
  );
}
