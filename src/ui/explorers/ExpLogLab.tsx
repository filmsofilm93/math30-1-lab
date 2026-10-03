import { Coordinates, Line, Mafs, Plot, Point } from 'mafs';
import { useState } from 'react';
import type { ExpLogPreset } from '../../content/lessons/types';
import { F, Frac } from '../../engine/frac';
import { Tex } from '../components/Rich';
import { card, muted } from '../styles';

const BASES = [F(1, 4), F(1, 3), F(1, 2), F(2, 3), F(3, 2), F(2), F(3), F(4), F(10)];
const A_VALUES = [-3, -2, -1, 1, 2, 3];
const SHIFTS = Array.from({ length: 11 }, (_, i) => i - 5);

const baseTex = (b: Frac) => (b.d === 1 ? String(b.n) : `\\left(${b.tex()}\\right)`);
const logTex = (b: Frac) => (b.eq(10) ? '\\log' : `\\log_{${b.tex()}}`);

function Slider({ label, n, index, onChange, show }: { label: string; n: number; index: number; onChange: (i: number) => void; show: React.ReactNode }) {
  return (
    <label className="flex items-center gap-3">
      <span className="w-6 text-lg font-bold italic">{label}</span>
      <input type="range" min={0} max={n - 1} step={1} value={index} onChange={(e) => onChange(Number(e.target.value))} className="h-8 flex-1 accent-accent dark:accent-accent-d" aria-label={label} />
      <span className="w-12 text-right tabular-nums">{show}</span>
    </label>
  );
}

export function ExpLogLab({ preset, locked = false }: { preset: ExpLogPreset; locked?: boolean }) {
  const start = BASES.findIndex((b) => b.eq(Frac.of(preset.b ?? 2)));
  const [bi, setBi] = useState(start < 0 ? 5 : start);
  const [showInv, setShowInv] = useState(!!preset.showInverse);
  const [ai, setAi] = useState(3);
  const [ci, setCi] = useState(5);
  const [di, setDi] = useState(5);
  const [x0, setX0] = useState(1);
  const b = BASES[bi];
  const bv = b.value;
  const [a, c, d] = preset.transform ? [A_VALUES[ai], SHIFTS[ci], SHIFTS[di]] : [1, 0, 0];
  const f = (x: number) => a * bv ** (x - c) + d;
  const finv = (x: number) => ((x - d) / a > 0 ? Math.log((x - d) / a) / Math.log(bv) + c : NaN);
  const tame = (fn: (x: number) => number) => (x: number) => {
    const y = fn(x);
    return Number.isFinite(y) && Math.abs(y) < 40 ? y : NaN;
  };
  const y0 = f(x0);
  const fmt = (v: number) => String(+v.toFixed(2));
  const growth = (bv > 1) === (a > 0) ? 'increasing' : 'decreasing';
  const eq = `y = ${a === 1 ? '' : a === -1 ? '-' : a}${baseTex(b)}^{${c === 0 ? 'x' : `x ${c > 0 ? '-' : '+'} ${Math.abs(c)}`}}${d === 0 ? '' : d > 0 ? ` + ${d}` : ` - ${-d}`}`;
  const arg = d === 0 ? 'x' : `x ${d > 0 ? '-' : '+'} ${Math.abs(d)}`;
  const inner = a === 1 ? arg : `\\frac{${arg}}{${a}}`;
  const invEq = `y = ${logTex(b)}${inner === 'x' ? ' x' : `\\left(${inner}\\right)`}${c === 0 ? '' : c > 0 ? ` + ${c}` : ` - ${-c}`}`;

  return (
    <div className={`${card} flex flex-col gap-3 p-3 sm:p-4`}>
      <fieldset disabled={locked} className={`min-w-0 flex flex-col gap-1 ${locked ? 'opacity-50' : ''}`}>
        <Slider label="b" n={BASES.length} index={bi} onChange={setBi} show={<Tex src={b.tex()} />} />
        {preset.transform && (
          <>
            <Slider label="a" n={A_VALUES.length} index={ai} onChange={setAi} show={a} />
            <Slider label="c" n={SHIFTS.length} index={ci} onChange={setCi} show={c} />
            <Slider label="d" n={SHIFTS.length} index={di} onChange={setDi} show={d} />
          </>
        )}
        <Slider label="x" n={13} index={x0 + 6} onChange={(i) => setX0(i - 6)} show={x0} />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showInv} onChange={(e) => setShowInv(e.target.checked)} className="h-5 w-5 accent-accent" />
          Show the inverse (reflect in <Tex src="y = x" />)
        </label>
      </fieldset>
      <div className="overflow-hidden rounded-lg border border-line dark:border-line-d">
        <Mafs height={300} viewBox={{ x: [-6, 6], y: [-6, 6], padding: 0 }} preserveAspectRatio={false} pan={false}>
          <Coordinates.Cartesian xAxis={{ lines: 1, labels: (n) => (n % 2 === 0 ? n : '') }} yAxis={{ lines: 1, labels: (n) => (n % 2 === 0 ? n : '') }} />
          <Line.Segment point1={[-6, d]} point2={[6, d]} style="dashed" color="var(--mafs-blue)" opacity={0.6} />
          <Plot.OfX y={tame(f)} color="var(--mafs-blue)" weight={3} />
          {Number.isFinite(y0) && Math.abs(y0) < 6.5 && <Point x={x0} y={y0} color="var(--mafs-blue)" />}
          {showInv && (
            <>
              <Line.ThroughPoints point1={[0, 0]} point2={[1, 1]} style="dashed" opacity={0.4} />
              <Line.Segment point1={[d, -6]} point2={[d, 6]} style="dashed" color="var(--mafs-red)" opacity={0.6} />
              <Plot.OfX y={tame(finv)} color="var(--mafs-red)" weight={3} />
              {Number.isFinite(y0) && Math.abs(y0) < 6.5 && <Point x={y0} y={x0} color="var(--mafs-red)" />}
            </>
          )}
        </Mafs>
      </div>
      <div className="flex flex-col gap-1 overflow-x-auto">
        <span className="text-[#2563eb] dark:text-[#60a5fa]">
          <Tex src={eq} />
        </span>
        <p>
          {growth === 'increasing' ? 'Increasing' : 'Decreasing'} · asymptote <Tex src={`y = ${d}`} /> · range <Tex src={a > 0 ? `y > ${d}` : `y < ${d}`} /> · point <Tex src={`(${x0}, ${fmt(y0)})`} />
        </p>
        {showInv && (
          <>
            <span className="text-[#dc2626] dark:text-[#f87171]">
              <Tex src={invEq} />
            </span>
            <p>
              Asymptote <Tex src={`x = ${d}`} /> · domain <Tex src={a > 0 ? `x > ${d}` : `x < ${d}`} /> · point <Tex src={`(${fmt(y0)}, ${x0})`} />: the coordinates swap.
            </p>
          </>
        )}
      </div>
      <p className={`text-xs ${muted}`}>Blue: the exponential. Red: its inverse, the logarithm. Dashed: asymptotes and the line y = x. Base 1 is excluded: 1^x is the constant 1.</p>
    </div>
  );
}
