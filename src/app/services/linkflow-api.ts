export interface Link {
  id: string;
  slug?: string;
  shortUrl: string;
  originalUrl: string;
  title: string;
  channel?: string;
  clicks: number;
  uniqueVisitors?: number;
  status: 'active' | 'paused' | 'blocked' | 'expired';
  createdAt: string;
  expiresAt?: string;
}

export interface DashboardStats {
  totalLinks: number;
  totalClicks: number;
  activeLinks: number;
  clicksToday: number;
  clicksGrowth: number;
  linksGrowth: number;
}

export interface Alert {
  id: string;
  linkId: string;
  shortUrl: string;
  title: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  reason: string[];
  detectedAt: string;
  status: 'pending' | 'approved' | 'blocked' | 'blacklisted';
  clicks?: number;
  reporter: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: string;
  status?: string;
  createdAt?: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}

export interface CreateLinkPayload {
  originalUrl: string;
  title: string;
  customSlug?: string;
  channel?: string;
  expiresAt?: string;
}

export interface UpdateLinkPayload {
  title?: string;
  originalUrl?: string;
  expiresAt?: string | null;
  status?: Link['status'];
}

export interface BackendHealth {
  status: string;
  components?: Record<string, unknown>;
}

interface ApiEnvelope<T> {
  request_id?: string;
  data: T;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  } | null;
  meta?: Record<string, unknown>;
}

const apiBaseUrl = ((import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8080').replace(/\/$/, '');
const sessionLinksKey = 'linkflow.session.created-links';

export const backendCapabilities = {
  health: {
    available: true,
    summary: 'Spring Boot health endpoint is available at GET /actuator/health.',
  },
  authRegister: {
    available: true,
    summary: 'Registration is wired to POST /api/v1/auth/register.',
  },
  authLogin: {
    available: false,
    summary: 'Login endpoint is not implemented in the current backend snapshot.',
  },
  linksCreate: {
    available: true,
    summary: 'Short URL creation is wired to POST /api/short-urls.',
  },
  linksList: {
    available: false,
    summary: 'The backend does not expose a list endpoint yet, so the UI can only show links created from this browser session.',
  },
  linkDetail: {
    available: false,
    summary: 'The backend does not expose a detail endpoint yet.',
  },
  linkUpdate: {
    available: false,
    summary: 'The backend does not expose an update endpoint yet.',
  },
  linkDelete: {
    available: false,
    summary: 'The backend does not expose a delete endpoint yet.',
  },
  dashboard: {
    available: false,
    summary: 'The backend does not expose dashboard summary metrics yet.',
  },
  alerts: {
    available: false,
    summary: 'The backend does not expose risk alert APIs yet.',
  },
  monitoring: {
    available: false,
    summary: 'The backend does not expose monitoring metrics beyond actuator health yet.',
  },
} as const;

export class ApiClientError extends Error {
  status: number;
  code: string;
  details: Record<string, unknown>;
  requestId?: string;

  constructor(
    status: number,
    code: string,
    message: string,
    details: Record<string, unknown> = {},
    requestId?: string,
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.requestId = requestId;
  }
}

export class ApiFeatureUnavailableError extends ApiClientError {
  feature: string;

  constructor(feature: string, message: string) {
    super(501, 'FEATURE_UNAVAILABLE', message, { feature });
    this.name = 'ApiFeatureUnavailableError';
    this.feature = feature;
  }
}

export function isFeatureUnavailableError(error: unknown): error is ApiFeatureUnavailableError {
  return error instanceof ApiFeatureUnavailableError;
}

function getAccessToken(): string | null {
  return localStorage.getItem('accessToken');
}

function toIsoDate(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  if (value.includes('T')) {
    return value;
  }

  return `${value}T00:00:00Z`;
}

function readSessionLinks(): Link[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = window.sessionStorage.getItem(sessionLinksKey);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Link[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSessionLinks(links: Link[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(sessionLinksKey, JSON.stringify(links));
}

function upsertSessionLink(link: Link): void {
  const existing = readSessionLinks();
  const next = [link, ...existing.filter((item) => item.id !== link.id)];
  next.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  writeSessionLinks(next);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);

  if (!headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json');
  }

  const accessToken = getAccessToken();
  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers,
    });
  } catch (error) {
    throw new ApiClientError(
      0,
      'NETWORK_ERROR',
      'Unable to reach the backend service. Check that the server is running and CORS is configured.',
      error instanceof Error ? { cause: error.message } : {},
    );
  }

  const requestId = response.headers.get('X-Request-Id') ?? undefined;
  const payload = await response.json().catch(() => null) as ApiEnvelope<T> | T | null;

  if (!response.ok) {
    if (payload && typeof payload === 'object' && 'error' in payload && (payload as ApiEnvelope<T>).error) {
      const envelope = payload as ApiEnvelope<T>;
      throw new ApiClientError(
        response.status,
        envelope.error?.code ?? 'HTTP_ERROR',
        envelope.error?.message ?? `Request failed with status ${response.status}.`,
        envelope.error?.details ?? {},
        envelope.request_id ?? requestId,
      );
    }

    throw new ApiClientError(response.status, 'HTTP_ERROR', `Request failed with status ${response.status}.`, {}, requestId);
  }

  if (payload && typeof payload === 'object' && 'error' in payload && (payload as ApiEnvelope<T>).error) {
    const envelope = payload as ApiEnvelope<T>;
    throw new ApiClientError(
      response.status,
      envelope.error?.code ?? 'HTTP_ERROR',
      envelope.error?.message ?? 'Request failed.',
      envelope.error?.details ?? {},
      envelope.request_id ?? requestId,
    );
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T;
}

function mapAuthUser(source: Record<string, unknown>): AuthUser {
  return {
    id: String(source.id),
    email: String(source.email),
    username: String(source.username),
    role: String(source.role),
    status: source.status ? String(source.status) : undefined,
    createdAt: source.created_at ? String(source.created_at) : undefined,
  };
}

function buildDefaultTitle(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return url;
  }
}

function mapCreatedLink(source: Record<string, unknown>, payload: CreateLinkPayload): Link {
  const slug = String(source.slug ?? source.id ?? Date.now());
  const rawShortUrl = String(source.short_url ?? source.shortUrl ?? `/api/short-urls/${slug}`);

  return {
    id: slug,
    slug,
    shortUrl: resolveShortUrl(rawShortUrl),
    originalUrl: String(source.long_url ?? source.longUrl ?? payload.originalUrl),
    title: payload.title.trim() || buildDefaultTitle(payload.originalUrl),
    channel: payload.channel,
    clicks: 0,
    uniqueVisitors: 0,
    status: 'active',
    createdAt: new Date().toISOString(),
    expiresAt: toIsoDate(payload.expiresAt),
  };
}

export function resolveShortUrl(shortUrl: string): string {
  if (/^https?:\/\//i.test(shortUrl)) {
    return shortUrl;
  }

  if (shortUrl.startsWith('/')) {
    return `${apiBaseUrl}${shortUrl}`;
  }

  if (/^[^/]+\.[^/]+/.test(shortUrl)) {
    return `https://${shortUrl}`;
  }

  return `${apiBaseUrl}/${shortUrl.replace(/^\/+/, '')}`;
}

export function formatShortUrl(shortUrl: string): string {
  const absoluteUrl = resolveShortUrl(shortUrl);

  try {
    const parsed = new URL(absoluteUrl);
    return `${parsed.host}${parsed.pathname}`;
  } catch {
    return shortUrl;
  }
}

export const api = {
  config: {
    mode: 'live',
    baseUrl: apiBaseUrl,
  },
  capabilities: backendCapabilities,

  async getBackendHealth(): Promise<BackendHealth> {
    return request<BackendHealth>('/actuator/health');
  },

  async register(payload: RegisterPayload): Promise<AuthUser> {
    const data = await request<Record<string, unknown>>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return mapAuthUser(data);
  },

  async getLinks(): Promise<Link[]> {
    return structuredClone(readSessionLinks());
  },

  async getLink(id: string): Promise<Link> {
    const link = readSessionLinks().find((item) => item.id === id || item.slug === id);

    if (!link) {
      throw new ApiFeatureUnavailableError(
        'links.detail',
        'The backend does not expose a link detail endpoint yet. Only links created in this browser session are available.',
      );
    }

    return structuredClone(link);
  },

  async createLink(payload: CreateLinkPayload): Promise<Link> {
    const data = await request<Record<string, unknown>>('/api/short-urls', {
      method: 'POST',
      body: JSON.stringify({
        longUrl: payload.originalUrl,
      }),
    });

    const link = mapCreatedLink(data, payload);
    upsertSessionLink(link);
    return structuredClone(link);
  },

  async updateLink(_id: string, _payload: UpdateLinkPayload): Promise<Link> {
    throw new ApiFeatureUnavailableError('links.update', backendCapabilities.linkUpdate.summary);
  },

  async deleteLink(_id: string): Promise<void> {
    throw new ApiFeatureUnavailableError('links.delete', backendCapabilities.linkDelete.summary);
  },

  async getDashboardStats(): Promise<DashboardStats> {
    throw new ApiFeatureUnavailableError('dashboard', backendCapabilities.dashboard.summary);
  },

  async getAlerts(): Promise<Alert[]> {
    throw new ApiFeatureUnavailableError('alerts', backendCapabilities.alerts.summary);
  },

  async updateAlert(_id: string, _status: 'approved' | 'blocked' | 'blacklisted'): Promise<Alert> {
    throw new ApiFeatureUnavailableError('alerts.review', backendCapabilities.alerts.summary);
  },
};
