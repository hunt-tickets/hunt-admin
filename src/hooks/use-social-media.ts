import { useState, useEffect } from 'react';
import type { SocialMediaLinks } from '@/types/producer';

interface UseSocialMediaProps {
  producerId?: string;
}

export function useSocialMedia({ producerId }: UseSocialMediaProps) {
  const [socialInputs, setSocialInputs] = useState<SocialMediaLinks>({
    website: "",
    instagram: "",
    facebook: "",
    x: "",
    spotify: "",
    soundcloud: "",
    tiktok: "",
    linkedin: ""
  });
  const [loading, setLoading] = useState(true); // Empezar con true para mostrar skeleton inicial
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (platform: keyof SocialMediaLinks, value: string) => {
    setSocialInputs(prev => ({ ...prev, [platform]: value }));
    setHasChanges(true);
  };

  const loadSocialMedia = async () => {
    if (!producerId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/producers/${producerId}/social-media`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setSocialInputs({
            website: data.website || "",
            instagram: data.instagram || "",
            facebook: data.facebook || "",
            x: data.x || "",
            spotify: data.spotify || "",
            soundcloud: data.soundcloud || "",
            tiktok: data.tiktok || "",
            linkedin: data.linkedin || ""
          });
        }
      }
    } catch (error) {
      console.error('Error loading social media:', error);
    } finally {
      setLoading(false);
      setHasChanges(false);
    }
  };

  const saveSocialMedia = async () => {
    if (!producerId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/producers/${producerId}/social-media`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(socialInputs),
      });
      
      if (response.ok) {
        setHasChanges(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        console.error('Failed to save social media');
      }
    } catch (error) {
      console.error('Error saving social media:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSocialMedia();
  }, [producerId]);

  return {
    socialInputs,
    loading,
    hasChanges,
    showSuccess,
    handleInputChange,
    saveSocialMedia
  };
}