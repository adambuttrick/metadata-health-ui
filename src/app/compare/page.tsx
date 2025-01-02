'use client';

import React, { useState } from 'react';
import ComparisonCard from '@/components/compare/comparison-card';
import { Provider, Client } from '@/lib/types/api';
import { useProviders, useClients } from '@/lib/hooks/use-entities';
import { EntitySearch } from '@/components/common/entity-search';
import { StatsViewProvider } from '@/contexts/stats-view-context';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { PageLayout } from '@/components/layout/page-layout';
import { Stack } from '@/components/layout/stack';
import { Text } from '@/components/typography/typography';

type ItemType = Provider | Client;

export default function ComparePage() {
  const [selectedItems, setSelectedItems] = useState<ItemType[]>([]);
  const { isLoading: isLoadingProviders } = useProviders();
  const { isLoading: isLoadingClients } = useClients();

  const handleAddComparison = (item: ItemType) => {
    if (selectedItems.length >= 9) {
      return;
    }
    setSelectedItems([...selectedItems, item]);
  };

  const handleRemoveComparison = (itemToRemove: ItemType) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemToRemove.id));
  };

  if (isLoadingProviders || isLoadingClients) {
    return (
      <PageLayout
        title="Compare Organizations and Repositories"
        variant="wide"
      >
        <LoadingOverlay 
          isLoading={true} 
          message="Loading data..."
        >
          <div className="h-72 sm:h-96" />
        </LoadingOverlay>
      </PageLayout>
    );
  }

  return (
    <StatsViewProvider>
      <PageLayout
        title="Compare Organizations and Repositories"
        variant="wide"
      >
        <Stack spacing="lg">
          <div className="w-full max-w-2xl mx-auto">
            <Stack spacing="md">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="w-full">
                  <EntitySearch 
                    mode="selection"
                    selectedItems={selectedItems}
                    onSelect={handleAddComparison}
                    className="w-full"
                  />
                </div>
                {selectedItems.length > 0 && (
                  <button
                    onClick={() => setSelectedItems([])}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-destructive hover:bg-destructive/90 rounded-md transition-colors whitespace-nowrap"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </Stack>
          </div>

          <div 
            className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-start"
            data-testid="comparison-grid"
          >
            {selectedItems.map((item) => (
              <div key={item.id} className="flex flex-col">
                {item.type === 'providers' ? (
                  <ComparisonCard
                    name={item.attributes.name}
                    onRemove={() => handleRemoveComparison(item)}
                    itemType="provider"
                    id={item.id}
                  />
                ) : (
                  <ComparisonCard
                    name={item.attributes.name}
                    onRemove={() => handleRemoveComparison(item)}
                    itemType="client"
                    id={item.id}
                    providerId={item.relationships?.provider || ''}
                  />
                )}
              </div>
            ))}
          </div>

          {selectedItems.length === 0 && (
            <Text variant="body" className="text-center text-datacite-dark-blue">
              Search for organizations or repositories to compare their metadata health statistics
            </Text>
          )}
          {selectedItems.length >= 9 && (
            <Text variant="body" className="text-center text-datacite-dark-blue font-medium">
              Maximum of 9 items can be compared at once
            </Text>
          )}
        </Stack>
      </PageLayout>
    </StatsViewProvider>
  );
}
