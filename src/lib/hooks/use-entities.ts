'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getProviders,
  getProviderDetails,
  getProviderStats,
  getClients,
  getClient,
  getClientStats,
} from '@/lib/api/endpoints';
import type { Provider, Client } from '@/lib/types/api';

export function useProviders() {
  return useQuery<Provider[], Error>({
    queryKey: ['providers'],
    queryFn: getProviders,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

export function useProviderDetails(providerId: string) {
  return useQuery<Provider, Error>({
    queryKey: ['provider', providerId],
    queryFn: () => getProviderDetails(providerId),
    enabled: !!providerId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

export function useProviderStats(providerId: string) {
  return useQuery<Provider, Error>({
    queryKey: ['provider-stats', providerId],
    queryFn: () => getProviderStats(providerId),
    enabled: !!providerId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

export function useClients() {
  return useQuery<Client[], Error>({
    queryKey: ['clients'],
    queryFn: getClients,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

export function useClientDetails(clientId: string) {
  return useQuery<Client, Error>({
    queryKey: ['client', clientId],
    queryFn: () => getClient(clientId),
    enabled: !!clientId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}

export function useClientStats(clientId: string) {
  return useQuery<Client, Error>({
    queryKey: ['client-stats', clientId],
    queryFn: () => getClientStats(clientId),
    enabled: !!clientId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}
