export const theme = {
  colors: {
    light: {
      background: '#FFFFFF',
      surface: '#F9FAFB',
      surfaceVariant: '#F3F4F6',
      text: '#111827',
      textSecondary: '#6B7280',
      primary: '#4F46E5', // Indigo-600
      primaryLight: '#EEF2F6',
      border: '#E5E7EB',
      error: '#EF4444',
      success: '#10B981',
      heart: '#EF4444',
      heartEmpty: '#9CA3AF',
      placeholder: '#9CA3AF',
    },
    dark: {
      background: '#0F172A', // Slate-900
      surface: '#1E293B', // Slate-800
      surfaceVariant: '#334155', // Slate-700
      text: '#F8FAFC',
      textSecondary: '#94A3B8',
      primary: '#6366F1', // Indigo-500
      primaryLight: '#1E1B4B',
      border: '#334155',
      error: '#F87171',
      success: '#34D399',
      heart: '#F87171',
      heartEmpty: '#64748B',
      placeholder: '#64748B',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  typography: {
    titleLarge: {
      fontSize: 28,
      fontWeight: '700' as const,
    },
    titleMedium: {
      fontSize: 20,
      fontWeight: '600' as const,
    },
    bodyLarge: {
      fontSize: 16,
      fontWeight: '400' as const,
    },
    bodyMedium: {
      fontSize: 14,
      fontWeight: '400' as const,
    },
    bodySmall: {
      fontSize: 12,
      fontWeight: '400' as const,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
    },
  },
};

export type AppTheme = typeof theme;
