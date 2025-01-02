import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EntitySearch } from '@/components/common/entity-search';
import { Provider, Client } from '@/lib/types/api';
import { useProviders, useClients } from '@/lib/hooks/use-entities';
import { useProviderNavigation } from '@/lib/hooks/use-provider-navigation';

jest.mock('@/lib/hooks/use-entities');
jest.mock('@/lib/hooks/use-provider-navigation');

jest.mock('@/components/ui/spinner', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

const mockNavigateToProvider = jest.fn();

const mockProvider: Provider = {
  id: 'provider1',
  type: 'providers',
  attributes: {
    name: 'Test Provider',
    symbol: 'TEST',
    stats: undefined
  },
};

const mockClient: Client = {
  id: 'client1',
  type: 'clients',
  attributes: {
    name: 'Test Client',
    symbol: 'CLIENT',
    stats: undefined
  },
  relationships: {
    provider: 'provider1',
  },
};

describe('EntitySearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useProviders as jest.Mock).mockReturnValue({
      data: [mockProvider],
      isLoading: false,
    });
    (useClients as jest.Mock).mockReturnValue({
      data: [mockClient],
      isLoading: false,
    });
    (useProviderNavigation as jest.Mock).mockReturnValue({
      navigateToProvider: mockNavigateToProvider,
    });
  });

  describe('Navigation Mode', () => {
    it('navigates to provider when provider is selected', async () => {
      render(<EntitySearch mode="navigation" />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Test' } });
      
      await waitFor(() => {
        expect(screen.getByText('Test Provider')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText('Test Provider'));
      
      expect(mockNavigateToProvider).toHaveBeenCalledWith({
        providerId: 'provider1',
        view: 'summary',
      });
    });

    it('navigates to client when client is selected', async () => {
      render(<EntitySearch mode="navigation" />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Test' } });
      
      await waitFor(() => {
        expect(screen.getByText('Test Client')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText('Test Client'));
      
      expect(mockNavigateToProvider).toHaveBeenCalledWith({
        providerId: 'provider1',
        clientId: 'client1',
        view: 'summary',
      });
    });

    it('handles missing provider relationship for client', async () => {
      const clientWithoutProvider = {
        ...mockClient,
        relationships: { provider: undefined },
      };
      (useClients as jest.Mock).mockReturnValue({
        data: [clientWithoutProvider],
        isLoading: false,
      });

      render(<EntitySearch mode="navigation" />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Test' } });
      
      await waitFor(() => {
        expect(screen.getByText('Test Client')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText('Test Client'));
      
      expect(mockNavigateToProvider).not.toHaveBeenCalled();
    });
  });

  describe('Selection Mode', () => {
    const mockOnSelect = jest.fn();

    it('calls onSelect when item is selected', async () => {
      render(
        <EntitySearch
          mode="selection"
          selectedItems={[]}
          onSelect={mockOnSelect}
        />
      );
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Test' } });
      
      await waitFor(() => {
        expect(screen.getByText('Test Provider')).toBeInTheDocument();
      });
      
      fireEvent.click(screen.getByText('Test Provider'));
      
      expect(mockOnSelect).toHaveBeenCalledWith(mockProvider);
    });

    it('prevents selecting already selected items', async () => {
      render(
        <EntitySearch
          mode="selection"
          selectedItems={[mockProvider]}
          onSelect={mockOnSelect}
        />
      );
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Test' } });
      
      await waitFor(() => {
        const providerButton = screen.getByRole('option', { name: /Test Provider/ });
        expect(providerButton).toBeInTheDocument();
        expect(providerButton).toHaveAttribute('aria-disabled', 'true');
      });
      
      fireEvent.click(screen.getByRole('option', { name: /Test Provider/ }));
      
      expect(mockOnSelect).not.toHaveBeenCalled();
    });
  });

  describe('Search Behavior', () => {
    it('shows error message for short search terms', () => {
      render(<EntitySearch mode="navigation" />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'a' } });
      
      expect(screen.getByText('Please enter at least 2 characters')).toBeInTheDocument();
    });

    it('shows loading state', async () => {
      (useProviders as jest.Mock).mockReturnValue({
        data: [],
        isLoading: true,
      });
      (useClients as jest.Mock).mockReturnValue({
        data: [],
        isLoading: true,
      });

      render(<EntitySearch mode="navigation" />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });
      
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('shows no results message when no matches found', async () => {
      render(<EntitySearch mode="navigation" />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'nonexistent' } });
      
      await waitFor(() => {
        expect(screen.getByText('No results found')).toBeInTheDocument();
      });
    });

    it('filters by both name and symbol', async () => {
      render(<EntitySearch mode="navigation" />);
      
      const input = screen.getByRole('textbox');
      
      // Search by name
      fireEvent.change(input, { target: { value: 'Test Provider' } });
      await waitFor(() => {
        expect(screen.getByText('Test Provider')).toBeInTheDocument();
      });
      
      // Search by symbol
      fireEvent.change(input, { target: { value: 'TEST' } });
      await waitFor(() => {
        expect(screen.getByText('Test Provider')).toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('closes dropdown on escape key', async () => {
      render(<EntitySearch mode="navigation" />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Test' } });
      
      await waitFor(() => {
        expect(screen.getByText('Test Provider')).toBeInTheDocument();
      });
      
      fireEvent.keyDown(input, { key: 'Escape' });
      
      await waitFor(() => {
        expect(screen.queryByText('Test Provider')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', async () => {
      render(<EntitySearch mode="navigation" />);
      
      const combobox = screen.getByRole('combobox');
      expect(combobox).toHaveAttribute('aria-expanded', 'false');
      expect(combobox).toHaveAttribute('aria-haspopup', 'listbox');
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Test' } });
      
      await waitFor(() => {
        expect(combobox).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('marks selected items as disabled', async () => {
      render(
        <EntitySearch
          mode="selection"
          selectedItems={[mockProvider]}
          onSelect={jest.fn()}
        />
      );
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'Test' } });
      
      await waitFor(() => {
        const option = screen.getByRole('option', { name: /Test Provider/ });
        expect(option).toHaveAttribute('aria-disabled', 'true');
        expect(option).toHaveAttribute('aria-selected', 'true');
      });
    });
  });
});
