import { renderHook, waitFor } from '@testing-library/react';
import {
  useProviders,
  useProviderDetails,
  useProviderStats,
  useClients,
  useClientDetails,
  useClientStats,
} from '@/lib/hooks/use-entities';
import {
  getProviders,
  getProviderDetails,
  getProviderStats,
  getClients,
  getClient,
  getClientStats,
} from '@/lib/api/endpoints';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mockProviders, mockClients, mockApiResponse } from '@/__fixtures__/entities';
import { ProviderFetchError, ClientFetchError } from '@/lib/types/api';

jest.mock('@/lib/api/endpoints');

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Entity Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useProviders', () => {
    it('should fetch providers successfully', async () => {
      (getProviders as jest.Mock).mockResolvedValueOnce(mockApiResponse.data);
      const { result } = renderHook(() => useProviders(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockApiResponse.data);
      expect(result.current.error).toBeNull();
    });

    it('should handle API errors', async () => {
      const error = new ProviderFetchError('Failed to fetch providers', 'all');
      (getProviders as jest.Mock).mockRejectedValueOnce(error);
      
      const { result } = renderHook(() => useProviders(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toEqual(error);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle pagination metadata', async () => {
      const paginatedResponse = {
        data: mockProviders,
        meta: {
          total: 10,
          totalPages: 2,
          page: 1
        }
      };
      
      (getProviders as jest.Mock).mockResolvedValueOnce(paginatedResponse.data);
      const { result } = renderHook(() => useProviders(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(paginatedResponse.data);
      expect(result.current.pageCount).toBeUndefined();
      expect(result.current.totalItems).toBeUndefined();
    });
  });

  describe('useProviderDetails', () => {
    const providerId = 'provider-1';
    const provider = mockProviders[0];

    it('should fetch provider details successfully', async () => {
      (getProviderDetails as jest.Mock).mockResolvedValueOnce({ data: provider });
      const { result } = renderHook(() => useProviderDetails(providerId), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual({ data: provider });
      expect(result.current.error).toBeNull();
    });

    it('should not fetch when providerId is empty', () => {
      const { result } = renderHook(() => useProviderDetails(''), { wrapper });
      expect(result.current.isLoading).toBe(false);
      expect(getProviderDetails).not.toHaveBeenCalled();
    });

    it('should handle provider fetch errors', async () => {
      const error = new ProviderFetchError('Provider not found', providerId);
      (getProviderDetails as jest.Mock).mockRejectedValueOnce(error);
      
      const { result } = renderHook(() => useProviderDetails(providerId), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toEqual(error);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useProviderStats', () => {
    const providerId = 'provider-1';
    const provider = mockProviders[0];

    it('should fetch provider stats successfully', async () => {
      (getProviderStats as jest.Mock).mockResolvedValueOnce({ data: provider });
      const { result } = renderHook(() => useProviderStats(providerId), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual({ data: provider });
      expect(result.current.error).toBeNull();
    });

    it('should not fetch when providerId is empty', () => {
      const { result } = renderHook(() => useProviderStats(''), { wrapper });
      expect(result.current.isLoading).toBe(false);
      expect(getProviderStats).not.toHaveBeenCalled();
    });

    it('should handle provider stats errors', async () => {
      const error = new ProviderFetchError('Failed to fetch provider stats', providerId);
      (getProviderStats as jest.Mock).mockRejectedValueOnce(error);
      
      const { result } = renderHook(() => useProviderStats(providerId), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toEqual(error);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useClients', () => {
    it('should fetch clients successfully', async () => {
      const mockClientResponse = { data: mockClients, meta: { total: 2, totalPages: 1, page: 1 } };
      (getClients as jest.Mock).mockResolvedValueOnce(mockClientResponse.data);
      const { result } = renderHook(() => useClients(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockClientResponse.data);
      expect(result.current.error).toBeNull();
    });

    it('should handle client fetch errors', async () => {
      const error = new ClientFetchError('Failed to fetch clients', 'all');
      (getClients as jest.Mock).mockRejectedValueOnce(error);
      
      const { result } = renderHook(() => useClients(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toEqual(error);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useClientDetails', () => {
    const clientId = 'client-1';
    const client = mockClients[0];

    it('should fetch client details successfully', async () => {
      (getClient as jest.Mock).mockResolvedValueOnce({ data: client });
      const { result } = renderHook(() => useClientDetails(clientId), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual({ data: client });
      expect(result.current.error).toBeNull();
    });

    it('should not fetch when clientId is empty', () => {
      const { result } = renderHook(() => useClientDetails(''), { wrapper });
      expect(result.current.isLoading).toBe(false);
      expect(getClient).not.toHaveBeenCalled();
    });

    it('should handle client fetch errors', async () => {
      const error = new ClientFetchError('Client not found', clientId);
      (getClient as jest.Mock).mockRejectedValueOnce(error);
      
      const { result } = renderHook(() => useClientDetails(clientId), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toEqual(error);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useClientStats', () => {
    const clientId = 'client-1';
    const client = mockClients[0];

    it('should fetch client stats successfully', async () => {
      (getClientStats as jest.Mock).mockResolvedValueOnce({ data: client });
      const { result } = renderHook(() => useClientStats(clientId), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual({ data: client });
      expect(result.current.error).toBeNull();
    });

    it('should not fetch when clientId is empty', () => {
      const { result } = renderHook(() => useClientStats(''), { wrapper });
      expect(result.current.isLoading).toBe(false);
      expect(getClientStats).not.toHaveBeenCalled();
    });

    it('should handle client stats errors', async () => {
      const error = new ClientFetchError('Failed to fetch client stats', clientId);
      (getClientStats as jest.Mock).mockRejectedValueOnce(error);
      
      const { result } = renderHook(() => useClientStats(clientId), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toEqual(error);
      expect(result.current.data).toBeUndefined();
    });
  });
});
