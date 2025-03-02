import { useEffect } from 'react';
import { useStatsView } from '@/contexts/stats-view-context';
import { Stats } from '@/lib/types/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface StatsSelectorProps {
  stats?: Stats;
  className?: string;
}

export function StatsSelector({ stats, className }: StatsSelectorProps) {
  const { selectedView, setSelectedView, availableViews, setAvailableViews } = useStatsView();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!stats) {
      setAvailableViews(['summary']);
      return;
    }

    const views = ['summary'];
    if (stats.byResourceType?.resourceTypes) {
      const resourceTypes = Object.entries(stats.byResourceType.resourceTypes)
        .filter(([, statsView]) => statsView.count > 0)
        .map(([type]) => type)
        .sort((a, b) => a.localeCompare(b));
      views.push(...resourceTypes);
    }

    setAvailableViews(views);


    if (!views.includes(selectedView)) {
      setSelectedView('summary');
      const params = new URLSearchParams(searchParams.toString());
      params.set('view', 'summary');
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [stats, setAvailableViews, selectedView, setSelectedView, searchParams, router]);

  useEffect(() => {
    const viewFromUrl = searchParams.get('view');
    if (viewFromUrl && availableViews.includes(viewFromUrl)) {
      setSelectedView(viewFromUrl);
    } else if (!viewFromUrl && availableViews.length > 0) {
      setSelectedView('summary');
    }
  }, [searchParams, availableViews, setSelectedView]);

  const handleViewChange = (view: string) => {
    setSelectedView(view);
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', view);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  if (!stats) {
    return null;
  }

  return (
    <Select value={selectedView} onValueChange={handleViewChange}>
      <SelectTrigger 
        className={cn(
          "justify-center whitespace-normal text-center h-auto py-2",
          "w-full sm:w-[300px]",
          "min-w-full sm:min-w-[300px]",
          className
        )}
      >
        <SelectValue className="text-center [&>span]:text-center [&>span]:w-full" />
      </SelectTrigger>
      <SelectContent 
        className="w-full sm:w-[300px] min-w-[250px]"
        position="popper"
        sideOffset={4}
      >
        {availableViews.map((view) => (
          <SelectItem 
            key={view} 
            value={view}
            className="text-center whitespace-normal py-2"
          >
            {view === 'summary' 
              ? 'All' 
              : view.replace(/([A-Z])/g, ' $1').trim()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
