import { render, screen, fireEvent } from '@testing-library/react';
import { StatsSelector } from '@/components/stats/stats-selector';
import { StatsViewProvider } from '@/contexts/stats-view-context';
import { useSearchParams, useRouter } from 'next/navigation';
import { Stats } from '@/lib/types/api';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

describe('StatsSelector', () => {
  const mockRouter = {
    replace: jest.fn(),
  };

  const mockSearchParams = new URLSearchParams();
  mockSearchParams.toString = jest.fn().mockReturnValue('');
  mockSearchParams.get = jest.fn().mockReturnValue(null);

  beforeEach(() => {
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (stats?: Stats) => {
    return render(
      <StatsViewProvider>
        <StatsSelector stats={stats} />
      </StatsViewProvider>
    );
  };

  it('should not render when stats is undefined', () => {
    renderComponent(undefined);
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('should show only summary view when no resource types are available', () => {
    const stats = {
      all: {
        count_dois: 100,
        mandatory_fields: {
          total: 100,
          missing: 20
        }
      }
    };

    renderComponent(stats);
    
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    const allOption = screen.getByRole('option', { name: 'All' });
    expect(allOption).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'Dataset' })).not.toBeInTheDocument();
  });

  it('should show available resource types in selector', () => {
    const stats = {
      all: {
        count_dois: 100
      },
      byResourceType: {
        resourceTypes: {
          dataset: {
            count: 50,
            mandatory_fields: {
              total: 50,
              missing: 10
            }
          },
          software: {
            count: 50,
            mandatory_fields: {
              total: 50,
              missing: 5
            }
          }
        }
      }
    };

    renderComponent(stats);
    
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    expect(screen.getByRole('option', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'dataset' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'software' })).toBeInTheDocument();
  });

  it('should filter out resource types with no items', () => {
    const stats = {
      all: {
        count_dois: 100
      },
      byResourceType: {
        resourceTypes: {
          dataset: {
            count: 100,
            mandatory_fields: {
              total: 100,
              missing: 20
            }
          },
          software: {
            count: 0,
            mandatory_fields: {
              total: 0,
              missing: 0
            }
          }
        }
      }
    };

    renderComponent(stats);
    
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    expect(screen.getByRole('option', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'dataset' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'software' })).not.toBeInTheDocument();
  });

  it('should update URL when view is changed', () => {
    const stats = {
      all: {
        count_dois: 100
      },
      byResourceType: {
        resourceTypes: {
          dataset: {
            count: 100,
            mandatory_fields: {
              total: 100,
              missing: 20
            }
          }
        }
      }
    };

    renderComponent(stats);
    
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    
    const datasetOption = screen.getByRole('option', { name: 'dataset' });
    fireEvent.click(datasetOption);
    
    expect(mockRouter.replace).toHaveBeenCalledWith('?view=dataset', { scroll: false });
  });

  it('should sync with URL parameters on mount', () => {
    mockSearchParams.get.mockReturnValue('dataset');
    
    const stats = {
      all: {
        count_dois: 100
      },
      byResourceType: {
        resourceTypes: {
          dataset: {
            count: 100,
            mandatory_fields: {
              total: 100,
              missing: 20
            }
          }
        }
      }
    };

    renderComponent(stats);
    
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveTextContent('dataset');
  });

  it('should revert to summary view if URL parameter is invalid', () => {
    mockSearchParams.get.mockReturnValue('invalid_view');
    
    const stats = {
      all: {
        count_dois: 100
      },
      byResourceType: {
        resourceTypes: {
          dataset: {
            count: 100,
            mandatory_fields: {
              total: 100,
              missing: 20
            }
          }
        }
      }
    };

    renderComponent(stats);
    
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveTextContent('All');
  });
});
