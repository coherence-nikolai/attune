import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

type StateChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function StateChip({ label, selected, onPress }: StateChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && styles.pressed]}
    >
      {selected ? <View style={styles.selectedGlow} /> : null}
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    overflow: 'hidden',
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.borderSoft,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 18,
    paddingVertical: 14,
    minWidth: 112,
  },
  selected: {
    backgroundColor: theme.colors.surfaceRaised,
    borderColor: 'rgba(146, 168, 255, 0.26)',
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  selectedGlow: {
    position: 'absolute',
    top: -16,
    left: 10,
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: theme.colors.selectionGlow,
  },
  pressed: {
    opacity: 0.94,
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  labelSelected: {
    color: theme.colors.text,
  },
});
