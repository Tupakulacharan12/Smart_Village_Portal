import { useLanguage } from '@/contexts/LanguageContext';
import type { TranslationKey } from '@/lib/i18n';
import {
  Home, Info, Landmark, Newspaper, FileText, MessageSquareWarning, HeartPulse,
  GraduationCap, Wheat, Siren, FileCheck, Images, MapPin, Phone, ShieldCheck, Trash2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  route: string;
  labelKey: TranslationKey;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { route: 'home', labelKey: 'home', icon: Home },
  { route: 'about', labelKey: 'about', icon: Info },
  { route: 'schemes', labelKey: 'schemes', icon: Landmark },
  { route: 'news', labelKey: 'news', icon: Newspaper },
  { route: 'notices', labelKey: 'notices', icon: FileText },
  { route: 'complaints', labelKey: 'complaints', icon: MessageSquareWarning },
  { route: 'health', labelKey: 'health', icon: HeartPulse },
  { route: 'education', labelKey: 'education', icon: GraduationCap },
  { route: 'agriculture', labelKey: 'agriculture', icon: Wheat },
  { route: 'emergency', labelKey: 'emergency', icon: Siren },
  { route: 'services', labelKey: 'services', icon: FileCheck },
  { route: 'waste', labelKey: 'wasteManagement', icon: Trash2 },
  { route: 'gallery', labelKey: 'gallery', icon: Images },
  { route: 'tourist', labelKey: 'tourist', icon: MapPin },
  { route: 'contact', labelKey: 'contact', icon: Phone },
];

export const ADMIN_NAV: NavItem[] = [
  { route: 'admin', labelKey: 'admin', icon: ShieldCheck },
];

export function useNav() {
  const { t } = useLanguage();
  return { items: NAV_ITEMS, adminItems: ADMIN_NAV, t };
}
