import type {
  ProducerTerms,
  CreateProducerTermsInput,
  UpdateProducerTermsInput,
  GetProducerPoliciesResponse,
  UpdateProducerPoliciesRequest,
  UpdateProducerPoliciesResponse,
  BulkUpdatePoliciesRequest,
  PolicyType,
  PolicyDbFieldMap
} from '@/types/policies';

/**
 * Database field mapping for policies
 */
const POLICY_DB_FIELD_MAP: PolicyDbFieldMap = {
  terms: 'terms_and_conditions',
  privacy: 'privacy_policy',
  refund: 'refund_policy'
};

/**
 * Base API configuration
 */
const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  retries: 3
};

/**
 * Custom error class for API errors
 */
export class PoliciesApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'PoliciesApiError';
  }
}

/**
 * HTTP client with proper error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const response = await fetch(url, {
      ...defaultOptions,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new PoliciesApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.code,
        errorData.details
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof PoliciesApiError) {
      throw error;
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new PoliciesApiError('Request timeout', 408, 'TIMEOUT');
      }
      throw new PoliciesApiError(`Network error: ${error.message}`, 0, 'NETWORK_ERROR');
    }
    
    throw new PoliciesApiError('Unknown error occurred', 0, 'UNKNOWN_ERROR');
  }
}

/**
 * Validates producer terms data before sending to API
 */
function validateProducerTermsInput(
  input: CreateProducerTermsInput | UpdateProducerTermsInput
): void {
  if (!input.producer_id?.trim()) {
    throw new PoliciesApiError('Producer ID is required', 400, 'VALIDATION_ERROR');
  }

  // Validate content lengths
  const maxLength = 50000; // 50KB max per field
  const fields = [
    { name: 'terms_and_conditions', value: input.terms_and_conditions },
    { name: 'privacy_policy', value: input.privacy_policy },
    { name: 'refund_policy', value: input.refund_policy }
  ];

  for (const field of fields) {
    if (field.value && field.value.length > maxLength) {
      throw new PoliciesApiError(
        `${field.name} exceeds maximum length of ${maxLength} characters`,
        400,
        'VALIDATION_ERROR'
      );
    }
  }
}

/**
 * Transforms database response to typed ProducerTerms
 */
function transformProducerTermsResponse(data: any): ProducerTerms {
  return {
    id: String(data.id),
    producer_id: String(data.producer_id),
    terms_and_conditions: data.terms_and_conditions || null,
    privacy_policy: data.privacy_policy || null,
    refund_policy: data.refund_policy || null,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
}

/**
 * API Functions
 */

/**
 * Fetches producer policies from the database
 * 
 * @param producerId - The producer ID to fetch policies for
 * @returns Promise resolving to producer policies response
 * 
 * @example
 * ```typescript
 * try {
 *   const response = await getProducerPolicies('producer-123');
 *   if (response.success && response.data) {
 *     console.log('Terms:', response.data.terms_and_conditions);
 *   }
 * } catch (error) {
 *   if (error instanceof PoliciesApiError) {
 *     console.error('API Error:', error.message, error.statusCode);
 *   }
 * }
 * ```
 */
export async function getProducerPolicies(
  producerId: string
): Promise<GetProducerPoliciesResponse> {
  if (!producerId?.trim()) {
    return {
      success: false,
      error: 'Producer ID is required'
    };
  }

  try {
    const data = await apiRequest<any>(`/producers/${producerId}/policies`);
    
    return {
      success: true,
      data: data ? transformProducerTermsResponse(data) : undefined
    };
  } catch (error) {
    const apiError = error instanceof PoliciesApiError ? error : new PoliciesApiError('Unknown error');
    return {
      success: false,
      error: apiError.message
    };
  }
}

/**
 * Creates new producer policies
 * 
 * @param input - Producer terms creation data
 * @returns Promise resolving to creation response
 */
export async function createProducerPolicies(
  input: CreateProducerTermsInput
): Promise<UpdateProducerPoliciesResponse> {
  try {
    validateProducerTermsInput(input);

    const data = await apiRequest<any>('/producers/policies', {
      method: 'POST',
      body: JSON.stringify(input)
    });

    return {
      success: true,
      data: transformProducerTermsResponse(data),
      message: 'Policies created successfully'
    };
  } catch (error) {
    const apiError = error instanceof PoliciesApiError ? error : new PoliciesApiError('Unknown error');
    return {
      success: false,
      error: apiError.message
    };
  }
}

/**
 * Updates a specific policy for a producer
 * 
 * @param request - Update request with producer ID, policy type, and content
 * @returns Promise resolving to update response
 * 
 * @example
 * ```typescript
 * const response = await updateProducerPolicy({
 *   producer_id: 'producer-123',
 *   policy_type: 'terms',
 *   content: 'Updated terms and conditions content...'
 * });
 * ```
 */
export async function updateProducerPolicy(
  request: UpdateProducerPoliciesRequest
): Promise<UpdateProducerPoliciesResponse> {
  try {
    const { producer_id, policy_type, content } = request;
    
    if (!producer_id?.trim()) {
      throw new PoliciesApiError('Producer ID is required', 400, 'VALIDATION_ERROR');
    }

    if (!['terms', 'privacy', 'refund'].includes(policy_type)) {
      throw new PoliciesApiError('Invalid policy type', 400, 'VALIDATION_ERROR');
    }

    if (!content?.trim()) {
      throw new PoliciesApiError('Content is required', 400, 'VALIDATION_ERROR');
    }

    // Transform to database field structure
    const dbField = POLICY_DB_FIELD_MAP[policy_type];
    const updateData: UpdateProducerTermsInput = {
      producer_id,
      [dbField]: content
    };

    validateProducerTermsInput(updateData);

    const data = await apiRequest<any>(`/producers/${producer_id}/policies`, {
      method: 'PATCH',
      body: JSON.stringify(updateData)
    });

    return {
      success: true,
      data: transformProducerTermsResponse(data),
      message: `${policy_type} policy updated successfully`
    };
  } catch (error) {
    const apiError = error instanceof PoliciesApiError ? error : new PoliciesApiError('Unknown error');
    return {
      success: false,
      error: apiError.message
    };
  }
}

/**
 * Bulk updates all policies for a producer
 * 
 * @param request - Bulk update request with all policy contents
 * @returns Promise resolving to bulk update response
 * 
 * @example
 * ```typescript
 * const response = await bulkUpdateProducerPolicies({
 *   producer_id: 'producer-123',
 *   terms_and_conditions: 'New terms...',
 *   privacy_policy: 'New privacy policy...',
 *   refund_policy: 'New refund policy...'
 * });
 * ```
 */
export async function bulkUpdateProducerPolicies(
  request: BulkUpdatePoliciesRequest
): Promise<UpdateProducerPoliciesResponse> {
  try {
    const updateData: UpdateProducerTermsInput = {
      producer_id: request.producer_id,
      terms_and_conditions: request.terms_and_conditions,
      privacy_policy: request.privacy_policy,
      refund_policy: request.refund_policy
    };

    validateProducerTermsInput(updateData);

    const data = await apiRequest<any>(`/producers/${request.producer_id}/policies/bulk`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });

    return {
      success: true,
      data: transformProducerTermsResponse(data),
      message: 'All policies updated successfully'
    };
  } catch (error) {
    const apiError = error instanceof PoliciesApiError ? error : new PoliciesApiError('Unknown error');
    return {
      success: false,
      error: apiError.message
    };
  }
}

/**
 * Deletes all policies for a producer
 * 
 * @param producerId - The producer ID to delete policies for
 * @returns Promise resolving to deletion response
 */
export async function deleteProducerPolicies(
  producerId: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  if (!producerId?.trim()) {
    return {
      success: false,
      error: 'Producer ID is required'
    };
  }

  try {
    await apiRequest<any>(`/producers/${producerId}/policies`, {
      method: 'DELETE'
    });

    return {
      success: true,
      message: 'Policies deleted successfully'
    };
  } catch (error) {
    const apiError = error instanceof PoliciesApiError ? error : new PoliciesApiError('Unknown error');
    return {
      success: false,
      error: apiError.message
    };
  }
}

/**
 * Utility function to get a specific policy content
 * 
 * @param producerId - Producer ID
 * @param policyType - Policy type to retrieve
 * @returns Promise resolving to policy content or null
 */
export async function getSpecificPolicy(
  producerId: string,
  policyType: PolicyType
): Promise<string | null> {
  const response = await getProducerPolicies(producerId);
  
  if (!response.success || !response.data) {
    return null;
  }

  const dbField = POLICY_DB_FIELD_MAP[policyType];
  return response.data[dbField] || null;
}

/**
 * Utility function to check if producer has any policies
 * 
 * @param producerId - Producer ID to check
 * @returns Promise resolving to boolean indicating if policies exist
 */
export async function hasAnyPolicies(producerId: string): Promise<boolean> {
  const response = await getProducerPolicies(producerId);
  
  if (!response.success || !response.data) {
    return false;
  }

  const { terms_and_conditions, privacy_policy, refund_policy } = response.data;
  return Boolean(terms_and_conditions || privacy_policy || refund_policy);
}

/**
 * Utility function to validate policy content length
 * 
 * @param content - Content to validate
 * @param maxLength - Maximum allowed length (default: 50000)
 * @returns Validation result with error message if invalid
 */
export function validatePolicyContent(
  content: string,
  maxLength: number = 50000
): { isValid: boolean; error?: string } {
  if (!content?.trim()) {
    return {
      isValid: false,
      error: 'Content cannot be empty'
    };
  }

  if (content.length > maxLength) {
    return {
      isValid: false,
      error: `Content exceeds maximum length of ${maxLength} characters`
    };
  }

  return { isValid: true };
}

/**
 * Export types for external use
 */
export type {
  ProducerTerms,
  CreateProducerTermsInput,
  UpdateProducerTermsInput,
  GetProducerPoliciesResponse,
  UpdateProducerPoliciesRequest,
  UpdateProducerPoliciesResponse,
  BulkUpdatePoliciesRequest,
  PolicyType
} from '@/types/policies';