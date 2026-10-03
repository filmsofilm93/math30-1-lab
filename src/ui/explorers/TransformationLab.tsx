import { Coordinates, Line, Mafs, Plot, Point } from 'mafs';
import { useMemo, useState } from 'react';
import type { TransformPreset } from '../../content/lessons/types';
import { BASE, TP, evalTransformed, mappingTex, transformedTex, toFrac } from '../../engine/basefns';
import { F, Frac } from '../../engine/frac';
import { invariantPoints } from '../../engine/invariant';
import { pieces } from '../components/Graph';
import { Tex } from '../components/Rich';
import { card, chip, muted } from '../styles';

const B_VALUES = [F(-4), F(-3), F(-2), F(-1), F(-1, 2), F(-1, 3), F(-1, 4), F(1, 4), F(1, 3), F(1, 2), F(1), F(2), F(3), F(4)];
const A_VALUES = [F(-4), F(-3), F(-2), F(-3, 2), F(-1), F(-1, 2), F(-1, 3), F(1, 3), F(1, 2), F(1), F(3, 2), F(2), F(3), F(4)];
const LAB_BASES = ['quad', 'sqrt', 'abs', 'cubic', 'recip', 'linear', 'exp2', 'log', 'sin', 'cos'];

function Slider({ label, values, index, onChange }: { label: string; values: Frac[]; index: number; onChange: (i: number) => void }) {
  return (
    <label className="flex items-center gap-3">
      <span className="w-6 text-lg font-bold italic">{label}</span>
      <input type="range" min={0} max={values.length - 1} step={1} value={index} onChange={(e) => onChange(Number(e.target.value))} className="h-8 flex-1 accent-accent dark:accent-accent-d" aria-label={`${label} = ${values[index]}`} />
      <span className="w-12 text-right tabular-nums">
        <Tex src={values[index].tex()} />
      </span>
    </label>
  );
}

const SHIFTS = Array.from({ length: 13 }, (_, i) => F(i - 6));

export function TransformationLab({ preset, locked = false }: { preset: TransformPreset; locked?: boolean }) {
  const [baseId, setBaseId] = useState(preset.base);
  const idx = (vals: Frac[], v: number | undefined, dflt: number) => {
    const t = toFrac(v ?? dflt);
    const i = vals.findIndex((x) => x.eq(t));
    return i < 0 ? vals.findIndex((x) => x.eq(dflt)) : i;
  };
  const [ai, setAi] = useState(idx(A_VALUES, preset.a, 1));
  const [bi, setBi] = useState(idx(B_VALUES, preset.b, 1));
  const [hi, setHi] = useState(idx(SHIFTS, preset.h, 0));
  const [ki, setKi] = useState(idx(SHIFTS, preset.k, 0));
  const [showInv, setShowInv] = useState(!!preset.showInverse);
  const [restrict, setRestrict] = useState(false);
  const base = BASE[baseId];
  const p = TP(A_VALUES[ai], B_VALUES[bi], SHIFTS[hi], SHIFTS[ki]);
  const img = useMemo(() => evalTransformed(base, p), [baseId, ai, bi, hi, ki]);
  const view = { x: [-8, 8] as [number, number], y: [-6, 6] as [number, number] };
  const keys = base.trig ? [] : base.keys.filter(([x, y]) => Math.abs(x) <= 9 && Math.abs(y) <= 9);
  const mapped = keys.map(([x, y]) => [x / p.b.value + p.h.value, p.a.value * y + p.k.value] as [number, number]);
  const inv = invariantPoints(base.f, p.a.value, p.b.value, p.h.value, p.k.value, view.x).filter(([x, y]) => Math.abs(x) <= 8 && Math.abs(y) <= 6);
  const breaks = base.vAsym?.map((v) => v / p.b.value + p.h.value);
  const quadLike = baseId === 'quad' || baseId === 'abs';
  const imgDomain: [number, number] | undefined = showInv && restrict && quadLike ? (p.b.value > 0 ? [p.h.value, 9] : [-9, p.h.value]) : undefined;
  const isFn = base.trig ? false : quadLike ? restrict : true;
  const tame = (fn: (x: number) => number) => (x: number) => {
    const y = fn(x);
    return Number.isFinite(y) ? Math.max(-60, Math.min(60, y)) : NaN;
  };

  return (
    <div className={`${card} flex flex-col gap-3 p-3 sm:p-4`}>
      <div className="flex gap-1.5 overflow-x-auto pb-1" role="group" aria-label="Base function">
        {LAB_BASES.map((id) => (
          <button key={id} className={`${chip} shrink-0 ${id === baseId ? 'border-accent bg-accent text-white dark:border-accent-d dark:bg-accent-d dark:text-paper-d' : ''}`} onClick={() => setBaseId(id)} aria-pressed={id === baseId}>
            <Tex src={BASE[id].name.replace('y = ', '')} />
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-lg border border-line dark:border-line-d">
        <Mafs height={300} viewBox={{ x: view.x, y: view.y, padding: 0 }} preserveAspectRatio={false} pan={false}>
          <Coordinates.Cartesian xAxis={{ lines: 1, labels: (n) => (n % 2 === 0 ? n : '') }} yAxis={{ lines: 1, labels: (n) => (n % 2 === 0 ? n : '') }} />
          {pieces({ fn: base.f, role: 'base', breaks: base.vAsym }, view).map((d, j) => (
            <Plot.OfX key={`b${j}`} y={tame(base.f)} domain={d} color="var(--mafs-violet)" style="dashed" weight={2} opacity={0.8} />
          ))}
          {pieces({ fn: img, role: 'image', breaks, domain: imgDomain }, view).map((d, j) => (
            <Plot.OfX key={`i${j}`} y={tame(img)} domain={d} color="var(--mafs-blue)" weight={3} />
          ))}
          {showInv && (
            <>
              <Line.ThroughPoints point1={[0, 0]} point2={[1, 1]} style="dashed" opacity={0.4} />
              {pieces({ fn: img, role: 'aux', breaks, domain: imgDomain }, view).map((d, j) => (
                <Plot.Parametric key={`v${j}`} xy={(t) => [tame(img)(t), t]} domain={d} color="var(--mafs-red)" weight={3} />
              ))}
            </>
          )}
          {mapped.map(([x, y], i) => Number.isFinite(y) && <Point key={`m${i}`} x={x} y={y} color="var(--mafs-blue)" />)}
          {preset.showInvariant !== false && inv.map(([x, y], i) => <Point key={`n${i}`} x={x} y={y} color="var(--mafs-green)" svgCircleProps={{ r: 7, strokeWidth: 3, fillOpacity: 0.2 }} />)}
        </Mafs>
      </div>
      <div className="flex flex-col gap-1 overflow-x-auto text-lg">
        <div>
          <Tex src={`y = ${transformedTex(base, p)}`} />
        </div>
        <div className={`text-base ${muted}`}>
          <Tex src={mappingTex(p)} />
        </div>
        {preset.showInvariant !== false && (
          <div className="text-sm">
            <span className="font-bold text-good dark:text-good-d">Invariant points: </span>
            {inv.length ? inv.map(([x, y]) => `(${+x.toFixed(2)}, ${+y.toFixed(2)})`).join(', ') : 'none'}
          </div>
        )}
      </div>
      <fieldset disabled={locked} className={`flex flex-col gap-1 ${locked ? 'opacity-50' : ''}`}>
        {preset.sliders.includes('a') && <Slider label="a" values={A_VALUES} index={ai} onChange={setAi} />}
        {preset.sliders.includes('b') && <Slider label="b" values={B_VALUES} index={bi} onChange={setBi} />}
        {preset.sliders.includes('h') && <Slider label="h" values={SHIFTS} index={hi} onChange={setHi} />}
        {preset.sliders.includes('k') && <Slider label="k" values={SHIFTS} index={ki} onChange={setKi} />}
      </fieldset>
      <div className="flex flex-wrap gap-2">
        <button className={`${chip} ${showInv ? 'border-accent bg-accent-soft dark:border-accent-d dark:bg-accent-soft-d' : ''}`} onClick={() => setShowInv(!showInv)} aria-pressed={showInv}>
          Reflect in y = x
        </button>
        {showInv && quadLike && (
          <button className={`${chip} ${restrict ? 'border-accent bg-accent-soft dark:border-accent-d dark:bg-accent-soft-d' : ''}`} onClick={() => setRestrict(!restrict)} aria-pressed={restrict}>
            Restrict domain to {p.b.value > 0 ? 'x ≥' : 'x ≤'} {p.h.toString()}
          </button>
        )}
        {showInv && <span className={`self-center text-sm ${isFn ? 'text-good dark:text-good-d' : 'text-bad dark:text-bad-d'}`}>{isFn ? 'Inverse is a function' : 'Inverse is not a function'}</span>}
      </div>
      <p className={`text-xs ${muted}`}>Dashed: original. Solid blue: image. Red: inverse. Green rings: invariant points.</p>
    </div>
  );
}
