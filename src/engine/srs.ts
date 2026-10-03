import { createEmptyCard, fsrs, generatorParameters, Rating, type Card, type Grade } from 'ts-fsrs';
import type { Confidence, StoredCard } from '../db/db';

const DAY = 86_400_000;

/** Map an answer to an FSRS grade. Correct-but-guessed counts as Hard and is pulled in sooner. */
export function gradeFor(correct: boolean, confidence: Confidence): Grade {
  if (!correct) return Rating.Again;
  if (confidence === 'guess' || confidence === 'unsure') return Rating.Hard;
  return Rating.Good;
}

export function toStored(c: Card): StoredCard {
  return { ...c, due: c.due.getTime(), last_review: c.last_review?.getTime() };
}
export function fromStored(s: StoredCard): Card {
  return { ...s, due: new Date(s.due), last_review: s.last_review ? new Date(s.last_review) : undefined } as Card;
}

/** Scheduler with intervals capped so every review lands before the exam. */
export function scheduler(examDate: string, now = Date.now()) {
  const daysLeft = Math.max(1, Math.floor((new Date(examDate + 'T09:00:00').getTime() - now) / DAY));
  return fsrs(generatorParameters({ request_retention: 0.9, maximum_interval: daysLeft, enable_short_term: false, enable_fuzz: false }));
}

export function review(card: StoredCard | undefined, correct: boolean, confidence: Confidence, examDate: string, now = Date.now()): StoredCard {
  const f = scheduler(examDate, now);
  const c = card ? fromStored(card) : createEmptyCard(new Date(now));
  let next = f.next(c, new Date(now), gradeFor(correct, confidence)).card;
  if (correct && confidence === 'guess') {
    // pull a lucky guess in to half its interval
    const half = Math.max(1, Math.round(next.scheduled_days / 2));
    next = { ...next, scheduled_days: half, due: new Date(now + half * DAY) };
  }
  return toStored(next);
}

/** Probability of recall at a given time (for readiness estimates). */
export function retrievability(card: StoredCard, examDate: string, at: number): number {
  const f = scheduler(examDate);
  const r = f.get_retrievability(fromStored(card), new Date(at), false);
  return typeof r === 'number' ? r : Number(r);
}

export const isDue = (card: StoredCard | undefined, now = Date.now()) => !!card && card.due <= now;
