import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface RadioGroupProps {
  label: string;
  options: string[];
  selectedValue: string;
  onValueChange: (value: any) => void;
  error?: string;
}

export default function RadioGroup({ label, options, selectedValue, onValueChange, error }: RadioGroupProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = selectedValue === option;
          return (
            <TouchableOpacity
              key={option}
              style={styles.optionButton}
              onPress={() => onValueChange(option)}
              activeOpacity={0.7}
            >
              <View style={[styles.outerCircle, isSelected && styles.outerCircleSelected]}>
                {isSelected && <View style={styles.innerCircle} />}
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
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
    color: theme.colors.light.text,
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
    borderColor: theme.colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.xs,
  },
  outerCircleSelected: {
    borderColor: theme.colors.light.primary,
  },
  innerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.light.primary,
  },
  optionText: {
    fontSize: 15,
    color: theme.colors.light.text,
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.light.error,
    marginTop: theme.spacing.xs,
  },
});
