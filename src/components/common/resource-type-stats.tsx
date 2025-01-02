'use client';

import { Provider, Client, Stats, getResourceTypeStats, ResourceType } from '@/lib/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStatsView } from '@/contexts/stats-view-context';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { getResourceTypeColor } from '@/lib/constants';
import { chartConfig } from '@/config/chart-styles';
import { Container } from '@/components/layout/container';
import { Stack } from '@/components/layout/stack';

interface ResourceTypeStatsProps {
  provider: Provider | Client;
}

interface ResourceTypeStat {
  type: ResourceType;
  count: number;
}

interface ChartDataItem {
  name: string;
  [key: string]: number | string | undefined;
  cumulative?: number;
}

interface SelectionIndicatorProps {
  x: number;
  y: number;
  width: number;
  selectedType: ResourceType;
  type: ResourceType;
}

const calculatePercentage = (count: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((count / total) * 1000) / 10;
};

const camelCaseToSpaced = (text: string): string => {
  return text.replace(/([A-Z])/g, ' $1').trim();
};

const MAX_TEXT_WIDTH = 100;
const LINE_HEIGHT = 12;
const TOP_MARGIN = 60;

const wrapText = (text: string, maxWidth: number): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = `${currentLine} ${word}`;
    const testWidth = testLine.length * 6; 

    if (testWidth < maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
};

const SelectionIndicator = ({ 
  x, 
  y, 
  width, 
  selectedType,
  type
}: SelectionIndicatorProps) => {
  const { selectedView } = useStatsView();
  if (!selectedType || selectedView === 'summary' || selectedType.toLowerCase() !== type.toLowerCase()) return null;

  const centerX = x + (width / 2);
  const wrappedText = wrapText(camelCaseToSpaced(type), MAX_TEXT_WIDTH);
  const totalHeight = wrappedText.length * LINE_HEIGHT;
  const startY = y - totalHeight - 30;

  return (
    <g>
      <text
        x={centerX}
        y={startY}
        textAnchor="middle"
        className="text-xs fill-current"
      >
        {wrappedText.map((line, index) => (
          <tspan
            key={index}
            x={centerX}
            dy={index === 0 ? 0 : LINE_HEIGHT}
            className="font-medium"
          >
            {line}
          </tspan>
        ))}
      </text>
      <line
        x1={centerX}
        y1={y - 20}
        x2={centerX}
        y2={y - 5}
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2,2"
      />
    </g>
  );
};

export function ResourceTypeStats({ provider }: ResourceTypeStatsProps) {
  const { selectedView } = useStatsView();
  const stats: Stats | undefined = provider.stats;

  if (!stats?.byResourceType?.resourceTypes) {
    return null;
  }

  const statsView = selectedView === 'summary' 
    ? stats.summary 
    : getResourceTypeStats(stats, selectedView);

  if (!statsView) {
    return null;
  }

  const resourceTypeStats: ResourceTypeStat[] = Object.entries(stats.byResourceType.resourceTypes)
    .map(([type, typeStats]) => ({
      type: type as ResourceType,
      count: typeStats.count
    }))
    .filter(({ count }) => count > 0)
    .sort((a, b) => b.count - a.count);

  if (resourceTypeStats.length === 0) {
    return null;
  }

  const totalCount = resourceTypeStats.reduce((sum, { count }) => sum + count, 0);

  const chartData: ChartDataItem[] = (() => {
    let remainingPercentage = 100;
    let cumulative = 0;
    
    const result = [{
      name: 'Distribution',
      cumulative: 0,
      ...resourceTypeStats.reduce<Record<string, number>>((acc, { type, count }, index) => {
        const percentage = index === resourceTypeStats.length - 1
          ? remainingPercentage
          : calculatePercentage(count, totalCount);
        
        remainingPercentage -= percentage;
        cumulative += percentage;
        
        return {
          ...acc,
          [type]: percentage,
          [`${type}Cumulative`]: cumulative
        };
      }, {})
    }];

    return result;
  })();

  const getDisplayPercentage = (): number => {
    if (selectedView === 'summary') {
      return chartData[0][resourceTypeStats[0]?.type] as number || 0;
    }
    const selectedType = selectedView.charAt(0).toUpperCase() + selectedView.slice(1) as ResourceType;
    return chartData[0][selectedType] as number || 0;
  };

  const displayPercentage = getDisplayPercentage();

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <Stack spacing="sm">
          <div className="flex items-center gap-2">
            <CardTitle className="text-2xl sm:text-3xl">Resource Type Distribution</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger aria-label="Information about resource types">
                  <Info className="h-4 w-4" />
                </TooltipTrigger>
                <TooltipContent className="text-xs sm:text-sm text-gray-700 whitespace-normal break-words text-popover max-w-xs">
                  Distribution of different resource types for the organization or repository
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Container variant="full" className="px-0">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              {selectedView === 'summary' ? (
                <>
                  <span>All Resource Types</span>
                  <span className="text-muted-foreground">•</span>
                  <span>Most common: </span>
                  <span className="font-medium text-foreground">
                    {camelCaseToSpaced(resourceTypeStats[0]?.type)}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span>{displayPercentage.toFixed(0)}% of total</span>
                </>
              ) : (
                <>
                  <span>Current Resource Type View: </span>
                  <span className="font-medium text-foreground">
                    {camelCaseToSpaced(selectedView.charAt(0).toUpperCase() + selectedView.slice(1))}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span>{displayPercentage.toFixed(0)}% of total</span>
                </>
              )}
            </div>
          </Container>
        </Stack>
      </CardHeader>
      <CardContent>
        <Container variant="full" className="px-0">
          <div 
            className="relative h-64 sm:h-72 lg:h-96 min-w-[320px]"
            role="figure"
            aria-label={`Resource type distribution chart showing ${selectedView === 'summary' 
              ? 'all resource types' 
              : `${camelCaseToSpaced(selectedView)} at ${displayPercentage.toFixed(0)}%`}`}
          >
            <div className="absolute inset-0 overflow-x-auto overflow-y-hidden">
              <div className="min-w-[800px] h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout={chartConfig.barChart.layout}
                    data={chartData}
                    margin={{
                      top: TOP_MARGIN,
                      right: 60,
                      bottom: 20,
                      left: 60
                    }}
                    {...chartConfig.barChart.accessibility}
                  >
                    <XAxis 
                      {...chartConfig.xAxis}
                      {...chartConfig.xAxis.accessibility}
                    />
                    <YAxis {...chartConfig.yAxis} />
                    <Legend 
                      {...chartConfig.legend}
                      formatter={(value: string) => (
                        <span className="text-foreground px-1 text-xs sm:text-sm">{camelCaseToSpaced(value)}</span>
                      )}
                    />
                    {resourceTypeStats.map(({ type, count }) => (
                      <Bar
                        key={type}
                        dataKey={type}
                        stackId="1"
                        fill={getResourceTypeColor(type)}
                        label={
                          <SelectionIndicator 
                            selectedType={selectedView as ResourceType} 
                            type={type}
                            x={0}
                            y={0}
                            width={0}
                          />
                        }
                        role="graphics-symbol"
                        aria-label={`${camelCaseToSpaced(type)}: ${calculatePercentage(count, totalCount).toFixed(1)}% (${count.toLocaleString()} items)`}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div 
            className="mt-4 sm:mt-6 text-xs sm:text-sm text-muted-foreground"
            aria-live="polite"
            role="status"
          >
            Total items: {totalCount.toLocaleString()}
          </div>
        </Container>
      </CardContent>
    </Card>
  );
}
