'use client';

import { useState, useMemo } from 'react';
import { useProviderDetails, useClientDetails, useClientStats } from '@/lib/hooks/use-entities';
import { Client } from '@/lib/types/api';
import { useQuery } from '@tanstack/react-query';
import { getProviderClientsList } from '@/lib/api/endpoints';
import { EntityMetrics } from '@/components/common/entity-metrics';
import { ResourceTypeStats } from '@/components/common/resource-type-stats';
import { FieldStats, ViewMode } from '@/components/common/field-stats';
import { ArrowLeft, BarChart2, List } from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useProviderNavigation } from '@/lib/hooks/use-provider-navigation';
import { StatsViewProvider } from '@/contexts/stats-view-context';
import { useStatsView } from '@/contexts/stats-view-context';
import { StatsSelector } from '@/components/stats/stats-selector';
import { AlertError } from '@/components/ui/alert';
import { ERROR_MESSAGES } from '@/lib/constants';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { Stack } from '@/components/layout/stack';
import { Text } from '@/components/typography/typography';

export function ProviderDetails({ providerId }: { providerId: string }) {
  const { data: provider, isLoading: isLoadingProvider, error: providerError } = useProviderDetails(providerId);
  const { currentParams, navigateToProvider } = useProviderNavigation();
  const { view: viewParam, clientId } = currentParams;
  const [selectedTab, setSelectedTab] = useState(clientId ? "repositories" : "organization");
  const [lastSelectedClientId, setLastSelectedClientId] = useState<string | null>(clientId || null);

  const { data: clientsListData, isLoading: isLoadingClientsList, error: clientsListError } = useQuery({
    queryKey: ['provider-clients-list', providerId],
    queryFn: () => getProviderClientsList(providerId),
    enabled: !!providerId && !!provider && selectedTab === "repositories",
  });

  const { data: selectedClient, isLoading: isLoadingClient, error: clientError } = useClientDetails(
    clientId ?? ''
  );

  const { data: selectedClientStats, isLoading: isLoadingClientStats } = useClientStats(
    clientId ?? ''
  );

  const clients = (clientsListData || []).filter((client): client is Client => client !== null);
  const isClientNotFound = clientId && clientError?.message?.includes('not found');

  const selectedClientData = useMemo(() => {
    if (!clientId || !selectedClient || !selectedClientStats) return null;
    return {
      ...selectedClient,
      stats: selectedClientStats.stats
    };
  }, [clientId, selectedClient, selectedClientStats]);

  const [fieldStatsView, setFieldStatsView] = useState<ViewMode>(ViewMode.Summary);
  const { } = useStatsView();

  const handleRepositoryChange = (newClientId: string | null) => {
    setLastSelectedClientId(newClientId);
    navigateToProvider({
      providerId,
      clientId: newClientId || undefined,
      view: viewParam
    });
    setSelectedTab(newClientId ? "repositories" : "organization");
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    if (tab === "organization") {
      navigateToProvider({
        providerId,
        view: viewParam
      });
    } else if (tab === "repositories" && lastSelectedClientId) {
      navigateToProvider({
        providerId,
        clientId: lastSelectedClientId,
        view: viewParam
      });
    }
  };

  if (isLoadingProvider || 
      (selectedTab === "repositories" && isLoadingClientsList) || 
      (clientId && !isClientNotFound && (isLoadingClient || isLoadingClientStats))) {
    return (
      <LoadingOverlay 
        isLoading={true} 
        message={
          isLoadingProvider 
            ? "Loading provider data..." 
            : clientId 
              ? isLoadingClient
                ? "Loading repository data..."
                : "Loading repository statistics..."
              : "Loading repositories..."
        }
      >
        <div className="h-96" />
      </LoadingOverlay>
    );
  }

  if (providerError) {
    return (
      <AlertError
        title={ERROR_MESSAGES.ORGANIZATION.TITLE}
        description={ERROR_MESSAGES.ORGANIZATION.LOAD_FAILED}
        details={[`Error: ${providerError.message}`]}
      />
    );
  }

  if (!provider) {
    return (
      <AlertError
        title={ERROR_MESSAGES.ORGANIZATION.TITLE}
        description={ERROR_MESSAGES.ORGANIZATION.NOT_FOUND}
      />
    );
  }

  if (clientsListError && selectedTab === "repositories") {
    return (
      <AlertError
        title={ERROR_MESSAGES.REPOSITORY.TITLE}
        description={ERROR_MESSAGES.REPOSITORY.LOAD_FAILED(1, 0)}
        details={[`Error: ${clientsListError.message}`]}
      />
    );
  }

  if (clientId && isClientNotFound) {
    return (
      <AlertError
        title={ERROR_MESSAGES.REPOSITORY.TITLE}
        description={ERROR_MESSAGES.REPOSITORY.NOT_FOUND(clientId)}
      />
    );
  }

  if (clientError && !isClientNotFound) {
    return (
      <AlertError
        title={ERROR_MESSAGES.REPOSITORY.TITLE}
        description={ERROR_MESSAGES.REPOSITORY.LOAD_FAILED(1, 0)}
        details={[`Error: ${clientError.message}`]}
      />
    );
  }

  return (
    <StatsViewProvider>
      <Stack spacing="lg">
        {clientId && !clients.some(c => c.id === clientId) && (
          <AlertError
            title={ERROR_MESSAGES.REPOSITORY.TITLE}
            description={ERROR_MESSAGES.REPOSITORY.NOT_FOUND(clientId)}
          />
        )}
        
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <Text variant="small" className="text-muted-foreground hover:text-foreground transition-colors">Back to Search</Text>
          </Link>
          <div className="flex flex-col gap-2">
            <Text variant="small" className="font-medium text-muted-foreground">Resource Type</Text>
            <StatsSelector 
              stats={selectedTab === "repositories" && selectedClientData ? selectedClientData.stats : provider.stats} 
              className="w-48" 
            />
          </div>
        </div>

        <Stack spacing="lg">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <Text variant="small" className="font-medium text-muted-foreground">Organization</Text>
              <div className="flex items-center gap-3">
                <Text variant="h1" wrap={true}>{provider.attributes.name}</Text>
                {provider.attributes.memberType && (
                  <Badge variant="outline" className="inline-flex items-center justify-center w-fit">
                    <Text variant="small" className="capitalize text-center">{provider.attributes.memberType.toLowerCase().replace(/_/g, ' ')}</Text>
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                {provider.attributes.rorId && (
                  <>
                    <Link 
                      href={provider.attributes.rorId}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary hover:underline"
                    >
                      <Text variant="small" className="text-muted-foreground hover:text-primary hover:underline" truncate={true}>{provider.attributes.rorId}</Text>
                    </Link>
                    <Text variant="small" className="text-muted-foreground">•</Text>
                    <Link
                      href={`https://commons.datacite.org/ror.org${provider.attributes.rorId.replace('https://ror.org', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary hover:underline"
                    >
                      <Text variant="small" className="text-muted-foreground hover:text-primary hover:underline">View in DataCite Commons</Text>
                    </Link>
                  </>
                )}
              </div>
            </div>
            {provider.attributes.isConsortium && (
              <Badge variant="secondary" className="self-start">
                <Text variant="small">Consortium</Text>
              </Badge>
            )}
          </div>

          <Tabs value={selectedTab} onValueChange={handleTabChange}>
            <div className="flex items-center justify-between mb-8">
              <Tabs value={fieldStatsView} onValueChange={(value) => setFieldStatsView(value as ViewMode)}>
                <TabsList>
                  <TabsTrigger value={ViewMode.Summary}>
                    <List className="h-4 w-4 mr-2" />
                    <Text variant="small">Summary</Text>
                  </TabsTrigger>
                  <TabsTrigger value={ViewMode.Detailed}>
                    <BarChart2 className="h-4 w-4 mr-2" />
                    <Text variant="small">Detailed</Text>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <TabsList>
                <TabsTrigger value="organization">
                  <Text variant="small">Organization</Text>
                </TabsTrigger>
                <TabsTrigger value="repositories">
                  <Text variant="small">Repositories</Text>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Keep both views mounted but hide/show with CSS */}
            <div className={`${selectedTab === "organization" ? "block" : "hidden"}`}>
              <Stack spacing="lg">
                <EntityMetrics entity={provider} />
                <div className={`${fieldStatsView === ViewMode.Detailed ? "block" : "hidden"}`}>
                  <ResourceTypeStats provider={provider} />
                </div>
                <FieldStats 
                  stats={provider.stats}
                  viewMode={fieldStatsView}
                  onToggleView={() => setFieldStatsView(fieldStatsView === ViewMode.Summary ? ViewMode.Detailed : ViewMode.Summary)}
                />
              </Stack>
            </div>

            <div className={`${selectedTab === "repositories" ? "block" : "hidden"}`}>
              <Stack spacing="lg">
                <LoadingOverlay
                  isLoading={isLoadingClientsList || isLoadingClient || isLoadingClientStats}
                  message="Loading client data..."
                >
                  {clients.length === 0 ? (
                    <Text variant="body" className="text-center text-muted-foreground">
                      No repositories available for this organization
                    </Text>
                  ) : (
                    <div className="grid gap-4">
                      <Stack spacing="md">
                        <Text variant="h2">Repositories</Text>
                        <Select value={clientId || lastSelectedClientId || ""} onValueChange={handleRepositoryChange}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a repository" />
                          </SelectTrigger>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                <Text variant="small" truncate={true}>{client.attributes.name}</Text>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Stack>
                      
                      {selectedClientData && (
                        <Stack spacing="md">
                          <div className="border-t pt-6">
                            <Stack spacing="sm">
                              <Text variant="h2" wrap={true}>{selectedClientData.attributes.name}</Text>
                              <Link
                                href={`https://commons.datacite.org/repositories?query=${encodeURIComponent(selectedClientData.attributes.name || '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-primary hover:underline"
                              >
                                <Text variant="small" className="text-muted-foreground hover:text-primary hover:underline">View in DataCite Commons</Text>
                              </Link>
                            </Stack>
                          </div>
                          <Stack spacing="lg">
                            <EntityMetrics entity={selectedClientData} />
                            <div className={`${fieldStatsView === ViewMode.Detailed ? "block" : "hidden"}`}>
                              <ResourceTypeStats provider={selectedClientData} />
                            </div>
                            <FieldStats 
                              stats={selectedClientData.stats}
                              viewMode={fieldStatsView}
                              onToggleView={() => setFieldStatsView(fieldStatsView === ViewMode.Summary ? ViewMode.Detailed : ViewMode.Summary)}
                            />
                          </Stack>
                        </Stack>
                      )}
                    </div>
                  )}
                </LoadingOverlay>
              </Stack>
            </div>
          </Tabs>
        </Stack>
      </Stack>
    </StatsViewProvider>
  );
}