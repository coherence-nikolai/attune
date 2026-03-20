export type AttuneState =
  | 'Scattered'
  | 'Contracted'
  | 'Heavy'
  | 'Open'
  | 'Calm'
  | 'Clear'
  | 'Connected';

export type AttuneMode = 'Steady' | 'Soften' | 'Clear';

export type SessionStatus = 'idle' | 'running' | 'paused' | 'completed' | 'exited';

export type AttuneSessionRecord = {
  id: string;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  mode: AttuneMode;
  beforeState: AttuneState;
  afterState: AttuneState;
  note?: string;
};
