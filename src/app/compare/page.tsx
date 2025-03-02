'use client';

import React, { useState } from 'react';
import ComparisonCard from '@/components/compare/comparison-card';
import { Provider, Client } from '@/lib/types/api';
import { useProviders, useClients } from '@/lib/hooks/use-entities';
import { EntitySearch } from '@/components/common/entity-search';
import { StatsViewProvider } from '@/contexts/stats-view-context';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div>
          <Text variant="h1" className="text-3xl font-bold text-datacite-dark-blue text-center mb-8 sm:mb-12">
            Compare Organizations and Repositories
          </Text>
        </div>
        <LoadingOverlay 
          isLoading={true} 
          message="Loading data..."
        >
          <div className="h-72 sm:h-96" />
        </LoadingOverlay>
      </div>
    );
  }

  return (
    <StatsViewProvider>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Search section with constrained width */}
        <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8 mb-8">
          <div>
            <Text variant="h1" className="text-3xl font-bold text-datacite-dark-blue text-center mb-8 sm:mb-12">
              Compare Organizations and Repositories
            </Text>
          </div>
          <Stack spacing="md">
            <div className="w-full">
              <div className="relative flex flex-col sm:flex-row gap-4 items-start">
                <div className="w-full">
                  <EntitySearch 
                    mode="selection"
                    selectedItems={selectedItems}
                    onSelect={handleAddComparison}
                    className="w-full"
                  />
                </div>
                {selectedItems.length > 0 && (
                  <>
                    {/* Desktop view - button appears inline */}
                    <button
                      onClick={() => setSelectedItems([])}
                      className="hidden sm:block shrink-0 px-4 py-2 text-sm font-medium text-white bg-destructive hover:bg-destructive/90 rounded-md transition-colors whitespace-nowrap"
                    >
                      Clear All
                    </button>
                    {/* Mobile view - button appears centered below */}
                    <div className="w-full flex justify-center sm:hidden">
                      <button
                        onClick={() => setSelectedItems([])}
                        className="px-4 py-2 text-sm font-medium text-white bg-destructive hover:bg-destructive/90 rounded-md transition-colors whitespace-nowrap mt-2"
                      >
                        Clear All
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Stack>

          {selectedItems.length === 0 && (
            <div className="mt-2 sm:mt-4">
              <Text variant="body" className="text-center text-datacite-dark-blue text-sm sm:text-base">
                Search for organizations or repositories to compare their metadata health statistics
              </Text>
            </div>
          )}
        </div>

        {/* Cards section with full width */}
        <div className="w-full">
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

          {selectedItems.length >= 9 && (
            <div className="mt-6 sm:mt-8">
              <Text variant="body" className="text-center text-datacite-dark-blue mt-2 text-sm sm:text-base font-medium">
                Maximum of 9 items can be compared at once
              </Text>
            </div>
          )}
        </div>
      </div>
    </StatsViewProvider>
  );
}
