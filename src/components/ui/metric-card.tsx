import {
  Card,
  CardContent,
  CardHeader,
} from './card';
import { Progress } from './progress';
import { Text } from '@/components/typography/typography';
import { cn } from '@/lib/utils';
import { FieldStatus } from '@/lib/types/api';
import { getTextColor, getCategoryColor } from '@/lib/constants';

interface MetricCardProps {
  fieldStatus: FieldStatus;
  completeness: number;
  className?: string;
}

const formatTitle = (status: FieldStatus) => 
  status.charAt(0).toUpperCase() + status.slice(1);

export function MetricCard({ 
  fieldStatus,
  completeness,
  className,
}: MetricCardProps) {
  const progress = completeness * 100;
  const textColorClass = getTextColor(fieldStatus, completeness);
  const bgColorClass = getCategoryColor(fieldStatus, completeness);
  const title = formatTitle(fieldStatus);

  return (
    <Card 
      className={cn('overflow-hidden', className)}
      role="region"
      aria-label={`Metric card for ${title}`}
    >
      <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2 border-b">
        <Text variant="h3" className="text-center">
          {title}
        </Text>
      </CardHeader>
      <CardContent className="pt-6">
        <Text 
          variant="h2" 
          className={cn("text-center", textColorClass)}
          role="status"
          aria-label={`Value: ${completeness * 100}%`}
        >
          {(completeness * 100).toFixed(0)}%
        </Text>
        <div role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <Progress
            value={progress}
            className="h-2 mt-4"
            indicatorClassName={bgColorClass}
          />
          <span className="sr-only">{`Progress: ${progress}%`}</span>
        </div>
      </CardContent>
    </Card>
  );
}
