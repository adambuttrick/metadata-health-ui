import { ElementType } from 'react';
import React from 'react';

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant: 'h1' | 'h2' | 'h3' | 'body' | 'small';
  children: React.ReactNode;
  className?: string;
  as?: ElementType;
  truncate?: boolean;
  wrap?: boolean;
}

const textVariants = {
  h1: 'text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900',
  h2: 'text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900',
  h3: 'text-base sm:text-lg lg:text-xl font-semibold text-gray-900',
  body: 'text-sm sm:text-base text-gray-900',
  small: 'text-xs sm:text-sm text-gray-700'
};

export const Text = React.forwardRef<HTMLElement, TextProps>(({ 
  variant, 
  children, 
  className = '', 
  as,
  truncate = false,
  wrap = true,
  ...props 
}, ref) => {
  const Component = (as || (variant.startsWith('h') ? variant : 'p')) as ElementType;
  
  const accessibilityProps = !variant.startsWith('h') && as ? {
    role: 'text',
    'aria-level': variant === 'body' ? undefined : '6'
  } : {};

  const overflowClasses = `${truncate ? 'truncate' : ''} ${!wrap ? 'whitespace-nowrap' : 'whitespace-normal break-words'}`;

  return (
    <Component 
      ref={ref}
      className={`${textVariants[variant]} ${overflowClasses} ${className}`.trim()}
      {...accessibilityProps}
      {...props}
    >
      {children}
    </Component>
  );
});

Text.displayName = 'Text';
