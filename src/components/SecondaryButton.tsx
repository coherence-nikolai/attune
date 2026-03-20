import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '../theme';

type SecondaryButtonProps = {
  label: string;
  onPress: () => void;
  tone?: 'default' | 'danger';
};

export function SecondaryButton({ label, onPress, tone = 'default' }: SecondaryButtonProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}>
      <Text style={[styles.label, tone === 'danger' ? styles.danger : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  pressed: {
    opacity: 0.88,
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
    fontWeight: '600',
  },
  danger: {
    color: theme.colors.danger,
  },
});
