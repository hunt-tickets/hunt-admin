import type {
  Policy,
  PolicyType,
  ProducerTerms,
  PolicyConfig,
  PolicyValidationResult,
  PolicyDbFieldMap
} from '@/types/policies';

/**
 * Policy configuration constants
 */
export const POLICY_CONSTANTS = {
  MAX_CONTENT_LENGTH: 50000,
  MIN_CONTENT_LENGTH: 50,
  DEFAULT_TIMEOUT: 10000,
  
  // Content validation patterns
  VALIDATION_PATTERNS: {
    terms: /términos|condiciones|uso|servicio/i,
    privacy: /privacidad|datos|personales|información/i,
    refund: /reembolso|devolución|cancelación|política/i
  },
  
  // Required keywords for each policy type
  REQUIRED_KEYWORDS: {
    terms: ['términos', 'condiciones'],
    privacy: ['privacidad', 'datos'],
    refund: ['reembolso', 'devolución']
  } as const
} as const;

/**
 * Database field mapping utility
 */
export const DB_FIELD_MAPPING: PolicyDbFieldMap = {
  terms: 'terms_and_conditions',
  privacy: 'privacy_policy',
  refund: 'refund_policy'
} as const;

/**
 * Reverse mapping from database fields to policy types
 */
export const REVERSE_DB_FIELD_MAPPING: Record<
  keyof Pick<ProducerTerms, 'terms_and_conditions' | 'privacy_policy' | 'refund_policy'>,
  PolicyType
> = {
  terms_and_conditions: 'terms',
  privacy_policy: 'privacy',
  refund_policy: 'refund'
} as const;

/**
 * Default policy configurations
 */
export const DEFAULT_POLICY_CONFIGS: Record<PolicyType, PolicyConfig> = {
  terms: {
    type: 'terms',
    display: {
      title: 'Términos y Condiciones',
      description: 'Reglas de uso del servicio',
      icon: require('lucide-react').FileText
    },
    validation: {
      minLength: 100,
      maxLength: 10000,
      required: true
    },
    dbField: 'terms_and_conditions'
  },
  privacy: {
    type: 'privacy',
    display: {
      title: 'Política de Privacidad',
      description: 'Manejo de datos personales',
      icon: require('lucide-react').Shield
    },
    validation: {
      minLength: 100,
      maxLength: 10000,
      required: true
    },
    dbField: 'privacy_policy'
  },
  refund: {
    type: 'refund',
    display: {
      title: 'Política de Reembolso',
      description: 'Condiciones de devolución',
      icon: require('lucide-react').DollarSign
    },
    validation: {
      minLength: 50,
      maxLength: 5000,
      required: false
    },
    dbField: 'refund_policy'
  }
} as const;

/**
 * Type guards and validation utilities
 */

/**
 * Type guard to check if a string is a valid PolicyType
 */
export function isPolicyType(value: unknown): value is PolicyType {
  return typeof value === 'string' && ['terms', 'privacy', 'refund'].includes(value);
}

/**
 * Type guard to check if an object is a valid Policy
 */
export function isValidPolicy(obj: unknown): obj is Policy {
  if (!obj || typeof obj !== 'object') return false;
  
  const policy = obj as any;
  return (
    isPolicyType(policy.id) &&
    typeof policy.title === 'string' &&
    typeof policy.description === 'string' &&
    typeof policy.icon === 'function' &&
    typeof policy.content === 'string'
  );
}

/**
 * Type guard to check if an object is a valid ProducerTerms
 */
export function isValidProducerTerms(obj: unknown): obj is ProducerTerms {
  if (!obj || typeof obj !== 'object') return false;
  
  const terms = obj as any;
  return (
    typeof terms.id === 'string' &&
    typeof terms.producer_id === 'string' &&
    typeof terms.created_at === 'string' &&
    typeof terms.updated_at === 'string' &&
    (terms.terms_and_conditions === null || typeof terms.terms_and_conditions === 'string') &&
    (terms.privacy_policy === null || typeof terms.privacy_policy === 'string') &&
    (terms.refund_policy === null || typeof terms.refund_policy === 'string')
  );
}

/**
 * Content validation utilities
 */

/**
 * Validates policy content with comprehensive checks
 */
export function validatePolicyContent(
  policyType: PolicyType,
  content: string,
  customConfig?: Partial<PolicyConfig>
): PolicyValidationResult {
  const config = { ...DEFAULT_POLICY_CONFIGS[policyType], ...customConfig };
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic validation
  if (!content || typeof content !== 'string') {
    errors.push('El contenido debe ser una cadena de texto válida');
    return { isValid: false, errors, warnings };
  }

  const trimmedContent = content.trim();

  // Required field validation
  if (config.validation.required && !trimmedContent) {
    errors.push('Este campo es obligatorio');
  }

  // Length validation
  if (trimmedContent.length < config.validation.minLength) {
    errors.push(`El contenido debe tener al menos ${config.validation.minLength} caracteres`);
  }

  if (trimmedContent.length > config.validation.maxLength) {
    errors.push(`El contenido no puede exceder ${config.validation.maxLength} caracteres`);
  }

  // Content quality validation
  if (trimmedContent) {
    // Check for minimum word count
    const wordCount = trimmedContent.split(/\s+/).length;
    if (wordCount < 10) {
      warnings.push('El contenido parece muy breve. Considera agregar más detalles');
    }

    // Policy-specific content validation
    const lowerContent = trimmedContent.toLowerCase();
    const requiredKeywords = POLICY_CONSTANTS.REQUIRED_KEYWORDS[policyType];
    
    const hasRequiredKeywords = requiredKeywords.some(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    );

    if (!hasRequiredKeywords && trimmedContent.length > 50) {
      warnings.push(
        `Considera incluir términos relevantes como: ${requiredKeywords.join(', ')}`
      );
    }

    // Check for placeholder content
    const placeholderPatterns = [
      /lorem ipsum/i,
      /contenido de ejemplo/i,
      /texto de prueba/i,
      /placeholder/i
    ];

    if (placeholderPatterns.some(pattern => pattern.test(trimmedContent))) {
      warnings.push('Detectado contenido de ejemplo. Asegúrate de usar contenido real');
    }

    // Basic structure validation for terms
    if (policyType === 'terms' && trimmedContent.length > 200) {
      if (!lowerContent.includes('usuario') && !lowerContent.includes('cliente')) {
        warnings.push('Los términos y condiciones deberían mencionar derechos y obligaciones del usuario');
      }
    }

    // Privacy policy specific validation
    if (policyType === 'privacy' && trimmedContent.length > 200) {
      const privacyKeywords = ['datos', 'información', 'cookies', 'compartir', 'terceros'];
      const foundKeywords = privacyKeywords.filter(keyword => lowerContent.includes(keyword));
      
      if (foundKeywords.length < 2) {
        warnings.push('La política de privacidad debería abordar el manejo de datos y cookies');
      }
    }

    // Refund policy specific validation
    if (policyType === 'refund' && trimmedContent.length > 100) {
      if (!lowerContent.includes('día') && !lowerContent.includes('plazo') && !lowerContent.includes('tiempo')) {
        warnings.push('La política de reembolso debería especificar plazos de tiempo');
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Text processing utilities
 */

/**
 * Extracts a summary from policy content
 */
export function extractPolicySummary(content: string, maxLength: number = 150): string {
  if (!content || content.length <= maxLength) {
    return content;
  }

  // Find the end of the first sentence or paragraph
  const firstSentence = content.match(/^[^.!?]*[.!?]/);
  if (firstSentence && firstSentence[0].length <= maxLength) {
    return firstSentence[0].trim();
  }

  // If first sentence is too long, truncate at word boundary
  const truncated = content.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

/**
 * Estimates reading time for policy content
 */
export function estimateReadingTime(content: string): { minutes: number; words: number } {
  const words = content.trim().split(/\s+/).length;
  const wordsPerMinute = 200; // Average reading speed
  const minutes = Math.ceil(words / wordsPerMinute);

  return { minutes, words };
}

/**
 * Sanitizes policy content for safe display
 */
export function sanitizePolicyContent(content: string): string {
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, '') // Remove HTML entities
    .trim();
}

/**
 * Data transformation utilities
 */

/**
 * Transforms ProducerTerms to Policy array
 */
export function transformProducerTermsToPolicies(
  producerTerms: ProducerTerms,
  configs: Record<PolicyType, PolicyConfig> = DEFAULT_POLICY_CONFIGS
): Policy[] {
  return Object.entries(configs).map(([type, config]) => {
    const policyType = type as PolicyType;
    const content = producerTerms[config.dbField] || '';
    
    return {
      id: policyType,
      title: config.display.title,
      description: config.display.description,
      icon: config.display.icon,
      content,
      isSaved: Boolean(content),
      lastUpdated: content ? producerTerms.updated_at : undefined
    };
  });
}

/**
 * Transforms Policy array back to ProducerTerms update format
 */
export function transformPoliciesToUpdate(
  policies: Policy[],
  producerId: string
): Partial<ProducerTerms> {
  const update: Partial<ProducerTerms> = { producer_id: producerId };

  for (const policy of policies) {
    const dbField = DB_FIELD_MAPPING[policy.id];
    update[dbField] = policy.content || null;
  }

  return update;
}

/**
 * Comparison utilities
 */

/**
 * Compares two policy arrays to detect changes
 */
export function comparePolicies(
  original: Policy[],
  updated: Policy[]
): {
  hasChanges: boolean;
  changedPolicies: PolicyType[];
  changes: Record<PolicyType, { oldContent: string; newContent: string }>;
} {
  const changedPolicies: PolicyType[] = [];
  const changes: Record<PolicyType, { oldContent: string; newContent: string }> = {} as any;

  for (const updatedPolicy of updated) {
    const originalPolicy = original.find(p => p.id === updatedPolicy.id);
    
    if (!originalPolicy || originalPolicy.content !== updatedPolicy.content) {
      changedPolicies.push(updatedPolicy.id);
      changes[updatedPolicy.id] = {
        oldContent: originalPolicy?.content || '',
        newContent: updatedPolicy.content
      };
    }
  }

  return {
    hasChanges: changedPolicies.length > 0,
    changedPolicies,
    changes
  };
}

/**
 * Utility functions for UI
 */

/**
 * Generates policy status indicators
 */
export function getPolicyStatus(policy: Policy): {
  status: 'empty' | 'draft' | 'complete';
  color: string;
  label: string;
} {
  if (!policy.content.trim()) {
    return {
      status: 'empty',
      color: 'text-red-400',
      label: 'Vacío'
    };
  }

  if (policy.content.length < 100) {
    return {
      status: 'draft',
      color: 'text-yellow-400',
      label: 'Borrador'
    };
  }

  return {
    status: 'complete',
    color: 'text-green-400',
    label: 'Completo'
  };
}

/**
 * Formats policy content for different output formats
 */
export function formatPolicyContent(
  content: string,
  format: 'html' | 'text' | 'markdown' = 'text'
): string {
  const sanitized = sanitizePolicyContent(content);

  switch (format) {
    case 'html':
      return sanitized
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>');
    
    case 'markdown':
      return sanitized
        .replace(/\n\n/g, '\n\n')
        .replace(/^(.+)$/gm, (line) => {
          // Simple heuristic for headings
          if (line.length < 50 && !line.includes('.')) {
            return `## ${line}`;
          }
          return line;
        });
    
    case 'text':
    default:
      return sanitized;
  }
}

/**
 * Error handling utilities
 */

/**
 * Creates user-friendly error messages
 */
export function createPolicyErrorMessage(
  error: unknown,
  context: string = 'operación'
): string {
  if (error instanceof Error) {
    return `Error en ${context}: ${error.message}`;
  }
  
  if (typeof error === 'string') {
    return `Error en ${context}: ${error}`;
  }
  
  return `Error desconocido en ${context}`;
}

/**
 * Validates multiple policies at once
 */
export function validateAllPolicies(
  policies: Policy[],
  configs: Record<PolicyType, PolicyConfig> = DEFAULT_POLICY_CONFIGS
): Record<PolicyType, PolicyValidationResult> {
  const results: Record<PolicyType, PolicyValidationResult> = {} as any;

  for (const policy of policies) {
    results[policy.id] = validatePolicyContent(policy.id, policy.content, configs[policy.id]);
  }

  return results;
}

/**
 * Export commonly used types for convenience
 */
export type {
  Policy,
  PolicyType,
  ProducerTerms,
  PolicyConfig,
  PolicyValidationResult
} from '@/types/policies';