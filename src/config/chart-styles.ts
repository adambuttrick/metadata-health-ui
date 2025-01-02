import { CSSProperties } from 'react';

type Breakpoints = {
  sm: number;
  lg: number;
};

const breakpoints: Breakpoints = {
  sm: 640,
  lg: 1024,
};

export const chartConfig = {
  breakpoints,
  barChart: {
    layout: 'vertical' as const,
    getMargins: (windowWidth: number) => ({
      top: 12,
      right: 8,
      left: 8,
      bottom: 12,
      ...(windowWidth >= breakpoints.sm && {
        top: 20,
        right: 16,
        left: 16,
        bottom: 20,
      }),
      ...(windowWidth >= breakpoints.lg && {
        top: 32,
        right: 24,
        left: 24,
        bottom: 32,
      }),
    }),
    accessibility: {
      role: 'graphics-document',
      ariaRoledescription: 'Bar chart showing resource type distribution',
    }
  },
  xAxis: {
    type: 'number' as const,
    domain: [0, 100] as [number, number],
    tickFormatter: (value: number) => `${value}%`,
    ticks: [0, 20, 40, 60, 80, 100] as (number)[],
    fontSize: 12,
    tickMargin: 4,
    accessibility: {
      role: 'graphics-symbol',
      ariaLabel: 'Percentage scale from 0% to 100%',
    }
  },
  yAxis: {
    type: 'category' as const,
    dataKey: 'name',
    hide: true,
  },
  legend: {
    layout: 'horizontal' as const,
    align: 'left' as const,
    verticalAlign: 'bottom' as const,
    wrapperStyle: {
      width: '100%',
      maxWidth: 'calc(100% - 16px)',
      fontSize: '0.75rem',
      lineHeight: '1rem',
      marginLeft: '8px'
    } as CSSProperties
  }
} as const;
