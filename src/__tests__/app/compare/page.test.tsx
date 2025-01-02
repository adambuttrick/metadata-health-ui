import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComparePage from '@/app/compare/page';
import { useProviders } from '@/lib/hooks/use-entities';
import { Provider } from '@/lib/types/entities';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockProvider = {
  id: '1',
  type: 'providers',
  attributes: {
    name: 'Test Provider',
    symbol: 'TEST'
  },
  stats: {
    summary: {
      count: 100,
      fields: {
        title: { 
          fieldStatus: 'mandatory',
          completeness: 1.0,
          count: 100,
          missing: 0
        },
        description: {
          fieldStatus: 'recommended',
          completeness: 0.8,
          count: 80,
          missing: 20
        },
        keywords: {
          fieldStatus: 'optional',
          completeness: 0.7,
          count: 70,
          missing: 30
        }
      }
    }
  }
};

const mockClient = {
  id: '2',
  type: 'clients',
  attributes: {
    name: 'Test Client',
    symbol: 'CLIENT'
  },
  stats: {
    summary: {
      count: 50,
      fields: {
        title: { 
          fieldStatus: 'mandatory',
          completeness: 0.9,
          count: 45,
          missing: 5
        },
        description: { 
          fieldStatus: 'recommended',
          completeness: 0.8,
          count: 40,
          missing: 10
        },
        keywords: { 
          fieldStatus: 'optional',
          completeness: 0.7,
          count: 35,
          missing: 15
        }
      }
    },
    byResourceType: {
      resourceTypes: {
        dataset: {
          count: 30,
          fields: {
            title: { 
              fieldStatus: 'mandatory',
              completeness: 0.93,
              count: 28,
              missing: 2
            },
            description: { 
              fieldStatus: 'recommended',
              completeness: 0.83,
              count: 25,
              missing: 5
            },
            keywords: { 
              fieldStatus: 'optional',
              completeness: 0.73,
              count: 22,
              missing: 8
            }
          }
        }
      }
    }
  },
  relationships: {
    provider: {
      data: {
        id: '1',
        type: 'providers'
      }
    }
  }
};

jest.mock('@/lib/hooks/use-entities', () => ({
  useProviders: jest.fn(() => ({
    isLoading: false,
    error: null,
    data: [mockProvider]
  })),
  useClients: jest.fn(() => ({
    isLoading: false,
    error: null,
    data: []
  })),
  useProviderStats: () => ({
    data: mockProvider,
    isLoading: false,
    error: null
  }),
  useClientStats: () => ({
    data: mockClient,
    isLoading: false,
    error: null
  })
}));

jest.mock('@/components/common/entity-search', () => ({
  EntitySearch: ({ onSelect, selectedItems }: { 
    onSelect: (item: Provider) => void,
    selectedItems: Array<Provider>
  }) => {
    const createMockProvider = (id: string) => ({
      id,
      type: 'providers',
      attributes: {
        name: `Test Provider ${id}`,
        symbol: `TEST${id}`
      },
      stats: {
        summary: {
          count: 100,
          fields: {
            title: { 
              fieldStatus: 'mandatory',
              completeness: 1.0,
              count: 100,
              missing: 0
            },
            description: {
              fieldStatus: 'recommended',
              completeness: 0.8,
              count: 80,
              missing: 20
            },
            keywords: {
              fieldStatus: 'optional',
              completeness: 0.7,
              count: 70,
              missing: 30
            }
          }
        }
      }
    });

    return (
      <div>
        <input
          type="text"
          aria-label="Search organizations and repositories"
          placeholder="Northwestern University, Zenodo..."
        />
        <button onClick={() => {
          const nextId = (selectedItems.length + 1).toString();
          onSelect(createMockProvider(nextId));
        }}>Select Provider</button>
      </div>
    )
  },
}));

const mockStatsViewContext = {
  selectedView: 'summary',
  setSelectedView: jest.fn()
};

jest.mock('@/contexts/stats-view-context', () => ({
  useStatsView: () => mockStatsViewContext,
  StatsViewProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
}));

describe('ComparePage', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles adding and removing comparison items', async () => {
    const user = userEvent.setup();
    
    render(
      <QueryClientProvider client={queryClient}>
        <ComparePage />
      </QueryClientProvider>
    );

    // Add an item
    const selectButton = screen.getByRole('button', { name: 'Select Provider' });
    await user.click(selectButton);

    // Verify provider card is displayed
    expect(screen.getByText('Test Provider 1')).toBeInTheDocument();

    // Remove the item
    const removeButton = screen.getByRole('button', { name: /Remove Test Provider 1/i });
    await user.click(removeButton);

    // Verify provider card is removed
    expect(screen.queryByText('Test Provider 1')).not.toBeInTheDocument();
  });

  it('enforces maximum item limit of 9', async () => {
    const user = userEvent.setup();
    
    render(
      <QueryClientProvider client={queryClient}>
        <ComparePage />
      </QueryClientProvider>
    );

    // Add 9 items
    for (let i = 0; i < 9; i++) {
      const selectButton = screen.getByRole('button', { name: 'Select Provider' });
      await user.click(selectButton);
    }

    // Verify 9 cards are shown
    const cards = screen.getAllByRole('region', { name: /Comparison card for Test Provider/ });
    expect(cards).toHaveLength(9);
  });

  it('shows dataset stats when view is changed', async () => {
    const user = userEvent.setup();
    render(
      <QueryClientProvider client={queryClient}>
        <ComparePage />
      </QueryClientProvider>
    );

    // Add a comparison item
    const selectButton = screen.getByRole('button', { name: 'Select Provider' });
    await user.click(selectButton);

    // Verify dataset stats are shown
    expect(screen.getByText('100.0%', { selector: 'p[aria-label="Completeness: 100.0%"]' })).toBeInTheDocument();
  });

  it('displays comparison card with proper sections and styling', async () => {
    const user = userEvent.setup();
    
    render(
      <QueryClientProvider client={queryClient}>
        <ComparePage />
      </QueryClientProvider>
    );

    // Add a comparison item
    const selectButton = screen.getByRole('button', { name: 'Select Provider' });
    await user.click(selectButton);

    // Click on the mandatory button to expand the section
    const mandatoryButton = screen.getByRole('button', { name: /mandatory/i });
    await user.click(mandatoryButton);

    // Verify field details are shown
    expect(screen.getByText('100.0%', { selector: 'p[aria-label="Completeness: 100.0%"]' })).toBeInTheDocument();
  });

  it('handles error states gracefully', async () => {
    // Mock error state
    (useProviders as jest.Mock).mockImplementationOnce(() => ({
      isLoading: false,
      error: new Error('Failed to fetch providers'),
      data: null
    }));
    
    render(
      <QueryClientProvider client={queryClient}>
        <ComparePage />
      </QueryClientProvider>
    );

    // Verify the default empty state message is shown
    expect(screen.getByText('Search for organizations or repositories to compare their metadata health statistics')).toBeInTheDocument();
  });

  it('maintains accessibility features', async () => {
    const user = userEvent.setup();
    
    render(
      <QueryClientProvider client={queryClient}>
        <ComparePage />
      </QueryClientProvider>
    );

    // Add a comparison item
    const selectButton = screen.getByRole('button', { name: 'Select Provider' });
    await user.click(selectButton);

    // Verify ARIA labels
    expect(screen.getByRole('region', { name: 'Comparison card for Test Provider 1' })).toBeInTheDocument();
    
    // Click on the mandatory button to expand the section
    const mandatoryButton = screen.getByRole('button', { name: /mandatory/i });
    await user.click(mandatoryButton);

    // Verify field details are shown with proper ARIA labels
    expect(screen.getByText('100.0%', { selector: 'p[aria-label="Completeness: 100.0%"]' })).toBeInTheDocument();
  });
});
