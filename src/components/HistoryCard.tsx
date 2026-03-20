import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AttuneSessionRecord } from '../types';
import { theme } from '../theme';
import { formatDateTime, formatTimer } from '../utils/time';

type HistoryCardProps = {
  record: AttuneSessionRecord;
};

export function HistoryCard({ record }: HistoryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.mode}>{record.mode}</Text>
        <Text style={styles.date}>{formatDateTime(record.completedAt)}</Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>Before: {record.beforeState}</Text>
        <Text style={styles.meta}>After: {record.afterState}</Text>
      </View>

      <Text style={styles.duration}>{formatTimer(record.durationSeconds)}</Text>

      {record.note ? <Text style={styles.note}>{record.note}</Text> : null}
    </View>
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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  mode: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
    fontWeight: '700',
  },
  date: {
    color: theme.colors.textSoft,
    fontSize: theme.typography.tiny,
  },
  metaRow: {
    gap: 4,
  },
  meta: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.small,
  },
  duration: {
    color: theme.colors.success,
    fontSize: theme.typography.small,
    fontWeight: '600',
  },
  note: {
    color: theme.colors.text,
    fontSize: theme.typography.small,
    lineHeight: 20,
  },
});
