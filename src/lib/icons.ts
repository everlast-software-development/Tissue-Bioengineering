import {
  Activity,
  Box,
  Cpu,
  Dna,
  Flame,
  Layers,
  Printer,
  ShieldCheck,
  Sparkles,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/**
 * Icons that data records refer to by name (`iconName` on services, technologies and
 * statistics). Typing `iconName` as `IconName` makes an unknown name a type error.
 */
export const ICONS = {
  Activity,
  Box,
  Cpu,
  Dna,
  Flame,
  Layers,
  Printer,
  ShieldCheck,
  Sparkles,
  Zap,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;
