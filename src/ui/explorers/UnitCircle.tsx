import { Circle, Coordinates, Line, Mafs, MovablePoint, Plot, Text, Theme } from 'mafs';
import { useState } from 'react';
import type { UnitCirclePreset } from '../../content/lessons/types';
import { exact, norm, radTex, refAngle } from '../../engine/generators/u4/shared';
import { angleLabel, castInfo, coterminals, unitPoint } from '../../engine/trigLab';
import { Tex } from '../components/Rich';
import { btnGhost, card, muted } from '../styles';
import { Slider, Toggle } from './controls';

const D2R = Math.PI / 180;

/** Drag the terminal arm; read the angle, reference angle, quadrant, exact coordinates, coterminal angles and arc length. */
export function UnitCircle({ preset, locked = false }: { preset: UnitCirclePreset; locked?: boolean }) {
  const start = preset.angle ?? 60;
  const [base, setBase] = useState(norm(start));
  const [turns, setTurns] = useState(Math.floor(start / 360));
  const [inRad, setInRad] = useState(!!preset.inRad);
  const [snap, setSnap] = useState(true);
  const [r, setR] = useState(5);
  const show = new Set(preset.show ?? []);
  const deg = base + 360 * turns;
  const p = unitPoint(deg);
  const cast = castInfo(deg);
  const ref = refAngle(deg);
  const rad = deg * D2R;

  const move = ([x, y]: [number, number]) => {
    let a = Math.atan2(y, x) / D2R;
    a = norm(a);
    a = snap ? norm(Math.round(a / 15) * 15) : Math.round(a);
    setBase(a);
  };
  const constrain = ([x, y]: [number, number]): [number, number] => {
    const len = Math.hypot(x, y) || 1;
    return [x / len, y / len];
  };
  const arcEnd = Math.abs(rad) < 1e-9 ? 0 : rad;
  const ratio = (fn: 'sin' | 'cos' | 'tan' | 'csc' | 'sec' | 'cot') => {
    if (p.exact) {
      const e = exact(fn, Math.round(deg));
      return e ? e.tex : '\\text{not defined}';
    }
    const v = { sin: Math.sin(rad), cos: Math.cos(rad), tan: Math.tan(rad), csc: 1 / Math.sin(rad), sec: 1 / Math.cos(rad), cot: 1 / Math.tan(rad) }[fn];
    return Math.abs(v) > 1e6 ? '\\text{not defined}' : v.toFixed(3);
  };
  const exactArc = Number.isInteger(deg) && deg % 15 === 0;

  return (
    <div className={`${card} flex flex-col gap-3 p-3 sm:p-4`}>
      <fieldset disabled={locked} className={`flex min-w-0 flex-col gap-2 ${locked ? 'opacity-50' : ''}`}>
        <div className="overflow-hidden rounded-lg border border-line dark:border-line-d">
          <Mafs height={300} viewBox={{ x: [-1.35, 1.35], y: [-1.35, 1.35], padding: 0 }} pan={false}>
            <Coordinates.Cartesian xAxis={{ lines: 0.5, labels: (n) => (Math.abs(n) === 1 ? String(n) : '') }} yAxis={{ lines: 0.5, labels: (n) => (Math.abs(n) === 1 ? String(n) : '') }} />
            <Circle center={[0, 0]} radius={1} strokeStyle="solid" fillOpacity={0} color={Theme.foreground} strokeOpacity={0.6} />
            <Plot.Parametric t={arcEnd >= 0 ? [0, arcEnd] : [arcEnd, 0]} xy={(t) => [0.22 * Math.cos(t) * (1 + Math.abs(t) / 40), 0.22 * Math.sin(t) * (1 + Math.abs(t) / 40)]} color="var(--mafs-orange)" weight={2} />
            {cast.q !== 0 && <Line.Segment point1={[p.x.value, p.y.value]} point2={[p.x.value, 0]} style="dashed" color="var(--mafs-green)" />}
            <Line.Segment point1={[0, 0]} point2={[p.x.value, p.y.value]} color="var(--mafs-blue)" weight={3} />
            <Text x={-1.2} y={1.2} size={14}>S</Text>
            <Text x={1.2} y={1.2} size={14}>A</Text>
            <Text x={-1.2} y={-1.2} size={14}>T</Text>
            <Text x={1.2} y={-1.2} size={14}>C</Text>
            {!locked && <MovablePoint point={[p.x.value, p.y.value]} onMove={move} constrain={constrain} color="var(--mafs-blue)" />}
          </Mafs>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className={btnGhost} onClick={() => setTurns(turns - 1)} aria-label="Subtract 360 degrees">
            − {inRad ? '2π' : '360°'}
          </button>
          <button className={btnGhost} onClick={() => setTurns(turns + 1)} aria-label="Add 360 degrees">
            + {inRad ? '2π' : '360°'}
          </button>
          <Toggle checked={inRad} onChange={setInRad}>
            Radians
          </Toggle>
          <Toggle checked={snap} onChange={setSnap}>
            Snap to 15°
          </Toggle>
        </div>
      </fieldset>
      <div className="flex flex-col gap-1 overflow-x-auto">
        <p>
          <Tex src={`\\theta = ${angleLabel(deg, false)} = ${angleLabel(deg, true)}`} />
        </p>
        <p>
          Reference angle <Tex src={angleLabel(ref, inRad)} /> · {cast.q ? `quadrant ${['', 'I', 'II', 'III', 'IV'][cast.q]}, positive: ${cast.positive}` : 'terminal arm on an axis'}
        </p>
        <p>
          <Tex src={`P(\\theta) = (\\cos\\theta, \\sin\\theta) = \\left(${p.x.tex}, ${p.y.tex}\\right)`} />
          {!p.exact && <span className={`text-sm ${muted}`}> (decimal: not a special angle)</span>}
        </p>
        <p>
          <Tex src={`\\tan\\theta = \\frac{y}{x} = ${ratio('tan')}`} />
        </p>
        {show.has('ratios') && (
          <p>
            <Tex src={`\\csc\\theta = ${ratio('csc')},\\quad \\sec\\theta = ${ratio('sec')},\\quad \\cot\\theta = ${ratio('cot')}`} />
          </p>
        )}
        {show.has('coterminal') && (
          <p>
            Coterminal: <Tex src={`${coterminals(deg).map((d) => angleLabel(d, inRad)).join(',\\ ')}`} />; in general <Tex src={`${angleLabel(norm(deg), inRad)} + ${inRad ? '2\\pi' : '360^\\circ'} n,\\ n \\in I`} />
          </p>
        )}
      </div>
      {show.has('arc') && (
        <div className="flex flex-col gap-1">
          <Slider label="r" n={20} index={r - 1} onChange={(i) => setR(i + 1)} show={r} />
          <p className="overflow-x-auto">
            <Tex src={`a = r\\theta = ${r} \\times ${exactArc ? angleLabel(Math.abs(deg), true) : Math.abs(rad).toFixed(3)} ${exactArc && deg !== 0 ? `= ${radTex(r * Math.abs(deg))} ` : ''}\\approx ${(r * Math.abs(rad)).toFixed(2)}`} />
          </p>
          <p className={`text-xs ${muted}`}>θ must be in radians in a = rθ. The arc is measured along the circle of radius r.</p>
        </div>
      )}
      <p className={`text-xs ${muted}`}>Drag the blue point. Blue: terminal arm. Green: the vertical leg of the reference triangle. Orange: the rotation from the positive x-axis.</p>
    </div>
  );
}
