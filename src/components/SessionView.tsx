import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MODE_CONFIG } from '../constants/attune';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { theme } from '../theme';
import { AttuneMode } from '../types';
import { formatTimer } from '../utils/time';
import { BreathPacer } from './BreathPacer';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { Screen } from './Screen';

type SessionViewProps = {
  mode: AttuneMode;
  onExit: () => void;
  onContinue: () => void;
  durationSeconds: number;
};

export function SessionView({ mode, onExit, onContinue, durationSeconds }: SessionViewProps) {
  const config = MODE_CONFIG[mode];
  const { remainingSeconds, status, pause, resume, exit } = useSessionTimer({
    durationSeconds,
    onComplete: () => undefined,
  });

  const breathLabel = useMemo(() => {
    if (status === 'completed') {
      return 'Settle';
    }

    if (status === 'paused') {
      return 'Paused';
    }

    const cycleMs = config.inhaleMs + config.exhaleMs + config.settleMs;
    const elapsedMs = (durationSeconds - remainingSeconds) * 1000;
    const position = ((elapsedMs % cycleMs) + cycleMs) % cycleMs;

    if (position < config.inhaleMs) {
      return 'In';
    }

    if (position < config.inhaleMs + config.exhaleMs) {
      return 'Out';
    }

    return 'Settle';
  }, [config.exhaleMs, config.inhaleMs, config.settleMs, durationSeconds, remainingSeconds, status]);

  const handleExit = () => {
    exit();
    onExit();
  };

  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{mode}</Text>
        <Text style={styles.title}>{config.description}</Text>
        <Text style={styles.subtitle}>Stay with the breath.</Text>
      </View>

      <View style={styles.sessionCard}>
        <BreathPacer
          inhaleMs={config.inhaleMs}
          exhaleMs={config.exhaleMs}
          settleMs={config.settleMs}
          paused={status === 'paused'}
          completed={status === 'completed'}
          label={breathLabel}
        />

        <Text style={styles.timer}>{formatTimer(remainingSeconds)}</Text>

        {status === 'completed' ? (
          <PrimaryButton label="Continue" onPress={onContinue} />
        ) : (
          <View style={styles.actions}>
            {status === 'paused' ? (
              <PrimaryButton label="Resume" onPress={resume} />
            ) : (
              <PrimaryButton label="Pause" onPress={pause} />
            )}
            <SecondaryButton label="Exit" onPress={handleExit} tone="danger" />
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  eyebrow: {
    color: theme.colors.success,
    fontSize: theme.typography.small,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.typography.title,
    lineHeight: 40,
    fontWeight: '700',
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
  },
  sessionCard: {
    flex: 1,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  timer: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    fontSize: theme.typography.section,
    fontWeight: '600',
    marginBottom: theme.spacing.lg,
  },
  actions: {
    gap: theme.spacing.sm,
  },
});
