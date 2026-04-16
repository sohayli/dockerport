import { createContext } from 'react';
import { UserProfile } from './types';

type ThemeGrayColor = 'gray' | 'slate';
type ThemeAccentColor = 'gray' | 'blue' | 'indigo' | 'violet' | 'purple' | 'plum' | 'crimson' | 'red' | 'ruby' | 'green' | 'jade' | 'teal' | 'cyan' | 'amber' | 'yellow' | 'gold' | 'orange' | 'tomato';

export const AuthContext = createContext<{
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
} | null>(null);

export const ThemeContext = createContext<{
  isDark: boolean;
  toggleTheme: () => void;
  grayColor: ThemeGrayColor;
  accentColor: ThemeAccentColor;
  setColorScale: (gray: ThemeGrayColor, accent: ThemeAccentColor) => void;
} | null>(null);