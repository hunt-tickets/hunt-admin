/**
 * Centralized type exports for the Hunt Admin Panel
 * This file provides a single import point for all TypeScript types
 */

// Core types
export type { Producer, ProducerSettings, SocialMediaLinks, LogoFiles, LogoPreviews, LogoLoadingStates } from './producer';
export type { TabItem, TabId, VerticalTabsProps, TabContentProps } from './tabs';

// Policies types - comprehensive export
export type {
  // Core policy types
  PolicyType,
  Policy,
  ProducerTerms,
  PolicyConfig,
  PolicyValidation,
  PolicyValidationResult,
  PolicyDbFieldMap,
  
  // Input/Output types
  CreateProducerTermsInput,
  UpdateProducerTermsInput,
  GetProducerPoliciesResponse,
  UpdateProducerPoliciesRequest,
  UpdateProducerPoliciesResponse,
  BulkUpdatePoliciesRequest,
  
  // State management types
  PolicyLoadingStates,
  PolicyErrorStates,
  PolicyFormState,
  UsePoliciesReturn,
  
  // Component prop types
  PoliciesTabProps,
  PolicyModalProps,
  
  // Audit and tracking types
  PolicyAuditLog,
  
  // Type guards
  isPolicyType
} from './policies';

// Re-export utility types for convenience
export type {
  // React types for icons
  LucideIcon
} from 'lucide-react';

/**
 * Common utility types used across the application
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

/**
 * Generic loading state for async operations
 */
export interface LoadingState<T extends string = string> {
  loading: boolean;
  operations: Record<T, boolean>;
}

/**
 * Generic error state for operations
 */
export interface ErrorState<T extends string = string> {
  globalError?: string;
  fieldErrors: Record<T, string | null>;
  validationErrors: Record<T, string[]>;
}

/**
 * Generic form state
 */
export interface FormState<T = any> {
  data: T;
  isDirty: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  hasChanges: boolean;
}

/**
 * Pagination state
 */
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Sort configuration
 */
export interface SortConfig<T extends string = string> {
  field: T;
  direction: 'asc' | 'desc';
}

/**
 * Filter configuration
 */
export interface FilterConfig<T = any> {
  filters: Record<string, T>;
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

/**
 * Modal state
 */
export interface ModalState<T = any> {
  isOpen: boolean;
  mode: 'view' | 'create' | 'edit' | 'delete';
  data?: T;
}

/**
 * Theme configuration
 */
export type ThemeMode = 'system' | 'light' | 'dark';

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  accentColor?: string;
}

/**
 * User role and permission types
 */
export type UserRole = 'admin' | 'producer' | 'staff' | 'viewer';

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface UserPermissions {
  role: UserRole;
  permissions: Permission[];
  customPermissions?: Record<string, boolean>;
}

/**
 * Database entity base interface
 */
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Audit trail interface
 */
export interface AuditTrail extends BaseEntity {
  entity_type: string;
  entity_id: string;
  action: 'create' | 'update' | 'delete';
  changes?: Record<string, any>;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
}

/**
 * File upload types
 */
export interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

export interface FileUploadConfig {
  maxSize: number;
  allowedTypes: string[];
  multiple?: boolean;
}

/**
 * Notification types
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  actions?: Array<{
    label: string;
    handler: () => void;
  }>;
}

/**
 * Analytics and metrics types
 */
export interface MetricData {
  label: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  format?: 'number' | 'currency' | 'percentage';
}

export interface ChartDataPoint {
  label: string;
  value: number;
  date?: string;
  category?: string;
}

export interface AnalyticsTimeRange {
  start: string;
  end: string;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

/**
 * Integration and webhook types
 */
export interface WebhookConfig {
  url: string;
  events: string[];
  secret?: string;
  active: boolean;
  retryConfig?: {
    maxAttempts: number;
    backoffMultiplier: number;
  };
}

export interface IntegrationStatus {
  connected: boolean;
  lastSync?: string;
  error?: string;
  health: 'healthy' | 'warning' | 'error';
}

/**
 * Export validation utilities
 */
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s-()]+$/,
  url: /^https?:\/\/.+/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
} as const;

/**
 * Common validation functions
 */
export const ValidationHelpers = {
  isEmail: (value: string): boolean => ValidationPatterns.email.test(value),
  isPhone: (value: string): boolean => ValidationPatterns.phone.test(value),
  isUrl: (value: string): boolean => ValidationPatterns.url.test(value),
  isSlug: (value: string): boolean => ValidationPatterns.slug.test(value),
  isUuid: (value: string): boolean => ValidationPatterns.uuid.test(value),
  
  isRequired: (value: any): boolean => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return value != null;
  },
  
  minLength: (value: string, min: number): boolean => value.length >= min,
  maxLength: (value: string, max: number): boolean => value.length <= max,
  
  isPositiveNumber: (value: number): boolean => typeof value === 'number' && value > 0,
  isInteger: (value: number): boolean => Number.isInteger(value)
} as const;