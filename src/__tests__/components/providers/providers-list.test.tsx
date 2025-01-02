import { render, screen } from '@testing-library/react';
import { ProvidersList } from '@/components/providers/providers-list';
import { useProviders } from '@/lib/hooks/use-entities';

jest.mock('@/lib/hooks/use-entities');
const mockUseProviders = useProviders as jest.MockedFunction<typeof useProviders>;

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card">{children}</div>
  ),
}));

describe('ProvidersList', () => {
  const mockProviders = [
    {
      id: 'provider1',
      type: 'providers',
      name: 'Test Provider 1',
      stats: {
        summary: {
          count: 1000
        }
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'provider2',
      type: 'providers',
      name: 'Test Provider 2',
      stats: {
        summary: {
          count: 2000
        }
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state while data is being fetched', () => {
    mockUseProviders.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    render(<ProvidersList />);
    expect(screen.getByText('Loading providers...')).toBeInTheDocument();
  });

  it('renders error message when there is an error', () => {
    const errorMessage = 'Failed to fetch providers';
    mockUseProviders.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error(errorMessage),
    });

    render(<ProvidersList />);
    expect(screen.getByText(`Error loading providers: ${errorMessage}`)).toBeInTheDocument();
  });

  it('renders "No providers found" message when data is empty', () => {
    mockUseProviders.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<ProvidersList />);
    expect(screen.getByText('No providers found')).toBeInTheDocument();
  });

  it('renders providers table with correct data', () => {
    mockUseProviders.mockReturnValue({
      data: mockProviders,
      isLoading: false,
      isError: false,
      error: null
    });

    render(<ProvidersList />);

    // Check table headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('DOIs')).toBeInTheDocument();

    // Check provider data
    mockProviders.forEach((provider) => {
      const link = screen.getByRole('link', { name: provider.name });
      expect(link).toBeInTheDocument();
      expect(link.closest('tr')).toHaveTextContent(provider.stats.summary.count.toLocaleString());
    });
  });

  it('handles missing provider statistics gracefully', () => {
    const providerWithMissingStats = {
      id: 'provider3',
      type: 'providers',
      name: 'Test Provider 3',
      stats: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    };

    mockUseProviders.mockReturnValue({
      data: [providerWithMissingStats],
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<ProvidersList />);

    const link = screen.getByRole('link', { name: providerWithMissingStats.name });
    expect(link).toBeInTheDocument();
    
    const row = link.closest('tr');
    expect(row).toHaveTextContent('0');
  });

  it('handles alternative stats structure gracefully', () => {
    const providerWithAlternativeStats = {
      id: 'provider4',
      type: 'providers',
      name: 'Test Provider 4',
      stats: {
        summary: {
          count: 3000
        }
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    };

    mockUseProviders.mockReturnValue({
      data: [providerWithAlternativeStats],
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<ProvidersList />);
    const link = screen.getByRole('link', { name: providerWithAlternativeStats.name });
    const row = link.closest('tr');
    expect(row).toHaveTextContent('3,000');
  });
});
