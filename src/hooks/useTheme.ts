import { theme } from '../theme/theme';
import { useThemeStore } from '../store/themeStore';

export function useTheme() {
  const mode = useThemeStore((s) => s.mode);
  return {
    colors: theme.colors[mode],
    mode,
    isDark: mode === 'dark',
  };
}
