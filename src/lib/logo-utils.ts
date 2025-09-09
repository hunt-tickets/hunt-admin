/**
 * Logo URL utilities for Hunt Tickets producers
 */

export interface LogoUrlOptions {
  type?: 'logo' | 'logo_white' | 'logo_black' | 'logo_banner' | 'full_logo_white' | 'full_logo_black';
  cacheBuster?: boolean;
}

/**
 * Constructs a predictive logo URL for a producer
 * Used as fallback when logoUrl is not in database yet
 */
export function constructLogoUrl(producerId: string, options: LogoUrlOptions = {}): string {
  const { type = 'logo', cacheBuster = true } = options;
  
  const baseUrl = 'https://db.hunt-tickets.com/storage/v1/object/public/producers';
  const url = `${baseUrl}/${producerId}/logos/${type}.png`;
  
  return cacheBuster ? `${url}?t=${Date.now()}` : url;
}

/**
 * Gets the effective logo URL for a producer
 * Tries database logoUrl first, then constructs predictive URL
 */
export function getEffectiveLogoUrl(producer: { id: string; logoUrl?: string | null }): string | null {
  // 1. Use logoUrl from database if available
  if (producer.logoUrl) {
    return producer.logoUrl;
  }
  
  // 2. Construct predictive URL (without cache buster for consistency)
  return constructLogoUrl(producer.id, { cacheBuster: false });
}

/**
 * Gets the effective banner URL for a producer
 * Tries database bannerUrl first, then constructs predictive URL for banner
 */
export function getEffectiveBannerUrl(producer: { id: string; bannerUrl?: string | null }): string | null {
  // 1. Use bannerUrl from database if available
  if (producer.bannerUrl) {
    return producer.bannerUrl;
  }
  
  // 2. Construct predictive URL for banner (without cache buster for consistency)
  return constructLogoUrl(producer.id, { type: 'logo_banner', cacheBuster: false });
}

/**
 * Checks if a logo URL is likely to exist
 * This is a predictive check based on our naming convention
 */
export function isLogoUrlValid(url: string): boolean {
  const logoUrlPattern = /^https:\/\/db\.hunt-tickets\.com\/storage\/v1\/object\/public\/producers\/[^\/]+\/logos\/(logo|logo_white|logo_black|logo_banner|full_logo_white|full_logo_black)\.png/;
  return logoUrlPattern.test(url);
}

/**
 * Extracts producer ID from a logo URL
 */
export function extractProducerIdFromLogoUrl(url: string): string | null {
  const match = url.match(/\/producers\/([^\/]+)\/logos\//);
  return match ? match[1] : null;
}

/**
 * Validates if an image exists by attempting to load it
 * Returns a promise that resolves to true if image exists
 */
export async function validateImageExists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Gets all possible logo URLs for a producer
 * Useful for preloading or checking multiple variants
 */
export function getAllLogoUrls(producerId: string): Record<string, string> {
  const types = ['logo', 'logo_white', 'logo_black', 'logo_banner', 'full_logo_white', 'full_logo_black'] as const;
  
  return types.reduce((acc, type) => {
    acc[type] = constructLogoUrl(producerId, { type, cacheBuster: false });
    return acc;
  }, {} as Record<string, string>);
}