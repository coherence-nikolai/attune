import AsyncStorage from '@react-native-async-storage/async-storage';

import { AttuneSessionRecord } from '../types';

const HISTORY_KEY = 'attune.history.v1';

export async function loadHistory(): Promise<AttuneSessionRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isSessionRecord).sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  } catch {
    return [];
  }
}

export async function appendHistory(record: AttuneSessionRecord): Promise<AttuneSessionRecord[]> {
  const existing = await loadHistory();
  const next = [record, ...existing].sort((a, b) => b.completedAt.localeCompare(a.completedAt));

  try {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    return existing;
  }

  return next;
}

function isSessionRecord(value: unknown): value is AttuneSessionRecord {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.startedAt === 'string' &&
    typeof candidate.completedAt === 'string' &&
    typeof candidate.durationSeconds === 'number' &&
    typeof candidate.mode === 'string' &&
    typeof candidate.beforeState === 'string' &&
    typeof candidate.afterState === 'string'
  );
}
