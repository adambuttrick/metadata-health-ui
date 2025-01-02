import { render, screen, fireEvent } from '@testing-library/react';
import { ProviderClients } from '../../../components/providers/provider-clients';
import { Client, StatsView } from '../../../lib/types/entities';

jest.mock('../../../components/common/field-stats', () => ({
  FieldStats: ({ stats, viewMode }: { stats: StatsView; viewMode: string }) => (
    <div data-testid="field-stats">
      Mode: {viewMode}
      Stats: {JSON.stringify(stats)}
    </div>
  ),
}));

jest.mock('../../../components/common/entity-metrics', () => ({
  EntityMetrics: ({ entity }: { entity: Client }) => (
    <div data-testid="entity-metrics">
      {entity.type === 'providers' ? `Provider: ${entity.attributes.name}` : `Client: ${entity.attributes.name}`}
    </div>
  ),
}));

const mockClients: Client[] = [
  {
    id: 'client1',
    type: 'clients',
    attributes: {
      name: 'Test Client 1',
      symbol: 'TEST1',
      stats: {
        all: {
          count_dois: 100,
          count_repositories: 1
        },
        mandatory_fields: {
          total: 100,
          missing: 20
        },
        recommended_fields: {
          total: 50,
          missing: 20
        }
      },
      metadata_health: {
        completeness: 0.8,
        accuracy: 0.75
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    relationships: {
      provider: 'provider1'
    }
  },
  {
    id: 'client2',
    type: 'clients',
    attributes: {
      name: 'Test Client 2',
      symbol: 'TEST2',
      stats: {
        all: {
          count_dois: 200,
          count_repositories: 1
        },
        mandatory_fields: {
          total: 100,
          missing: 10
        },
        recommended_fields: {
          total: 50,
          missing: 15
        }
      },
      metadata_health: {
        completeness: 0.9,
        accuracy: 0.85
      },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    relationships: {
      provider: 'provider1'
    }
  }
];

describe('ProviderClients', () => {
  const defaultProps = {
    clients: mockClients,
    fieldStatsView: 'summary' as const,
  };

  it('renders client selection dropdown', () => {
    render(<ProviderClients {...defaultProps} />);
    
    expect(screen.getByText('Select a repository')).toBeInTheDocument();
    expect(screen.getByText('Select a repository')).toBeInTheDocument();
  });

  it('displays client names in dropdown', () => {
    render(<ProviderClients {...defaultProps} />);
    
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    mockClients.forEach(client => {
      const option = screen.getByText(client.attributes.name);
      expect(option).toBeInTheDocument();
    });
  });

  it('calls onClientSelect when a client is selected', () => {
    const onClientSelect = jest.fn();
    render(<ProviderClients {...defaultProps} onClientSelect={onClientSelect} />);
    
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    const option = screen.getByText('Test Client 1');
    fireEvent.click(option);
    
    expect(onClientSelect).toHaveBeenCalledWith('client1');
  });

  it('displays selected client details', () => {
    const selectedClient = mockClients[0];
    render(
      <ProviderClients
        {...defaultProps}
        selectedClient={selectedClient}
      />
    );
    
    expect(screen.getByRole('heading', { name: 'Test Client 1', level: 3 })).toBeInTheDocument();
    expect(screen.getByText(selectedClient.id, { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByTestId('entity-metrics')).toBeInTheDocument();
    expect(screen.getByTestId('field-stats')).toBeInTheDocument();
  });

  it('displays details link for selected client', () => {
    const selectedClient = mockClients[0];
    render(
      <ProviderClients
        {...defaultProps}
        selectedClient={selectedClient}
      />
    );
    
    const link = screen.getByRole('link', { name: 'View Details' });
    expect(link).toHaveAttribute(
      'href',
      `/providers/${selectedClient.relationships?.provider}?client=${selectedClient.id}`
    );
  });

  it('passes correct view mode to FieldStats', () => {
    const selectedClient = mockClients[0];
    render(
      <ProviderClients
        {...defaultProps}
        selectedClient={selectedClient}
        fieldStatsView="detailed"
      />
    );
    
    const fieldStats = screen.getByTestId('field-stats');
    expect(fieldStats).toHaveTextContent('Mode: detailed');
  });

  it('handles clients without names', () => {
    const clientsWithoutNames = [
      {
        ...mockClients[0],
        attributes: {
          ...mockClients[0].attributes,
          name: undefined
        }
      }
    ];
    
    render(
      <ProviderClients
        {...defaultProps}
        clients={clientsWithoutNames}
        selectedClient={clientsWithoutNames[0]}
      />
    );
    
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    // When there's no name, it should display the client ID in the select trigger
    expect(trigger).toHaveTextContent(clientsWithoutNames[0].id);
  });
});
