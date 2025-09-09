/**
 * TypeScript types for Producer Policies feature
 * Handles integration between frontend components and backend API
 */

// Backend database entity (matches producers_terms table)
export interface ProducerTermsDB {
  id: string;
  producer_id: string;
  terms_and_conditions: string | null;
  privacy_policy: string | null;
  refund_policy: string | null;
  created_at: string;
  updated_at: string;
}

// Frontend policy display object (matches component structure)
export interface PolicyItem {
  id: PolicyType;
  title: string;
  description: string;
  icon: any; // Lucide React icon component
  content: string;
}

// Union type for policy types
export type PolicyType = 'terms' | 'privacy' | 'refund';

// Mapping between frontend IDs and backend fields
export const POLICY_FIELD_MAP: Record<PolicyType, keyof ProducerTermsDB> = {
  'terms': 'terms_and_conditions',
  'privacy': 'privacy_policy', 
  'refund': 'refund_policy'
} as const;

// API Response wrapper
export interface PoliciesApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API request for creating/updating policies
export interface PoliciesUpdateRequest {
  producer_id: string;
  terms_and_conditions?: string;
  privacy_policy?: string;
  refund_policy?: string;
}

// Component state interface
export interface PoliciesState {
  policies: PolicyItem[];
  loading: boolean;
  error: string | null;
  editingId: string | null;
  viewingId: string | null;
  content: string;
  saving: boolean;
}

// Loading state for individual policies
export interface PolicyLoadingState {
  fetching: boolean;
  saving: boolean;
  error: string | null;
}

// API service interface
export interface PoliciesApiService {
  getPolicies: (producerId: string) => Promise<PoliciesApiResponse<ProducerTermsDB>>;
  updatePolicies: (producerId: string, data: Partial<PoliciesUpdateRequest>) => Promise<PoliciesApiResponse<ProducerTermsDB>>;
  createPolicies: (data: PoliciesUpdateRequest) => Promise<PoliciesApiResponse<ProducerTermsDB>>;
}

/**
 * Utility functions for converting between backend and frontend formats
 */

/**
 * Converts backend database entity to frontend policy items
 * @param dbData - Database entity from producers_terms table
 * @returns Array of PolicyItem objects for frontend display
 */
export function convertDbToPolicyItems(dbData: ProducerTermsDB | null): PolicyItem[] {
  const defaultPolicies: Omit<PolicyItem, 'content'>[] = [
    {
      id: 'terms',
      title: 'Términos y Condiciones',
      description: 'Reglas de uso del servicio',
      icon: 'FileText'
    },
    {
      id: 'privacy', 
      title: 'Política de Privacidad',
      description: 'Manejo de datos personales',
      icon: 'Shield'
    },
    {
      id: 'refund',
      title: 'Política de Reembolso', 
      description: 'Condiciones de devolución',
      icon: 'DollarSign'
    }
  ];

  return defaultPolicies.map(policy => ({
    ...policy,
    content: dbData?.[POLICY_FIELD_MAP[policy.id]] || ''
  }));
}

/**
 * Converts frontend policy update to backend request format
 * @param policyId - Frontend policy ID ('terms', 'privacy', 'refund')
 * @param content - Policy content string
 * @param producerId - Producer UUID
 * @returns Backend API request object
 */
export function convertPolicyUpdateToRequest(
  policyId: PolicyType, 
  content: string, 
  producerId: string
): PoliciesUpdateRequest {
  const request: PoliciesUpdateRequest = {
    producer_id: producerId
  };
  
  const backendField = POLICY_FIELD_MAP[policyId];
  (request as any)[backendField] = content;
  
  return request;
}

/**
 * Default empty state for policies component
 */
export const defaultPoliciesState: PoliciesState = {
  policies: [],
  loading: true,
  error: null,
  editingId: null,
  viewingId: null,
  content: '',
  saving: false
};