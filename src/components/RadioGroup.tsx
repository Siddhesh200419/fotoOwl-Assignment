import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';
import { useTheme } from '../hooks/useTheme';
import { hapticSelection } from '../services/haptics';

interface RadioGroupProps {
  label: string;
  options: string[];
  selectedValue: string;
  onValueChange: (value: any) => void;
  error?: string;
}

export default function RadioGroup({ label, options, selectedValue, onValueChange, error }: RadioGroupProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = selectedValue === option;
          return (
            <TouchableOpacity
              key={option}
              style={styles.optionButton}
              onPress={() => {
                hapticSelection();
                onValueChange(option);
              }}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.outerCircle,
                  {
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
              >
                {isSelected && (
                  <View style={[styles.innerCircle, { backgroundColor: colors.primary }]} />
                )}
              </View>
              <Text style={[styles.optionText, { color: colors.text }]}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {!!error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  outerCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.xs,
  },
  innerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  optionText: {
    fontSize: 15,
  },
  errorText: {
    fontSize: 12,
    marginTop: theme.spacing.xs,
  },
});
