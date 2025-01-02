import { useSearchParams, useRouter } from 'next/navigation';
import { useCallback } from 'react';

interface ProviderNavigationParams {
  providerId?: string;
  clientId?: string;
  view?: string;
}

export function useProviderNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentParams: ProviderNavigationParams = {
    clientId: searchParams.get('client') || undefined,
    view: searchParams.get('view') || 'summary',
  };

  const navigateToProvider = useCallback(
    (params: ProviderNavigationParams) => {
      const { providerId, clientId, view = 'summary' } = params;
      if (!providerId) return;

      const queryParams = new URLSearchParams();
      if (view) queryParams.set('view', view);
      if (clientId) queryParams.set('client', clientId);

      const queryString = queryParams.toString();
      const url = `/providers/${providerId}${queryString ? `?${queryString}` : ''}`;
      router.push(url);
    },
    [router]
  );

  return {
    currentParams,
    navigateToProvider,
  };
}
