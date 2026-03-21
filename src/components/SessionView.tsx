import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MODE_CONFIG } from '../constants/attune';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { theme } from '../theme';
import { AttuneMode } from '../types';
import { formatSessionLength } from '../utils/format';
import { BreathPacer } from './BreathPacer';
import { PrimaryButton } from './PrimaryButton';
import { Screen } from './Screen';
import { SecondaryButton } from './SecondaryButton';

type SessionViewProps = {
  mode: AttuneMode;
  durationSeconds: number;
  onExit: () => void;
  onContinue: () => void;
};

export function SessionView({ mode, durationSeconds, onExit, onContinue }: SessionViewProps) {
  const { remainingSeconds, status, start, pause, resume } = useSessionTimer(durationSeconds);

  useEffect(() => {
    start();
    // start should run once on mount for a fresh session
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const modeConfig = MODE_CONFIG[mode];
  const running = status === 'running';
  const completed = status === 'completed';

  return (
    <Screen>
      <View style={styles.headerBlock}>
        <Text style={styles.eyebrow}>{mode}</Text>
        <Text style={styles.title}>{modeConfig.sessionPrompt}</Text>
        <Text style={styles.text}>Quiet breath. Quiet return.</Text>
      </View>

      <View style={styles.instrumentPanel}>
        <Text style={styles.timer}>{formatSessionLength(remainingSeconds)}</Text>
        <View style={styles.fieldWrap}>
          <BreathPacer running={running} />
        </View>
        <Text style={styles.line}>{completed ? modeConfig.completionLine : 'Let the breath organize the signal.'}</Text>
      </View>

      <View style={styles.buttonStack}>
        {!completed ? (
          <PrimaryButton label={running ? 'Pause' : 'Resume'} onPress={running ? pause : resume} />
        ) : (
          <PrimaryButton label="Continue" onPress={onContinue} />
        )}
        <SecondaryButton label="Exit" onPress={onExit} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    gap: 8,
    marginBottom: theme.spacing.lg,
  },
  eyebrow: {
    color: theme.colors.positive,
    fontSize: 13,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    maxWidth: 320,
  },
  text: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 300,
  },
  instrumentPanel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  timer: {
    color: theme.colors.textMuted,
    fontSize: 14,
    letterSpacing: 1,
    marginBottom: theme.spacing.sm,
  },
  fieldWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  line: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 260,
  },
  buttonStack: {
    gap: theme.spacing.sm,
  },
});
