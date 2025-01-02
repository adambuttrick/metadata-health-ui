import { render, screen, waitFor } from '@testing-library/react'
import { ProviderDetails } from '@/components/providers/provider-details'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as endpoints from '@/lib/api/endpoints'
import { StatsViewProvider } from '@/contexts/stats-view-context'

jest.mock('@/lib/api/endpoints')
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn()
  }),
  useSearchParams: () => ({
    get: jest.fn((param) => {
      if (param === 'client') return null
      if (param === 'view') return null
      return null
    })
  })
}))

jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => <div role="tablist">{children}</div>,
  TabsTrigger: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <button role="tab" data-value={value}>{children}</button>
  )
}))

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, onValueChange, value }: { children: React.ReactNode; onValueChange?: (value: string) => void; value?: string }) => (
    <div data-value={value} onChange={onValueChange}>{children}</div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <button type="button" role="combobox" aria-controls="radix-select-content" aria-expanded="false" aria-label="Select option">
      {children}
    </button>
  ),
  SelectValue: ({ children, placeholder }: { children: React.ReactNode; placeholder?: string }) => (
    <span>{placeholder || children}</span>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div id="radix-select-content" role="listbox">
      {children}
    </div>
  ),
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div role="option" aria-selected="false" data-value={value}>
      {children}
    </div>
  )
}))

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>
}))

jest.mock('@/components/typography/typography', () => ({
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>
}))

jest.mock('@/components/layout/stack', () => ({
  Stack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

jest.mock('@/components/common/entity-metrics', () => ({
  EntityMetrics: () => <div>Entity Metrics</div>
}))

jest.mock('@/components/common/resource-type-stats', () => ({
  ResourceTypeStats: () => <div>Resource Type Stats</div>
}))

jest.mock('@/components/stats/stats-selector', () => ({
  StatsSelector: () => <div>Stats Selector</div>
}))

const mockProvider = {
  id: 'test-id',
  attributes: {
    name: 'Test Provider',
    memberType: 'MEMBER'
  },
  stats: {
    total_records: 1000,
    resource_types: {
      dataset: 500,
      software: 300,
      other: 200
    }
  }
}

const mockClient = {
  id: 'client-1',
  attributes: {
    name: 'Test Client',
    provider_id: 'test-id'
  },
  stats: {
    total_records: 100,
    resource_types: {
      dataset: 50,
      software: 30,
      other: 20
    }
  }
}

describe('ProviderDetails', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
        staleTime: 0
      },
    },
  })
  
  beforeEach(() => {
    queryClient.clear()
    jest.clearAllMocks()
    ;(endpoints.getProviderDetails as jest.Mock).mockResolvedValue(mockProvider)
    ;(endpoints.getProviderClientsList as jest.Mock).mockResolvedValue([mockClient])
    ;(endpoints.getClient as jest.Mock).mockResolvedValue(mockClient)
    ;(endpoints.getClientStats as jest.Mock).mockResolvedValue(mockClient)
  })

  const renderComponent = (providerId: string = 'test-id') => {
    return render(
      <QueryClientProvider client={queryClient}>
        <StatsViewProvider>
          <ProviderDetails providerId={providerId} />
        </StatsViewProvider>
      </QueryClientProvider>
    )
  }

  describe('Loading States', () => {
    it('should render loading state initially', async () => {
      renderComponent()
      expect(screen.getByText(/Loading provider data/i)).toBeInTheDocument()
    })
  })

  describe('Basic Rendering', () => {
    it('should render provider details when data is loaded', async () => {
      renderComponent()
      
      await waitFor(() => {
        expect(screen.getByText(/Test Provider/i)).toBeInTheDocument()
        expect(screen.getByText(/Member/i)).toBeInTheDocument()
      })
      
      expect(screen.getByText(/Back to Search/i)).toBeInTheDocument()
    })

    it('should render stats selector', async () => {
      renderComponent()
      
      await waitFor(() => {
        expect(screen.getByText(/Stats Selector/i)).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle provider fetch error', async () => {
      ;(endpoints.getProviderDetails as jest.Mock).mockRejectedValueOnce(
        new Error('Failed to fetch')
      )
      
      renderComponent()
      
      await waitFor(() => {
        const errorMessages = screen.getAllByText(/Unable to Load Organization/i)
        expect(errorMessages.length).toBeGreaterThan(0)
      })
    })
  })
})
