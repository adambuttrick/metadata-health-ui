import { Suspense } from 'react';
import { EntitySearch } from '@/components/common/entity-search';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { Text } from '@/components/typography/typography';

export default function Home() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
        <div>
          <Text variant="h1" className="text-3xl font-bold text-datacite-dark-blue text-center mb-8 sm:mb-12">
            Search Organizations and Repositories
          </Text>
        </div>
        <div className="relative">
          <Suspense fallback={
            <LoadingOverlay isLoading={true} message="Loading search...">
              <div className="h-72 sm:h-96" />
            </LoadingOverlay>
          }>
            <EntitySearch mode="navigation" className="max-w-2xl mx-auto" />
          </Suspense>
        </div>

        <div className="mt-6 sm:mt-8">
          <Text variant="body" className="text-center text-datacite-dark-blue mt-2 text-sm sm:text-base">
            Search for organizations or repositories to view their metadata health statistics
          </Text>
        </div>
      </div>
    </div>
  );
}