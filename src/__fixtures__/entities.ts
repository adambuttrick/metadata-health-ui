import type { Provider, Client, Stats, StatsView } from '@/lib/types/api';

const mockStatsView: StatsView = {
  count: 100,
  fields: {
    title: {
      count: 100,
      instances: 100,
      missing: 0,
      fieldStatus: 'complete',
      completeness: 100,
      subfields: {
        main: {
          count: 100,
          instances: 100,
          missing: 0,
          completeness: 100
        }
      }
    }
  }
};

const mockStats: Stats = {
  summary: mockStatsView,
  byResourceType: {
    resourceTypes: {
      'dataset': mockStatsView,
      'text': mockStatsView
    }
  }
};

export const mockProviders: Provider[] = [
  {
    id: 'provider-1',
    type: 'providers',
    attributes: {
      name: 'Northwestern University',
      symbol: 'NWUU',
      created: '2023-01-01T00:00:00Z',
      updated: '2024-01-01T00:00:00Z',
      description: 'A major research university',
      isActive: true,
      region: 'North America',
      country: 'United States',
      organizationType: 'academic',
      focusArea: 'research',
      nonProfitStatus: 'non-profit',
      year: 1851
    },
    relationships: {
      prefixes: ['10.1000'],
      clients: ['client-1']
    },
    stats: mockStats
  },
  {
    id: 'provider-2',
    type: 'providers',
    attributes: {
      name: 'Zenodo',
      symbol: 'ZNDO',
      created: '2023-01-01T00:00:00Z',
      updated: '2024-01-01T00:00:00Z',
      description: 'Open science repository',
      isActive: true,
      region: 'Europe',
      country: 'Switzerland',
      organizationType: 'non-profit',
      focusArea: 'research',
      nonProfitStatus: 'non-profit',
      year: 2013
    },
    relationships: {
      prefixes: ['10.5281'],
      clients: ['client-2']
    },
    stats: mockStats
  }
];

export const mockClients: Client[] = [
  {
    id: 'client-1',
    type: 'clients',
    attributes: {
      name: 'Northwestern Repository',
      symbol: 'NWUR',
      created: '2023-01-01T00:00:00Z',
      updated: '2024-01-01T00:00:00Z',
      description: 'Northwestern University institutional repository',
      isActive: true,
      alternateName: null,
      language: ['en'],
      clientType: 'repository',
      domains: 'repository.northwestern.edu',
      year: 2015,
      url: 'https://repository.northwestern.edu'
    },
    relationships: {
      provider: 'provider-1',
      prefixes: ['10.1000']
    },
    stats: mockStats
  },
  {
    id: 'client-2',
    type: 'clients',
    attributes: {
      name: 'Zenodo Repository',
      symbol: 'ZNDR',
      created: '2023-01-01T00:00:00Z',
      updated: '2024-01-01T00:00:00Z',
      description: 'Zenodo open science repository',
      isActive: true,
      alternateName: null,
      language: ['en'],
      clientType: 'repository',
      domains: 'zenodo.org',
      year: 2013,
      url: 'https://zenodo.org'
    },
    relationships: {
      provider: 'provider-2',
      prefixes: ['10.5281']
    },
    stats: mockStats
  }
];

export const mockApiResponse = {
  data: mockProviders,
  meta: {
    total: 2,
    totalPages: 1,
    page: 1
  }
};

export const mockApiError = {
  message: 'Resource not found',
  code: 'NOT_FOUND',
  details: {
    resource: 'provider',
    id: 'non-existent-id'
  }
};
