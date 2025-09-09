"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Producer } from '@/types/producer';

interface ProfileProducerContextProps {
  producers: Producer[];
  currentProducerId: string;
  currentProducer: Producer | undefined;
  setCurrentProducerId: (producerId: string) => void;
  addProducer: (producer: Producer) => void;
  refreshProducers: () => Promise<void>;
  loading: boolean;
}

const ProfileProducerContext = createContext<ProfileProducerContextProps | null>(null);

export function ProfileProducerProvider({ children }: { children: React.ReactNode }) {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [currentProducerId, setCurrentProducerId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const currentProducer = producers.find(p => p.id === currentProducerId) || producers[0];

  const fetchProducers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/producers');
      if (response.ok) {
        const data = await response.json();
        setProducers(data);
        if (data.length > 0 && !currentProducerId) {
          setCurrentProducerId(data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching producers:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshProducers = async () => {
    await fetchProducers();
  };

  useEffect(() => {
    fetchProducers();
  }, []);

  const addProducer = (newProducer: Producer) => {
    setProducers(prev => [newProducer, ...prev]);
    setCurrentProducerId(newProducer.id);
  };

  return (
    <ProfileProducerContext.Provider
      value={{
        producers,
        currentProducerId,
        currentProducer,
        setCurrentProducerId,
        addProducer,
        refreshProducers,
        loading,
      }}
    >
      {children}
    </ProfileProducerContext.Provider>
  );
}

export function useProfileProducer() {
  const context = useContext(ProfileProducerContext);
  if (!context) {
    throw new Error('useProfileProducer must be used within a ProfileProducerProvider');
  }
  return context;
}