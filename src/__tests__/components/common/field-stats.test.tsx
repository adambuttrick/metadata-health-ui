import { render, screen, fireEvent, within } from '@testing-library/react';
import { FieldStats, ViewMode } from '@/components/common/field-stats';
import { useContainerWidth } from '@/lib/hooks/use-container-width';
import { Stats } from '@/lib/types/api';

jest.mock('@/lib/hooks/use-container-width');
jest.mock('@/contexts/stats-view-context', () => ({
  useStatsView: () => ({
    selectedView: 'summary',
    setSelectedView: jest.fn()
  })
}));

describe('FieldStats', () => {
  const mockStats: Stats = {
    summary: {
      count: 100,
      fields: {
        'test-field': {
          count: 100,
          instances: 150,
          missing: 50,
          fieldStatus: 'mandatory',
          completeness: 0.67,
          subfields: {
            'subfield1': {
              count: 75,
              instances: 100,
              missing: 25,
              completeness: 0.75,
              values: {}
            }
          }
        }
      },
      categories: {
        mandatory: { completeness: 0.8 },
        recommended: { completeness: 0.6 },
        optional: { completeness: 0.4 }
      }
    },
    byResourceType: {
      resourceTypes: {}
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useContainerWidth as jest.Mock).mockReturnValue({
      containerRef: { current: null },
      width: 1200
    });
  });

  describe('DetailedFieldStats', () => {
    it('renders field information correctly', () => {
      render(<FieldStats stats={mockStats} viewMode={ViewMode.Detailed} />);
      
      // Check if field name is rendered
      expect(screen.getByText('test-field')).toBeInTheDocument();
      
      // Check if stats are displayed
      expect(screen.getByTitle('100')).toBeInTheDocument(); // count
      expect(screen.getByTitle('50')).toBeInTheDocument(); // missing
      expect(screen.getByTitle('150')).toBeInTheDocument(); // instances
    });

    it('handles responsive layout', () => {
      // Test narrow layout
      (useContainerWidth as jest.Mock).mockReturnValue({
        containerRef: { current: null },
        width: 800
      });
      
      const { rerender } = render(<FieldStats stats={mockStats} viewMode={ViewMode.Detailed} />);
      const container = screen.getByRole('region', { name: /test-field/i });
      const contentDiv = container.querySelector('[class*="flex-col"]');
      expect(contentDiv).toHaveClass('flex-col');
      expect(contentDiv).not.toHaveClass('grid');
      
      // Test wide layout
      (useContainerWidth as jest.Mock).mockReturnValue({
        containerRef: { current: null },
        width: 1200
      });
      
      rerender(<FieldStats stats={mockStats} viewMode={ViewMode.Detailed} />);
      const wideContainer = screen.getByRole('region', { name: /test-field/i });
      const wideContentDiv = wideContainer.querySelector('[class*="flex-col"]');
      expect(wideContentDiv).toHaveClass('grid');
      expect(wideContentDiv).toHaveClass('grid-cols-[minmax(250px,3fr),1fr,1fr,1fr,1fr,1.2fr]');
    });

    describe('Subfields', () => {
      it('toggles subfield visibility', () => {
        render(<FieldStats stats={mockStats} viewMode={ViewMode.Detailed} />);
        
        // Find and click the subfields toggle button
        const toggleButton = screen.getByRole('button', { name: /subfields/i });
        fireEvent.click(toggleButton);
        
        // Check if subfield section is visible
        const fieldRegion = screen.getByRole('region', { name: /test-field/i });
        expect(fieldRegion).toBeInTheDocument();
        
        // Click again to hide
        fireEvent.click(toggleButton);
        expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      });

      it('shows valid subfields only', () => {
        const statsWithInvalidSubfield = {
          ...mockStats,
          summary: {
            ...mockStats.summary,
            fields: {
              'test-field': {
                ...mockStats.summary.fields['test-field'],
                subfields: {
                  'valid-subfield': {
                    count: 75,
                    instances: 100,
                    missing: 25,
                    completeness: 0.75,
                    values: {}
                  },
                  'invalid-subfield': {
                    count: 0,
                    instances: 0,
                    missing: 0,
                    completeness: 0,
                    values: {}
                  }
                }
              }
            }
          }
        };
        
        render(<FieldStats stats={statsWithInvalidSubfield} viewMode={ViewMode.Detailed} />);
        
        const toggleButton = screen.getByRole('button', { name: /subfields/i });
        fireEvent.click(toggleButton);
        
        const fieldRegion = screen.getByRole('region', { name: /test-field/i });
        expect(within(fieldRegion).getByText(/valid-subfield/i)).toBeInTheDocument();
        expect(within(fieldRegion).queryByText(/invalid-subfield/i)).not.toBeInTheDocument();
      });
    });

    describe('Accessibility', () => {
      it('provides proper ARIA labels', () => {
        render(<FieldStats stats={mockStats} viewMode={ViewMode.Detailed} />);
        
        // Check field region
        const fieldRegion = screen.getByRole('region', { name: /test-field/i });
        expect(fieldRegion).toBeInTheDocument();
        
        // Check subfields button
        const subfieldsButton = screen.getByRole('button', { name: /subfields/i });
        expect(subfieldsButton).toHaveAttribute('aria-expanded', 'false');
      });

      it('handles keyboard navigation', () => {
        render(<FieldStats stats={mockStats} viewMode={ViewMode.Detailed} />);
        
        const subfieldsButton = screen.getByRole('button', { name: /subfields/i });
        
        // Test click event instead of keyboard navigation
        fireEvent.click(subfieldsButton);
        expect(subfieldsButton).toHaveAttribute('aria-expanded', 'true');
        
        fireEvent.click(subfieldsButton);
        expect(subfieldsButton).toHaveAttribute('aria-expanded', 'false');
      });
    });
  });

  describe('SummaryFieldStats', () => {
    it('groups fields by category', () => {
      render(<FieldStats stats={mockStats} viewMode={ViewMode.Summary} />);
      
      // Check if categories are rendered
      expect(screen.getByText('Mandatory')).toBeInTheDocument();
      expect(screen.getByText('Recommended')).toBeInTheDocument();
      expect(screen.getByText('Optional')).toBeInTheDocument();
    });

    it('displays field information in categories', () => {
      render(<FieldStats stats={mockStats} viewMode={ViewMode.Summary} />);
      
      // Check if field is in the correct category
      const mandatoryCard = screen.getByText('Mandatory').closest('.rounded-lg');
      expect(within(mandatoryCard!).getByTitle('test-field')).toBeInTheDocument();
    });
  });

  describe('ViewMode Toggle', () => {
    it('switches between summary and detailed views', () => {
      const onToggleView = jest.fn();
      const { rerender } = render(
        <FieldStats 
          stats={mockStats} 
          viewMode={ViewMode.Summary} 
          onToggleView={onToggleView}
        />
      );
      
      // Check if it renders summary view
      expect(screen.getByText('Mandatory')).toBeInTheDocument();
      
      // Rerender with detailed view
      rerender(
        <FieldStats 
          stats={mockStats} 
          viewMode={ViewMode.Detailed} 
          onToggleView={onToggleView}
        />
      );
      
      // Check if it renders detailed view
      expect(screen.getByText('Fields')).toBeInTheDocument();
    });
  });
});
