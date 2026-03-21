import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '../theme';

type SecondaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function SecondaryButton({ label, onPress, disabled }: SecondaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.button, pressed && !disabled && styles.buttonPressed, disabled && styles.buttonDisabled]}
    >
      <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 58,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.borderSoft,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  buttonPressed: {
    opacity: 0.92,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  label: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '600',
  },
  labelDisabled: {
    color: theme.colors.textSoft,
  },
});
