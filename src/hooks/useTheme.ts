import { theme, AppTheme } from '../theme/theme';
import { useThemeStore, ThemeMode } from '../store/themeStore';

type ThemedColors = AppTheme['colors']['light'];

export interface ThemedStyles {
  colors: ThemedColors;
  mode: ThemeMode;
  isDark: boolean;
}

/**
 * Returns the currently active color palette (light or dark)
 * driven by the persisted zustand themeStore.
 *
 * Usage:
 *   const { colors, isDark } = useTheme();
 *   <View style={{ backgroundColor: colors.background }} />
 */
export function useTheme(): ThemedStyles {
  const mode = useThemeStore((s) => s.mode);
  const colors = theme.colors[mode];
  return {
    colors,
    mode,
    isDark: mode === 'dark',
  };
}

/**
 * Map a hex color to its opacity variant. Lightweight helper since
 * `theme.colors` only ships the base swatches.
 */
export function withAlpha(hex: string, alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha));
  if (hex.length === 7 && hex[0] === '#') {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  return hex;
}
