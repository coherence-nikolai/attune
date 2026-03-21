import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

import { HistoryCard } from './src/components/HistoryCard';
import { ModeCard } from './src/components/ModeCard';
import { PrimaryButton } from './src/components/PrimaryButton';
import { Screen } from './src/components/Screen';
import { SecondaryButton } from './src/components/SecondaryButton';
import { SessionView } from './src/components/SessionView';
import { StateChip } from './src/components/StateChip';
import { ATTUNE_STATES, MODE_CONFIG, SESSION_DURATION_SECONDS } from './src/constants/attune';
import { appendHistory, loadHistory } from './src/lib/storage';
import { theme } from './src/theme';
import { AttuneMode, AttuneSessionRecord, AttuneState, Flow } from './src/types';

const MODE_ORDER: AttuneMode[] = ['Steady', 'Soften', 'Clear'];

export default function App() {
  const [flow, setFlow] = useState<Flow>('home');
  const [history, setHistory] = useState<AttuneSessionRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [beforeState, setBeforeState] = useState<AttuneState | null>(null);
  const [selectedMode, setSelectedMode] = useState<AttuneMode | null>(null);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const [afterState, setAfterState] = useState<AttuneState | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const loaded = await loadHistory();
      if (!cancelled) {
        setHistory(loaded);
        setHistoryLoading(false);
      }
    }

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const currentSignalLine = useMemo(() => {
    if (!beforeState) {
      return 'Choose the state that feels closest.';
    }

    return `${beforeState} is closest right now.`;
  }, [beforeState]);

  const resetDraft = () => {
    setBeforeState(null);
    setSelectedMode(null);
    setStartedAt(null);
    setAfterState(null);
    setNote('');
    setSaving(false);
  };

  const beginAttune = () => {
    resetDraft();
    setFlow('checkin');
  };

  const exitToHome = () => {
    resetDraft();
    setFlow('home');
  };

  const openHistory = async () => {
    setHistoryLoading(true);
    const loaded = await loadHistory();
    setHistory(loaded);
    setHistoryLoading(false);
    setFlow('history');
  };

  const saveReflection = async () => {
    if (!beforeState || !selectedMode || !afterState || !startedAt) {
      return;
    }

    setSaving(true);

    const record: AttuneSessionRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      startedAt,
      completedAt: new Date().toISOString(),
      durationSeconds: SESSION_DURATION_SECONDS,
      mode: selectedMode,
      beforeState,
      afterState,
      note: note.trim() || undefined,
    };

    const nextHistory = await appendHistory(record);
    setHistory(nextHistory);
    resetDraft();
    setFlow('history');
  };

  return (
    <>
      <StatusBar style="light" />

      {flow === 'home' ? (
        <Screen>
          <View style={styles.heroWrap}>
            <Text style={styles.heroEyebrow}>ATTUNE</Text>
            <Text style={styles.heroTitle}>A quiet instrument{`\n`}for coherence.</Text>
            <Text style={styles.heroText}>Notice the signal. Steady the breath. Return with more clarity.</Text>
          </View>

          <View style={styles.panel}>
            <Text style={styles.sectionTitle}>Phase 1 · Self coherence</Text>
            <Text style={styles.bodyText}>A private practice for stabilizing your own signal before it reaches outward.</Text>
          </View>

          <View style={styles.spacer} />

          <View style={styles.buttonStack}>
            <PrimaryButton label="Begin" onPress={beginAttune} />
            <SecondaryButton label="History" onPress={openHistory} />
          </View>
        </Screen>
      ) : null}

      {flow === 'checkin' ? (
        <Screen>
          <View style={styles.headerBlock}>
            <Text style={styles.heroEyebrow}>SIGNAL</Text>
            <Text style={styles.heroTitle}>Where is the{`\n`}signal now?</Text>
            <Text style={styles.heroText}>{currentSignalLine}</Text>
          </View>

          <View style={styles.chipGrid}>
            {ATTUNE_STATES.map((state) => (
              <StateChip key={state} label={state} selected={beforeState === state} onPress={() => setBeforeState(state)} />
            ))}
          </View>

          <View style={styles.buttonStack}>
            <PrimaryButton label="Continue" onPress={() => setFlow('mode')} disabled={!beforeState} />
            <SecondaryButton label="Return" onPress={exitToHome} />
          </View>
        </Screen>
      ) : null}

      {flow === 'mode' ? (
        <Screen>
          <View style={styles.headerBlock}>
            <Text style={styles.heroEyebrow}>MODE</Text>
            <Text style={styles.heroTitle}>Choose the next{`\n`}movement.</Text>
            <Text style={styles.heroText}>Select the kind of return you need.</Text>
          </View>

          <View style={styles.cardStack}>
            {MODE_ORDER.map((mode) => {
              const config = MODE_CONFIG[mode];
              return (
                <ModeCard
                  key={mode}
                  title={mode}
                  cue={config.cue}
                  description={config.description}
                  selected={selectedMode === mode}
                  onPress={() => setSelectedMode(mode)}
                />
              );
            })}
          </View>

          <View style={styles.buttonStack}>
            <PrimaryButton
              label="Start session"
              onPress={() => {
                if (!selectedMode) return;
                setStartedAt(new Date().toISOString());
                setFlow('session');
              }}
              disabled={!selectedMode}
            />
            <SecondaryButton label="Back" onPress={() => setFlow('checkin')} />
          </View>
        </Screen>
      ) : null}

      {flow === 'session' && selectedMode ? (
        <SessionView mode={selectedMode} durationSeconds={SESSION_DURATION_SECONDS} onExit={exitToHome} onContinue={() => setFlow('reflection')} />
      ) : null}

      {flow === 'reflection' ? (
        <Screen>
          <View style={styles.headerBlock}>
            <Text style={styles.heroEyebrow}>REFLECT</Text>
            <Text style={styles.heroTitle}>Where has the{`\n`}signal settled?</Text>
            <Text style={styles.heroText}>Choose the state that feels closest now.</Text>
          </View>

          <View style={styles.chipGrid}>
            {ATTUNE_STATES.map((state) => (
              <StateChip key={state} label={state} selected={afterState === state} onPress={() => setAfterState(state)} />
            ))}
          </View>

          <View style={styles.panel}>
            <Text style={styles.fieldLabel}>Optional note</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="What shifted?"
              placeholderTextColor={theme.colors.textSoft}
              maxLength={160}
              multiline
              style={styles.input}
            />
          </View>

          <View style={styles.buttonStack}>
            <PrimaryButton label={saving ? 'Saving…' : 'Save return'} onPress={saveReflection} disabled={!afterState || saving} />
            <SecondaryButton label="Return" onPress={exitToHome} />
          </View>
        </Screen>
      ) : null}

      {flow === 'history' ? (
        <Screen scroll={false}>
          <View style={styles.headerBlock}>
            <Text style={styles.heroEyebrow}>HISTORY</Text>
            <Text style={styles.heroTitle}>A quiet record{`\n`}of return.</Text>
            <Text style={styles.heroText}>Each entry marks a movement toward steadiness, softness, or clarity.</Text>
          </View>

          {historyLoading ? (
            <View style={styles.centerFill}>
              <ActivityIndicator color={theme.colors.accent} />
            </View>
          ) : history.length === 0 ? (
            <View style={[styles.panel, styles.emptyPanel]}>
              <Text style={styles.sectionTitle}>No returns saved yet.</Text>
              <Text style={styles.bodyText}>Begin a session when you want to steady the signal.</Text>
            </View>
          ) : (
            <FlatList
              data={history}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.historyList}
              renderItem={({ item }) => <HistoryCard item={item} />}
              showsVerticalScrollIndicator={false}
            />
          )}

          <View style={styles.buttonStack}>
            <PrimaryButton label="New session" onPress={beginAttune} />
            <SecondaryButton label="Return" onPress={exitToHome} />
          </View>
        </Screen>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  heroWrap: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  heroEyebrow: {
    color: theme.colors.success,
    fontSize: theme.typography.small,
    fontWeight: '700',
    letterSpacing: 1.9,
  },
  heroTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.hero,
    lineHeight: 64,
    fontWeight: '700',
  },
  heroText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
    lineHeight: 28,
    maxWidth: 336,
  },
  headerBlock: {
    gap: theme.spacing.sm,
  },
  panel: {
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.borderSoft,
    backgroundColor: theme.colors.surfaceGlass,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 0.22,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
  },
  emptyPanel: {
    minHeight: 180,
    justifyContent: 'center',
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.section,
    fontWeight: '700',
  },
  bodyText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
    lineHeight: 28,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  cardStack: {
    gap: theme.spacing.sm,
  },
  buttonStack: {
    gap: theme.spacing.sm,
  },
  spacer: {
    flex: 1,
    minHeight: 120,
  },
  fieldLabel: {
    color: theme.colors.text,
    fontSize: theme.typography.small,
    fontWeight: '600',
  },
  input: {
    minHeight: 108,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceElevated,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    textAlignVertical: 'top',
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  historyList: {
    gap: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },
  centerFill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
