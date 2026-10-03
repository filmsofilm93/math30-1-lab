import { Coordinates, Mafs, Plot, Point, Polygon } from 'mafs';
import { useState } from 'react';
import type { RadicalPreset } from '../../content/lessons/types';
import { mappingTex, TP, transformedTex, BASE } from '../../engine/basefns';
import { F, polyTex, signedTex } from '../../engine/frac';
import { Tex } from '../components/Rich';
import { card, muted } from '../styles';
import { Chips, Slider, Toggle } from './controls';

const A_VALUES = [F(-3), F(-2), F(-1), F(-1, 2), F(1, 2), F(1), F(2), F(3)];
const B_VALUES = [F(-4), F(-2), F(-1), F(-1, 2), F(1, 2), F(1), F(2), F(4)];
const SHIFTS = Array.from({ length: 11 }, (_, i) => i - 5);
const M_VALUES = [F(-3), F(-2), F(-1), F(-1, 2), F(1, 2), F(1), F(2), F(3)];
const Q_VALUES = [F(-2), F(-1), F(-1, 2), F(1, 2), F(1), F(2)];
const VIEW = 8;
const fmt = (v: number) => String(+v.toFixed(2));
const rel = (v: number) => (Math.abs(v - Math.round(v)) < 1e-9 ? '=' : '\\approx');
const tame = (fn: (x: number) => number) => (x: number) => {
  const y = fn(x);
  return Number.isFinite(y) && Math.abs(y) < 40 ? y : NaN;
};

/** Sorted real solutions of f(x) = t on [−20, 20] by sign changes and touch points. */
function solveOn(fn: (x: number) => number, t: number): number[] {
  const out: number[] = [];
  const step = 0.01;
  for (let x = -20; x < 20; x += step) {
    const a = fn(x) - t;
    const b = fn(x + step) - t;
    if (Math.abs(a) < 1e-9) out.push(x);
    else if (a * b < 0) {
      let lo = x;
      let hi = x + step;
      for (let i = 0; i < 50; i++) {
        const mid = (lo + hi) / 2;
        if ((fn(lo) - t) * (fn(mid) - t) <= 0) hi = mid;
        else lo = mid;
      }
      out.push((lo + hi) / 2);
    }
  }
  return out.filter((x, i) => i === 0 || Math.abs(x - out[i - 1]) > 1e-6);
}

export function RadicalLab({ preset, locked = false }: { preset: RadicalPreset; locked?: boolean }) {
  const [mode, setMode] = useState(preset.mode ?? 'transform');
  return (
    <div className={`${card} flex flex-col gap-3 p-3 sm:p-4`}>
      <Chips
        label="Radical lab view"
        options={[
          { id: 'transform', label: <>Transform <Tex src="\sqrt{x}" /></> },
          { id: 'sqrt-of-f', label: <Tex src="y = \sqrt{f(x)}" /> },
          { id: 'solve', label: 'Solve' },
        ]}
        value={mode}
        onChange={setMode}
      />
      {mode === 'transform' ? <TransformView locked={locked} /> : mode === 'sqrt-of-f' ? <SqrtOfF locked={locked} start={preset.f ?? 'linear'} /> : <SolveView locked={locked} />}
    </div>
  );
}

function TransformView({ locked }: { locked: boolean }) {
  const [ai, setAi] = useState(5);
  const [bi, setBi] = useState(5);
  const [hi, setHi] = useState(5);
  const [ki, setKi] = useState(5);
  const p = TP(A_VALUES[ai], B_VALUES[bi], SHIFTS[hi], SHIFTS[ki]);
  const f = (x: number) => p.a.value * BASE.sqrt.f(p.b.value * (x - p.h.value)) + p.k.value;
  const domain = p.b.n > 0 ? `[${p.h.tex()}, \\infty)` : `(-\\infty, ${p.h.tex()}]`;
  const range = p.a.n > 0 ? `[${p.k.tex()}, \\infty)` : `(-\\infty, ${p.k.tex()}]`;
  const img = ([x, y]: [number, number]): [number, number] => [x / p.b.value + p.h.value, p.a.value * y + p.k.value];
  return (
    <>
      <fieldset disabled={locked} className={`flex min-w-0 flex-col gap-1 ${locked ? 'opacity-50' : ''}`}>
        <Slider label="a" n={A_VALUES.length} index={ai} onChange={setAi} show={<Tex src={A_VALUES[ai].tex()} />} />
        <Slider label="b" n={B_VALUES.length} index={bi} onChange={setBi} show={<Tex src={B_VALUES[bi].tex()} />} />
        <Slider label="h" n={SHIFTS.length} index={hi} onChange={setHi} show={SHIFTS[hi]} />
        <Slider label="k" n={SHIFTS.length} index={ki} onChange={setKi} show={SHIFTS[ki]} />
      </fieldset>
      <div className="overflow-hidden rounded-lg border border-line dark:border-line-d">
        <Mafs height={280} viewBox={{ x: [-VIEW, VIEW], y: [-VIEW, VIEW], padding: 0 }} preserveAspectRatio={false} pan={false}>
          <Coordinates.Cartesian xAxis={{ lines: 1, labels: (n) => (n % 2 === 0 ? n : '') }} yAxis={{ lines: 1, labels: (n) => (n % 2 === 0 ? n : '') }} />
          <Plot.OfX y={tame(BASE.sqrt.f)} color="var(--mafs-violet)" style="dashed" />
          <Plot.OfX y={tame(f)} color="var(--mafs-blue)" weight={3} />
          {([[0, 0], [1, 1], [4, 2]] as [number, number][]).map((k) => {
            const [x, y] = img(k);
            return Math.abs(x) < VIEW && Math.abs(y) < VIEW ? <Point key={k[0]} x={x} y={y} color="var(--mafs-blue)" /> : null;
          })}
        </Mafs>
      </div>
      <div className="flex flex-col gap-1 overflow-x-auto">
        <span className="text-[#1f5fbf] dark:text-[#7aa7ff]">
          <Tex src={`y = ${transformedTex(BASE.sqrt, p)}`} />
        </span>
        <Tex src={mappingTex(p)} />
        <p>
          Endpoint <Tex src={`(${p.h.tex()}, ${p.k.tex()})`} /> · domain <Tex src={domain} /> · range <Tex src={range} />
        </p>
      </div>
      <p className={`text-xs ${muted}`}>Dashed: y = √x. The points (0, 0), (1, 1), (4, 2) are carried by the mapping. Negative b sends the graph left; negative a sends it down.</p>
    </>
  );
}

function SqrtOfF({ locked, start }: { locked: boolean; start: 'linear' | 'quadratic' }) {
  const [kind, setKind] = useState<'linear' | 'quadratic'>(start);
  const [mi, setMi] = useState(6);
  const [ci, setCi] = useState(3);
  const [qi, setQi] = useState(1);
  const [hi, setHi] = useState(5);
  const [ki, setKi] = useState(9);
  const [band, setBand] = useState(true);
  const C_VALUES = Array.from({ length: 13 }, (_, i) => i - 6);
  const K_VALUES = Array.from({ length: 13 }, (_, i) => i - 4);
  let f: (x: number) => number;
  let fTex: string;
  if (kind === 'linear') {
    const m = M_VALUES[mi];
    const c = C_VALUES[ci];
    f = (x) => m.value * x + c;
    fTex = m.isInt ? polyTex([m.n, c]) : `${m.tex()}x${signedTex(c)}`;
  } else {
    const a = Q_VALUES[qi];
    const h = SHIFTS[hi];
    const k = K_VALUES[ki];
    f = (x) => a.value * (x - h) ** 2 + k;
    fTex = `${a.eq(1) ? '' : a.eq(-1) ? '-' : a.tex()}${h === 0 ? 'x^2' : `\\left(x ${h > 0 ? '-' : '+'} ${Math.abs(h)}\\right)^2`}${signedTex(k)}`;
  }
  const g = (x: number) => (f(x) >= 0 ? Math.sqrt(f(x)) : NaN);
  const inv = [...solveOn(f, 0).map((x) => [x, 0]), ...solveOn(f, 1).map((x) => [x, 1])] as [number, number][];
  // Domain of √f: where f ≥ 0, read off by sampling between the zeros.
  const zs = solveOn(f, 0);
  const cuts = [-Infinity, ...zs, Infinity];
  const pieces: string[] = [];
  for (let i = 0; i < cuts.length - 1; i++) {
    const mid = Number.isFinite(cuts[i]) && Number.isFinite(cuts[i + 1]) ? (cuts[i] + cuts[i + 1]) / 2 : Number.isFinite(cuts[i]) ? cuts[i] + 1 : Number.isFinite(cuts[i + 1]) ? cuts[i + 1] - 1 : 0;
    if (f(mid) >= 0) pieces.push(`${Number.isFinite(cuts[i]) ? `[${fmt(cuts[i])}` : '(-\\infty'}, ${Number.isFinite(cuts[i + 1]) ? `${fmt(cuts[i + 1])}]` : '\\infty)'}`);
  }
  const touch = zs.length === 1 && kind === 'quadratic' && Math.abs(f(zs[0] + 0.5) * f(zs[0] - 0.5)) > 0 && f(zs[0] + 0.5) * f(zs[0] - 0.5) > 0;
  const domain = pieces.length ? pieces.join(' \\cup ') : touch ? `\\{${fmt(zs[0])}\\}` : '\\varnothing';
  return (
    <>
      <fieldset disabled={locked} className={`flex min-w-0 flex-col gap-1 ${locked ? 'opacity-50' : ''}`}>
        <Chips label="f" options={[{ id: 'linear', label: 'linear f' }, { id: 'quadratic', label: 'quadratic f' }]} value={kind} onChange={setKind} />
        {kind === 'linear' ? (
          <>
            <Slider label="m" n={M_VALUES.length} index={mi} onChange={setMi} show={<Tex src={M_VALUES[mi].tex()} />} />
            <Slider label="c" n={C_VALUES.length} index={ci} onChange={setCi} show={C_VALUES[ci]} />
          </>
        ) : (
          <>
            <Slider label="a" n={Q_VALUES.length} index={qi} onChange={setQi} show={<Tex src={Q_VALUES[qi].tex()} />} />
            <Slider label="h" n={SHIFTS.length} index={hi} onChange={setHi} show={SHIFTS[hi]} />
            <Slider label="k" n={K_VALUES.length} index={ki} onChange={setKi} show={K_VALUES[ki]} />
          </>
        )}
        <Toggle checked={band} onChange={setBand}>
          Shade <Tex src="0 < y < 1" />, where <Tex src="\sqrt{y} > y" />
        </Toggle>
      </fieldset>
      <div className="overflow-hidden rounded-lg border border-line dark:border-line-d">
        <Mafs height={280} viewBox={{ x: [-VIEW, VIEW], y: [-4, 8], padding: 0 }} preserveAspectRatio={false} pan={false}>
          <Coordinates.Cartesian xAxis={{ lines: 1, labels: (n) => (n % 2 === 0 ? n : '') }} yAxis={{ lines: 1, labels: (n) => (n % 2 === 0 ? n : '') }} />
          {band && <Polygon points={[[-VIEW - 1, 0], [VIEW + 1, 0], [VIEW + 1, 1], [-VIEW - 1, 1]]} color="var(--mafs-green)" fillOpacity={0.12} strokeOpacity={0} />}
          <Plot.OfX y={tame(f)} color="var(--mafs-violet)" style="dashed" weight={2} />
          <Plot.OfX y={tame(g)} color="var(--mafs-blue)" weight={3} />
          {inv.filter(([x]) => Math.abs(x) < VIEW).map(([x, y], i) => (
            <Point key={i} x={x} y={y} color="var(--mafs-green)" />
          ))}
        </Mafs>
      </div>
      <div className="flex flex-col gap-1 overflow-x-auto">
        <p>
          <span className="text-[#6a3fb5] dark:text-[#b69cff]">
            <Tex src={`f(x) = ${fTex}`} />
          </span>{' '}
          (dashed) and{' '}
          <span className="text-[#1f5fbf] dark:text-[#7aa7ff]">
            <Tex src="y = \sqrt{f(x)}" />
          </span>
        </p>
        <p>
          Domain of <Tex src="\sqrt{f(x)}" />: <Tex src={domain} /> (where <Tex src="f(x) \ge 0" />)
        </p>
        <p>
          Invariant points: {inv.length ? <Tex src={inv.map(([x, y]) => `(${fmt(x)}, ${y})`).join(',\\ ')} /> : 'none'} (where <Tex src="f(x) = 0" /> or <Tex src="1" />)
        </p>
      </div>
      <p className={`text-xs ${muted}`}>Green points stay put because √0 = 0 and √1 = 1. Inside the shaded band the root graph is above f; above it, below f. Values are rounded to hundredths.</p>
    </>
  );
}

function SolveView({ locked }: { locked: boolean }) {
  const A = Array.from({ length: 13 }, (_, i) => i - 4); // √(x + a)
  const D = Array.from({ length: 11 }, (_, i) => i - 5); // = x + d
  const [ai, setAi] = useState(8);
  const [di, setDi] = useState(3);
  const [squared, setSquared] = useState(true);
  const a = A[ai];
  const d = D[di];
  const left = (x: number) => (x + a >= 0 ? Math.sqrt(x + a) : NaN);
  const right = (x: number) => x + d;
  // Squared: x + a = (x + d)² → x² + (2d − 1)x + d² − a = 0
  const B = 2 * d - 1;
  const Cc = d * d - a;
  const disc = B * B - 4 * Cc;
  const roots = disc < 0 ? [] : disc === 0 ? [-B / 2] : [(-B - Math.sqrt(disc)) / 2, (-B + Math.sqrt(disc)) / 2];
  const valid = roots.filter((x) => x + d >= -1e-9);
  const bad = roots.filter((x) => x + d < -1e-9);
  const eq = `\\sqrt{${a === 0 ? 'x' : polyTex([1, a])}} = ${polyTex([1, d])}`;
  return (
    <>
      <fieldset disabled={locked} className={`flex min-w-0 flex-col gap-1 ${locked ? 'opacity-50' : ''}`}>
        <Slider label="a" n={A.length} index={ai} onChange={setAi} show={a} />
        <Slider label="d" n={D.length} index={di} onChange={setDi} show={d} />
        <Toggle checked={squared} onChange={setSquared}>
          Show the squared equation <Tex src={`${a === 0 ? 'x' : polyTex([1, a])} = (${polyTex([1, d])})^2`} />
        </Toggle>
      </fieldset>
      <div className="overflow-hidden rounded-lg border border-line dark:border-line-d">
        <Mafs height={280} viewBox={{ x: [-6, 8], y: [-5, 7], padding: 0 }} preserveAspectRatio={false} pan={false}>
          <Coordinates.Cartesian xAxis={{ lines: 1, labels: (n) => (n % 2 === 0 ? n : '') }} yAxis={{ lines: 1, labels: (n) => (n % 2 === 0 ? n : '') }} />
          {squared && (
            <>
              <Plot.OfX y={tame((x) => x + a)} color="var(--mafs-violet)" style="dashed" />
              <Plot.OfX y={tame((x) => (x + d) ** 2)} color="var(--mafs-violet)" style="dashed" />
              {roots.map((x) => (
                <Point key={`s${x}`} x={x} y={x + a} color={bad.includes(x) ? 'var(--mafs-red)' : 'var(--mafs-violet)'} />
              ))}
            </>
          )}
          <Plot.OfX y={tame(left)} color="var(--mafs-blue)" weight={3} />
          <Plot.OfX y={tame(right)} color="var(--mafs-orange)" weight={3} />
          {valid.map((x) => (
            <Point key={x} x={x} y={right(x)} color="var(--mafs-green)" />
          ))}
        </Mafs>
      </div>
      <div className="flex flex-col gap-1 overflow-x-auto">
        <p>
          <Tex src={eq} />: {valid.length ? <>solution{valid.length > 1 ? 's' : ''} <Tex src={valid.map((x) => `x ${rel(x)} ${fmt(x)}`).join(',\\ ')} /></> : 'no solution'}.
        </p>
        <p>
          Squared equation roots: {roots.length ? <Tex src={roots.map(fmt).join(',\\ ')} /> : 'none'}.
          {bad.length > 0 && (
            <>
              {' '}
              <Tex src={`x ${rel(bad[0])} ${bad.map(fmt).join(', ')}`} /> is extraneous: there <Tex src={`x ${signedTex(d)} < 0`} />, but a square root is never negative.
            </>
          )}
        </p>
      </div>
      <p className={`text-xs ${muted}`}>Blue: left side. Orange: right side. Green: real solutions. Dashed: the two sides after squaring; a red point is a root the squaring added.</p>
    </>
  );
}

