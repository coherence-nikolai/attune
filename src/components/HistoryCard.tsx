import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '../theme';
import { AttuneSessionRecord } from '../types';
import { formatDateTime } from '../utils/format';

type HistoryCardProps = {
  item: AttuneSessionRecord;
};

export function HistoryCard({ item }: HistoryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.mode}>{item.mode}</Text>
        <Text style={styles.date}>{formatDateTime(item.completedAt)}</Text>
      </View>
      <Text style={styles.states}>{item.beforeState} → {item.afterState}</Text>
      {item.note ? <Text style={styles.note}>{item.note}</Text> : <Text style={styles.noteMuted}>Quiet return saved.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderSoft,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  mode: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  date: {
    color: theme.colors.textSoft,
    fontSize: 13,
  },
  states: {
    color: theme.colors.success,
    fontSize: 14,
    fontWeight: '600',
  },
  note: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  noteMuted: {
    color: theme.colors.textSoft,
    fontSize: 14,
  },
});
