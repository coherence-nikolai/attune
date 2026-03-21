import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '../theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, disabled }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.button, disabled && styles.buttonDisabled, pressed && !disabled && styles.buttonPressed]}
    >
      <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 62,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
  },
  buttonPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
  },
  buttonDisabled: {
    backgroundColor: theme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowOpacity: 0,
  },
  label: {
    color: '#11131a',
    fontSize: 18,
    fontWeight: '700',
  },
  labelDisabled: {
    color: theme.colors.textSoft,
  },
});
