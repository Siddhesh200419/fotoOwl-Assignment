import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../theme/theme';
import { useTheme } from '../hooks/useTheme';
import { hapticSelection } from '../services/haptics';

export type FilterValue = 'All' | 'A-M' | 'N-Z';

interface FilterChipsProps {
  selected: FilterValue;
  onSelect: (value: FilterValue) => void;
}

const FILTERS: FilterValue[] = ['All', 'A-M', 'N-Z'];

function FilterChips({ selected, onSelect }: FilterChipsProps) {
  const { colors } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {FILTERS.map((filter) => {
        const isActive = selected === filter;
        return (
          <TouchableOpacity
            key={filter}
            style={[
              styles.chip,
              {
                borderColor: isActive ? colors.primary : colors.border,
                backgroundColor: isActive ? colors.primary : colors.surface,
              },
              isActive && styles.chipActive,
            ]}
            onPress={() => {
              hapticSelection();
              onSelect(filter);
            }}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.chipText,
                {
                  color: isActive ? '#FFFFFF' : colors.textSecondary,
                },
                isActive && styles.chipTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  chip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs + 2,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1.5,
  },
  chipActive: {},
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  chipTextActive: {
    fontWeight: '600',
  },
});

export default React.memo(FilterChips);
