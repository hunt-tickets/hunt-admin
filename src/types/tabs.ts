import { LucideIcon } from 'lucide-react';
import type { Producer } from './producer';

export interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export type TabId = 
  | 'team'
  | 'social'
  | 'branding'
  | 'politicas'
  | 'website'
  | 'settings'
  | 'emails-bloqueados'
  | 'checkout-fees';

export interface VerticalTabsProps {
  defaultTab?: TabId;
  onTabChange?: (tabId: TabId) => void;
  producerId?: string;
  currentProducer?: Producer | null;
}

export interface TabContentProps {
  producerId?: string;
  currentProducer?: Producer | null;
}