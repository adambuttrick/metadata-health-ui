import { render, screen } from '@testing-library/react';
import { ResourceTypeStats } from '@/components/common/resource-type-stats';
import { Provider, Stats } from '@/lib/types/api';
import { StatsViewProvider } from '@/contexts/stats-view-context';
import { axe } from 'jest-axe';

// Mock the tooltip component to avoid portal issues in tests
jest.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Bar: ({ children }: { children: React.ReactNode }) => <div data-testid="bar">{children}</div>,
  XAxis: () => null,
  YAxis: () => null,
  Legend: () => null,
}));

const mockStats: Stats = {
  summary: {
    count_dois: 100,
    fields: {},
  },
  byResourceType: {
    resourceTypes: {
      'journal-article': {
        count_dois: 50,
        count: 50,
        fields: {},
      },
      'book-chapter': {
        count_dois: 30,
        count: 30,
        fields: {},
      },
      'dataset': {
        count_dois: 20,
        count: 20,
        fields: {},
      },
    },
  },
};

const mockProvider: Provider = {
  id: 'test-provider',
  name: 'Test Provider',
  stats: mockStats,
};

const renderWithProvider = (children: React.ReactNode) => {
  return render(
    <StatsViewProvider>
      {children}
    </StatsViewProvider>
  );
};

describe('ResourceTypeStats', () => {
  it('renders resource type stats correctly', () => {
    renderWithProvider(<ResourceTypeStats provider={mockProvider} />);
    
    // Check for heading and description
    expect(screen.getByRole('heading', { name: 'Resource Type Distribution' })).toBeInTheDocument();
    
    // Check for chart container
    expect(screen.getByRole('figure', { 
      name: 'Resource type distribution chart showing all resource types' 
    })).toBeInTheDocument();
    
    // Check for total items
    expect(screen.getByRole('status')).toHaveTextContent('Total items: 100');
    
    // Check for the most common type info
    expect(screen.getByText('Most common:')).toBeInTheDocument();
    expect(screen.getByText('journal-article')).toBeInTheDocument();
    expect(screen.getByText('(50.0% of total)')).toBeInTheDocument();
  });

  it('does not render when stats are undefined', () => {
    const providerWithoutStats: Provider = {
      id: 'test-provider',
      name: 'Test Provider',
    };
    const { container } = renderWithProvider(<ResourceTypeStats provider={providerWithoutStats} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('does not render when resource type stats are empty', () => {
    const emptyStats: Stats = {
      summary: {
        count_dois: 0,
        fields: {},
      },
      byResourceType: {
        resourceTypes: {},
      },
    };
    const providerWithEmptyStats: Provider = {
      id: 'test-provider',
      name: 'Test Provider',
      stats: emptyStats,
    };
    const { container } = renderWithProvider(<ResourceTypeStats provider={providerWithEmptyStats} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('has no accessibility violations', async () => {
    const { container } = renderWithProvider(<ResourceTypeStats provider={mockProvider} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
