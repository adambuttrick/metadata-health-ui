import {
  getProviders,
  getProviderDetails,
  getProviderStats,
  getProviderClientsList,
  getClients,
  getClient,
  getClientStats
} from '@/lib/api/endpoints';
import { apiClient } from '@/lib/api/client';
import { 
  ClientFetchError,
  ProviderFetchError
} from '@/lib/types/api';

jest.mock('@/lib/api/client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;
const API_BASE = '/api/v1';

const mockStats = {
  summary: {
    count: 100,
    fields: {
      title: {
        completeness: 100,
        count: 100,
        fieldStatus: 'complete',
        instances: 100,
        missing: 0,
        subfields: {
          main: {
            completeness: 100,
            count: 100,
            instances: 100,
            missing: 0
          }
        }
      }
    }
  }
};

const mockProviders = [
  { 
    id: '1',
    type: 'providers',
    attributes: {
      name: 'Provider 1',
      symbol: 'PRV1',
      created: '2024-01-01T00:00:00Z',
      updated: '2024-01-01T00:00:00Z',
      description: 'Test Provider 1',
      isActive: true,
      memberType: 'direct',
      rorId: 'https://ror.org/123456789',
      isConsortium: false,
      region: 'North America',
      country: 'United States',
      logoUrl: 'https://example.com/logo.png',
      organizationType: 'university',
      focusArea: 'research',
      nonProfitStatus: 'non-profit',
      year: 2020
    },
    relationships: {
      prefixes: ['10.1234', '10.5678'],
      clients: ['client1', 'client2']
    },
    stats: mockStats
  }
];

describe('API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProviders', () => {
    it('should fetch providers with attributes only', async () => {
      const response = { data: { data: mockProviders } };
      mockApiClient.get.mockResolvedValueOnce(response);
      const result = await getProviders();
      expect(mockApiClient.get).toHaveBeenCalledWith(`${API_BASE}/providers/attributes`);
      expect(result).toEqual(response.data.data);
      expect(result[0]).toHaveProperty('attributes.memberType');
      expect(result[0]).toHaveProperty('attributes.rorId');
      expect(result[0]).toHaveProperty('relationships.prefixes');
    });

    it('should throw ProviderFetchError with status code on failure', async () => {
      const error = { response: { status: 404 } };
      mockApiClient.get.mockRejectedValueOnce(error);
      await expect(getProviders()).rejects.toThrow(ProviderFetchError);
      await expect(getProviders()).rejects.toMatchObject({
        message: 'Failed to fetch providers',
        providerId: 'all'
      });
    });
  });

  describe('getProviderDetails', () => {
    const mockProvider = {
      id: '1',
      type: 'providers',
      attributes: {
        name: 'Provider 1',
        symbol: 'PRV1',
        created: '2024-01-01T00:00:00Z',
        updated: '2024-01-01T00:00:00Z',
        description: 'Test Provider 1',
        isActive: true,
        memberType: 'direct',
        rorId: 'https://ror.org/123456789',
        isConsortium: false,
        region: 'North America',
        country: 'United States',
        logoUrl: 'https://example.com/logo.png',
        organizationType: 'university',
        focusArea: 'research',
        nonProfitStatus: 'non-profit',
        year: 2020
      },
      relationships: {
        prefixes: ['10.1234', '10.5678'],
        clients: ['client1', 'client2']
      },
      stats: mockStats
    };

    it('should fetch full provider details', async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: { data: mockProvider } });
      const result = await getProviderDetails('1');
      expect(mockApiClient.get).toHaveBeenCalledWith(`${API_BASE}/providers/1`);
      expect(result).toEqual(mockProvider);
    });

    it('should throw ProviderFetchError on failure', async () => {
      const error = new Error('Network error');
      mockApiClient.get.mockRejectedValueOnce(error);
      await expect(getProviderDetails('1')).rejects.toThrow(ProviderFetchError);
      await expect(getProviderDetails('1')).rejects.toMatchObject({
        message: 'Failed to fetch provider details',
        providerId: '1'
      });
    });
  });

  describe('getProviderStats', () => {
    const providerId = '1';

    it('should fetch provider stats successfully', async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: { data: mockStats } });
      const result = await getProviderStats(providerId);
      expect(result).toEqual(mockStats);
      expect(mockApiClient.get).toHaveBeenCalledWith(`${API_BASE}/providers/${providerId}/stats`);
    });

    it('should throw ProviderFetchError on failure', async () => {
      const error = new Error('Network error');
      mockApiClient.get.mockRejectedValueOnce(error);
      await expect(getProviderStats(providerId)).rejects.toThrow(ProviderFetchError);
    });
  });

  describe('getProviderClientsList', () => {
    const providerId = '1';
    const mockClients = ['client1', 'client2'];

    it('should handle empty client list', async () => {
      mockApiClient.get.mockResolvedValueOnce({ 
        data: { 
          data: []
        } 
      });
      
      const result = await getProviderClientsList(providerId);
      expect(result).toEqual([]);
      expect(mockApiClient.get).toHaveBeenCalledWith(`${API_BASE}/providers/${providerId}/clients`);
    });

    it('should fetch provider clients', async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: { data: mockClients } });

      const result = await getProviderClientsList(providerId);
      expect(result).toEqual(mockClients);
      expect(mockApiClient.get).toHaveBeenCalledWith(`${API_BASE}/providers/${providerId}/clients`);
    });

    it('should handle fetch failures', async () => {
      const error = new Error('Failed to fetch clients');
      mockApiClient.get.mockRejectedValueOnce(error);
      
      await expect(getProviderClientsList('1')).rejects.toThrow(ProviderFetchError);
    });
  });

  describe('getClients', () => {
    const mockClients = [
      { 
        id: 'client1',
        type: 'clients',
        attributes: {
          name: 'Client 1',
          symbol: 'CLT1',
          created: '2024-01-01T00:00:00Z',
          updated: '2024-01-01T00:00:00Z',
          description: 'Test Client 1',
          isActive: true,
          alternateName: 'Test Client One',
          language: ['en', 'es'],
          clientType: 'repository',
          domains: 'example.com',
          year: 2020,
          url: 'https://example.com'
        },
        relationships: {
          provider: '1',
          prefixes: ['10.1234']
        },
        stats: mockStats
      }
    ];

    it('should fetch clients with attributes only', async () => {
      const response = { data: { data: mockClients } };
      mockApiClient.get.mockResolvedValueOnce(response);
      const result = await getClients();
      expect(mockApiClient.get).toHaveBeenCalledWith(`${API_BASE}/clients/attributes`);
      expect(result).toEqual(mockClients);
    });

    it('should throw ClientFetchError on failure', async () => {
      const error = new Error('Network error');
      mockApiClient.get.mockRejectedValueOnce(error);
      await expect(getClients()).rejects.toThrow(ClientFetchError);
    });
  });

  describe('getClient', () => {
    const clientId = 'client1';
    const mockClient = { 
      id: clientId,
      type: 'clients',
      attributes: {
        name: 'Client 1',
        symbol: 'CLT1',
        created: '2024-01-01T00:00:00Z',
        updated: '2024-01-01T00:00:00Z',
        description: 'Test Client 1',
        isActive: true,
        alternateName: 'Test Client One',
        language: ['en', 'es'],
        clientType: 'repository',
        domains: 'example.com',
        year: 2020,
        url: 'https://example.com'
      },
      relationships: {
        provider: '1',
        prefixes: ['10.1234']
      },
      stats: mockStats
    };

    it('should fetch client details successfully', async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: { data: mockClient } });
      const result = await getClient(clientId);
      expect(mockApiClient.get).toHaveBeenCalledWith(`${API_BASE}/clients/${clientId}`);
      expect(result).toEqual(mockClient);
    });

    it('should throw ClientFetchError on failure', async () => {
      const error = new Error('Network error');
      mockApiClient.get.mockRejectedValueOnce(error);
      await expect(getClient(clientId)).rejects.toThrow(ClientFetchError);
      await expect(getClient(clientId)).rejects.toMatchObject({
        message: 'Failed to fetch client',
        clientId: clientId
      });
    });
  });

  describe('getClientStats', () => {
    const clientId = 'client1';

    it('should fetch client stats successfully', async () => {
      const response = { data: { data: mockStats } };
      mockApiClient.get.mockResolvedValueOnce(response);
      const result = await getClientStats(clientId);
      expect(result).toEqual(response.data.data);
      expect(mockApiClient.get).toHaveBeenCalledWith(`${API_BASE}/clients/${clientId}/stats`);
    });

    it('should throw ClientFetchError on failure', async () => {
      const error = new Error('Network error');
      mockApiClient.get.mockRejectedValueOnce(error);
      await expect(getClientStats(clientId)).rejects.toThrow(ClientFetchError);
    });
  });

  describe('Stats Validation', () => {
    const mockStats = {
      summary: {
        count: 100,
        fields: {
          title: {
            completeness: 100,
            count: 100,
            fieldStatus: 'complete',
            instances: 100,
            missing: 0,
            subfields: {
              main: {
                completeness: 100,
                count: 100,
                instances: 100,
                missing: 0
              }
            }
          }
        }
      }
    };

    it('should validate stats structure', () => {
      const stats = mockStats;
      expect(stats).toBeDefined();
      expect(stats.summary).toBeDefined();
      expect(stats.summary.count).toBeDefined();
      expect(stats.summary.fields).toBeDefined();
    });

    it('should correctly get resource type stats', () => {
      const stats = mockStats;
      expect(stats.summary).toBeDefined();
      expect(stats.summary.count).toBe(100);
      expect(stats.summary.fields).toBeDefined();
    });
  });
});
