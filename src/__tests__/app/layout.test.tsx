/* eslint-disable @next/next/no-img-element */
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
            <img src="/logo.svg" alt="DataCite Metadata Health Reports Logo" data-testid="datacite-logo" />
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

describe('RootLayout', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Navigation Integration', () => {
    it('renders navigation with correct structure', () => {
      render(
        <div id="layout-test">
          <RootLayout>
            <div>Test Content</div>
          </RootLayout>
        </div>
      );

      const navigation = screen.getByTestId('mock-navigation');
      expect(navigation).toBeInTheDocument();
      expect(navigation).toHaveAttribute('aria-label', 'Main navigation');
      
      // Verify navigation links
      expect(screen.getByTestId('nav-search')).toBeInTheDocument();
      expect(screen.getByTestId('nav-compare')).toBeInTheDocument();
      expect(screen.getByTestId('nav-about')).toBeInTheDocument();
      
      // Verify logos
      expect(screen.getByTestId('grei-logo')).toBeInTheDocument();
      expect(screen.getByTestId('datacite-logo')).toBeInTheDocument();
    });
  });

  describe('Footer Integration', () => {
    it('renders footer with correct structure', () => {
      render(
        <div id="layout-test">
          <RootLayout>
            <div>Test Content</div>
          </RootLayout>
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

  describe('Layout Structure', () => {
    it('renders with correct HTML structure and classes', () => {
      render(
        <div id="layout-test">
          <RootLayout>
            <div data-testid="test-content">Test Content</div>
          </RootLayout>
        </div>
      );

      const content = screen.getByTestId('test-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('Test Content');
    });
  });

  describe('QueryProvider Integration', () => {
    it('wraps content in QueryProvider', () => {
      render(
        <div id="layout-test">
          <RootLayout>
            <div data-testid="test-content">Test Content</div>
          </RootLayout>
        </div>
      );

      const queryProvider = screen.getByTestId('mock-query-provider');
      expect(queryProvider).toBeInTheDocument();
      expect(queryProvider).toContainElement(screen.getByTestId('test-content'));
    });
  });

  describe('Metadata', () => {
    it('exports correct metadata configuration', () => {
      expect(metadata).toEqual({
        title: 'DataCite Metadata Health Reports',
        description: 'Monitor and analyze the quality and completeness of DataCite metadata records',
        icons: {
          icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/logo.svg', type: 'image/svg+xml' }
          ]
        }
      });
    });
  });
});
