import { useState, useEffect } from 'react';
import type { Producer, ProducerSettings } from '@/types/producer';

interface UseProducerSettingsProps {
  currentProducer: Producer | null;
}

export function useProducerSettings({ currentProducer }: UseProducerSettingsProps) {
  const [settings, setSettings] = useState<ProducerSettings>({
    name: '',
    description: '',
    domain: '',
    primaryColor: '',
    theme: 'system'
  });
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = <K extends keyof ProducerSettings>(
    key: K, 
    value: ProducerSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const resetSettings = () => {
    if (currentProducer) {
      setSettings({
        name: currentProducer.name,
        description: currentProducer.description || '',
        domain: currentProducer.url || generateDomainFromName(currentProducer.name),
        primaryColor: '',
        theme: 'system'
      });
      setHasChanges(false);
    }
  };

  const generateDomainFromName = (name: string): string => {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const saveSettings = async (): Promise<boolean> => {
    if (!currentProducer) return false;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/producers/${currentProducer.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: settings.name,
          description: settings.description,
          url: settings.domain,
        }),
      });
      
      if (response.ok) {
        setHasChanges(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving producer settings:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteProducer = async (): Promise<void> => {
    if (!currentProducer) return;
    
    const response = await fetch(`/api/producers/${currentProducer.id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete producer');
    }
  };

  useEffect(() => {
    resetSettings();
  }, [currentProducer]);

  return {
    settings,
    loading,
    hasChanges,
    updateSetting,
    resetSettings,
    saveSettings,
    deleteProducer
  };
}