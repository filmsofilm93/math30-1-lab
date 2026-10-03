import { Coordinates, Line, Mafs, Plot, Point, Text, Theme } from 'mafs';
import { piLabel } from '../../engine/generators/u4/shared';
import type { Curve, GraphSpec } from '../../engine/types';

export const ROLE_COLOR: Record<Curve['role'], string> = {
  base: 'var(--mafs-violet)',
  image: 'var(--mafs-blue)',
  aux: 'var(--mafs-red)',
};

/** Split a curve's domain at its breaks (asymptotes, holes). */
export function pieces(c: Curve, view: GraphSpec['view']): [number, number][] {
  const [lo, hi] = c.domain ?? [view.x[0] - 1, view.x[1] + 1];
  const cuts = (c.breaks ?? []).filter((b) => b > lo && b < hi).sort((a, b) => a - b);
  const out: [number, number][] = [];
  let start = lo;
  for (const b of cuts) {
    out.push([start, b - 1e-4]);
    start = b + 1e-4;
  }
  out.push([start, hi]);
  return out;
}

/** Clamp outputs so near-asymptote values don't blow up the SVG path. */
const tame = (fn: (x: number) => number, lim: number) => (x: number) => {
  const y = fn(x);
  return Number.isFinite(y) ? Math.max(-lim, Math.min(lim, y)) : NaN;
};

const multiple = (v: number, step: number) => Math.abs(v / step - Math.round(v / step)) < 1e-6;

/** Axis tick label: every labelStep, in degrees, multiples of π, or plain numbers. */
export function tickLabel(v: number, labelStep: number, unit?: 'deg' | 'pi'): string {
  if (!multiple(v, labelStep)) return '';
  if (unit === 'pi') return piLabel(Math.round((v * 180) / Math.PI));
  const n = String(+v.toFixed(4));
  return unit === 'deg' ? `${n}°` : n;
}

export function Graph({ spec, height = 260 }: { spec: GraphSpec; height?: number }) {
  const lim = 10 * Math.max(Math.abs(spec.view.y[0]), Math.abs(spec.view.y[1]), 10);
  const t = spec.ticks;
  const [xs, xl, ys, yl] = t ? [t.x, t.xLabel, t.y ?? 1, t.yLabel ?? 2 * (t.y ?? 1)] : [1, 2, 1, 2];
  return (
    <div className="overflow-hidden rounded-xl border border-line dark:border-line-d" role="img" aria-label="Graph">
      <Mafs height={height} viewBox={{ x: spec.view.x, y: spec.view.y, padding: 0 }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian xAxis={{ lines: xs, labels: (n) => tickLabel(n, xl, t?.xUnit) }} yAxis={{ lines: ys, labels: (n) => tickLabel(n, yl) }} />
        {spec.vlines?.map((v, i) => <Line.ThroughPoints key={`v${i}`} point1={[v.x, 0]} point2={[v.x, 1]} style={v.dashed ? 'dashed' : 'solid'} color={Theme.foreground} opacity={0.5} />)}
        {spec.hlines?.map((h, i) => <Line.ThroughPoints key={`h${i}`} point1={[0, h.y]} point2={[1, h.y]} style={h.dashed ? 'dashed' : 'solid'} color={Theme.foreground} opacity={0.5} />)}
        {spec.curves.map((c, i) =>
          pieces(c, spec.view).map((d, j) => (
            <Plot.OfX key={`${i}-${j}`} y={tame(c.fn, lim)} domain={d} color={ROLE_COLOR[c.role]} style={c.dashed || c.role === 'base' ? 'dashed' : 'solid'} weight={c.role === 'image' ? 3 : 2} />
          )),
        )}
        {spec.points?.map((p, i) => (
          <g key={`p${i}`}>
            <Point x={p.x} y={p.y} color={p.kind === 'invariant' ? 'var(--mafs-green)' : Theme.foreground} svgCircleProps={p.kind === 'open' ? { style: { fill: 'var(--open-point-fill)', stroke: Theme.foreground, strokeWidth: 2 } } : undefined} />
            {p.label && (
              <Text x={p.x} y={p.y} attach="ne" size={13}>
                {p.label}
              </Text>
            )}
          </g>
        ))}
      </Mafs>
    </div>
  );
}
