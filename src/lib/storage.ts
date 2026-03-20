import AsyncStorage from '@react-native-async-storage/async-storage';

import { AttuneSessionRecord } from '../types';

const HISTORY_KEY = 'attune.session-history.v1';

export async function loadHistory(): Promise<AttuneSessionRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isSessionRecordLike);
  } catch {
    return [];
  }
}

export async function saveHistory(history: AttuneSessionRecord[]): Promise<void> {
  try {
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // fail quietly for v1
  }
}

export async function appendHistory(record: AttuneSessionRecord): Promise<AttuneSessionRecord[]> {
  const current = await loadHistory();
  const next = [record, ...current];
  await saveHistory(next);
  return next;
}

function isSessionRecordLike(value: unknown): value is AttuneSessionRecord {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.startedAt === 'string' &&
    typeof record.completedAt === 'string' &&
    typeof record.durationSeconds === 'number' &&
    typeof record.mode === 'string' &&
    typeof record.beforeState === 'string' &&
    typeof record.afterState === 'string'
  );
}
