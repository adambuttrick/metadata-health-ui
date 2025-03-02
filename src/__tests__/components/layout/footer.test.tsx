import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from '@/components/layout/footer';

jest.mock('next/link', () => {
  const MockLink = ({ children, href, 'aria-label': ariaLabel }: { children: React.ReactNode; href: string; 'aria-label'?: string }) => (
    <a href={href} aria-label={ariaLabel}>{children}</a>
  );
  MockLink.displayName = 'Link';
  return MockLink;
});

jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span data-testid="font-awesome-icon" />,
}));

describe('Footer', () => {
  it('renders with correct structure', () => {
    render(<Footer />);
    
    // Check basic footer structure
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveAttribute('aria-labelledby', 'footer-heading');
    
    // Check footer heading
    const heading = screen.getByText('Footer');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('sr-only');
    
    // Check data version text
    expect(screen.getByText(/Data file version:/)).toBeInTheDocument();
  });
});
