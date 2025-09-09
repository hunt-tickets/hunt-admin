import { LucideIcon } from 'lucide-react';

export type MarketingTabId = 
  | 'email-campaigns'
  | 'sms-campaigns' 
  | 'discount-codes';

export interface MarketingTabItem {
  id: MarketingTabId;
  label: string;
  icon: LucideIcon;
}