import { render, screen } from '@testing-library/react';
import AboutPage from '@/app/about/page';

describe('AboutPage', () => {
  beforeEach(() => {
    render(<AboutPage />);
  });

  describe('Structure', () => {
    it('renders main container with correct styling', () => {
      const container = screen.getByRole('heading', { name: /About DataCite Metadata Health Reports/i }).closest('div');
      expect(container).toHaveClass('space-y-6', 'sm:space-y-8');
    });

    it('renders all major sections', () => {
      expect(screen.getByRole('heading', { name: /About DataCite Metadata Health Reports/i, level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Overview/i, level: 2 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /How to Use/i, level: 2 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Contact/i, level: 2 })).toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('renders overview section content', () => {
      expect(screen.getByText(/DataCite Metadata Health Reports is a test application for providing insights/i)).toBeInTheDocument();
      expect(screen.getByText(/It is in an alpha state so things may change and break!/i)).toBeInTheDocument();
    });

    it('renders how to use section with list items', () => {
      const listItems = [
        'View individual metadata health reports',
        'Compare multiple organizations',
        'Analyze specific metadata fields',
        'Track improvements over time',
        'Generate insights for metadata quality enhancement'
      ];

      listItems.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });

    it('renders contact section with email', () => {
      expect(screen.getByText(/For questions or feedback/i)).toBeInTheDocument();
      expect(screen.getByText('support@datacite.org')).toBeInTheDocument();
    });
  });

  describe('Interactive Elements', () => {
    it('renders home page link correctly', () => {
      const homeLink = screen.getByRole('link', { name: /search functionality/i });
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('renders email link correctly', () => {
      const emailLink = screen.getByRole('link', { name: 'support@datacite.org' });
      expect(emailLink).toHaveAttribute('href', 'mailto:support@datacite.org');
    });
  });

  describe('Accessibility', () => {
    it('maintains proper heading hierarchy', () => {
      const headings = screen.getAllByRole('heading');
      expect(headings[0]).toHaveAttribute('class', expect.stringContaining('text-3xl'));
      expect(headings.slice(1)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ tagName: 'H2' })
        ])
      );
    });

    it('ensures links have accessible names', () => {
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAccessibleName();
      });
    });
  });
});
