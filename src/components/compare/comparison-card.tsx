'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  getFieldDescription, 
  getFieldDisplayLabel,
  getTextColor,
  getCategoryColor,
  getFieldUrl
} from '@/lib/constants';
import { ChevronDown, ChevronUp, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCompleteness } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from 'next/link';
import { useClientStats, useProviderStats } from '@/lib/hooks/use-entities';
import { useStatsView } from '@/contexts/stats-view-context';
import { StatsView, FieldInfo, FieldStatus } from '@/lib/types/api';
import { Text } from '@/components/typography/typography';

type SectionType = FieldStatus;

type ComparisonCardProps =
  | {
      name: string;
      itemType: 'provider';
      id: string;
      onRemove?: () => void;
      providerId?: never;
    }
  | {
      name: string;
      itemType: 'client';
      id: string;
      providerId: string;
      onRemove?: () => void;
    };

const isValidFieldInfo = (info: unknown): info is FieldInfo => {
  if (!info || typeof info !== 'object') return false;
  const field = info as Record<string, unknown>;
  return (
    'fieldStatus' in field &&
    'completeness' in field &&
    typeof field.completeness === 'number'
  );
};

const isStatsView = (stats: unknown): stats is StatsView => {
  if (stats === null || stats === undefined) return false;
  if (typeof stats !== 'object') return false;
  const obj = stats as Record<string, unknown>;
  return (
    'fields' in obj &&
    'count' in obj &&
    typeof obj.count === 'number' &&
    typeof obj.fields === 'object' &&
    obj.fields !== null &&
    Object.values(obj.fields).every(isValidFieldInfo)
  );
};

const ComparisonCard: React.FC<ComparisonCardProps> = ({
  name,
  onRemove,
  itemType,
  id,
  providerId,
}) => {
  const { selectedView } = useStatsView();
  const { data: clientData, isLoading: isClientLoading } = useClientStats(itemType === 'client' ? id : '');
  const { data: providerData, isLoading: isProviderLoading } = useProviderStats(itemType === 'provider' ? id : '');
  const titleRef = useRef<HTMLDivElement>(null);
  const [isTitleTruncated, setIsTitleTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      if (titleRef.current) {
        setIsTitleTruncated(
          titleRef.current.scrollWidth > titleRef.current.clientWidth ||
          titleRef.current.scrollHeight > titleRef.current.clientHeight
        );
      }
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [name]);

  const statsData = itemType === 'client' ? clientData : providerData;
  const isLoading = itemType === 'client' ? isClientLoading : isProviderLoading;

  const viewStats = statsData?.stats.summary;
  const resourceTypeStats = selectedView !== 'summary' ? 
    statsData?.stats.byResourceType?.resourceTypes[selectedView] : 
    undefined;

  const currentStats = resourceTypeStats || viewStats;

  const [expandedSections, setExpandedSections] = useState<Record<SectionType, boolean>>({
    mandatory: false,
    recommended: false,
    optional: false
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 relative">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!currentStats || !isStatsView(currentStats)) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 relative border-2 border-gray-200">
        <Text variant="body">Invalid or missing stats data</Text>
      </div>
    );
  }

  const groupedFields = Object.entries(currentStats.fields).reduce<Record<SectionType, Record<string, FieldInfo>>>((acc, [fieldName, fieldInfo]) => {
    const status = fieldInfo.fieldStatus as SectionType;
    if (!acc[status]) {
      acc[status] = {};
    }
    if (isValidFieldInfo(fieldInfo)) {
      acc[status][fieldName] = fieldInfo;
    }
    return acc;
  }, {
    mandatory: {},
    recommended: {},
    optional: {}
  });

  return (
    <div 
      className="bg-white rounded-lg shadow-lg p-6 pt-12 relative border-2 border-gray-200 flex flex-col"
      role="region"
      aria-label={`Comparison card for ${name}`}
    >
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full transition-colors border border-gray-300"
          aria-label={`Remove ${name} from comparison`}
        >
          <X className="h-4 w-4 text-gray-700" aria-hidden="true" />
        </button>
      )}

      <div className="min-h-[120px] flex flex-col justify-between">
        <div className="flex flex-col gap-3 pb-4 border-b border-border w-full">
          <div className="pr-8">
            <div className="w-full">
              {isTitleTruncated ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Text 
                        variant="h2" 
                        id={`comparison-title-${id}`} 
                        className="text-left line-clamp-2 text-base font-semibold max-w-full"
                        ref={titleRef}
                      >
                        {name}
                      </Text>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <span className="text-sm">{name}</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Text 
                  variant="h2" 
                  id={`comparison-title-${id}`} 
                  className="text-left line-clamp-2 text-base font-semibold max-w-full"
                  ref={titleRef}
                >
                  {name}
                </Text>
              )}
            </div>
          </div>
          <Link 
            href={itemType === 'provider' ? `/providers/${id}` : `/providers/${providerId}?client=${id}`}
            className="text-sm text-muted-foreground hover:text-primary hover:underline inline-flex items-center mt-auto"
            aria-describedby={`comparison-title-${id}`}
          >
            <Text variant="small">
              View {itemType === 'provider' ? 'Organization' : 'Repository'} details
              <span className="sr-only"> for {name}</span>
            </Text>
          </Link>
        </div>
      </div>

      <div className="mt-4 space-y-6" role="list" aria-label="Metadata completeness statistics">
        {(['mandatory', 'recommended', 'optional'] as const).map((status: FieldStatus) => {
          const fields = groupedFields[status] || {};
          const fieldEntries = Object.entries(fields);
          if (fieldEntries.length === 0) return null;

          const avgCompleteness = fieldEntries.reduce((sum, [, info]) => 
            sum + info.completeness, 0) / fieldEntries.length;

          return (
            <div key={status} className="space-y-8">
              <button 
                onClick={() => setExpandedSections(prev => ({...prev, [status]: !prev[status]}))}
                className="w-full text-left"
                aria-expanded={expandedSections[status]}
                aria-controls={`${status}-details`}
              >
                <div className="flex justify-between items-center mb-6">
                  <Text variant="body" className="font-medium text-datacite-dark-blue capitalize">
                    {status}
                  </Text>
                  <div className="flex items-center gap-2">
                    <Text 
                      variant="body" 
                      className={cn("font-medium", getTextColor(status, avgCompleteness))}
                      aria-label={`Completeness: ${formatCompleteness(avgCompleteness)}`}
                    >
                      {formatCompleteness(avgCompleteness)}
                    </Text>
                    {expandedSections[status] ? (
                      <ChevronUp className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    )}
                  </div>
                </div>

                <div 
                  className="h-2 bg-primary/20 rounded-full"
                  role="progressbar"
                  aria-valuenow={avgCompleteness * 100}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all",
                      getCategoryColor(status, avgCompleteness)
                    )}
                    style={{ width: `${avgCompleteness * 100}%` }}
                  />
                </div>
              </button>

              {expandedSections[status] && (
                <div 
                  id={`${status}-details`}
                  className="mt-8 mb-12 space-y-8"
                >
                  {fieldEntries.map(([fieldName, fieldInfo], index, array) => (
                    <div key={fieldName}>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Text variant="body" className="font-medium">
                              {getFieldDisplayLabel(fieldName)}
                            </Text>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button 
                                    className="inline-flex flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    aria-label={`Information about ${getFieldDisplayLabel(fieldName)}`}
                                  >
                                    <Info className="h-4 w-4 text-gray-700" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs sm:text-sm text-gray-700 whitespace-normal break-words text-popover max-w-xs">
                                  {getFieldDescription(fieldName)}
                                  {getFieldUrl(fieldName) && (
                                    <a
                                      href={getFieldUrl(fieldName)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-700 hover:underline block mt-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                      aria-label={`Learn more about ${getFieldDisplayLabel(fieldName)} (opens in new tab)`}
                                    >
                                      Learn more
                                    </a>
                                  )}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <Text 
                            variant="body" 
                            className={cn("font-medium", getTextColor(status, fieldInfo.completeness))}
                          >
                            {formatCompleteness(fieldInfo.completeness)}
                          </Text>
                        </div>

                        <div 
                          className="h-1.5 bg-primary/20 rounded-full"
                          role="progressbar"
                          aria-valuenow={fieldInfo.completeness * 100}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className={cn(
                              "h-1.5 rounded-full transition-all",
                              getCategoryColor(status, fieldInfo.completeness)
                            )}
                            style={{ width: `${fieldInfo.completeness * 100}%` }}
                          />
                        </div>

                        <div className="flex justify-center text-xs text-gray-700">
                          <Text variant="small">{fieldInfo.count.toLocaleString()} / {(fieldInfo.count + fieldInfo.missing).toLocaleString()}</Text>
                        </div>
                      </div>
                      {index < array.length - 1 && (
                        <div className="border-b border-gray-200 my-4" role="separator" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComparisonCard;
