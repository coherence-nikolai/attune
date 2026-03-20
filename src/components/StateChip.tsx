import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { AttuneState } from '../types';
import { theme } from '../theme';

type StateChipProps = {
  label: AttuneState;
  selected: boolean;
  onPress: () => void;
};

export function StateChip({ label, selected, onPress }: StateChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected ? styles.selected : null, pressed ? styles.pressed : null]}
    >
      <Text style={[styles.label, selected ? styles.selectedLabel : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 48,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  selected: {
    borderColor: theme.colors.accentGlow,
    backgroundColor: theme.colors.accentSoft,
  },
  pressed: {
    opacity: 0.9,
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.typography.small,
    fontWeight: '600',
  },
  selectedLabel: {
    color: theme.colors.success,
  },
});
