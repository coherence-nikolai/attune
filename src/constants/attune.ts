import { AttuneMode, AttuneState } from '../types';

export const ATTUNE_STATES: AttuneState[] = [
  'Scattered',
  'Contracted',
  'Heavy',
  'Open',
  'Calm',
  'Clear',
  'Connected',
];

export const SESSION_DURATION_SECONDS = 180;

export const BREATH_PHASES = {
  inhaleSeconds: 4,
  exhaleSeconds: 6,
  settleSeconds: 1,
} as const;

export const MODE_ORDER: AttuneMode[] = ['Steady', 'Soften', 'Clear'];

export const MODE_CONFIG: Record<AttuneMode, { cue: string; description: string; sessionPrompt: string; completionLine: string }> = {
  Steady: {
    cue: 'Stabilize the signal',
    description: 'Settle into steadiness.',
    sessionPrompt: 'Steady the signal',
    completionLine: 'Hold what has steadied.',
  },
  Soften: {
    cue: 'Ease contraction gently',
    description: 'Reduce contraction without force.',
    sessionPrompt: 'Soften the edges',
    completionLine: 'Let the signal stay soft.',
  },
  Clear: {
    cue: 'Reduce inner noise',
    description: 'Return to clarity and space.',
    sessionPrompt: 'Clear the inner field',
    completionLine: 'Notice what has cleared.',
  },
};
