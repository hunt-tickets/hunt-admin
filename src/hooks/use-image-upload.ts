import { useState, useCallback } from 'react';
import type { LogoFiles, LogoPreviews, LogoLoadingStates } from '@/types/producer';
import { useProfileProducer } from '@/contexts/profile-producer-context';

interface UseImageUploadProps {
  producerId?: string;
  onSuccess?: () => void;
}

export function useImageUpload({ producerId, onSuccess }: UseImageUploadProps) {
  const { refreshProducers } = useProfileProducer();
  const [files, setFiles] = useState<LogoFiles>({});
  const [previews, setPreviews] = useState<LogoPreviews>({
    main: '',
    white: '',
    black: '',
    banner: '',
    fullWhite: '',
    fullBlack: ''
  });
  const [loadingStates, setLoadingStates] = useState<LogoLoadingStates>({
    main: false,
    white: false,
    black: false,
    banner: false,
    fullWhite: false,
    fullBlack: false,
    uploading: false
  });

  const createPreview = (file: File): string => {
    return URL.createObjectURL(file);
  };

  const setLoading = (type: keyof LogoLoadingStates, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [type]: loading }));
  };

  const handleFileSelect = (file: File, type: keyof LogoFiles) => {
    const preview = createPreview(file);
    setFiles(prev => ({ ...prev, [type]: file }));
    setPreviews(prev => ({ ...prev, [type]: preview }));
    setLoading(type, false);
  };

  const uploadFile = async (file: File, logoType: string) => {
    if (!producerId) return false;
    
    setLoading('uploading', true);
    try {
      // Map frontend types to backend file names
      const typeMap: Record<string, string> = {
        'main': 'logo',
        'white': 'logo_white',
        'black': 'logo_black',
        'banner': 'logo_banner',
        'fullWhite': 'full_logo_white',
        'fullBlack': 'full_logo_black'
      };
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('logoType', typeMap[logoType] || logoType);
      
      const response = await fetch(`/api/producers/${producerId}/logo`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        // Trigger context refresh to update producer data with new logoUrl
        if (logoType === 'logo') {
          // Small delay to ensure database update is complete, then refresh context
          setTimeout(async () => {
            await refreshProducers();
          }, 500);
        }
        onSuccess?.();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error uploading file:', error);
      return false;
    } finally {
      setLoading('uploading', false);
    }
  };

  const loadExistingImages = useCallback((producerId: string) => {
    setLoadingStates({
      main: true,
      white: true,
      black: true,
      banner: true,
      fullWhite: true,
      fullBlack: true,
      uploading: false
    });

    const imageTypes = ['logo', 'logo_white', 'logo_black', 'logo_banner', 'full_logo_white', 'full_logo_black'] as const;
    const typeMap = ['main', 'white', 'black', 'banner', 'fullWhite', 'fullBlack'] as const;

    imageTypes.forEach((imageType, index) => {
      const type = typeMap[index];
      const imageUrl = `https://db.hunt-tickets.com/storage/v1/object/public/producers/${producerId}/logos/${imageType}.png?t=${Date.now()}`;
      
      const img = new Image();
      img.onload = () => {
        setPreviews(prev => ({ ...prev, [type]: imageUrl }));
        setLoadingStates(prev => ({ ...prev, [type]: false }));
      };
      img.onerror = () => {
        setPreviews(prev => ({ ...prev, [type]: '' }));
        setLoadingStates(prev => ({ ...prev, [type]: false }));
      };
      img.src = imageUrl;
    });
  }, []);

  return {
    files,
    previews,
    loadingStates,
    handleFileSelect,
    uploadFile,
    loadExistingImages
  };
}