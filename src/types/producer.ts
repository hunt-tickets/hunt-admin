export interface Producer {
  id: string;
  name: string;
  description?: string;
  url?: string;
  logoUrl?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProducerSettings {
  name: string;
  description: string;
  domain: string;
  primaryColor: string;
  theme: 'system' | 'light' | 'dark';
}

export interface SocialMediaLinks {
  website: string;
  instagram: string;
  facebook: string;
  x: string;
  spotify: string;
  soundcloud: string;
  tiktok: string;
  linkedin: string;
}

export interface LogoFiles {
  main?: File;
  white?: File;
  black?: File;
  banner?: File;
  fullWhite?: File;
  fullBlack?: File;
}

export interface LogoPreviews {
  main: string;
  white: string;
  black: string;
  banner: string;
  fullWhite: string;
  fullBlack: string;
}

export interface LogoLoadingStates {
  main: boolean;
  white: boolean;
  black: boolean;
  banner: boolean;
  fullWhite: boolean;
  fullBlack: boolean;
  uploading: boolean;
}