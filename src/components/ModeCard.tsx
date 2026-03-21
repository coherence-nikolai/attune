import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';

type ModeCardProps = {
  title: string;
  cue: string;
  description: string;
  selected: boolean;
  onPress: () => void;
};

export function ModeCard({ title, cue, description, selected, onPress }: ModeCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, selected && styles.cardSelected, pressed && styles.cardPressed]}>
      <View style={[styles.glow, selected && styles.glowSelected]} />
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.dotRing, selected && styles.dotRingSelected]}>
          <View style={[styles.dotInner, selected && styles.dotInnerSelected]} />
        </View>
      </View>
      <Text style={styles.cue}>{cue}</Text>
      <Text style={styles.description}>{description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderSoft,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    gap: 8,
  },
  cardSelected: {
    borderColor: 'rgba(146, 168, 255, 0.28)',
    backgroundColor: theme.colors.surfaceRaised,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  cardPressed: {
    opacity: 0.96,
  },
  glow: {
    position: 'absolute',
    top: -22,
    left: 26,
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: 'transparent',
  },
  glowSelected: {
    backgroundColor: theme.colors.selectionGlow,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  cue: {
    color: theme.colors.success,
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  dotRing: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundSoft,
  },
  dotRingSelected: {
    borderColor: 'rgba(146, 168, 255, 0.4)',
    backgroundColor: 'rgba(146, 168, 255, 0.08)',
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'transparent',
  },
  dotInnerSelected: {
    backgroundColor: theme.colors.accentSoft,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.24,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
  },
});
