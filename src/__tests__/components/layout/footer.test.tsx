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
  it('renders all footer sections', () => {
    render(<Footer />);
    
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
  });

  it('renders all about links correctly', () => {
    render(<Footer />);
    
    const aboutLinks = [
      { name: 'Mission', url: 'https://datacite.org/mission.html' },
      { name: 'Team', url: 'https://datacite.org/team/' },
      { name: 'Job Opportunities', url: 'https://datacite.org/job-opportunities/' },
      { name: 'Contact', url: 'https://datacite.org/contact.html' }
    ];

    aboutLinks.forEach(link => {
      const linkElement = screen.getByRole('link', { name: link.name });
      expect(linkElement).toHaveAttribute('href', link.url);
    });
  });

  it('renders all services links correctly', () => {
    render(<Footer />);
    
    const servicesLinks = [
      { name: 'Create DOIs', url: 'https://datacite.org/create-dois/' },
      { name: 'Metadata Search', url: 'https://commons.datacite.org' },
      { name: 'Stats Portal', url: 'https://stats.datacite.org' },
      { name: 'Service Status', url: 'https://status.datacite.org' }
    ];

    servicesLinks.forEach(link => {
      const linkElement = screen.getByRole('link', { name: link.name });
      expect(linkElement).toHaveAttribute('href', link.url);
    });
  });

  it('renders all community links correctly', () => {
    render(<Footer />);
    
    const communityLinks = [
      { name: 'Members', url: 'https://datacite.org/members.html' },
      { name: 'Steering Groups', url: 'https://datacite.org/CESG/' },
      { name: 'Events', url: 'https://datacite.org/events/' }
    ];

    communityLinks.forEach(link => {
      const linkElement = screen.getByRole('link', { name: link.name });
      expect(linkElement).toHaveAttribute('href', link.url);
    });
  });

  it('renders all resources links correctly', () => {
    render(<Footer />);
    
    const resourcesLinks = [
      { name: 'Documentation', url: 'https://support.datacite.org' },
      { name: 'Community Forum', url: 'https://pidforum.org' },
      { name: 'Fee Model', url: 'https://datacite.org/fee-model/' }
    ];

    resourcesLinks.forEach(link => {
      const linkElement = screen.getByRole('link', { name: link.name });
      expect(linkElement).toHaveAttribute('href', link.url);
    });
  });

  it('renders social links with correct attributes', () => {
    render(<Footer />);
    
    const socialLinks = [
      { name: 'Email DataCite Support', url: 'mailto:support@datacite.org' },
      { name: 'Visit DataCite Blog', url: 'https://blog.datacite.org' },
      { name: 'Visit DataCite LinkedIn', url: 'https://www.linkedin.com/company/datacite' },
      { name: 'Visit DataCite GitHub', url: 'https://github.com/datacite' },
      { name: 'Visit DataCite YouTube', url: 'https://www.youtube.com/channel/UCVsSDZhIN_WbnD_v5o9eB_A' },
      { name: 'Visit DataCite Mastodon', url: 'https://openbiblio.social/@datacite' }
    ];

    socialLinks.forEach(link => {
      const linkElement = screen.getByRole('link', { name: link.name });
      expect(linkElement).toHaveAttribute('href', link.url);
    });
  });

  it('maintains accessibility features', () => {
    render(<Footer />);
    
    // Check for ARIA labels on section headings
    const aboutHeading = screen.getByText('About');
    expect(aboutHeading.id).toBe('footer-about-heading');
    
    // Check that lists are properly labeled
    const aboutList = screen.getByRole('list', { name: /about/i });
    expect(aboutList).toHaveAttribute('aria-labelledby', 'footer-about-heading');
    
    // Check that social links have proper aria-labels
    const socialLinks = [
      'Email DataCite Support',
      'Visit DataCite Blog',
      'Visit DataCite LinkedIn',
      'Visit DataCite GitHub',
      'Visit DataCite YouTube',
      'Visit DataCite Mastodon'
    ];

    socialLinks.forEach(label => {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument();
    });
  });
});
