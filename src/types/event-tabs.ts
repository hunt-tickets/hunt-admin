import { LucideIcon } from 'lucide-react';

export type EventTabId = 
  | 'general'
  | 'accessibility';

export interface EventTabItem {
  id: EventTabId;
  label: string;
  icon: LucideIcon;
}