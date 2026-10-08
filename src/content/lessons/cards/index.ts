import type { LessonCard } from '../types';
import { CARDS as PRE } from './pre';
import { CARDS as U1 } from './u1';
import { CARDS as U2 } from './u2';
import { CARDS as U3 } from './u3';
import { CARDS as U4A } from './u4a';
import { CARDS as U4B } from './u4b';
import { CARDS as U5 } from './u5';
import { CARDS as U6 } from './u6';
import { CARDS as EXAM } from './exam';

export const CARD_MAP: Record<string, LessonCard[]> = { ...PRE, ...U1, ...U2, ...U3, ...U4A, ...U4B, ...U5, ...U6, ...EXAM };
