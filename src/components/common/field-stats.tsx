import { SubfieldInfo, FieldInfo, Stats, StatsView } from '@/lib/types/api';
import { FieldCategory } from '@/lib/constants';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Info, ChevronDown } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatCompleteness } from '@/lib/utils'; 
import { 
  getFieldDescription, 
  getFieldUrl,
  getFieldDisplayLabel,
  getSubfieldDescription,
  getSubfieldDisplayLabel,
  getSubfieldUrl,
  getTextColor,
  getCategoryColor
} from '@/lib/constants';
import { useState } from 'react';
import { useStatsView } from '@/contexts/stats-view-context';
import { Container } from '@/components/layout/container';
import { Stack } from '@/components/layout/stack';
import { Text } from '@/components/typography/typography';
import { useContainerWidth } from '@/lib/hooks/use-container-width';

type ExpandedSubfields = Record<`${string}-${string}`, boolean>;

export enum ViewMode {
  Summary = 'summary',
  Detailed = 'detailed'
}

interface GroupedFields {
  [key: string]: {
    [field: string]: FieldInfo;
  };
}

interface DetailedFieldStatsProps {
  stats: StatsView;
}

interface SummaryFieldStatsProps {
  readonly groupedFields: GroupedFields;
  readonly categories: readonly FieldCategory[];
}

interface FieldStatsProps {
  readonly stats: Stats;
  readonly viewMode: ViewMode;
  readonly onToggleView?: () => void;
}

const getCategoryTitle = (category: string): string => {
  switch (category) {
    case 'mandatory':
      return 'Mandatory';
    case 'recommended':
      return 'Recommended';
    case 'optional':
      return 'Optional';
    default:
      return category;
  }
};


const DetailedFieldStats = ({ stats }: DetailedFieldStatsProps) => {
  const fields = Object.entries(stats?.fields || {})
    .sort(([a], [b]) => a.localeCompare(b));
  const [expandedSubfields, setExpandedSubfields] = useState<ExpandedSubfields>({});
  const { containerRef, width } = useContainerWidth();
  const isNarrow = width > 0 && width < 1024; // Threshold for switching layouts

  const toggleSubfield = (fieldName: string, subfieldName: string): void => {
    const key = `${fieldName}-${subfieldName}` as const;
    setExpandedSubfields(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isSubfieldExpanded = (fieldName: string, subfieldName: string): boolean => {
    const key = `${fieldName}-${subfieldName}` as const;
    return expandedSubfields[key] ?? false;
  };

  const isValidSubfield = (entry: [string, unknown]): entry is [string, SubfieldInfo] => {
    const [, subfieldData] = entry;
    return subfieldData !== null && 
      typeof subfieldData === 'object' && 
      'count' in subfieldData && 
      typeof subfieldData.count === 'number' && 
      subfieldData.count > 0;
  };

  return (
    <Stack spacing="lg" className="w-full">
      <div>
        <Text variant="h2" id="fields-heading">Fields</Text>
        <div className="border-t-2 border-gray-300 my-4" role="separator"></div>
      </div>
      <Stack spacing="md">
        {fields.map(([fieldName, fieldData]) => {
          const completeness = fieldData.completeness;
          const hasSubfields = fieldData.subfields && Object.keys(fieldData.subfields).length > 0;

          return (
            <Card key={fieldName} className="overflow-hidden" role="region" aria-labelledby={`field-${fieldName}`}>
              <CardContent className="p-6">
                <div 
                  ref={containerRef}
                  className={cn(
                    "flex flex-col gap-4",
                    !isNarrow && "grid grid-cols-[minmax(250px,3fr),1fr,1fr,1fr,1fr,1.2fr] gap-4 sm:gap-8"
                  )}
                >
                  {/* Mobile Header - Always Visible */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Text 
                          variant="h3" 
                          className="truncate" 
                          title={getFieldDisplayLabel(fieldName)} 
                          id={`field-${fieldName}`}
                        >
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
                              <a
                                href={getFieldUrl(fieldName)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-700 hover:underline block mt-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                aria-label={`Learn more about ${getFieldDisplayLabel(fieldName)} (opens in new tab)`}
                              >
                                Learn more
                              </a>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    {isNarrow && (
                      <div className="flex items-center gap-2">
                        <div className="space-y-2">
                          <Text variant="small" className="text-gray-700">Completeness</Text>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={completeness * 100} 
                              className="h-2 w-24 bg-primary/20"
                              indicatorClassName={getCategoryColor(fieldData.fieldStatus, completeness)}
                            />
                            <Text 
                              variant="body" 
                              className={cn("font-medium", getTextColor(fieldData.fieldStatus, completeness))}
                            >
                              {formatCompleteness(completeness)}
                            </Text>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t-2 border-gray-300 my-4"></div>

                  {/* Stats Grid */}
                  <div className={cn(
                    "grid gap-4",
                    isNarrow ? "col-span-2" : "contents"
                  )}>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <Text variant="small" className="text-gray-700">Category</Text>
                        <Text 
                          variant="body" 
                          className="font-medium capitalize"
                          title={getCategoryTitle(fieldData.fieldStatus)}
                          aria-label={`Field category: ${getCategoryTitle(fieldData.fieldStatus)}`}
                        >
                          {getCategoryTitle(fieldData.fieldStatus)}
                        </Text>
                      </div>

                      <div className="space-y-1">
                        <Text variant="small" className="text-gray-700">Present</Text>
                        <Text 
                          variant="body" 
                          className="font-medium tabular-nums"
                          title={fieldData.count.toLocaleString()}
                          aria-label={`${fieldData.count.toLocaleString()} records present`}
                        >
                          {fieldData.count.toLocaleString()}
                        </Text>
                      </div>

                      <div className="space-y-1">
                        <Text variant="small" className="text-gray-700">Missing</Text>
                        <Text 
                          variant="body" 
                          className="font-medium tabular-nums"
                          title={fieldData.missing.toLocaleString()}
                          aria-label={`${fieldData.missing.toLocaleString()} missing instances`}
                        >
                          {fieldData.missing.toLocaleString()}
                        </Text>
                      </div>

                      <div className="space-y-1">
                        <Text variant="small" className="text-gray-700">Instances</Text>
                        <Text 
                          variant="body" 
                          className="font-medium tabular-nums"
                          title={fieldData.instances.toLocaleString()}
                          aria-label={`${fieldData.instances.toLocaleString()} instances`}
                        >
                          {fieldData.instances.toLocaleString()}
                        </Text>
                      </div>
                    </div>
                  </div>

                  {/* Subfields Section */}
                  {hasSubfields && fieldData.subfields && Object.values(fieldData.subfields)?.some(subfield => subfield.count > 0) && (
                    <div className={cn(
                      "space-y-2",
                      isNarrow ? "col-span-full" : "col-span-6"
                    )}>
                      <button
                        onClick={() => toggleSubfield(fieldName, 'all')}
                        className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-300 hover:bg-gray-50 transition-colors w-auto"
                        aria-expanded={isSubfieldExpanded(fieldName, 'all')}
                        aria-controls={`subfields-${fieldName}`}
                      >
                        <Text variant="body" className="font-medium">Subfields</Text>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-gray-500 transition-transform ml-2",
                            isSubfieldExpanded(fieldName, 'all') ? "rotate-180" : ""
                          )}
                        />
                      </button>

                      {isSubfieldExpanded(fieldName, 'all') && (
                        <div 
                          id={`subfields-${fieldName}`}
                          className="space-y-4 mt-2"
                        >
                          {Object.entries(fieldData.subfields)
                            .filter(isValidSubfield)
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([subfieldName, subfieldData]) => {
                              const isExpanded = isSubfieldExpanded(fieldName, subfieldName);
                              return (
                                <div 
                                  key={subfieldName} 
                                  className={cn(
                                    "rounded-lg border border-gray-200 overflow-hidden",
                                    isNarrow ? "" : "ml-6"
                                  )}
                                >
                                  <button
                                    onClick={() => toggleSubfield(fieldName, subfieldName)}
                                    className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                                    aria-expanded={isExpanded}
                                    aria-controls={`subfield-content-${fieldName}-${subfieldName}`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Text variant="body" className="font-medium">
                                        {getSubfieldDisplayLabel(fieldName, subfieldName)}
                                      </Text>
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <span className="inline-flex p-1 hover:bg-gray-200 rounded-full transition-colors">
                                              <Info className="h-4 w-4 text-gray-700" />
                                            </span>
                                          </TooltipTrigger>
                                          <TooltipContent className="text-xs sm:text-sm text-gray-700 whitespace-normal break-words text-popover max-w-xs">
                                            {getSubfieldDescription(fieldName, subfieldName)}
                                            <a
                                              href={getSubfieldUrl(fieldName, subfieldName)}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-blue-700 hover:underline block mt-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                              aria-label={`Learn more about ${getSubfieldDisplayLabel(fieldName, subfieldName)} (opens in new tab)`}
                                            >
                                              Learn more
                                            </a>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <div className="flex items-center gap-2">
                                        <Progress 
                                          value={subfieldData.completeness * 100} 
                                          className="h-2 w-24 bg-[#EBF0F5]"
                                          indicatorClassName="bg-gray-900"
                                        />
                                        <Text 
                                          variant="body" 
                                          className="font-medium"
                                        >
                                          {formatCompleteness(subfieldData.completeness)}
                                        </Text>
                                      </div>
                                      <ChevronDown
                                        className={cn(
                                          "h-4 w-4 text-gray-500 transition-transform",
                                          isExpanded ? "rotate-180" : ""
                                        )}
                                      />
                                    </div>
                                  </button>

                                  {isExpanded && (
                                    <div 
                                      id={`subfield-content-${fieldName}-${subfieldName}`}
                                      className="px-4 py-3"
                                    >
                                      <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                          <Text variant="small" className="text-gray-700">Present</Text>
                                          <Text variant="body" className="font-medium">
                                            {subfieldData.count.toLocaleString()}
                                          </Text>
                                        </div>
                                        <div className="space-y-1">
                                          <Text variant="small" className="text-gray-700">Missing</Text>
                                          <Text variant="body" className="font-medium">
                                            {subfieldData.missing.toLocaleString()}
                                          </Text>
                                        </div>
                                        <div className="space-y-1">
                                          <Text variant="small" className="text-gray-700">Instances</Text>
                                          <Text variant="body" className="font-medium">
                                            {subfieldData.instances.toLocaleString()}
                                          </Text>
                                        </div>
                                      </div>
                                      {subfieldData.values && Object.keys(subfieldData.values).length > 0 && (
                                        <>
                                          <div className="border-t border-gray-200 my-4"></div>
                                          <div className="space-y-2">
                                            {Object.entries(subfieldData.values)
                                              .filter(entry => entry[1] > 0)
                                              .sort((a, b) => b[1] - a[1])
                                              .map(([valueKey, valueCount]) => {
                                                const percentage = (valueCount / subfieldData.instances) * 100;
                                                return (
                                                  <div key={valueKey} className="space-y-1">
                                                    <div className="flex justify-between items-center">
                                                      <Text variant="body" className="font-medium">
                                                        {valueKey}
                                                      </Text>
                                                      <Text variant="body" className="text-gray-600">
                                                        {formatCompleteness(percentage / 100)}
                                                      </Text>
                                                    </div>
                                                    <div className="relative">
                                                      <Progress 
                                                        value={percentage} 
                                                        className="h-2 bg-[#EBF0F5]"
                                                        indicatorClassName="bg-gray-900"
                                                      />
                                                      <div className="flex justify-between items-center mt-1">
                                                        <Text variant="small" className="text-gray-600">
                                                          log scale
                                                        </Text>
                                                        <Text variant="small" className="text-gray-600 tabular-nums">
                                                          {valueCount.toLocaleString()} / {subfieldData.instances.toLocaleString()}
                                                        </Text>
                                                      </div>
                                                    </div>
                                                  </div>
                                                );
                                              })}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Stack>
  );
};

const SummaryFieldStats = ({ groupedFields, categories }: SummaryFieldStatsProps) => {
  const sortedGroupedFields = Object.fromEntries(
    Object.entries(groupedFields).map(([category, fields]) => [
      category,
      Object.fromEntries(
        Object.entries(fields)
          .sort(([a], [b]) => a.localeCompare(b))
      )
    ])
  );

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category: FieldCategory) => (
        <Card key={category} className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2 border-b">
            <Text variant="h3" className="text-center">
              {getCategoryTitle(category)}
            </Text>
          </CardHeader>
          <CardContent className="pt-6">
            <Stack spacing="md">
              {Object.entries(sortedGroupedFields[category] || {}).map(([field, fieldInfo]) => {
                const completeness = fieldInfo.completeness;
                return (
                  <div key={field} className="min-w-0">
                    <Stack spacing="sm">
                      <div className="flex items-center justify-between gap-1 sm:gap-2 min-w-0">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Text 
                            variant="body" 
                            className="font-medium truncate text-sm sm:text-base" 
                            title={getFieldDisplayLabel(field)}
                          >
                            {getFieldDisplayLabel(field)}
                          </Text>
                          {getFieldDescription(field) && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button 
                                    className="inline-flex flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
                                    aria-label={`Information about ${field} in ${category}`}
                                  >
                                    <Info className="h-4 w-4 text-gray-700" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs sm:text-sm text-gray-700 whitespace-normal break-words text-popover max-w-xs">
                                  {getFieldDescription(field)}
                                  <a
                                    href={getFieldUrl(field)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-700 hover:underline block mt-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    aria-label={`Learn more about ${field} (opens in new tab)`}
                                  >
                                    Learn more
                                  </a>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        <Text 
                          variant="small" 
                          className="text-gray-900 font-semibold text-sm whitespace-nowrap"
                        >
                          {formatCompleteness(completeness)}
                        </Text>
                      </div>
                      <Progress
                        value={completeness * 100}
                        className="h-2 bg-primary/20"
                        indicatorClassName={getCategoryColor(category, completeness)}
                        aria-label={`${getFieldDisplayLabel(field)} completion progress`}
                      />
                      <div className="flex justify-center text-sm text-gray-600">
                        <Text variant="small" className="truncate text-xs sm:text-sm">
                          {fieldInfo.count.toLocaleString()} / {(fieldInfo.count + fieldInfo.missing).toLocaleString()} records
                        </Text>
                      </div>
                    </Stack>
                    {Object.entries(sortedGroupedFields[category] || {}).length > 1 && 
                      field !== Object.keys(sortedGroupedFields[category] || {}).slice(-1)[0] && (
                      <div className="mt-4 border-b border-gray-200" />
                    )}
                  </div>
                );
              })}
              {(!sortedGroupedFields[category] || Object.keys(sortedGroupedFields[category]).length === 0) && (
                <Text variant="small" className="text-gray-700 text-center py-4">
                  No {category} fields available
                </Text>
              )}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export function FieldStats({ stats, viewMode }: FieldStatsProps) {
  const categories = ['mandatory', 'recommended', 'optional'] as const;
  const { selectedView } = useStatsView();
  
  const statsData: StatsView = selectedView === 'summary' || !stats.byResourceType?.resourceTypes?.[selectedView]
    ? stats.summary ?? { fields: {} }
    : stats.byResourceType.resourceTypes[selectedView] ?? { fields: {} };

  const groupedFields: GroupedFields = Object.entries(statsData?.fields ?? {}).reduce<GroupedFields>((acc, [field, info]) => {
    const category = info.fieldStatus as string;
    if (!acc[category]) {
      acc[category] = {};
    }
    acc[category][field] = info;
    return acc;
  }, {});

  return (
    <Container variant="wide" className="w-full">
      {viewMode === ViewMode.Detailed ? (
        <DetailedFieldStats stats={statsData} />
      ) : (
        <SummaryFieldStats
          groupedFields={groupedFields}
          categories={categories}
        />
      )}
    </Container>
  );
}
