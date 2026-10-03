import { Coordinates, Line, Mafs, Plot, Point, Text } from 'mafs';
import { useState } from 'react';
import type { SinusoidPreset } from '../../content/lessons/types';
import { F } from '../../engine/frac';
import { A_VALUES, angleLabel, B_VALUES, C_VALUES, D_VALUES, matchTarget, sameCurve, sinValue, type SinParams } from '../../engine/trigLab';
import { tickLabel } from '../components/Graph';
import { Tex } from '../components/Rich';
import { btnGhost, card, good, muted } from '../styles';
import { Chips, Slider, Toggle } from './controls';

const D2R = Math.PI / 180;
const fracTex = (v: number) => {
  const f = F(Math.round(v * 6), 6);
  return f.tex();
};
const signed = (d: number) => (d === 0 ? '' : d > 0 ? ` + ${d}` : ` - ${-d}`);

function eqTex(p: SinParams, inRad: boolean, unfactored = false): string {
  const a = p.a === 1 ? '' : p.a === -1 ? '-' : String(p.a);
  const b = p.b === 1 ? '' : fracTex(p.b);
  let arg: string;
  if (p.c === 0) arg = `\\left(${b}x\\right)`;
  else if (unfactored) {
    const k = p.b * p.c;
    arg = `\\left(${b}x ${k > 0 ? '-' : '+'} ${angleLabel(Math.abs(k), inRad)}\\right)`;
  } else arg = `\\left[${b === '' ? '' : b}\\left(x ${p.c > 0 ? '-' : '+'} ${angleLabel(Math.abs(p.c), inRad)}\\right)\\right]`;
  return `y = ${a}\\${p.f}${arg}${signed(p.d)}`;
}

/** First maximum at x ≥ 0, in degrees. */
function firstMax(p: SinParams): number {
  const P = 360 / p.b;
  const base = p.c + (p.f === 'sin' ? P / 4 : 0) + (p.a < 0 ? P / 2 : 0);
  return ((base % P) + P) % P;
}

type Overlay = 'amp' | 'period' | 'mid' | 'phase';

function SinGraph({ p, target, inRad, overlays, tan }: { p: SinParams | null; target?: SinParams; inRad: boolean; overlays: Set<Overlay>; tan?: boolean }) {
  const k = inRad ? D2R : 1;
  const [x0, x1] = [-180 * k, 720 * k];
  const step = 45 * k;
  const yr = 8;
  const max = p ? firstMax(p) : 0;
  const P = p ? 360 / p.b : 360;
  const amp = p ? Math.abs(p.a) : 1;
  return (
    <div className="overflow-hidden rounded-lg border border-line dark:border-line-d">
      <Mafs height={300} viewBox={{ x: [x0, x1], y: [-yr, yr], padding: 0 }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian xAxis={{ lines: step, labels: (n) => tickLabel(n, 4 * step, inRad ? 'pi' : 'deg') }} yAxis={{ lines: 1, labels: (n) => tickLabel(n, 2) }} />
        {target && <Plot.OfX y={(x) => sinValue(target, x / k)} color="var(--mafs-red)" style="dashed" weight={3} />}
        {tan && (
          <>
            {[-90, 90, 270, 450, 630].map((a) => (
              <Line.ThroughPoints key={a} point1={[a * k, 0]} point2={[a * k, 1]} style="dashed" opacity={0.5} />
            ))}
            {[-180, 0, 180, 360, 540].map((c) => (
              <Plot.OfX key={c} y={(x) => Math.tan(x / k * D2R)} domain={[(c - 89.5) * k, (c + 89.5) * k]} color="var(--mafs-blue)" weight={3} />
            ))}
          </>
        )}
        {p && (
          <>
            {overlays.has('mid') && <Line.ThroughPoints point1={[0, p.d]} point2={[1, p.d]} style="dashed" color="var(--mafs-green)" />}
            <Plot.OfX y={(x) => sinValue(p, x / k)} color="var(--mafs-blue)" weight={3} />
            {overlays.has('amp') && (
              <>
                <Line.Segment point1={[max * k, p.d]} point2={[max * k, p.d + amp]} color="var(--mafs-orange)" weight={3} />
                <Text x={max * k} y={p.d + amp / 2} attach="e" size={12}>
                  amplitude {amp}
                </Text>
              </>
            )}
            {overlays.has('period') && (
              <>
                <Line.Segment point1={[max * k, p.d + amp + 0.6]} point2={[(max + P) * k, p.d + amp + 0.6]} color="var(--mafs-violet)" weight={3} />
                <Point x={max * k} y={p.d + amp} color="var(--mafs-violet)" />
                <Point x={(max + P) * k} y={p.d + amp} color="var(--mafs-violet)" />
                <Text x={(max + P / 2) * k} y={p.d + amp + 0.6} attach="n" size={12}>
                  period
                </Text>
              </>
            )}
            {overlays.has('phase') && p.c !== 0 && (
              <>
                <Line.Segment point1={[0, p.d]} point2={[p.c * k, p.d]} color="var(--mafs-pink)" weight={4} />
                <Point x={p.c * k} y={sinValue(p, p.c)} color="var(--mafs-pink)" />
              </>
            )}
          </>
        )}
      </Mafs>
    </div>
  );
}

const idx = <T,>(xs: T[], v: T, d: number) => {
  const i = xs.indexOf(v);
  return i < 0 ? d : i;
};

function Features({ p, inRad }: { p: SinParams; inRad: boolean }) {
  const amp = Math.abs(p.a);
  const P = 360 / p.b;
  return (
    <p className="overflow-x-auto text-sm">
      Amplitude <Tex src={String(amp)} /> · period <Tex src={`\\frac{${inRad ? '2\\pi' : '360^\\circ'}}{|b|} = ${angleLabel(P, inRad)}`} /> · phase shift <Tex src={p.c === 0 ? '0' : `${angleLabel(Math.abs(p.c), inRad)}\\ \\text{${p.c > 0 ? 'right' : 'left'}}`} /> · midline <Tex src={`y = ${p.d}`} /> · range <Tex src={`${p.d - amp} \\le y \\le ${p.d + amp}`} />
    </p>
  );
}

function ParamSliders({ p, set, inRad }: { p: SinParams; set: (p: SinParams) => void; inRad: boolean }) {
  return (
    <>
      <Slider label="a" n={A_VALUES.length} index={idx(A_VALUES, p.a, 10)} onChange={(i) => set({ ...p, a: A_VALUES[i] })} show={<Tex src={fracTex(p.a)} />} />
      <Slider label="b" n={B_VALUES.length} index={idx(B_VALUES, p.b, 3)} onChange={(i) => set({ ...p, b: B_VALUES[i] })} show={<Tex src={fracTex(p.b)} />} />
      <Slider label="c" n={C_VALUES.length} index={idx(C_VALUES, p.c, 12)} onChange={(i) => set({ ...p, c: C_VALUES[i] })} show={<Tex src={angleLabel(p.c, inRad)} />} />
      <Slider label="d" n={D_VALUES.length} index={idx(D_VALUES, p.d, 6)} onChange={(i) => set({ ...p, d: D_VALUES[i] })} show={p.d} />
    </>
  );
}

/** Context builder: Ferris wheel or tide, with a time cursor. */
function ModelBuilder() {
  const [ctx, setCtx] = useState<'ferris' | 'tide'>('ferris');
  const [D, setD] = useState(40);
  const [low, setLow] = useState(2);
  const [T, setT] = useState(4);
  const [hi, setHi] = useState(10);
  const [lo, setLo] = useState(2);
  const [th, setTh] = useState(3);
  const [t, setTime] = useState(1);
  const ferris = ctx === 'ferris';
  const r = D / 2;
  const period = ferris ? T : 12;
  const A = ferris ? r : (hi - lo) / 2;
  const mid = ferris ? r + low : (hi + lo) / 2;
  const f = (x: number) => (ferris ? -r * Math.cos(((2 * Math.PI) / T) * x) + mid : A * Math.cos((Math.PI / 6) * (x - th)) + mid);
  const tMax = 2 * period;
  const yMax = mid + A + 2;
  const eq = ferris ? `h(t) = -${r}\\cos\\left(\\frac{2\\pi}{${T}}t\\right) + ${mid}` : `d(t) = ${A}\\cos\\left[\\frac{\\pi}{6}(t - ${th})\\right] + ${mid}`;
  const tCur = Math.min(t, tMax);
  return (
    <div className="flex flex-col gap-2">
      <Chips label="Context" options={[{ id: 'ferris', label: 'Ferris wheel' }, { id: 'tide', label: 'Tide' }]} value={ctx} onChange={(v) => setCtx(v)} />
      {ferris ? (
        <>
          <Slider label="D" n={10} index={D / 10 - 1} onChange={(i) => setD((i + 1) * 10)} show={`${D} m`} />
          <Slider label="p" n={5} index={low - 1} onChange={(i) => setLow(i + 1)} show={`${low} m`} />
          <Slider label="T" n={10} index={T - 1} onChange={(i) => setT(i + 1)} show={`${T} min`} />
          <p className={`text-xs ${muted}`}>D: diameter. p: height of the lowest seat. T: time for one rotation. The rider boards at the bottom at t = 0.</p>
        </>
      ) : (
        <>
          <Slider label="H" n={9} index={hi - 6} onChange={(i) => setHi(i + 6)} show={`${hi} m`} />
          <Slider label="L" n={5} index={lo - 1} onChange={(i) => setLo(i + 1)} show={`${lo} m`} />
          <Slider label="t₁" n={12} index={th} onChange={setTh} show={`${th}:00`} />
          <p className={`text-xs ${muted}`}>H: high-tide depth at t₁. L: low-tide depth six hours later. Period 12 h.</p>
        </>
      )}
      <div className="overflow-hidden rounded-lg border border-line dark:border-line-d">
        <Mafs height={260} viewBox={{ x: [-0.05 * tMax, tMax], y: [-0.05 * yMax, yMax], padding: 0 }} preserveAspectRatio={false} pan={false}>
          <Coordinates.Cartesian xAxis={{ lines: period / 4, labels: (n) => tickLabel(n, period / 2) }} yAxis={{ lines: yMax > 30 ? 10 : 2, labels: (n) => tickLabel(n, yMax > 30 ? 20 : 4) }} />
          <Line.ThroughPoints point1={[0, mid]} point2={[1, mid]} style="dashed" color="var(--mafs-green)" />
          <Plot.OfX y={f} domain={[0, tMax]} color="var(--mafs-blue)" weight={3} />
          <Point x={tCur} y={f(tCur)} color="var(--mafs-orange)" />
        </Mafs>
      </div>
      <Slider label="t" n={41} index={Math.round((tCur / tMax) * 40)} onChange={(i) => setTime((i / 40) * tMax)} show={`${+tCur.toFixed(2)}`} />
      <p className="overflow-x-auto">
        <Tex src={eq} />
      </p>
      <p className="text-sm">
        At <Tex src={`t = ${+tCur.toFixed(2)}`} />: {ferris ? 'height' : 'depth'} <Tex src={`\\approx ${f(tCur).toFixed(1)}`} /> m · max <Tex src={String(mid + A)} /> · min <Tex src={String(mid - A)} /> · midline <Tex src={String(mid)} /> · period <Tex src={String(period)} /> {ferris ? 'min' : 'h'}
      </p>
    </div>
  );
}

/** Sinusoid lab: a, b, c, d sliders with feature overlays, "match this graph" challenges, and a real-context builder. */
export function SinusoidLab({ preset, locked = false }: { preset: SinusoidPreset; locked?: boolean }) {
  const [mode, setMode] = useState(preset.mode ?? 'explore');
  const [inRad, setInRad] = useState(!!preset.inRad);
  const [base, setBase] = useState<'sin' | 'cos' | 'tan'>(preset.f ?? 'sin');
  const [p, setP] = useState<SinParams>({ f: preset.f ?? 'sin', a: 1, b: 1, c: 0, d: 0 });
  const [overlays, setOverlays] = useState<Set<Overlay>>(new Set(['mid', 'amp', 'period', 'phase']));
  const [target, setTarget] = useState<SinParams>(() => matchTarget(Math.random, preset.f));
  const [revealed, setRevealed] = useState(false);
  const toggle = (o: Overlay) => setOverlays((s) => {
    const n = new Set(s);
    if (n.has(o)) n.delete(o);
    else n.add(o);
    return n;
  });
  const matched = mode === 'match' && sameCurve(p, target);
  const isTan = mode === 'explore' && base === 'tan';
  const setFn = (f: 'sin' | 'cos' | 'tan') => {
    setBase(f);
    if (f !== 'tan') setP({ ...p, f });
  };
  const newTarget = () => {
    setTarget(matchTarget(Math.random));
    setP({ ...p, a: 1, b: 1, c: 0, d: 0 });
    setRevealed(false);
  };

  return (
    <div className={`${card} flex flex-col gap-3 p-3 sm:p-4`}>
      <fieldset disabled={locked} className={`flex min-w-0 flex-col gap-2 ${locked ? 'opacity-50' : ''}`}>
        <Chips label="Mode" options={[{ id: 'explore', label: 'Explore' }, { id: 'match', label: 'Match this graph' }, { id: 'model', label: 'Real context' }]} value={mode} onChange={(v) => setMode(v)} />
        {mode !== 'model' ? (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <Chips label="Function" options={[{ id: 'sin', label: 'sin' }, { id: 'cos', label: 'cos' }, ...(preset.tan && mode === 'explore' ? [{ id: 'tan' as const, label: 'tan' }] : [])]} value={mode === 'match' ? p.f : base} onChange={setFn} />
              <Toggle checked={inRad} onChange={setInRad}>
                Radians
              </Toggle>
            </div>
            <SinGraph p={isTan ? null : p} target={mode === 'match' ? target : undefined} inRad={inRad} overlays={overlays} tan={isTan} />
            {isTan ? (
              <p className="text-sm">
                <Tex src="y = \tan x" />: period <Tex src={angleLabel(180, inRad)} />, intercepts at <Tex src={`${angleLabel(180, inRad)}n`} />, asymptotes <Tex src={`x = ${angleLabel(90, inRad)} + ${angleLabel(180, inRad)}n`} />, range all real numbers. No amplitude: it has no maximum.
              </p>
            ) : (
              <>
                <ParamSliders p={p} set={setP} inRad={inRad} />
                <p className="overflow-x-auto">
                  <span className="text-[#2563eb] dark:text-[#60a5fa]">
                    <Tex src={eqTex(p, inRad, preset.unfactored)} />
                  </span>
                </p>
                <Features p={p} inRad={inRad} />
                {mode === 'explore' && (
                  <div className="flex flex-wrap gap-3 text-sm">
                    <Toggle checked={overlays.has('amp')} onChange={() => toggle('amp')}>
                      Amplitude
                    </Toggle>
                    <Toggle checked={overlays.has('period')} onChange={() => toggle('period')}>
                      Period
                    </Toggle>
                    <Toggle checked={overlays.has('mid')} onChange={() => toggle('mid')}>
                      Midline
                    </Toggle>
                    <Toggle checked={overlays.has('phase')} onChange={() => toggle('phase')}>
                      Phase shift
                    </Toggle>
                  </div>
                )}
                {mode === 'match' && (
                  <div className="flex flex-col gap-2">
                    <p className={matched ? `font-bold ${good}` : 'text-sm'}>{matched ? 'Matched: your curve lies exactly on the red graph.' : 'Move the sliders until the blue curve covers the dashed red one. Read the midline and amplitude from the max and min first.'}</p>
                    {(matched || revealed) && (
                      <p className="overflow-x-auto text-sm">
                        Target: <Tex src={eqTex(target, inRad)} />
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <button className={btnGhost} onClick={newTarget}>
                        New graph
                      </button>
                      {!matched && !revealed && (
                        <button className={btnGhost} onClick={() => setRevealed(true)}>
                          Show the equation
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <ModelBuilder />
        )}
      </fieldset>
      <p className={`text-xs ${muted}`}>
        {mode === 'model' ? 'Orange: the time cursor. Dashed green: the midline.' : <>Form <Tex src="y = a\sin[b(x - c)] + d" />. Orange: amplitude. Violet: one period, maximum to maximum. Pink: phase shift. Dashed green: midline.</>}
      </p>
    </div>
  );
}
