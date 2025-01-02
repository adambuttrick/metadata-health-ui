'use client';

import { Client } from '@/lib/types/api';
import { FieldStats, ViewMode } from '@/components/common/field-stats';
import { EntityMetrics } from '@/components/common/entity-metrics';
import Link from 'next/link';
import { Text } from '@/components/typography/typography';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProviderClientsProps {
  clients: Client[];
  onClientSelect?: (clientId: string | null) => void;
  selectedClient?: Client | null;
  fieldStatsView: ViewMode;
}

export function ProviderClients({ 
  clients, 
  onClientSelect,
  selectedClient,
  fieldStatsView,
}: ProviderClientsProps) {
  const handleClientSelect = (clientId: string) => {
    onClientSelect?.(clientId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Text variant="h2" className="font-semibold">Repositories</Text>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <Select onValueChange={handleClientSelect} value={selectedClient?.id}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a repository" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.attributes.name || client.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedClient && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <Text variant="h3" className="font-medium">{selectedClient.attributes.name}</Text>
                <Text variant="small" className="text-gray-500">{selectedClient.id}</Text>
              </div>
              <Link
                href={`/providers/${selectedClient.relationships?.provider}?client=${selectedClient.id}`}
                className="text-datacite-dark-blue hover:underline"
              >
                <Text variant="small">View Details</Text>
              </Link>
            </div>

            <EntityMetrics entity={selectedClient} />
            <FieldStats 
              stats={selectedClient.stats} 
              viewMode={fieldStatsView}
              onToggleView={() => {}} 
            />
          </div>
        )}
      </div>
    </div>
  );
}