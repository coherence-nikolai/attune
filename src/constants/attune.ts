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

export const MODE_CONFIG: Record<
  AttuneMode,
  {
    cue: string;
    description: string;
    inhaleMs: number;
    exhaleMs: number;
    settleMs: number;
  }
> = {
  Steady: {
    cue: 'Grounding / settling',
    description: 'Return to a quieter center.',
    inhaleMs: 4000,
    exhaleMs: 4000,
    settleMs: 1000,
  },
  Soften: {
    cue: 'Gentle easing',
    description: 'Loosen the pace. Let the edges soften.',
    inhaleMs: 3500,
    exhaleMs: 5000,
    settleMs: 1200,
  },
  Clear: {
    cue: 'Composure / decluttering',
    description: 'Make a little more space in the field.',
    inhaleMs: 3000,
    exhaleMs: 4500,
    settleMs: 800,
  },
};
