import { useState, useEffect } from 'react';
import { PolicyItem, PolicyType, convertDbToPolicyItems, convertPolicyUpdateToRequest } from '@/types/policies';
import { ProducerTerms } from '@/lib/db';

interface UsePoliciesProps {
  producerId?: string;
}

export function usePolicies({ producerId }: UsePoliciesProps) {
  const [policies, setPolicies] = useState<PolicyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const loadPolicies = async () => {
    if (!producerId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/producers/${producerId}/policies`);
      
      if (response.ok) {
        const data: ProducerTerms | null = await response.json();
        const policyItems = convertDbToPolicyItems(data);
        setPolicies(policyItems);
      } else {
        // For any non-200 status, just show default empty policies
        // This handles 404 (no policies yet) and other errors gracefully
        console.warn(`API returned ${response.status}: ${response.statusText}`);
        const defaultPolicies = convertDbToPolicyItems(null);
        setPolicies(defaultPolicies);
      }
    } catch (err) {
      console.error('Error loading policies:', err);
      setError('Error al cargar las políticas');
      // Show default policies even on error
      const defaultPolicies = convertDbToPolicyItems(null);
      setPolicies(defaultPolicies);
    } finally {
      setLoading(false);
    }
  };

  const updatePolicy = async (policyType: PolicyType, content: string): Promise<boolean> => {
    if (!producerId) return false;
    
    setSaving(true);
    setError(null);
    
    try {
      const updateRequest = convertPolicyUpdateToRequest(policyType, content, producerId);
      
      const response = await fetch(`/api/producers/${producerId}/policies`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateRequest),
      });
      
      if (response.ok) {
        const updatedData: ProducerTerms = await response.json();
        const updatedPolicies = convertDbToPolicyItems(updatedData);
        setPolicies(updatedPolicies);
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        return true;
      } else {
        // Handle API errors gracefully without throwing
        try {
          const errorData = await response.json();
          setError(errorData.error || `Error ${response.status}: ${response.statusText}`);
        } catch (parseError) {
          // If we can't parse the error response, use a generic message
          setError(`Error ${response.status}: No se pudo guardar la política`);
        }
        return false;
      }
    } catch (err) {
      console.error('Error updating policy:', err);
      setError(err instanceof Error ? err.message : 'Error al guardar la política');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const getPolicy = (policyType: PolicyType): PolicyItem | undefined => {
    return policies.find(policy => policy.id === policyType);
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    loadPolicies();
  }, [producerId]);

  return {
    policies,
    loading,
    saving,
    error,
    showSuccess,
    updatePolicy,
    getPolicy,
    clearError,
    reload: loadPolicies
  };
}