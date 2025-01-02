import { render, screen } from '@testing-library/react';
import NotFound from '@/app/not-found';

// Mock the Button component and House icon
jest.mock('lucide-react', () => ({
  House: () => <div data-testid="house-icon" />,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, className, variant }: { children: React.ReactNode; className?: string; variant?: string }) => (
    <button className={className} data-testid="home-button" data-variant={variant}>{children}</button>
  ),
}));

describe('NotFound', () => {
  beforeEach(() => {
    render(<NotFound />);
  });

  it('renders the container with correct structure', () => {
    const container = screen.getByTestId('not-found-container');
    const content = screen.getByTestId('not-found-content');
    const textContainer = screen.getByTestId('not-found-text');

    expect(container).toBeInTheDocument();
    expect(content).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'min-h-[60vh]',
      'space-y-6',
      'text-center',
      'px-4'
    );
    expect(textContainer).toHaveClass('space-y-2');
  });

  it('renders headings with correct hierarchy and styling', () => {
    const heading = screen.getByRole('heading', { level: 1, name: '404' });
    const subheading = screen.getByRole('heading', { level: 2, name: 'Page Not Found' });

    expect(heading).toHaveClass('text-4xl', 'font-bold', 'tracking-tighter', 'sm:text-5xl', 'text-primary');
    expect(subheading).toHaveClass('text-2xl', 'font-semibold', 'tracking-tight');
  });

  it('renders the description with correct styling', () => {
    const description = screen.getByText("Sorry, we couldn't find the page you're looking for.");
    expect(description).toHaveClass('text-muted-foreground');
  });

  it('renders the home button with correct configuration', () => {
    const homeButton = screen.getByTestId('home-button');
    const link = screen.getByRole('link');
    const icon = screen.getByTestId('house-icon');

    expect(homeButton).toHaveClass('gap-2');
    expect(homeButton).toHaveTextContent('Return Home');
    expect(homeButton).toHaveAttribute('data-variant', 'default');
    expect(link).toHaveAttribute('href', '/');
    expect(icon).toBeInTheDocument();
  });
});
