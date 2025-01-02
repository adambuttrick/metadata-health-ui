export type ResourceType = string;

export type FieldStatus = 'mandatory' | 'recommended' | 'optional';

export interface SubfieldInfo {
  count: number;
  instances: number;
  missing: number;
  completeness: number;
  values?: {
    [value: string]: number;
  };
}

export interface FieldInfo {
  count: number;
  instances: number;
  missing: number;
  fieldStatus: FieldStatus;
  completeness: number;
  subfields?: {
    [subfieldName: string]: SubfieldInfo;
  };
}

export interface CategoryStats {
  [field: string]: FieldInfo;
}

export interface CategoryCompleteness {
  completeness: number;
}

export interface CategoriesStats {
  mandatory: CategoryCompleteness;
  recommended: CategoryCompleteness;
  optional: CategoryCompleteness;
}

export interface StatsView {
  count: number;
  fields: CategoryStats;
  categories: CategoriesStats;
}

export interface Stats {
  summary: StatsView;
  byResourceType: {
    resourceTypes: {
      [resourceType: string]: StatsView;
    };
  };
}

export interface Entity {
  id: string;
  name: string;
  stats: Stats;
  type: 'providers' | 'clients';
}

export interface Provider extends Entity {
  type: 'providers';
  attributes: {
    name: string;
    displayName: string;
    symbol: string;
    website?: string;
    created: string;
    updated: string;
    description: string | null;
    isActive: boolean;
    memberType?: string;
    rorId?: string;
    isConsortium?: boolean;
    region: string;
    country: string;
    logoUrl?: string | null;
    organizationType: string;
    focusArea: string | null;
    nonProfitStatus: string;
    year?: number | null;
    joined?: string | null;
    doiEstimate: number;
  };
  relationships: {
    prefixes: string[];
    clients?: string[];
  };
}

export interface Client extends Entity {
  type: 'clients';
  attributes: {
    name: string;
    symbol: string;
    year: number;
    alternateName: string | null;
    description: string | null;
    language: string[];
    clientType: string;
    domains: string;
    re3data: string | null;
    opendoar: string | null;
    issn: Record<string, unknown>;
    url: string | null;
    created: string;
    updated: string;
    isActive: boolean;
  };
  relationships: {
    provider: string;
    prefixes: string[];
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public cause?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ClientFetchError extends ApiError {
  constructor(
    message: string,
    public clientId: string,
    statusCode?: number,
    cause?: unknown
  ) {
    super(message, statusCode, cause);
    this.name = 'ClientFetchError';
  }
}

export class PartialClientsFetchError extends ApiError {
  constructor(
    message: string,
    public failedClients: { id: string; error: Error }[],
    public successfulClients: string[],
    statusCode?: number
  ) {
    super(message, statusCode);
    this.name = 'PartialClientsFetchError';
  }
}

export class ProviderFetchError extends ApiError {
  constructor(
    message: string,
    public providerId: string,
    statusCode?: number,
    cause?: unknown
  ) {
    super(message, statusCode, cause);
    this.name = 'ProviderFetchError';
  }
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    totalPages?: number;
    page?: number;
  };
  error?: {
    message: string;
    code: string;
    details?: unknown;
  };
}

export type ProviderResponse = ApiResponse<Provider>;
export type ClientResponse = ApiResponse<Client>;
export type ProvidersResponse = ApiResponse<Provider[]>;
export type ClientsResponse = ApiResponse<Client[]>;

export interface StatsFilters {
  resourceType?: string;
  fieldStatus?: string;
  timeRange?: string;
}

export interface StatsViewOptions {
  filters?: StatsFilters;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function isProvider(entity: Entity | undefined): entity is Provider {
  return !!entity && entity.type === 'providers';
}

export function isClient(entity: Entity | undefined): entity is Client {
  return !!entity && entity.type === 'clients';
}

export function getResourceTypeStats(stats: Stats, resourceType?: string): StatsView | undefined {
  if (!resourceType) {
    return stats.summary;
  }
  return stats.byResourceType?.resourceTypes?.[resourceType];
}

export function isStats(stats: unknown): stats is Stats {
  if (typeof stats !== 'object' || stats === null) {
    return false;
  }

  const statsObj = stats as { summary?: { count?: unknown; fields?: unknown } };
  
  return (
    'summary' in stats &&
    typeof statsObj.summary === 'object' &&
    statsObj.summary !== null &&
    'count' in statsObj.summary &&
    typeof statsObj.summary.count === 'number' &&
    'fields' in statsObj.summary &&
    typeof statsObj.summary.fields === 'object' &&
    statsObj.summary.fields !== null
  );
}