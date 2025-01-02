import React from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {},
    },
  })
}

export function renderWithClient(ui: React.ReactElement) {
  const testQueryClient = createTestQueryClient()
  return {
    ...render(
      <QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>
    ),
    testQueryClient,
  }
}

describe('Test utilities', () => {
  test('createTestQueryClient creates a client with expected configuration', () => {
    const client = createTestQueryClient()
    expect(client).toBeDefined()
    expect(client.getDefaultOptions().queries?.retry).toBe(false)
  })

  test('renderWithClient returns both render result and query client', () => {
    const TestComponent = () => <div>Test</div>
    const { container, testQueryClient } = renderWithClient(<TestComponent />)
    expect(container).toBeDefined()
    expect(testQueryClient).toBeDefined()
  })
})
