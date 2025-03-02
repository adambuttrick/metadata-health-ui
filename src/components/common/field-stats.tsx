import { SubfieldInfo, FieldInfo, Stats, StatsView } from '@/lib/types/api';
import { FieldCategory } from '@/lib/constants';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useStatsView } from '@/contexts/stats-view-context';
import { Container } from '@/components/layout/container';
import { Stack } from '@/components/layout/stack';
import { Text } from '@/components/typography/typography';
import { useContainerWidth } from '@/lib/hooks/use-container-width';

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
  const { containerRef, width } = useContainerWidth();
  const isNarrow = width > 0 && width < 1024;
  const [selectedSubfields, setSelectedSubfields] = useState<Record<string, string | 'all'>>({});

  useEffect(() => {
    const initialSubfields: Record<string, string | 'all'> = {};
    setSelectedSubfields(initialSubfields);
  }, []);

  // Memoize the sorted fields to prevent unnecessary recalculations
  const sortedFields = useMemo(() => 
    Object.entries(stats?.fields || {}).sort(([a], [b]) => a.localeCompare(b)),
    [stats?.fields]
  );

  const isValidSubfield = useCallback((entry: [string, unknown]): entry is [string, SubfieldInfo] => {
    const [, subfieldData] = entry;
    return subfieldData !== null && 
      typeof subfieldData === 'object' && 
      'count' in subfieldData && 
      typeof subfieldData.count === 'number' && 
      subfieldData.count > 0;
  }, []);

  const handleSubfieldChange = useCallback((fieldName: string, subfieldName: string | null) => {
    setSelectedSubfields(prev => {
      if (subfieldName === null) {
        const newState = { ...prev };
        delete newState[fieldName];
        return newState;
      }
      return {
        ...prev,
        [fieldName]: subfieldName
      };
    });
  }, []);

  return (
    <Stack spacing="lg" className="w-full">
      <div>
        <Text variant="h2" id="fields-heading">Fields</Text>
        <div className="border-t-2 border-gray-300 my-4" role="separator"></div>
      </div>
      <Stack spacing="md">
        {sortedFields.map(([fieldName, fieldData]) => {
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
                              className="w-24 h-2 bg-primary/20"
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

                  {/* Desktop Header - Visible when not narrow */}
                  {!isNarrow && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Text 
                            variant="h3" 
                            className="truncate" 
                            title={getFieldDisplayLabel(fieldName)}
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
                              <TooltipContent>
                                {getFieldDescription(fieldName)}
                                <a
                                  href={getFieldUrl(fieldName)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-700 hover:underline block mt-2"
                                >
                                  Learn more
                                </a>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Text variant="small" className="text-gray-700">Completeness</Text>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={completeness * 100} 
                            className="w-24 h-2 bg-primary/20"
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

                  <div className="border-t-2 border-gray-300 my-4"></div>

                  {/* Stats Grid */}
                  <div className={cn(
                    "w-full",
                    isNarrow ? "col-span-2" : "contents"
                  )}>
                    <div className={cn(
                      "grid gap-4",
                      isNarrow ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-4"
                    )}>
                      <div className="space-y-1">
                        <Text variant="small" className="text-gray-700">Category</Text>
                        <Text 
                          variant="body" 
                          className="font-medium capitalize text-sm sm:text-base"
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
                          className="font-medium tabular-nums text-sm sm:text-base"
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
                          className="font-medium tabular-nums text-sm sm:text-base"
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
                          className="font-medium tabular-nums text-sm sm:text-base"
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
                      "space-y-4 w-full",
                      isNarrow ? "col-span-full" : "col-span-6"
                    )}>
                      <div>
                        <div className="border-t-2 border-gray-300 my-4" role="separator"></div>
                        <Text variant="h3">Subfields</Text>
                      </div>

                      <div className="rounded-lg border border-gray-200 overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50">
                          <div className="flex flex-wrap gap-y-3">
                            <div className={cn(
                              "flex items-center gap-2",
                              isNarrow ? "w-full" : "w-auto"
                            )}>
                              <Select
                                value={selectedSubfields[fieldName] || ""}
                                onValueChange={(value) => handleSubfieldChange(fieldName, value || null)}
                              >
                                <SelectTrigger className="min-h-[2.5rem] text-xs sm:text-sm font-medium px-3 py-2 w-[300px]">
                                  <SelectValue 
                                    placeholder="Select subfield"
                                    className="leading-tight line-clamp-2 text-xs sm:text-sm"
                                  />
                                </SelectTrigger>
                                <SelectContent 
                                  className="w-[300px] max-w-[85vw]"
                                  align="start"
                                  side="bottom"
                                  position="popper"
                                >
                                  <SelectItem 
                                    value="all" 
                                    className="py-2 px-3 text-sm"
                                  >
                                    <span className="pr-6">All Subfields</span>
                                  </SelectItem>
                                  {Object.entries(fieldData.subfields)
                                    .filter(isValidSubfield)
                                    .sort(([a], [b]) => a.localeCompare(b))
                                    .map(([subfieldName]) => (
                                      <SelectItem 
                                        key={subfieldName} 
                                        value={subfieldName}
                                        className="py-2 px-3 leading-tight text-sm"
                                      >
                                        <span className="line-clamp-2">
                                          {getSubfieldDisplayLabel(fieldName, subfieldName)}
                                        </span>
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                              {selectedSubfields[fieldName] && (
                                <>
                                  <div className="w-4" />
                                  <button
                                    onClick={() => handleSubfieldChange(fieldName, null)}
                                    className="px-2 py-1 text-xs font-medium text-white bg-destructive hover:bg-destructive/90 rounded transition-colors"
                                    aria-label="Clear subfield selection"
                                  >
                                    Clear
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {selectedSubfields[fieldName] === 'all' ? (
                          <div className="divide-y divide-gray-200 bg-white w-full">
                            {Object.entries(fieldData.subfields)
                              .filter(isValidSubfield)
                              .sort(([a], [b]) => a.localeCompare(b))
                              .map(([subfieldName, subfieldData]) => (
                                <div key={subfieldName} className="p-4 space-y-4 bg-white">
                                  <div className="flex items-start gap-2">
                                    <Text variant="h3" className="font-medium">
                                      {getSubfieldDisplayLabel(fieldName, subfieldName)}
                                    </Text>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="inline-flex flex-shrink-0 p-1 hover:bg-gray-200 rounded-full transition-colors mt-0.5">
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

                                  {Object.keys(subfieldData.values || {}).length > 0 && (
                                    <>
                                      <div className="border-t border-gray-200 my-4"></div>
                                      <div className="space-y-2">
                                        {Object.entries(subfieldData.values || {})
                                          .filter(entry => entry[1] > 0)
                                          .sort((a, b) => b[1] - a[1])
                                          .map(([valueKey, valueCount]) => {
                                            const totalInstances = subfieldData.instances || 1;
                                            const percentage = (valueCount / totalInstances) * 100;
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
                                                      {valueCount.toLocaleString()} / {totalInstances.toLocaleString()}
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
                              ))}
                          </div>
                        ) : (
                          selectedSubfields[fieldName] && (
                            <div className="p-4 space-y-4 bg-white">
                              <div className="flex items-start gap-2">
                                <Text variant="h3" className="font-medium">
                                  {getSubfieldDisplayLabel(fieldName, selectedSubfields[fieldName])}
                                </Text>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="inline-flex flex-shrink-0 p-1 hover:bg-gray-200 rounded-full transition-colors mt-0.5">
                                        <Info className="h-4 w-4 text-gray-700" />
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent className="text-xs sm:text-sm text-gray-700 whitespace-normal break-words text-popover max-w-xs">
                                      {getSubfieldDescription(fieldName, selectedSubfields[fieldName])}
                                      <a
                                        href={getSubfieldUrl(fieldName, selectedSubfields[fieldName])}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-700 hover:underline block mt-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        aria-label={`Learn more about ${getSubfieldDisplayLabel(fieldName, selectedSubfields[fieldName])} (opens in new tab)`}
                                      >
                                        Learn more
                                      </a>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                  <Text variant="small" className="text-gray-700">Present</Text>
                                  <Text variant="body" className="font-medium">
                                    {fieldData.subfields[selectedSubfields[fieldName]].count.toLocaleString()}
                                  </Text>
                                </div>
                                <div className="space-y-1">
                                  <Text variant="small" className="text-gray-700">Missing</Text>
                                  <Text variant="body" className="font-medium">
                                    {fieldData.subfields[selectedSubfields[fieldName]].missing.toLocaleString()}
                                  </Text>
                                </div>
                                <div className="space-y-1">
                                  <Text variant="small" className="text-gray-700">Instances</Text>
                                  <Text variant="body" className="font-medium">
                                    {fieldData.subfields[selectedSubfields[fieldName]].instances.toLocaleString()}
                                  </Text>
                                </div>
                              </div>

                              {fieldData.subfields && 
                               selectedSubfields[fieldName] && 
                               fieldData.subfields[selectedSubfields[fieldName]] &&
                               Object.keys(fieldData.subfields[selectedSubfields[fieldName]].values || {}).length > 0 && (
                                <>
                                  <div className="border-t border-gray-200 my-4"></div>
                                  <div className="space-y-2">
                                    {Object.entries(fieldData.subfields[selectedSubfields[fieldName]].values || {})
                                      .filter(entry => entry[1] > 0)
                                      .sort((a, b) => b[1] - a[1])
                                      .map(([valueKey, valueCount]) => {
                                        const selectedSubfield = fieldData.subfields?.[selectedSubfields[fieldName]];
                                        const totalInstances = selectedSubfield?.instances || 1;
                                        const percentage = (valueCount / totalInstances) * 100;
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
                                                  {valueCount.toLocaleString()} / {totalInstances.toLocaleString()}
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
                          )
                        )}
                      </div>
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
