/**
 * Readiness estimate: the chance of answering a typical diploma question correctly, if the exam were today.
 *
 * Per skill, a Beta posterior on accuracy: prior mean 0.3 (strength 4), updated with the last 20
 * unassisted, non-faded attempts. Skills are weighted by exam emphasis inside a unit and units by
 * their estimated exam share. Skill uncertainties are combined as if fully correlated (a conservative
 * upper bound: what you don't know in one skill says something about the next), and the 80% range is
 * never narrower than ±5 points, because the model itself is an approximation.
 */

export interface ReadinessNode {
  id: string;
  unit: string;
  examEmphasis: number;
}

export interface ReadinessAttempt {
  nodeId: string;
  correct: boolean;
  assisted: boolean;
  mode: string;
}

export const PRIOR_MEAN = 0.3;
export const PRIOR_STRENGTH = 4;
export const RECENT = 20;
const Z80 = 1.2816;
export const FLOOR = 0.05;

export interface NodeEstimate {
  mean: number;
  sd: number;
  n: number;
}

export function nodeEstimate(attempts: ReadinessAttempt[]): NodeEstimate {
  const used = attempts.filter((a) => !a.assisted && a.mode !== 'faded').slice(-RECENT);
  const k = used.filter((a) => a.correct).length;
  const a = PRIOR_MEAN * PRIOR_STRENGTH + k;
  const b = (1 - PRIOR_MEAN) * PRIOR_STRENGTH + used.length - k;
  const mean = a / (a + b);
  return { mean, sd: Math.sqrt((a * b) / ((a + b) ** 2 * (a + b + 1))), n: used.length };
}

export interface Readiness {
  mean: number;
  low: number;
  high: number;
  /** Share of exam weight (0..1) on skills with at least 5 counted attempts. */
  coverage: number;
  byUnit: { unit: string; mean: number; share: number }[];
}

export function readiness(nodes: ReadinessNode[], attempts: ReadinessAttempt[], unitShare: Record<string, number>): Readiness {
  const byNode = new Map<string, ReadinessAttempt[]>();
  for (const a of attempts) byNode.set(a.nodeId, [...(byNode.get(a.nodeId) ?? []), a]);
  const units = Object.keys(unitShare).filter((u) => nodes.some((n) => n.unit === u));
  const total = units.reduce((s, u) => s + unitShare[u], 0);
  let mean = 0;
  let sd = 0;
  let coverage = 0;
  const byUnit = units.map((u) => {
    const ns = nodes.filter((n) => n.unit === u);
    const wSum = ns.reduce((s, n) => s + n.examEmphasis, 0);
    let um = 0;
    for (const n of ns) {
      const e = nodeEstimate(byNode.get(n.id) ?? []);
      const w = (unitShare[u] / total) * (n.examEmphasis / wSum);
      mean += w * e.mean;
      sd += w * e.sd;
      if (e.n >= 5) coverage += w;
      um += (n.examEmphasis / wSum) * e.mean;
    }
    return { unit: u, mean: um, share: unitShare[u] / total };
  });
  const half = Math.max(Z80 * sd, FLOOR);
  return { mean, low: Math.max(0, mean - half), high: Math.min(1, mean + half), coverage, byUnit };
}
