import { createContext } from 'react';
import { UserProfile } from './types';
import type { AccentColor, GrayColor } from '@radix-ui/themes';

export const AuthContext = createContext<{
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
} | null>(null);

export const ThemeContext = createContext<{
  isDark: boolean;
  toggleTheme: () => void;
  grayColor: GrayColor;
  accentColor: AccentColor;
  setColorScale: (gray: GrayColor, accent: AccentColor) => void;
} | null>(null);