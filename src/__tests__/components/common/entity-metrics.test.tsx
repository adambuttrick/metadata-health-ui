import { render, screen } from '@testing-library/react';
import { EntityMetrics } from '@/components/common/entity-metrics';
import { StatsViewProvider } from '@/contexts/stats-view-context';
import { Provider, Client, StatsView } from '@/lib/types/api';

jest.mock('@/components/ui/loading-overlay', () => ({
  LoadingOverlay: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="loading-overlay">{children}</div>
  ),
}));

jest.mock('@/components/ui/metric-card', () => ({
  MetricCard: ({ fieldStatus, completeness, entityType }: { fieldStatus: string; completeness: number; entityType: string }) => {
    const title = fieldStatus.charAt(0).toUpperCase() + fieldStatus.slice(1);
    return (
      <div
        data-testid={`metric-card-${fieldStatus}`}
        role="region"
        aria-label={`Metric card for ${title}`}
      >
        <div>
          <span data-testid={`completeness-${fieldStatus}`}>{(completeness * 100).toFixed(2)}%</span>
          <span data-testid={`entity-type-${fieldStatus}`}>{entityType || ''}</span>
        </div>
      </div>
    );
  },
}));

const mockStatsView: StatsView = {
  count: 100,
  fields: {
    identifier: {
      count: 100,
      instances: 100,
      missing: 0,
      fieldStatus: 'mandatory',
      completeness: 1.0
    },
    title: {
      count: 100,
      instances: 90,
      missing: 10,
      fieldStatus: 'mandatory',
      completeness: 0.9
    },
    subjects: {
      count: 100,
      instances: 70,
      missing: 30,
      fieldStatus: 'recommended',
      completeness: 0.7
    },
    language: {
      count: 100,
      instances: 50,
      missing: 50,
      fieldStatus: 'optional',
      completeness: 0.5
    }
  },
  categories: {
    mandatory: { completeness: 1.0 },
    recommended: { completeness: 0.7 },
    optional: { completeness: 0.5 }
  }
};

const mockProvider: Provider = {
  id: 'test-provider',
  type: 'providers',
  attributes: {
    name: 'Test Provider'
  },
  stats: {
    summary: mockStatsView,
    byResourceType: {
      resourceTypes: {
        'dataset': mockStatsView
      }
    }
  }
};

const mockClient: Client = {
  id: 'test-client',
  type: 'clients',
  attributes: {
    name: 'Test Client'
  },
  stats: {
    summary: mockStatsView,
    byResourceType: {
      resourceTypes: {
        'dataset': mockStatsView
      }
    }
  }
};

describe('EntityMetrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderEntityMetrics = (props: { entity?: Provider | Client } = {}) => {
    return render(
      <StatsViewProvider>
        <EntityMetrics entity={props.entity} />
      </StatsViewProvider>
    );
  };

  describe('Loading State', () => {
    it('shows loading state when entity is undefined', async () => {
      renderEntityMetrics();
      expect(await screen.findByTestId('loading-overlay')).toBeInTheDocument();
    });

    it('shows loading state when entity has no stats', async () => {
      const entityWithoutStats = { ...mockProvider, stats: undefined };
      renderEntityMetrics({ entity: entityWithoutStats as Provider });
      expect(await screen.findByTestId('loading-overlay')).toBeInTheDocument();
    });
  });

  describe('Provider Metrics', () => {
    it('displays provider metrics with correct completeness values', async () => {
      renderEntityMetrics({ entity: mockProvider });

      // Wait for loading state to clear
      await screen.findByTestId('metric-card-mandatory');

      // Verify metric cards are properly labeled
      expect(screen.getByRole('region', { name: 'Metric card for Mandatory' })).toBeInTheDocument();
      expect(screen.getByRole('region', { name: 'Metric card for Recommended' })).toBeInTheDocument();
      expect(screen.getByRole('region', { name: 'Metric card for Optional' })).toBeInTheDocument();

      // Verify completeness values
      expect(screen.getByTestId('completeness-mandatory')).toHaveTextContent('100.00%');
      expect(screen.getByTestId('completeness-recommended')).toHaveTextContent('70.00%');
      expect(screen.getByTestId('completeness-optional')).toHaveTextContent('50.00%');
    });

    it('handles resource type view correctly', async () => {
      const { rerender } = renderEntityMetrics({ entity: mockProvider });

      // Wait for loading state to clear
      await screen.findByTestId('metric-card-mandatory');

      // Check metric values for summary view
      expect(screen.getByTestId('completeness-mandatory')).toHaveTextContent('100.00%');

      // Update the context to use a resource type view
      rerender(
        <StatsViewProvider defaultView="dataset">
          <EntityMetrics entity={mockProvider} />
        </StatsViewProvider>
      );

      // Check metric values for dataset view
      expect(screen.getByTestId('completeness-mandatory')).toHaveTextContent('100.00%');
    });

    it('renders metric cards with correct region roles and names', () => {
      renderEntityMetrics({ entity: mockProvider });
      
      // Verify metric cards are properly labeled
      expect(screen.getByRole('region', { name: 'Metric card for Mandatory' })).toBeInTheDocument();
      expect(screen.getByRole('region', { name: 'Metric card for Recommended' })).toBeInTheDocument();
      expect(screen.getByRole('region', { name: 'Metric card for Optional' })).toBeInTheDocument();
    });

    it('renders correct completeness values', () => {
      renderEntityMetrics({ entity: mockProvider });
      
      expect(screen.getByTestId('completeness-mandatory')).toHaveTextContent('100.00%');
    });
  });

  describe('Client Metrics', () => {
    it('displays client metrics with correct completeness values', async () => {
      renderEntityMetrics({ entity: mockClient });

      // Wait for loading state to clear
      await screen.findByTestId('metric-card-mandatory');

      // Check for metric cards with correct values
      expect(screen.getByTestId('completeness-mandatory')).toHaveTextContent('100.00%');
    });
  });

  describe('Error Handling', () => {
    it('handles missing fields gracefully', async () => {
      const statsWithMissingFields = {
        ...mockStatsView,
        fields: {}
      };

      const entityWithEmptyStats = {
        ...mockProvider,
        stats: {
          summary: statsWithMissingFields,
          byResourceType: {
            resourceTypes: {
              'dataset': statsWithMissingFields
            }
          }
        }
      };

      renderEntityMetrics({ entity: entityWithEmptyStats as Provider });

      // Wait for loading state to clear
      await screen.findByTestId('metric-card-mandatory');

      // Should show 0% for all categories when no fields are present
      expect(screen.getByTestId('completeness-mandatory')).toHaveTextContent('0.00%');
      expect(screen.getByTestId('completeness-recommended')).toHaveTextContent('0.00%');
      expect(screen.getByTestId('completeness-optional')).toHaveTextContent('0.00%');
    });

    it('handles malformed stats data gracefully', async () => {
      const malformedStats = {
        summary: {
          count_dois: 100,
          fields: null
        }
      };

      const entityWithMalformedStats = {
        ...mockProvider,
        stats: malformedStats
      };

      renderEntityMetrics({ entity: entityWithMalformedStats as Provider });
      expect(await screen.findByTestId('loading-overlay')).toBeInTheDocument();
    });

    it('handles missing categories gracefully', async () => {
      const statsWithMissingCategories = {
        ...mockStatsView,
        categories: undefined
      };

      const entityWithEmptyStats = {
        ...mockProvider,
        stats: {
          summary: statsWithMissingCategories,
          byResourceType: {
            resourceTypes: {
              'dataset': statsWithMissingCategories
            }
          }
        }
      };

      renderEntityMetrics({ entity: entityWithEmptyStats as Provider });

      // Should show loading state when categories are missing
      expect(await screen.findByTestId('loading-overlay')).toBeInTheDocument();
    });
  });
});
