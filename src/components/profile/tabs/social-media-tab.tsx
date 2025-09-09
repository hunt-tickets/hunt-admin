"use client"

import { Button } from "@/components/ui/button";
import { SocialMediaInput } from "@/components/profile/atomic/social-media-input";
import { useSocialMedia } from "@/hooks/use-social-media";
import type { TabContentProps } from "@/types/tabs";

const socialPlatforms = [
  {
    key: 'website' as const,
    name: 'Website',
    placeholder: 'https://tuwebsite.com',
    iconColor: 'text-status-info',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM11 19.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    )
  },
  {
    key: 'instagram' as const,
    name: 'Instagram',
    placeholder: 'https://instagram.com/tu-perfil',
    iconColor: 'text-pink-500',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  },
  {
    key: 'facebook' as const,
    name: 'Facebook',
    placeholder: 'https://facebook.com/tu-pagina',
    iconColor: 'text-status-info',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  {
    key: 'x' as const,
    name: 'X (Twitter)',
    placeholder: 'https://x.com/tu-usuario',
    iconColor: 'text-stone-800 dark:text-stone-300',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  {
    key: 'spotify' as const,
    name: 'Spotify',
    placeholder: 'https://open.spotify.com/user/tu-perfil',
    iconColor: 'text-status-success',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.959-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.361 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    )
  },
  {
    key: 'soundcloud' as const,
    name: 'SoundCloud',
    placeholder: 'https://soundcloud.com/tu-usuario',
    iconColor: 'text-orange-500',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17 11h1c1.38 0 3 1.274 3 3c0 1.657 -1.5 3 -3 3l-6 0v-10c3 0 4.5 1.5 5 4z" />
        <path d="M9 8l0 9" />
        <path d="M6 17l0 -7" />
        <path d="M3 16l0 -2" />
      </svg>
    )
  },
  {
    key: 'tiktok' as const,
    name: 'TikTok',
    placeholder: 'https://tiktok.com/@tu-usuario',
    iconColor: 'text-stone-800 dark:text-stone-300',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    )
  },
  {
    key: 'linkedin' as const,
    name: 'LinkedIn',
    placeholder: 'https://linkedin.com/company/tu-empresa',
    iconColor: 'text-status-info',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  }
];

export function SocialMediaTab({ producerId, currentProducer }: TabContentProps) {
  const { socialInputs, loading, hasChanges, showSuccess, handleInputChange, saveSocialMedia } = useSocialMedia({ producerId });

  // Show loading state with skeleton
  if (loading) {
    return (
      <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-text-primary">Redes Sociales</h3>
            <p className="text-text-secondary">
              Conecta tus perfiles de redes sociales para mayor alcance.
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          {socialPlatforms.map((platform, index) => (
            <div key={index} className="flex items-center gap-4 animate-pulse">
              <div className={`w-6 h-6 flex-shrink-0 ${platform.iconColor} opacity-40`}>
                {platform.icon}
              </div>
              <div className="w-32">
                <div className="h-5 bg-surface-tertiary rounded w-20 mb-1"></div>
              </div>
              <div className="flex-1">
                <div className="h-12 bg-surface-secondary border border-border-secondary rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-secondary backdrop-blur-xl border border-border-primary p-8 rounded-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-text-primary">Redes Sociales</h3>
          <p className="text-text-secondary">
            Conecta tus perfiles de redes sociales para mayor alcance.
          </p>
        </div>
        
        {hasChanges && (
          <Button 
            onClick={saveSocialMedia}
            disabled={loading}
            className="bg-interactive-primary text-text-inverse hover:bg-interactive-active font-medium border border-border-primary"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        )}
      </div>

      {showSuccess && (
        <div className="bg-status-success/10 border border-status-success/20 text-status-success px-4 py-3 rounded-lg">
          ✓ Redes sociales guardadas exitosamente
        </div>
      )}
      
      <div className="space-y-6">
        {socialPlatforms.map((platform) => (
          <SocialMediaInput
            key={platform.key}
            value={socialInputs[platform.key]}
            onChange={(value) => handleInputChange(platform.key, value)}
            platform={platform.name}
            placeholder={platform.placeholder}
            icon={platform.icon}
            iconColor={platform.iconColor}
          />
        ))}
      </div>
    </div>
  );
}