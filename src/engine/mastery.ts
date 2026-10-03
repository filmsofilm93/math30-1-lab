/** Mastery rule: at least 80% on the last 10 unassisted attempts, spread over at least two different days. */
export interface MasteryAttempt {
  correct: boolean;
  assisted: boolean;
  day: string;
  mode: string;
}

export const MASTERY_WINDOW = 10;
export const MASTERY_RATE = 0.8;

export function masteryStatus(attempts: MasteryAttempt[]) {
  const counted = attempts.filter((a) => !a.assisted && a.mode !== 'faded').slice(-MASTERY_WINDOW);
  const correct = counted.filter((a) => a.correct).length;
  const days = new Set(counted.map((a) => a.day)).size;
  const mastered = counted.length === MASTERY_WINDOW && correct / MASTERY_WINDOW >= MASTERY_RATE && days >= 2;
  return { mastered, counted: counted.length, correct, days, needed: MASTERY_WINDOW };
}

/** Two consecutive unassisted misses trigger a prerequisite check. */
export const ROUTING_FAILS = 2;
