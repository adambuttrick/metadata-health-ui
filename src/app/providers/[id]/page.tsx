import { ProviderDetails } from '@/components/providers/provider-details';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { PageLayout } from '@/components/layout/page-layout';
import { Suspense } from 'react';

export default async function ProviderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={
      <PageLayout
        variant="wide"
      >
        <LoadingOverlay isLoading={true} message="Loading provider details...">
          <div className="h-72 sm:h-96" />
        </LoadingOverlay>
      </PageLayout>
    }>
      <PageLayout
        variant="wide"
      >
        <ProviderDetails providerId={resolvedParams.id} />
      </PageLayout>
    </Suspense>
  );
}
