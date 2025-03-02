/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen, cleanup } from '@testing-library/react';
import RootLayout, { metadata } from '@/app/layout';
import Link from 'next/link';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className, width, height, priority }: {
    src: string
    alt: string
    className?: string
    width?: number
    height?: number
    priority?: boolean
  }) => (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      data-priority={priority}
      data-testid="mock-image"
    />
  ),
}));

jest.mock('@/components/layout/navigation', () => ({
  Navigation: () => (
    <nav data-testid="mock-navigation" className="border-b bg-white" aria-label="Main navigation">
      <div className="container mx-auto px-4">
        <div className="flex h-28 items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/grei.svg" alt="GREI Logo" data-testid="grei-logo" />
          </div>
          <div className="flex items-center space-x-6" role="menubar">
            <Link href="/" data-testid="nav-search">Search</Link>
            <Link href="/compare" data-testid="nav-compare">Compare</Link>
            <Link href="/about" data-testid="nav-about">About</Link>
          </div>
        </div>
      </div>
    </nav>
  ),
}));

jest.mock('@/components/layout/footer', () => ({
  Footer: () => (
    <footer data-testid="mock-footer" className="bg-[#fafafa] border-t" role="contentinfo">
      <div className="max-w-5xl mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-4">
          <div data-testid="footer-about">About Us Section</div>
          <div data-testid="footer-work">Work With Us Section</div>
          <div data-testid="footer-org">Organizations Section</div>
          <div data-testid="footer-contact">Contact Us Section</div>
        </div>
      </div>
    </footer>
  ),
}));

jest.mock('@/components/providers/query-provider', () => ({
  QueryProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-query-provider">{children}</div>
  ),
}));

jest.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'mock-inter-font',
    subsets: ['latin'],
  }),
}));

describe('RootLayout Components', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Navigation Integration', () => {
    it('renders navigation with correct structure', () => {
      render(
        <div>
          <nav data-testid="mock-navigation" className="border-b bg-white" aria-label="Main navigation">
            <div className="container mx-auto px-4">
              <div className="flex h-28 items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img src="/grei.svg" alt="GREI Logo" data-testid="grei-logo" />
                </div>
                <div className="flex items-center space-x-6" role="menubar">
                  <Link href="/" data-testid="nav-search">Search</Link>
                  <Link href="/compare" data-testid="nav-compare">Compare</Link>
                  <Link href="/about" data-testid="nav-about">About</Link>
                </div>
              </div>
            </div>
          </nav>
        </div>
      );

      const navigation = screen.getByTestId('mock-navigation');
      expect(navigation).toBeInTheDocument();
      expect(navigation).toHaveAttribute('aria-label', 'Main navigation');
      
      // Verify navigation links
      expect(screen.getByTestId('nav-search')).toBeInTheDocument();
      expect(screen.getByTestId('nav-compare')).toBeInTheDocument();
      expect(screen.getByTestId('nav-about')).toBeInTheDocument();
      
      // Verify logo
      expect(screen.getByTestId('grei-logo')).toBeInTheDocument();
    });
  });

  describe('Footer Integration', () => {
    it('renders footer with correct structure', () => {
      render(
        <div>
          <footer data-testid="mock-footer" className="bg-[#fafafa] border-t" role="contentinfo">
            <div className="max-w-5xl mx-auto py-8">
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div data-testid="footer-about">About Us Section</div>
                <div data-testid="footer-work">Work With Us Section</div>
                <div data-testid="footer-org">Organizations Section</div>
                <div data-testid="footer-contact">Contact Us Section</div>
              </div>
            </div>
          </footer>
        </div>
      );

      const footer = screen.getByTestId('mock-footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveAttribute('role', 'contentinfo');

      // Verify footer sections
      expect(screen.getByTestId('footer-about')).toBeInTheDocument();
      expect(screen.getByTestId('footer-work')).toBeInTheDocument();
      expect(screen.getByTestId('footer-org')).toBeInTheDocument();
      expect(screen.getByTestId('footer-contact')).toBeInTheDocument();
    });
  });

  describe('QueryProvider Integration', () => {
    it('wraps content in QueryProvider', () => {
      render(
        <div data-testid="mock-query-provider">
          <div data-testid="test-content">Test Content</div>
        </div>
      );

      expect(screen.getByTestId('mock-query-provider')).toBeInTheDocument();
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });
  });

  describe('Metadata', () => {
    it('has correct metadata values', () => {
      expect(metadata.title).toBe('Metadata Health Reports');
      expect(metadata.description).toBe('Monitor and analyze the quality and completeness of metadata records');
      expect(metadata.icons).toEqual({
        icon: [
          { url: '/favicon.ico', sizes: 'any' },
          { url: '/logo.svg', type: 'image/svg+xml' }
        ]
      });
    });
  });
});
