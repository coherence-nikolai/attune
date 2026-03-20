import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AttuneMode } from '../types';
import { theme } from '../theme';

type ModeCardProps = {
  title: AttuneMode;
  cue: string;
  description: string;
  selected: boolean;
  onPress: () => void;
};

export function ModeCard({ title, cue, description, selected, onPress }: ModeCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.card, selected ? styles.selected : null, pressed ? styles.pressed : null]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.cue}>{cue}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  selected: {
    borderColor: theme.colors.accentGlow,
    backgroundColor: theme.colors.surfaceElevated,
    shadowColor: theme.colors.accentGlow,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  pressed: {
    opacity: 0.92,
  },
  header: {
    gap: 4,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.section,
    fontWeight: '700',
  },
  cue: {
    color: theme.colors.success,
    fontSize: theme.typography.small,
    fontWeight: '600',
  },
  description: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
    lineHeight: 22,
  },
});
