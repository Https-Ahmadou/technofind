// ─────────────────────────────────────────────────────────────────────────────
// TYPES GLOBAUX — TechnoFind
// ─────────────────────────────────────────────────────────────────────────────

// ── Utilisateur ───────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'premium';
  language: string;
  createdAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  layout: 'list' | 'grid' | 'magazine';
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  categories: string[];
  sources: string[];
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  push: boolean;
  email: boolean;
  breakingNews: boolean;
  digest: 'never' | 'daily' | 'weekly';
  quietHoursStart?: string; // "22:00"
  quietHoursEnd?: string;   // "07:00"
}

// ── Article ───────────────────────────────────────────────────────────────────
export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  author?: string;
  source: ArticleSource;
  category: ArticleCategory;
  publishedAt: string;
  tags: string[];
  media?: ArticleMedia[];
  language: string;
  region?: string;
  url: string;
  readTime?: number; // minutes
  relevanceScore?: number;
}

export interface ArticleSource {
  id: string;
  name: string;
  url: string;
  logo?: string;
  reliability?: number; // 1-5
}

export interface ArticleMedia {
  url: string;
  type: 'image' | 'video';
  alt?: string;
  width?: number;
  height?: number;
}

export type ArticleCategory =
  | 'politique'
  | 'economie'
  | 'technologie'
  | 'sport'
  | 'science'
  | 'sante'
  | 'culture'
  | 'environnement'
  | 'monde'
  | 'societe';

// ── Recherche ─────────────────────────────────────────────────────────────────
export interface SearchFilters {
  query: string;
  category?: ArticleCategory;
  source?: string;
  dateRange?: 'hour' | 'day' | 'week' | 'month' | 'custom';
  dateFrom?: string;
  dateTo?: string;
  region?: string;
  language?: string;
  sortBy?: 'relevance' | 'date' | 'popularity';
}

export interface SearchResult {
  articles: Article[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ── Alertes ───────────────────────────────────────────────────────────────────
export interface Alert {
  id: string;
  userId: string;
  keyword: string;
  category?: ArticleCategory;
  sources?: string[];
  frequency: 'immediate' | 'daily' | 'weekly';
  threshold: number; // 0-1 pertinence
  active: boolean;
  createdAt: string;
}

// ── Tendances ─────────────────────────────────────────────────────────────────
export interface Trend {
  id: string;
  topic: string;
  articleCount: number;
  change: number; // % vs période précédente
  category: ArticleCategory;
  region: 'local' | 'world';
  history: TrendPoint[];
}

export interface TrendPoint {
  timestamp: string;
  count: number;
}

// ── API Responses ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status: number;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}
