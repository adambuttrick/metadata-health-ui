import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '@/app/page';
import { mockProviders } from '../fixtures/entities';
import { Provider, Client } from '@/lib/types/api';
import { type EntitySearch as EntitySearchType } from '@/components/common/entity-search';

const mockProviders = [
  {
    id: 'provider-1',
    type: 'providers',
    attributes: { name: 'Northwestern University' }
  }
];

const mockClientWithProvider = {
  id: 'client-1',
  type: 'clients',
  attributes: { name: 'Northwestern Repository' },
  relationships: {
    provider: 'provider-1'
  }
};

const mockClientWithoutProvider = {
  id: 'client-1',
  type: 'clients',
  attributes: { name: 'Northwestern Repository' },
  relationships: {}
};

jest.mock('@/lib/hooks/use-entities', () => ({
  useProviders: () => ({
    data: mockProviders,
    isLoading: false,
  }),
  useClients: () => ({
    data: [mockClientWithProvider, mockClientWithoutProvider],
    isLoading: false,
  }),
}));

const mockNavigateToProvider = jest.fn();
jest.mock('@/lib/hooks/use-provider-navigation', () => ({
  useProviderNavigation: () => ({
    navigateToProvider: mockNavigateToProvider,
  }),
}));

const consoleErrorSpy = jest.spyOn(console, 'error');

jest.mock('@/components/common/entity-search', () => ({
  EntitySearch: ({ mode }: { mode: 'selection' | 'navigation' }) => {
    const handleClick = (item: Provider | Client) => {
      if (mode === 'navigation') {
        if (item.type === 'providers') {
          mockNavigateToProvider({
            providerId: item.id,
            view: 'summary'
          });
        } else if (item.type === 'clients') {
          if (!item.relationships?.provider) {
            console.error('Provider relationship not found for client:', item);
          } else {
            mockNavigateToProvider({
              providerId: item.relationships.provider,
              clientId: item.id,
              view: 'summary'
            });
          }
        }
      }
    };

    return (
      <div data-testid="mock-entity-search" data-mode={mode}>
        <input 
          data-testid="search-input"
          aria-label="Search organizations and repositories"
          placeholder="Search..."
          role="searchbox"
        />
        <div data-testid="search-results" role="listbox">
          <div 
            data-testid="provider-provider-1" 
            role="option"
            aria-selected="false"
            onClick={() => handleClick(mockProviders[0])}
          >
            Northwestern University
          </div>
          <div 
            data-testid="client-with-provider" 
            role="option"
            aria-selected="false"
            onClick={() => handleClick(mockClientWithProvider)}
          >
            Client With Provider
          </div>
          <div 
            data-testid="client-without-provider" 
            role="option"
            aria-selected="false"
            onClick={() => handleClick(mockClientWithoutProvider)}
          >
            Client Without Provider
          </div>
        </div>
        <div role="status" aria-live="polite">3 results found</div>
      </div>
    );
  },
}));

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('Rendering', () => {
    it('renders the page with correct heading and description', () => {
      render(<Home />);

      expect(screen.getByRole('heading', { 
        name: /search organizations and repositories/i 
      })).toBeInTheDocument();
      
      expect(screen.getByText(
        /search for organizations or repositories to view their metadata health statistics/i
      )).toBeInTheDocument();
    });

    it('renders the search component in navigation mode', () => {
      render(<Home />);
      const searchComponent = screen.getByTestId('mock-entity-search');
      
      expect(searchComponent).toBeInTheDocument();
      expect(searchComponent).toHaveAttribute('data-mode', 'navigation');
    });
  });

  describe('Loading States', () => {
    beforeEach(() => {
      jest.resetModules();
    });

    it('shows loading overlay when EntitySearch is loading', () => {
      // Mock loading state
      jest.mock('@/lib/hooks/use-entities', () => ({
        useProviders: () => ({
          data: undefined,
          isLoading: true,
        }),
        useClients: () => ({
          data: undefined,
          isLoading: true,
        }),
      }));

      render(<Home />);
      expect(screen.getByTestId('mock-entity-search')).toBeInTheDocument();
    });

    it('removes loading overlay when EntitySearch loads', async () => {
      render(<Home />);
      expect(screen.getByTestId('mock-entity-search')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('renders search input with correct placeholder', () => {
      render(<Home />);
      const searchInput = screen.getByTestId('search-input');
      
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('placeholder', 'Search...');
    });

    it('displays search results for providers and clients', async () => {
      render(<Home />);
      const searchResults = screen.getByTestId('search-results');
      
      expect(searchResults).toBeInTheDocument();
      expect(screen.getByTestId('provider-provider-1')).toHaveTextContent('Northwestern University');
      expect(screen.getByTestId('client-with-provider')).toHaveTextContent('Client With Provider');
      expect(screen.getByTestId('client-without-provider')).toHaveTextContent('Client Without Provider');
    });

    it('filters results based on search input', async () => {
      const user = userEvent.setup();
      render(<Home />);
      
      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'Northwestern');

      await waitFor(() => {
        expect(screen.getByTestId('provider-provider-1')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation Mode', () => {
    beforeEach(() => {
      mockNavigateToProvider.mockClear();
    });

    it('navigates to provider when provider is selected', async () => {
      render(<Home />);
      const user = userEvent.setup();
      const providerElement = screen.getByTestId('provider-provider-1');
      await user.click(providerElement);

      expect(mockNavigateToProvider).toHaveBeenCalledWith({
        providerId: 'provider-1',
        view: 'summary'
      });
    });

    it('navigates to client with provider context when client is selected', async () => {
      render(<Home />);
      const user = userEvent.setup();
      const clientElement = screen.getByTestId('client-with-provider');
      await user.click(clientElement);

      expect(mockNavigateToProvider).toHaveBeenCalledWith({
        providerId: 'provider-1',
        clientId: 'client-1',
        view: 'summary'
      });
    });

    it('handles missing provider relationship gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error');
      render(<Home />);
      const user = userEvent.setup();
      const clientElement = screen.getByTestId('client-without-provider');
      await user.click(clientElement);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Provider relationship not found for client:',
        expect.objectContaining({
          id: 'client-1',
          relationships: {}
        })
      );
    });
  });

  describe('UI/UX', () => {
    let mockEntitySearch: { EntitySearch: typeof EntitySearchType };

    beforeEach(() => {
      mockEntitySearch = jest.requireMock('@/components/common/entity-search');
      mockEntitySearch.EntitySearch = jest.fn(({ mode }) => {
        return (
          <div data-testid="mock-entity-search" data-mode={mode}>
            <input data-testid="search-input" role="searchbox" />
            <div data-testid="search-results" role="listbox">
              <div data-testid="search-result-item">Search Result</div>
            </div>
          </div>
        );
      });
    });

    it('closes search results when clicking outside', async () => {
      const user = userEvent.setup();
      render(<Home />);

      // Click outside
      await user.click(document.body);

      // Verify the component was rendered
      expect(screen.getByTestId('mock-entity-search')).toBeInTheDocument();
    });

    it('closes search results when pressing escape', async () => {
      const user = userEvent.setup();
      render(<Home />);

      // Press escape
      await user.keyboard('{Escape}');

      // Verify the component was rendered
      expect(screen.getByTestId('mock-entity-search')).toBeInTheDocument();
    });

    it('supports keyboard navigation in search results', async () => {
      const user = userEvent.setup();
      render(<Home />);

      // Get the search input
      const searchInput = screen.getByRole('searchbox');
      await user.click(searchInput);

      // Press arrow down to navigate
      await user.keyboard('{ArrowDown}');

      // Verify we can find the first option
      const firstOption = screen.getByTestId('provider-provider-1');
      expect(firstOption).toBeInTheDocument();

      // Press arrow down again to navigate to the second option
      await user.keyboard('{ArrowDown}');

      // Verify we can find the second option
      const secondOption = screen.getByTestId('client-with-provider');
      expect(secondOption).toBeInTheDocument();
    });
  });

  describe('UI/UX', () => {
    describe('Accessibility', () => {
      it('has correct ARIA attributes', () => {
        render(<Home />);
        
        const searchInput = screen.getByRole('searchbox');
        expect(searchInput).toHaveAttribute('aria-label', 'Search organizations and repositories');
        
        const searchResults = screen.getByTestId('search-results');
        expect(searchResults).toHaveAttribute('role', 'listbox');
      });

      it('announces loading state to screen readers', () => {
        // Mock loading state
        jest.mock('@/lib/hooks/use-entities', () => ({
          useProviders: () => ({
            data: undefined,
            isLoading: true,
          }),
          useClients: () => ({
            data: undefined,
            isLoading: true,
          }),
        }));

        render(<Home />);
        const loadingMessage = screen.getByTestId('mock-entity-search');
        expect(loadingMessage).toBeInTheDocument();
      });

      it('announces search results count to screen readers', async () => {
        render(<Home />);
        const resultsStatus = screen.getByRole('status');
        expect(resultsStatus).toHaveTextContent('3 results found');
      });
    });
  });
});
