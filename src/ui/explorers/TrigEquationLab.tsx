import { Coordinates, Line, Mafs, Plot, Point } from 'mafs';
import { useState } from 'react';
import type { TrigEquationPreset } from '../../content/lessons/types';
import { angleLabel, evalFn3, generalSolution, solveFn, type Fn3 } from '../../engine/trigLab';
import { tickLabel } from '../components/Graph';
import { Tex } from '../components/Rich';
import { card, muted } from '../styles';
import { Chips, Slider, Toggle } from './controls';

const D2R = Math.PI / 180;
/** Slider values for k, with the special values exact. */
const K_SPECIAL: { v: number; tex: string }[] = [
  { v: -Math.sqrt(3), tex: '-\\sqrt{3}' },
  { v: -1, tex: '-1' },
  { v: -Math.sqrt(3) / 2, tex: '-\\frac{\\sqrt{3}}{2}' },
  { v: -Math.SQRT1_2, tex: '-\\frac{\\sqrt{2}}{2}' },
  { v: -0.5, tex: '-\\frac{1}{2}' },
  { v: -Math.sqrt(3) / 3, tex: '-\\frac{\\sqrt{3}}{3}' },
  { v: 0, tex: '0' },
  { v: Math.sqrt(3) / 3, tex: '\\frac{\\sqrt{3}}{3}' },
  { v: 0.5, tex: '\\frac{1}{2}' },
  { v: Math.SQRT1_2, tex: '\\frac{\\sqrt{2}}{2}' },
  { v: Math.sqrt(3) / 2, tex: '\\frac{\\sqrt{3}}{2}' },
  { v: 1, tex: '1' },
  { v: Math.sqrt(3), tex: '\\sqrt{3}' },
];
const K_VALUES = [...K_SPECIAL.map((k) => k.v), -2, -1.5, -0.8, -0.3, 0.3, 0.8, 1.5, 2].sort((a, b) => a - b);
const kTex = (v: number) => K_SPECIAL.find((k) => Math.abs(k.v - v) < 1e-12)?.tex ?? String(v);

const DOMAINS: { id: string; lo: number; hi: number; hiIn: boolean }[] = [
  { id: '0-360', lo: 0, hi: 360, hiIn: false },
  { id: '0-720', lo: 0, hi: 720, hiIn: false },
  { id: '-360-360', lo: -360, hi: 360, hiIn: true },
  { id: '-180-180', lo: -180, hi: 180, hiIn: true },
];
const domTex = (d: (typeof DOMAINS)[number], inRad: boolean) => `${angleLabel(d.lo, inRad)} \\le x ${d.hiIn ? '\\le' : '<'} ${angleLabel(d.hi, inRad)}`;

/** y = sin x (cos, tan) against y = k: intersections over a chosen domain and the general solution. */
export function TrigEquationLab({ preset, locked = false }: { preset: TrigEquationPreset; locked?: boolean }) {
  const [fn, setFn] = useState<Fn3>(preset.fn ?? 'sin');
  const nearest = (v: number) => K_VALUES.reduce((bi, x, i) => (Math.abs(x - v) < Math.abs(K_VALUES[bi] - v) ? i : bi), 0);
  const [ki, setKi] = useState(nearest(preset.k ?? 0.5));
  const [two, setTwo] = useState(preset.k2 !== undefined);
  const [k2i, setK2i] = useState(nearest(preset.k2 ?? -1));
  const [dom, setDom] = useState(DOMAINS[0].id);
  const [inRad, setInRad] = useState(!!preset.inRad);
  const D = DOMAINS.find((d) => d.id === dom)!;
  const ks = two ? [K_VALUES[ki], K_VALUES[k2i]] : [K_VALUES[ki]];
  const sols = ks.map((k) => solveFn(fn, k, D.lo, D.hi, D.hiIn));
  const all = [...new Set(sols.flatMap((s) => s.xs.map((x) => +x.toFixed(9))))].sort((a, b) => a - b);
  const allExact = sols.every((s) => s.exact);
  const k = inRad ? D2R : 1;
  const yLim = fn === 'tan' ? 4 : 2.2;
  const label = (x: number) => (allExact ? angleLabel(Math.round(x), inRad) : angleLabel(x, inRad));
  const gen = ks.map((kv) => generalSolution(fn, kv));
  const genTex = gen
    .flatMap((g) => (g ? g.roots.map((r) => `x = ${g.exact ? angleLabel(Math.round(r), inRad) : angleLabel(r, inRad)} + ${angleLabel(g.period, inRad)}n`) : []))
    .join(',\\ ');

  return (
    <div className={`${card} flex flex-col gap-3 p-3 sm:p-4`}>
      <fieldset disabled={locked} className={`flex min-w-0 flex-col gap-2 ${locked ? 'opacity-50' : ''}`}>
        <div className="flex flex-wrap items-center gap-3">
          <Chips label="Function" options={[{ id: 'sin', label: 'sin' }, { id: 'cos', label: 'cos' }, { id: 'tan', label: 'tan' }]} value={fn} onChange={setFn} />
          <Toggle checked={inRad} onChange={setInRad}>
            Radians
          </Toggle>
        </div>
        <Chips label="Domain" options={DOMAINS.map((d) => ({ id: d.id, label: <Tex src={domTex(d, inRad)} /> }))} value={dom} onChange={setDom} />
        <Slider label="k" n={K_VALUES.length} index={ki} onChange={setKi} show={<Tex src={kTex(K_VALUES[ki])} />} />
        <Toggle checked={two} onChange={setTwo}>
          Second factor (for equations like <Tex src="(2\sin x - 1)(\sin x + 1) = 0" />)
        </Toggle>
        {two && <Slider label="k₂" n={K_VALUES.length} index={k2i} onChange={setK2i} show={<Tex src={kTex(K_VALUES[k2i])} />} />}
        <div className="overflow-hidden rounded-lg border border-line dark:border-line-d">
          <Mafs height={260} viewBox={{ x: [(D.lo - 20) * k, (D.hi + 20) * k], y: [-yLim, yLim], padding: 0 }} preserveAspectRatio={false} pan={false}>
            <Coordinates.Cartesian xAxis={{ lines: 45 * k, labels: (n) => tickLabel(n, 90 * k * (D.hi - D.lo > 400 ? 2 : 1), inRad ? 'pi' : 'deg') }} yAxis={{ lines: 0.5, labels: (n) => tickLabel(n, 1) }} />
            <Line.Segment point1={[D.lo * k, -yLim]} point2={[D.lo * k, yLim]} style="dashed" opacity={0.4} />
            <Line.Segment point1={[D.hi * k, -yLim]} point2={[D.hi * k, yLim]} style="dashed" opacity={0.4} />
            {fn === 'tan' ? (
              Array.from({ length: 8 }, (_, i) => -450 + 180 * i).map((c) => <Plot.OfX key={c} y={(x) => Math.tan((x / k) * D2R)} domain={[(c + 0.5) * k, (c + 179.5) * k]} color="var(--mafs-blue)" weight={3} />)
            ) : (
              <Plot.OfX y={(x) => evalFn3(fn, x / k)} color="var(--mafs-blue)" weight={3} />
            )}
            {ks.map((kv, i) => (
              <Line.ThroughPoints key={i} point1={[0, kv]} point2={[1, kv]} color={i ? 'var(--mafs-violet)' : 'var(--mafs-red)'} />
            ))}
            {all.map((x) => (
              <Point key={x} x={x * k} y={evalFn3(fn, x)} color="var(--mafs-orange)" />
            ))}
          </Mafs>
        </div>
      </fieldset>
      <div className="flex flex-col gap-1 overflow-x-auto">
        <p>
          <Tex src={ks.map((kv) => `\\${fn} x = ${kTex(kv)}`).join('\\ \\text{or}\\ ')} /> on <Tex src={domTex(D, inRad)} />:
        </p>
        <p>
          {all.length ? (
            <>
              <span className="font-bold">{all.length}</span> solution{all.length === 1 ? '' : 's'}: <Tex src={`x ${allExact ? '=' : '\\approx'} ${all.map(label).join(',\\ ')}`} />
            </>
          ) : (
            <>No solutions{fn !== 'tan' && ks.some((kv) => Math.abs(kv) > 1) ? <>: <Tex src={`\\${fn} x`} /> stays between −1 and 1.</> : '.'}</>
          )}
        </p>
        {genTex && (
          <p>
            General solution: <Tex src={`${genTex},\\ n \\in I`} />
          </p>
        )}
      </div>
      <p className={`text-xs ${muted}`}>Orange points: intersections inside the domain (dashed edges). {allExact ? 'k is a special value, so the angles are exact.' : 'k is not a special value: angles are rounded, as a calculator gives them.'}</p>
    </div>
  );
}
