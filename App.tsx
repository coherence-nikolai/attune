import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

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
import { AttuneMode, AttuneSessionRecord, AttuneState } from './src/types';

type Flow = 'home' | 'checkin' | 'mode' | 'session' | 'reflection' | 'history';

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

  const sessionSummary = useMemo(() => {
    if (!beforeState || !selectedMode) {
      return null;
    }

    return `${beforeState} → ${selectedMode}`;
  }, [beforeState, selectedMode]);

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
            <Text style={styles.heroEyebrow}>Attune</Text>
            <Text style={styles.heroTitle}>A quiet solo coherence practice.</Text>
            <Text style={styles.heroText}>Check in. Breathe. Reflect.</Text>
          </View>

          <View style={styles.panel}>
            <Text style={styles.sectionTitle}>Phase 1</Text>
            <Text style={styles.bodyText}>A short guided session to move from fragmentation toward steadier presence.</Text>
          </View>

          <View style={styles.buttonStack}>
            <PrimaryButton label="Begin" onPress={beginAttune} />
            <SecondaryButton label="History" onPress={openHistory} />
          </View>
        </Screen>
      ) : null}

      {flow === 'checkin' ? (
        <Screen>
          <View style={styles.headerBlock}>
            <Text style={styles.heroEyebrow}>Check in</Text>
            <Text style={styles.heroTitle}>What feels closest now?</Text>
            <Text style={styles.heroText}>Choose one current state.</Text>
          </View>

          <View style={styles.chipGrid}>
            {ATTUNE_STATES.map((state) => (
              <StateChip
                key={state}
                label={state}
                selected={beforeState === state}
                onPress={() => setBeforeState(state)}
              />
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
            <Text style={styles.heroEyebrow}>Mode</Text>
            <Text style={styles.heroTitle}>Choose the tone.</Text>
            <Text style={styles.heroText}>{sessionSummary ?? 'Select a mode for this session.'}</Text>
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
                if (!selectedMode) {
                  return;
                }
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
        <SessionView
          mode={selectedMode}
          durationSeconds={SESSION_DURATION_SECONDS}
          onExit={exitToHome}
          onContinue={() => setFlow('reflection')}
        />
      ) : null}

      {flow === 'reflection' ? (
        <Screen>
          <View style={styles.headerBlock}>
            <Text style={styles.heroEyebrow}>Reflect</Text>
            <Text style={styles.heroTitle}>How do you feel now?</Text>
            <Text style={styles.heroText}>Choose one state. A short note is optional.</Text>
          </View>

          <View style={styles.chipGrid}>
            {ATTUNE_STATES.map((state) => (
              <StateChip
                key={state}
                label={state}
                selected={afterState === state}
                onPress={() => setAfterState(state)}
              />
            ))}
          </View>

          <View style={styles.panel}>
            <Text style={styles.fieldLabel}>Optional note</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="A brief reflection"
              placeholderTextColor={theme.colors.textSoft}
              maxLength={160}
              multiline
              style={styles.input}
            />
          </View>

          <View style={styles.buttonStack}>
            <PrimaryButton label={saving ? 'Saving…' : 'Save session'} onPress={saveReflection} disabled={!afterState || saving} />
            <SecondaryButton label="Return" onPress={exitToHome} />
          </View>
        </Screen>
      ) : null}

      {flow === 'history' ? (
        <Screen scroll={false}>
          <View style={styles.headerBlock}>
            <Text style={styles.heroEyebrow}>History</Text>
            <Text style={styles.heroTitle}>Local sessions</Text>
            <Text style={styles.heroText}>Stored on this device only.</Text>
          </View>

          {historyLoading ? (
            <View style={styles.centerFill}>
              <ActivityIndicator color={theme.colors.accent} />
            </View>
          ) : history.length === 0 ? (
            <View style={[styles.panel, styles.emptyPanel]}>
              <Text style={styles.sectionTitle}>No sessions yet</Text>
              <Text style={styles.bodyText}>Complete one short Attune session to begin a private history.</Text>
            </View>
          ) : (
            <FlatList
              data={history}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.historyList}
              renderItem={({ item }) => <HistoryCard record={item} />}
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
    letterSpacing: 0.3,
  },
  heroTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.title,
    lineHeight: 40,
    fontWeight: '700',
  },
  heroText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  headerBlock: {
    gap: theme.spacing.sm,
  },
  panel: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
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
    lineHeight: 24,
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
    lineHeight: 22,
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
