'use client';

import { useProviders } from '@/lib/hooks/use-entities';
import { Card } from '@/components/ui/card';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Text } from '@/components/typography/typography';

export function ProvidersList() {
  const { data: providers, isLoading, isError, error } = useProviders();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingOverlay isLoading={true} message="Loading providers...">
          <div className="h-96" />
        </LoadingOverlay>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-destructive/10 p-4 rounded-lg">
        <Text variant="body" className="text-destructive">
          Error loading providers: {error instanceof Error ? error.message : 'Unknown error'}
        </Text>
      </div>
    );
  }

  if (!providers || providers.length === 0) {
    return (
      <Card className="p-6">
        <Text variant="body" className="text-center text-muted-foreground">
          No providers found
        </Text>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Text variant="small" className="font-medium">Name</Text>
            </TableHead>
            <TableHead className="text-right">
              <Text variant="small" className="font-medium">DOIs</Text>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {providers.map((provider) => (
            <TableRow key={provider.id}>
              <TableCell>
                <Link
                  href={`/providers/${provider.id}`}
                  className="hover:underline"
                >
                  <Text variant="body" className="font-medium">{provider.name}</Text>
                </Link>
              </TableCell>
              <TableCell className="text-right">
                <Text variant="body">
                  {(provider.stats?.summary?.count || provider.stats?.summary.count || 0).toLocaleString()}
                </Text>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}