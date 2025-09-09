import { useState, useCallback, useEffect } from 'react';
import type {
  Policy,
  PolicyType,
  PolicyLoadingStates,
  PolicyErrorStates,
  PolicyFormState,
  ProducerTerms,
  GetProducerPoliciesResponse,
  UpdateProducerPoliciesRequest,
  UpdateProducerPoliciesResponse,
  BulkUpdatePoliciesRequest,
  UsePoliciesReturn,
  PolicyConfig,
  PolicyValidationResult
} from '@/types/policies';

/**
 * Default policy configurations
 */
const DEFAULT_POLICIES: Record<PolicyType, Omit<Policy, 'content' | 'isSaved' | 'lastUpdated'>> = {
  terms: {
    id: 'terms',
    title: 'Términos y Condiciones',
    description: 'Reglas de uso del servicio',
    icon: require('lucide-react').FileText
  },
  privacy: {
    id: 'privacy',
    title: 'Política de Privacidad',
    description: 'Manejo de datos personales',
    icon: require('lucide-react').Shield
  },
  refund: {
    id: 'refund',
    title: 'Política de Reembolso',
    description: 'Condiciones de devolución',
    icon: require('lucide-react').DollarSign
  }
};

/**
 * Maps database fields to policy types
 */
const DB_FIELD_MAP: Record<PolicyType, keyof Pick<ProducerTerms, 'terms_and_conditions' | 'privacy_policy' | 'refund_policy'>> = {
  terms: 'terms_and_conditions',
  privacy: 'privacy_policy',
  refund: 'refund_policy'
};

/**
 * Custom hook for managing producer policies
 * Provides comprehensive state management, validation, and API integration
 */
export function usePolicies(
  initialPolicies?: Partial<Record<PolicyType, string>>,
  validationConfig?: Partial<Record<PolicyType, PolicyConfig>>
): UsePoliciesReturn {
  
  // State management
  const [policies, setPolicies] = useState<Policy[]>(() => {
    return Object.entries(DEFAULT_POLICIES).map(([type, defaults]) => ({
      ...defaults,
      content: initialPolicies?.[type as PolicyType] || '',
      isSaved: Boolean(initialPolicies?.[type as PolicyType]),
      lastUpdated: initialPolicies?.[type as PolicyType] ? new Date().toISOString() : undefined
    }));
  });

  const [loading, setLoading] = useState<PolicyLoadingStates>({
    loading: false,
    updating: {
      terms: false,
      privacy: false,
      refund: false
    },
    bulkUpdating: false
  });

  const [errors, setErrors] = useState<PolicyErrorStates>({
    fetchError: undefined,
    updateErrors: {
      terms: null,
      privacy: null,
      refund: null
    },
    validationErrors: {
      terms: [],
      privacy: [],
      refund: []
    }
  });

  const [form, setForm] = useState<PolicyFormState>({
    editingId: null,
    viewingId: null,
    content: '',
    hasChanges: false,
    isValid: true
  });

  /**
   * Validates policy content
   */
  const validatePolicy = useCallback((
    policyType: PolicyType, 
    content: string
  ): PolicyValidationResult => {
    const config = validationConfig?.[policyType];
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation
    if (!content.trim()) {
      if (config?.validation.required !== false) {
        errors.push('El contenido no puede estar vacío');
      }
    } else {
      // Length validation
      if (config?.validation.minLength && content.length < config.validation.minLength) {
        errors.push(`Mínimo ${config.validation.minLength} caracteres`);
      }
      
      if (config?.validation.maxLength && content.length > config.validation.maxLength) {
        errors.push(`Máximo ${config.validation.maxLength} caracteres`);
      }
    }

    // Content-specific validation
    switch (policyType) {
      case 'terms':
        if (!content.toLowerCase().includes('términos') && !content.toLowerCase().includes('condiciones')) {
          warnings.push('Considera incluir las palabras "términos" y "condiciones"');
        }
        break;
      case 'privacy':
        if (!content.toLowerCase().includes('privacidad') && !content.toLowerCase().includes('datos')) {
          warnings.push('Considera incluir información sobre privacidad y manejo de datos');
        }
        break;
      case 'refund':
        if (!content.toLowerCase().includes('reembolso') && !content.toLowerCase().includes('devolución')) {
          warnings.push('Considera incluir información sobre reembolsos y devoluciones');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }, [validationConfig]);

  /**
   * Fetches policies for a producer
   */
  const fetchPolicies = useCallback(async (producerId: string): Promise<void> => {
    setLoading(prev => ({ ...prev, loading: true }));
    setErrors(prev => ({ ...prev, fetchError: undefined }));

    try {
      // Simulated API call - replace with actual implementation
      const response: GetProducerPoliciesResponse = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              id: '1',
              producer_id: producerId,
              terms_and_conditions: 'Sample terms...',
              privacy_policy: 'Sample privacy policy...',
              refund_policy: 'Sample refund policy...',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          });
        }, 1000);
      });

      if (response.success && response.data) {
        setPolicies(prev => prev.map(policy => ({
          ...policy,
          content: response.data![DB_FIELD_MAP[policy.id]] || '',
          isSaved: Boolean(response.data![DB_FIELD_MAP[policy.id]]),
          lastUpdated: response.data!.updated_at
        })));
      } else {
        throw new Error(response.error || 'Error al cargar políticas');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setErrors(prev => ({
        ...prev,
        fetchError: errorMessage
      }));
    } finally {
      setLoading(prev => ({ ...prev, loading: false }));
    }
  }, []);

  /**
   * Updates a single policy
   */
  const updatePolicy = useCallback(async (
    producerId: string,
    policyType: PolicyType,
    content: string
  ): Promise<void> => {
    const validation = validatePolicy(policyType, content);
    
    if (!validation.isValid) {
      setErrors(prev => ({
        ...prev,
        updateErrors: {
          ...prev.updateErrors,
          [policyType]: validation.errors.join(', ')
        },
        validationErrors: {
          ...prev.validationErrors,
          [policyType]: validation.errors
        }
      }));
      return;
    }

    setLoading(prev => ({
      ...prev,
      updating: { ...prev.updating, [policyType]: true }
    }));

    setErrors(prev => ({
      ...prev,
      updateErrors: { ...prev.updateErrors, [policyType]: null },
      validationErrors: { ...prev.validationErrors, [policyType]: [] }
    }));

    try {
      const request: UpdateProducerPoliciesRequest = {
        producer_id: producerId,
        policy_type: policyType,
        content
      };

      // Simulated API call - replace with actual implementation
      const response: UpdateProducerPoliciesResponse = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              id: '1',
              producer_id: producerId,
              [DB_FIELD_MAP[policyType]]: content,
              terms_and_conditions: policyType === 'terms' ? content : 'existing...',
              privacy_policy: policyType === 'privacy' ? content : 'existing...',
              refund_policy: policyType === 'refund' ? content : 'existing...',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            } as ProducerTerms,
            message: 'Política actualizada correctamente'
          });
        }, 800);
      });

      if (response.success && response.data) {
        setPolicies(prev => prev.map(policy =>
          policy.id === policyType
            ? {
                ...policy,
                content,
                isSaved: true,
                lastUpdated: response.data!.updated_at
              }
            : policy
        ));
      } else {
        throw new Error(response.error || 'Error al actualizar política');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setErrors(prev => ({
        ...prev,
        updateErrors: {
          ...prev.updateErrors,
          [policyType]: errorMessage
        }
      }));
    } finally {
      setLoading(prev => ({
        ...prev,
        updating: { ...prev.updating, [policyType]: false }
      }));
    }
  }, [validatePolicy]);

  /**
   * Bulk updates all policies
   */
  const bulkUpdatePolicies = useCallback(async (
    producerId: string,
    policiesData: BulkUpdatePoliciesRequest
  ): Promise<void> => {
    setLoading(prev => ({ ...prev, bulkUpdating: true }));

    try {
      // Validate all policies first
      const validationResults: Record<PolicyType, PolicyValidationResult> = {
        terms: validatePolicy('terms', policiesData.terms_and_conditions || ''),
        privacy: validatePolicy('privacy', policiesData.privacy_policy || ''),
        refund: validatePolicy('refund', policiesData.refund_policy || '')
      };

      const hasValidationErrors = Object.values(validationResults).some(result => !result.isValid);
      
      if (hasValidationErrors) {
        setErrors(prev => ({
          ...prev,
          validationErrors: {
            terms: validationResults.terms.errors,
            privacy: validationResults.privacy.errors,
            refund: validationResults.refund.errors
          }
        }));
        return;
      }

      // Simulated API call - replace with actual implementation
      const response: UpdateProducerPoliciesResponse = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            data: {
              id: '1',
              producer_id: producerId,
              terms_and_conditions: policiesData.terms_and_conditions || '',
              privacy_policy: policiesData.privacy_policy || '',
              refund_policy: policiesData.refund_policy || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            message: 'Políticas actualizadas correctamente'
          });
        }, 1200);
      });

      if (response.success && response.data) {
        setPolicies(prev => prev.map(policy => ({
          ...policy,
          content: response.data![DB_FIELD_MAP[policy.id]] || '',
          isSaved: Boolean(response.data![DB_FIELD_MAP[policy.id]]),
          lastUpdated: response.data!.updated_at
        })));
      } else {
        throw new Error(response.error || 'Error al actualizar políticas');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setErrors(prev => ({
        ...prev,
        fetchError: errorMessage
      }));
    } finally {
      setLoading(prev => ({ ...prev, bulkUpdating: false }));
    }
  }, [validatePolicy]);

  /**
   * Form management actions
   */
  const startEditing = useCallback((policyType: PolicyType, content?: string) => {
    const policy = policies.find(p => p.id === policyType);
    setForm({
      editingId: policyType,
      viewingId: null,
      content: content || policy?.content || '',
      hasChanges: false,
      isValid: true
    });
  }, [policies]);

  const cancelEditing = useCallback(() => {
    setForm({
      editingId: null,
      viewingId: null,
      content: '',
      hasChanges: false,
      isValid: true
    });
  }, []);

  const startViewing = useCallback((policyType: PolicyType) => {
    setForm(prev => ({
      ...prev,
      viewingId: policyType,
      editingId: null
    }));
  }, []);

  const stopViewing = useCallback(() => {
    setForm(prev => ({
      ...prev,
      viewingId: null
    }));
  }, []);

  const updateContent = useCallback((content: string) => {
    if (!form.editingId) return;

    const originalPolicy = policies.find(p => p.id === form.editingId);
    const validation = validatePolicy(form.editingId, content);

    setForm(prev => ({
      ...prev,
      content,
      hasChanges: content !== (originalPolicy?.content || ''),
      isValid: validation.isValid
    }));

    setErrors(prev => ({
      ...prev,
      validationErrors: {
        ...prev.validationErrors,
        [form.editingId!]: validation.errors
      }
    }));
  }, [form.editingId, policies, validatePolicy]);

  const clearErrors = useCallback((policyType?: PolicyType) => {
    if (policyType) {
      setErrors(prev => ({
        ...prev,
        updateErrors: { ...prev.updateErrors, [policyType]: null },
        validationErrors: { ...prev.validationErrors, [policyType]: [] }
      }));
    } else {
      setErrors({
        fetchError: undefined,
        updateErrors: { terms: null, privacy: null, refund: null },
        validationErrors: { terms: [], privacy: [], refund: [] }
      });
    }
  }, []);

  return {
    policies,
    loading,
    errors,
    form,
    actions: {
      fetchPolicies,
      updatePolicy,
      bulkUpdatePolicies,
      startEditing,
      cancelEditing,
      startViewing,
      stopViewing,
      updateContent,
      clearErrors
    }
  };
}