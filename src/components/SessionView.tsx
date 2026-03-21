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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const modeConfig = MODE_CONFIG[mode];
  const running = status === 'running';
  const completed = status === 'completed';

  return (
    <Screen>
      <View style={styles.headerBlock}>
        <Text style={styles.eyebrow}>{mode.toUpperCase()}</Text>
        <Text style={styles.title}>{modeConfig.sessionPrompt}</Text>
        <Text style={styles.text}>Quiet breath. Quiet return.</Text>
      </View>

      <View style={styles.instrumentField}>
        <View style={styles.timerRow}>
          <Text style={styles.timer}>{formatSessionLength(remainingSeconds)}</Text>
        </View>
        <BreathPacer running={running} />
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
  },
  eyebrow: {
    color: theme.colors.success,
    fontSize: 13,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  title: {
    color: theme.colors.text,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700',
    maxWidth: 320,
  },
  text: {
    color: theme.colors.textMuted,
    fontSize: 17,
    lineHeight: 26,
    maxWidth: 300,
  },
  instrumentField: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    position: 'relative',
  },
  timerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 22,
  },
  timer: {
    color: theme.colors.textSoft,
    fontSize: 14,
    letterSpacing: 1.6,
  },
  line: {
    color: theme.colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 280,
    marginTop: -4,
  },
  buttonStack: {
    gap: theme.spacing.sm,
  },
});
