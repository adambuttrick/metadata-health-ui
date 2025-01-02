'use client';

import { Entity, FieldStatus } from '@/lib/types/api';
import { MetricCard } from '@/components/ui/metric-card';
import { useStatsView } from '@/contexts/stats-view-context';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { Text } from '@/components/typography/typography';

interface EntityMetricsProps {
  entity: Entity | undefined;
}

export function EntityMetrics({ entity }: EntityMetricsProps) {
  const { selectedView } = useStatsView();

  if (!entity || !entity.stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LoadingOverlay isLoading={true}>
          <Text variant="body">Loading metrics...</Text>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-[140px]" />
            <div className="h-[140px]" />
            <div className="h-[140px]" />
          </div>
        </LoadingOverlay>
      </div>
    );
  }

  const statsView = selectedView === 'summary' 
    ? entity.stats.summary 
    : entity.stats.byResourceType?.resourceTypes?.[selectedView] ?? entity.stats.summary;

  if (!statsView || !statsView.categories) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LoadingOverlay isLoading={true}>
          <Text variant="body">Loading metrics...</Text>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-[140px]" />
            <div className="h-[140px]" />
            <div className="h-[140px]" />
          </div>
        </LoadingOverlay>
      </div>
    );
  }

  const getCompletenessForStatus = (status: FieldStatus): number => {
    return statsView.categories[status].completeness;
  };

  const mandatoryCompleteness = getCompletenessForStatus('mandatory');
  const recommendedCompleteness = getCompletenessForStatus('recommended');
  const optionalCompleteness = getCompletenessForStatus('optional');

  return (
    <div className="grid gap-6 md:grid-cols-3 max-w-[1420px] mx-auto px-4 py-6 text-[#2e4053]">
      <MetricCard
        fieldStatus="mandatory"
        completeness={mandatoryCompleteness}
        className="bg-white shadow-sm hover:shadow-md transition-shadow"
      />
      <MetricCard
        fieldStatus="recommended"
        completeness={recommendedCompleteness}
        className="bg-white shadow-sm hover:shadow-md transition-shadow"
      />
      <MetricCard
        fieldStatus="optional"
        completeness={optionalCompleteness}
        className="bg-white shadow-sm hover:shadow-md transition-shadow"
      />
    </div>
  );
}