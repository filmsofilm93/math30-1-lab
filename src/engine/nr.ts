// Numerical response, following the Math 30-1 bulletin: digits go in the boxes from the left, values between 0 and 1
// keep the leading 0, answers are rounded as the question says (or are whole numbers), and a negative sign, when the
// answer is negative, is printed before the boxes. Four boxes; the decimal point takes a box (assumed, not stated officially).
import { roundTo } from './check';
import type { Item, NRSpec, Round } from './types';

export const NR_BOXES = 4;
export const NR_FOOTER = '(Record your answer in the numerical-response section on the answer sheet.)';
export const NR_FOOTER_ANY = (n: number) => `(Record all ${['', '', 'two', 'three', 'four'][n]} digits of your answer in any order in the numerical-response section on the answer sheet.)`;
export const NR_FOOTER_ORDER = (n: number) => `(Record all ${['', '', 'two', 'three', 'four'][n]} digits of your answer in the numerical-response section on the answer sheet.)`;

/** How a value is written in the boxes: "0.25", "5.3", "17". */
export function recordValue(v: number, round: Round): string {
  const a = Math.abs(roundTo(v, round));
  return round === 'whole' ? String(a) : a.toFixed(round === 'tenth' ? 1 : 2);
}

export function valueSpec(v: number, round: Round): Extract<NRSpec, { kind: 'value' }> | null {
  const r = roundTo(v, round);
  const record = recordValue(v, round);
  if (record.length > NR_BOXES) return null;
  return { kind: 'value', value: r, round, negative: r < 0, record };
}

/** Turn an input item with one numeric answer into a numerical-response item; null if it can't be one. */
export function toNR(it: Item): Item | null {
  if (it.format === 'nr') return it;
  if (it.format !== 'input' || it.fields?.length !== 1) return null;
  const a = it.fields[0].answer;
  let v: number;
  let round: Round | undefined;
  if (a.kind === 'number') {
    v = a.value;
    round = a.round;
  } else if (a.kind === 'set' && a.values.length === 1 && !a.deg) {
    v = a.values[0];
    round = a.round;
  } else return null;
  if (!round) {
    if (Math.abs(v - Math.round(v)) > 1e-9) return null; // exact non-integer (a fraction or radical): not recordable
    round = 'whole';
  }
  const spec = valueSpec(v, round);
  if (!spec) return null;
  return {
    ...it,
    format: 'nr',
    nr: spec,
    fields: undefined,
    stem: `${it.stem} ${NR_FOOTER}`,
  };
}

export type NRVerdict = { ok: boolean; note?: string };

/** Check what was typed into the boxes, scoring it as a scanner would and naming any recording error. */
export function checkNR(spec: NRSpec, raw: string): NRVerdict {
  const s = raw.trim();
  if (!s) return { ok: false, note: 'No answer recorded.' };
  if (!/^[0-9.]+$/.test(s)) return { ok: false, note: s.includes('-') ? 'Record only digits: a negative sign is already printed before the boxes when the answer is negative.' : 'Only digits and a decimal point go in the boxes.' };
  if (s.length > NR_BOXES) return { ok: false, note: `There are only ${NR_BOXES} boxes.` };
  if (spec.kind === 'code') {
    if (s.includes('.')) return { ok: false, note: 'A code has digits only.' };
    if (s === spec.record) return { ok: true };
    if (spec.order === 'any' && s.length === spec.record.length && [...s].sort().join('') === [...spec.record].sort().join('')) return { ok: true };
    if (spec.order === 'correct' && [...s].sort().join('') === [...spec.record].sort().join('')) return { ok: false, note: 'Right digits, wrong order. This code is scored in the order asked.' };
    return { ok: false };
  }
  if ((s.match(/\./g) ?? []).length > 1) return { ok: false, note: 'More than one decimal point.' };
  if (s === spec.record) return { ok: true };
  const v = Number(s);
  const want = Math.abs(spec.value);
  if (s.startsWith('.') && Math.abs(v - want) < 1e-9) return { ok: false, note: 'Record the 0 before the decimal point for values between 0 and 1.' };
  if (Math.abs(v - want) < 1e-9) return { ok: false, note: `Round to the ${spec.round === 'whole' ? 'whole number' : spec.round}: record ${spec.record}.` };
  const places = s.includes('.') ? s.split('.')[1].length : 0;
  const need = spec.round === 'whole' ? 0 : spec.round === 'tenth' ? 1 : 2;
  if (places !== need && Math.abs(v - want) < 0.06) return { ok: false, note: `Round to the ${spec.round === 'whole' ? 'whole number' : 'nearest ' + spec.round}.` };
  return { ok: false };
}

/** Plain-text answer for solutions and reports, e.g. "−0.25 (record 0.25)". */
export function nrAnswerText(spec: NRSpec): string {
  if (spec.kind === 'code') return `${spec.record}${spec.order === 'any' ? ' (any order)' : ''}`;
  return spec.negative ? `−${spec.record} (record ${spec.record}; the sign is printed)` : spec.record;
}
