import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComparisonCard from '@/components/compare/comparison-card';
import { StatsViewProvider } from '@/contexts/stats-view-context';

jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'Link';
  return MockLink;
});

const mockUseClientStats = jest.fn();
const mockUseProviderStats = jest.fn();

jest.mock('@/lib/hooks/use-entities', () => ({
  useClientStats: (clientId: string) => mockUseClientStats(clientId),
  useProviderStats: (providerId: string) => mockUseProviderStats(providerId)
}));

jest.mock('@/contexts/stats-view-context', () => ({
  useStatsView: () => ({
    selectedView: 'summary',
    setSelectedView: jest.fn()
  }),
  StatsViewProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

const mockStatsView = {
  fields: {
    'title': {
      fieldStatus: 'mandatory',
      completeness: 0.8,
      count: 80,
      missing: 20
    },
    'description': {
      fieldStatus: 'recommended',
      completeness: 0.6,
      count: 60,
      missing: 40
    },
    'keywords': {
      fieldStatus: 'optional',
      completeness: 0.4,
      count: 40,
      missing: 60
    }
  },
  count: 100
};

const mockProviderProps = {
  name: 'Test Provider',
  itemType: 'provider' as const,
  id: 'test-id',
};

const mockClientProps = {
  name: 'Test Client',
  itemType: 'client' as const,
  id: 'test-id',
  providerId: 'provider-id',
};

const renderWithContext = (ui: React.ReactElement) => {
  return render(
    <StatsViewProvider>
      {ui}
    </StatsViewProvider>
  );
};

describe('ComparisonCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseClientStats.mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    });
    mockUseProviderStats.mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    });
  });

  describe('Loading States', () => {
    it('shows loading skeleton for provider', () => {
      mockUseProviderStats.mockReturnValue({ isLoading: true, data: null });
      const { container } = renderWithContext(<ComparisonCard {...mockProviderProps} />);
      
      const skeletonContainer = container.querySelector('.bg-white.rounded-lg.shadow-sm.p-6');
      expect(skeletonContainer).toBeInTheDocument();
      const skeleton = skeletonContainer?.querySelector('.animate-pulse');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('space-y-4');
    });

    it('shows loading skeleton for client', () => {
      mockUseClientStats.mockReturnValue({ isLoading: true, data: null });
      const { container } = renderWithContext(<ComparisonCard {...mockClientProps} />);
      
      const skeletonContainer = container.querySelector('.bg-white.rounded-lg.shadow-sm.p-6');
      expect(skeletonContainer).toBeInTheDocument();
      const skeleton = skeletonContainer?.querySelector('.animate-pulse');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('space-y-4');
    });
  });

  describe('Basic Rendering', () => {
    beforeEach(() => {
      mockUseProviderStats.mockReturnValue({ 
        isLoading: false, 
        data: { stats: { summary: mockStatsView } } 
      });
      mockUseClientStats.mockReturnValue({ 
        isLoading: false, 
        data: { stats: { summary: mockStatsView } } 
      });
    });

    it('renders provider card information', () => {
      renderWithContext(<ComparisonCard {...mockProviderProps} />);
      
      expect(screen.getByText('Test Provider')).toBeInTheDocument();
      expect(screen.getByText(/View Organization details/)).toBeInTheDocument();
      expect(screen.getByRole('link')).toHaveAttribute('href', '/providers/test-id');
    });

    it('renders client card information', () => {
      renderWithContext(<ComparisonCard {...mockClientProps} />);
      
      expect(screen.getByText('Test Client')).toBeInTheDocument();
      expect(screen.getByText(/View Repository details/)).toBeInTheDocument();
      expect(screen.getByRole('link')).toHaveAttribute('href', '/providers/provider-id?client=test-id');
    });
  });

  describe('Field Display', () => {
    beforeEach(() => {
      mockUseProviderStats.mockReturnValue({ 
        isLoading: false, 
        data: { stats: { summary: mockStatsView } } 
      });
    });

    it('displays field details when section is expanded', async () => {
      renderWithContext(<ComparisonCard {...mockProviderProps} />);
      
      // Expand mandatory section
      fireEvent.click(screen.getByRole('button', { name: /Mandatory/i }));
      
      await waitFor(() => {
        // Check for the field name
        expect(screen.getByText('title')).toBeInTheDocument();
        
        // Check for the percentage in the field details (using aria-label)
        expect(screen.getByLabelText('Completeness: 80.0%')).toBeInTheDocument();
        
        // Check for the count
        expect(screen.getByText('80 / 100')).toBeInTheDocument();
      });
    });

    it('shows tooltips with field information', async () => {
      renderWithContext(<ComparisonCard {...mockProviderProps} />);
      
      // Expand mandatory section
      fireEvent.click(screen.getByRole('button', { name: /Mandatory/i }));
      
      // Check tooltip trigger exists
      const tooltipTrigger = screen.getByRole('button', { name: /Information about title/i });
      expect(tooltipTrigger).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('handles invalid stats data gracefully', () => {
      mockUseProviderStats.mockReturnValue({ 
        isLoading: false, 
        data: { stats: { summary: null } } 
      });

      renderWithContext(<ComparisonCard {...mockProviderProps} />);
      
      expect(screen.getByText('Invalid or missing stats data')).toBeInTheDocument();
    });
  });

  describe('Visual Styling', () => {
    beforeEach(() => {
      mockUseProviderStats.mockReturnValue({ 
        isLoading: false, 
        data: { stats: { summary: mockStatsView } } 
      });
    });

    it('applies correct color classes based on completeness', async () => {
      renderWithContext(<ComparisonCard {...mockProviderProps} />);
      
      // Expand mandatory section
      fireEvent.click(screen.getByRole('button', { name: /Mandatory/i }));
      
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars[0]).toHaveClass('bg-primary/20'); // Background
      
      // Check the progress bar fill
      const progressBarFill = progressBars[0].firstChild;
      expect(progressBarFill).toHaveClass('bg-[#0E8C73]');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      mockUseProviderStats.mockReturnValue({ 
        isLoading: false, 
        data: { stats: { summary: mockStatsView } } 
      });
    });

    it('maintains proper ARIA attributes', () => {
      renderWithContext(<ComparisonCard {...mockProviderProps} />);
      
      expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Comparison card for Test Provider');
      
      const progressBars = screen.getAllByRole('progressbar');
      progressBars.forEach(bar => {
        expect(bar).toHaveAttribute('aria-valuemin', '0');
        expect(bar).toHaveAttribute('aria-valuemax', '100');
        expect(bar).toHaveAttribute('aria-valuenow');
      });
    });

    it('handles section expansion with proper ARIA states', () => {
      renderWithContext(<ComparisonCard {...mockProviderProps} />);
      
      const mandatoryButton = screen.getByRole('button', { name: /Mandatory/i });
      expect(mandatoryButton).toHaveAttribute('aria-expanded', 'false');
      
      fireEvent.click(mandatoryButton);
      expect(mandatoryButton).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
