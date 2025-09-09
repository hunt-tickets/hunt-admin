import { useState } from 'react';

export function useDocumentEditor() {
  const [privacyPolicy, setPrivacyPolicy] = useState<string>('');
  const [termsConditions, setTermsConditions] = useState<string>('');
  const [refundPolicy, setRefundPolicy] = useState<string>('');

  const updatePrivacyPolicy = (content: string) => {
    setPrivacyPolicy(content);
  };

  const updateTermsConditions = (content: string) => {
    setTermsConditions(content);
  };

  const updateRefundPolicy = (content: string) => {
    setRefundPolicy(content);
  };

  return {
    privacyPolicy,
    termsConditions,
    refundPolicy,
    updatePrivacyPolicy,
    updateTermsConditions,
    updateRefundPolicy
  };
}