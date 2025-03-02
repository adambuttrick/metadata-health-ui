import { render, screen } from '@testing-library/react';
import AboutPage from '@/app/about/page';

describe('AboutPage', () => {
  beforeEach(() => {
    render(<AboutPage />);
  });

  describe('Structure', () => {
    it('renders main container with correct styling', () => {
      const container = screen.getByRole('heading', { name: /About Metadata Health Reports/i }).closest('div');
      expect(container).toHaveClass('space-y-6', 'sm:space-y-8');
    });

    it('renders all major sections', () => {
      expect(screen.getByRole('heading', { name: /About Metadata Health Reports/i, level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Overview/i, level: 2 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /How to Use/i, level: 2 })).toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('renders overview section content', () => {
      expect(screen.getByText(/Metadata Health Reports is a test application for providing insights/i)).toBeInTheDocument();
      expect(screen.getByText(/It is a demo application so things may change and break!/i)).toBeInTheDocument();
    });

    it('renders how to use section with list items', () => {
      const listItems = [
        'View individual metadata health reports',
        'Compare multiple organizations',
        'Analyze specific metadata fields',
        'Generate insights for metadata quality enhancement',
        'Compare overall metadata completeness scores',
        'Identify differences in specific metadata fields',
        'Benchmark metadata practices across organizations and repositories'
      ];

      listItems.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });
  });

  describe('Interactive Elements', () => {
    it('renders navigation links correctly', () => {
      const searchLink = screen.getByRole('link', { name: /search functionality/i });
      expect(searchLink).toHaveAttribute('href', '/');

      const compareLink = screen.getByRole('link', { name: /comparison feature/i });
      expect(compareLink).toHaveAttribute('href', '/compare');
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
