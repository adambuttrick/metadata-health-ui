'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useProviders, useClients } from '@/lib/hooks/use-entities';
import { useProviderNavigation } from '@/lib/hooks/use-provider-navigation';
import { Provider, Client } from '@/lib/types/api';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Text } from '@/components/typography/typography';

interface EntitySearchProps {
  mode: 'selection' | 'navigation';
  selectedItems?: (Provider | Client)[];
  onSelect?: (item: Provider | Client) => void;
  className?: string;
}

function isProvider(item: Provider | Client): item is Provider {
  return item.type === 'providers';
}

function isClient(item: Provider | Client): item is Client {
  return item.type === 'clients';
}

export function EntitySearch({ 
  mode, 
  selectedItems = [], 
  onSelect, 
  className 
}: EntitySearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { navigateToProvider } = useProviderNavigation();
  const { data: providers = [], isLoading: isLoadingProviders } = useProviders();
  const { data: clients = [], isLoading: isLoadingClients } = useClients();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && event.target instanceof Node && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        break;
    }
  };

  const validateSearch = (value: string) => {
    if (value.length > 0 && value.length < 2) {
      return 'Please enter at least 2 characters';
    }
    return undefined;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setError(validateSearch(value));
    setIsOpen(value.length >= 2);
  };

  const filteredProviders = useMemo((): Provider[] => {
    if (!searchTerm || searchTerm.length < 2) return [];
    return providers.filter(provider => {
      const searchLower = searchTerm.toLowerCase();
      return (
        provider.attributes.name.toLowerCase().includes(searchLower) ||
        provider.attributes.symbol?.toLowerCase().includes(searchLower)
      );
    });
  }, [providers, searchTerm]);

  const filteredClients = useMemo((): Client[] => {
    if (!searchTerm || searchTerm.length < 2) return [];
    return clients.filter(client => {
      const searchLower = searchTerm.toLowerCase();
      return (
        client.attributes.name.toLowerCase().includes(searchLower) ||
        client.attributes.symbol?.toLowerCase().includes(searchLower)
      );
    });
  }, [clients, searchTerm]);

  const isItemSelected = (item: Provider | Client): boolean => {
    return selectedItems?.some(selectedItem => selectedItem.id === item.id) ?? false;
  };

  const handleSelect = (item: Provider | Client) => {
    if (!item || !item.id) {
      console.error('Invalid item data:', item);
      return;
    }

    if (mode === 'selection' && isItemSelected(item)) {
      return;
    }

    if (mode === 'navigation') {
      if (isClient(item)) {
        const providerId = item.relationships?.provider;
        if (!providerId) {
          console.error('Provider relationship not found for client:', item);
          return;
        }
        navigateToProvider({
          providerId,
          clientId: item.id,
          view: 'summary'
        });
      } else if (isProvider(item)) {
        navigateToProvider({
          providerId: item.id,
          view: 'summary'
        });
      }
    } else {
      onSelect?.(item);
    }

    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="relative" ref={searchRef}>
        <div
          className="relative"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="search-results"
        >
          <Search
            className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            className={cn("w-full pl-9 pr-4 text-center")}
            placeholder="Northwestern University, Zenodo..."
            aria-label="Search organizations and repositories"
          />
        </div>

        {error && (
          <Text variant="small" className="mt-2 text-destructive" role="alert">
            {error}
          </Text>
        )}

        {isOpen && (
          <Card className="absolute z-50 mt-2 w-full overflow-hidden">
            <div
              className="max-h-[300px] overflow-y-auto p-2"
              role="listbox"
              aria-label="Search results"
            >
              {(isLoadingProviders || isLoadingClients) && (
                <div className="flex items-center justify-center p-4">
                  <Spinner size="md" className="text-datacite-dark-blue" />
                </div>
              )}

              {!isLoadingProviders && !isLoadingClients && 
               filteredProviders.length === 0 && filteredClients.length === 0 && (
                <Text variant="small" className="p-2 text-muted-foreground">No results found</Text>
              )}

              {filteredProviders.length > 0 && (
                <div className="mb-2">
                  <Text variant="small" className="px-2 py-1.5 font-medium text-muted-foreground">
                    Organizations
                  </Text>
                  {filteredProviders.map((provider) => {
                    const isSelected = mode === 'selection' && isItemSelected(provider);
                    return (
                      <button
                        key={provider.id}
                        onClick={() => !isSelected && handleSelect(provider)}
                        className={cn(
                          "w-full rounded-sm px-2 py-1.5 text-left",
                          isSelected 
                            ? "cursor-not-allowed" 
                            : "hover:bg-accent cursor-pointer"
                        )}
                        role="option"
                        aria-disabled={isSelected}
                        aria-selected={isSelected}
                      >
                        <Text variant="small" className={cn(isSelected ? "text-muted-foreground/50" : "")}>
                          {provider.attributes.name}
                          {isSelected && (
                            <span className="ml-2 text-xs text-muted-foreground/50">(Already Selected)</span>
                          )}
                        </Text>
                      </button>
                    );
                  })}
                </div>
              )}

              {filteredClients.length > 0 && (
                <div>
                  <Text variant="small" className="px-2 py-1.5 font-medium text-muted-foreground">
                    Repositories
                  </Text>
                  {filteredClients.map((client) => {
                    const isSelected = mode === 'selection' && isItemSelected(client);
                    return (
                      <button
                        key={client.id}
                        onClick={() => !isSelected && handleSelect(client)}
                        className={cn(
                          "w-full rounded-sm px-2 py-1.5 text-left",
                          isSelected 
                            ? "cursor-not-allowed" 
                            : "hover:bg-accent cursor-pointer"
                        )}
                        role="option"
                        aria-disabled={isSelected}
                        aria-selected={isSelected}
                      >
                        <Text variant="small" className={cn(isSelected ? "text-muted-foreground/50" : "")}>
                          {client.attributes.name}
                          {isSelected && (
                            <span className="ml-2 text-xs text-muted-foreground/50">(Already Selected)</span>
                          )}
                        </Text>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
