import { useState } from 'react';
import type { RationalPreset } from '../../content/lessons/types';
import { setBuilderTex } from '../../engine/check/realset';
import { ptTex } from '../../engine/frac';
import { analyze, L, linTex, ratGraph, ratTex, type RatFn } from '../../engine/rational';
import { Graph } from '../components/Graph';
import { Rich, Tex } from '../components/Rich';
import { btnGhost, card, chip, muted } from '../styles';
import { Chips, chipOn } from './controls';

const KS = [-4, -2, -1, 1, 2, 4];
const R_MIN = -5;
const R_MAX = 5;

type Feature = { id: string; label: string; why: string };

function FactorRow({ title, zeros, min, onChange, locked }: { title: string; zeros: number[]; min: number; onChange: (z: number[]) => void; locked: boolean }) {
  const set = (i: number, r: number) => r >= R_MIN && r <= R_MAX && onChange(zeros.map((z, j) => (j === i ? r : z)));
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="basis-full text-sm font-semibold sm:basis-auto sm:w-24">{title}</span>
      {zeros.map((r, i) => (
        <span key={i} className="flex items-center gap-0.5 rounded-lg border border-line px-1 dark:border-line-d">
          <button className="px-2 py-1" aria-label={`Move factor ${i + 1} left`} disabled={locked} onClick={() => set(i, r - 1)}>
            −
          </button>
          <Tex src={linTex(L(r))} />
          <button className="px-2 py-1" aria-label={`Move factor ${i + 1} right`} disabled={locked} onClick={() => set(i, r + 1)}>
            +
          </button>
          {zeros.length > min && (
            <button className={`px-1.5 py-1 text-sm ${muted}`} aria-label={`Remove factor ${i + 1}`} disabled={locked} onClick={() => onChange(zeros.filter((_, j) => j !== i))}>
              ✕
            </button>
          )}
        </span>
      ))}
      {zeros.length < 2 && (
        <button className={`${btnGhost} px-2 py-1 text-sm`} disabled={locked} onClick={() => onChange([...zeros, [0, 1, -1, 2, -2, 3, -3].find((r) => !zeros.includes(r)) ?? 0])}>
          + factor
        </button>
      )}
    </div>
  );
}

export function RationalLab({ preset, locked = false }: { preset: RationalPreset; locked?: boolean }) {
  const [num, setNum] = useState(preset.num);
  const [den, setDen] = useState(preset.den.length ? preset.den : [1]);
  const [k, setK] = useState(preset.k ?? 1);
  const [sel, setSel] = useState<string | null>(null);
  const r: RatFn = { k, num: num.map((z) => L(z)), den: den.map((z) => L(z)) };
  const a = analyze(r);
  const spec = ratGraph(r, a);
  const simpTex = ratTex(a.simplified);

  const features: Feature[] = [
    ...a.holes.map((h) => ({
      id: `hole${h.x.value}`,
      label: `Hole at $${ptTex(h.x, h.y)}$`,
      why: `The factor $${linTex(L(h.x.value))}$ is in both numerator and denominator, so it cancels: the graph of $y = ${simpTex}$ passes through this point, but the original is $\\frac{0}{0}$ at $x = ${h.x.tex()}$ and has no value there. The $y$-coordinate comes from the simplified form: $${h.y.tex()}$.`,
    })),
    ...a.vas.map((v) => ({
      id: `va${v.value}`,
      label: `Vertical asymptote $x = ${v.tex()}$`,
      why: `After cancelling, $${linTex(L(v.value))}$ is still in the denominator and not in the numerator. Near $x = ${v.tex()}$ the denominator approaches 0 while the numerator does not, so $|y|$ grows without bound.${
        den.filter((z) => z === v.value).length === 2 && !num.includes(v.value) ? ' The factor is squared, so y has the same sign on both sides.' : ''
      }`,
    })),
    a.ha
      ? {
          id: 'ha',
          label: `Horizontal asymptote $y = ${a.ha.tex()}$`,
          why:
            a.simplified.num.length < a.simplified.den.length
              ? `The denominator has higher degree than the numerator, so as $|x| \\to \\infty$ the quotient $\\to 0$.`
              : `Numerator and denominator have equal degree, so as $|x| \\to \\infty$ the quotient approaches the ratio of leading coefficients, $${a.ha.tex()}$.`,
        }
      : {
          id: 'ha',
          label: 'No horizontal asymptote',
          why: 'After cancelling, the numerator has higher degree than the denominator (or there is no denominator left), so y does not level off.',
        },
    ...a.xints.map((x) => ({
      id: `x${x.value}`,
      label: `$x$-intercept $${ptTex(x, 0)}$`,
      why: `The numerator's factor $${linTex(L(x.value))}$ is zero here and does not cancel, so $y = 0$.`,
    })),
    a.yint
      ? { id: 'y', label: `$y$-intercept $${ptTex(0, a.yint)}$`, why: `Substitute $x = 0$: $y = ${a.yint.tex()}$.` }
      : { id: 'y', label: 'No $y$-intercept', why: 'x = 0 is excluded from the domain (an asymptote or a hole sits there).' },
  ];
  const cur = features.find((f) => f.id === sel);
  // Mark the selected feature on the graph.
  if (cur?.id.startsWith('va')) spec.vlines = spec.vlines!.map((v) => (`va${v.x}` === cur.id ? { ...v, dashed: false } : v));
  if (cur?.id === 'ha') spec.hlines = spec.hlines!.map((h) => ({ ...h, dashed: false }));
  if (cur) {
    spec.points = spec.points!.map((p) => {
      const id = p.kind === 'open' ? `hole${p.x}` : p.y === 0 ? `x${p.x}` : 'y';
      return id === cur.id ? { ...p, label: '◀' } : p;
    });
  }

  return (
    <div className={`${card} flex flex-col gap-3 p-3 sm:p-4`}>
      <fieldset disabled={locked} className={`flex min-w-0 flex-col gap-2 ${locked ? 'opacity-50' : ''}`}>
        <FactorRow title="Numerator" zeros={num} min={0} onChange={(z) => (setNum(z), setSel(null))} locked={locked} />
        <FactorRow title="Denominator" zeros={den} min={1} onChange={(z) => (setDen(z), setSel(null))} locked={locked} />
        <Chips label="k" options={KS.map((v) => ({ id: v, label: `k = ${v}` }))} value={k} onChange={(v) => (setK(v), setSel(null))} />
      </fieldset>
      <div className="overflow-x-auto">
        <Tex src={`y = ${ratTex(r)}`} display />
        {a.holes.length > 0 && (
          <p className="text-sm">
            Simplifies to <Tex src={`y = ${simpTex}`} />, <Tex src={a.holes.map((h) => `x \\ne ${h.x.tex()}`).join(',\\ ')} />
          </p>
        )}
      </div>
      <Graph spec={spec} height={280} />
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Features">
        {features.map((f) => (
          <button key={f.id} aria-pressed={sel === f.id} className={`${chip} ${sel === f.id ? chipOn : ''}`} onClick={() => setSel(sel === f.id ? null : f.id)}>
            <Rich text={f.label} />
          </button>
        ))}
      </div>
      {cur && <FeatureWhy text={cur.why} />}
      <p className="overflow-x-auto text-sm">
        Domain <Tex src={setBuilderTex(a.domain)} />
        {a.range && (
          <>
            {' '}
            · range <Tex src={setBuilderTex(a.range, 'y')} />
          </>
        )}
      </p>
      <p className={`text-xs ${muted}`}>Dashed lines: asymptotes. Open circle: hole. Tap a feature for its reason; it is marked on the graph.</p>
    </div>
  );
}

function FeatureWhy({ text }: { text: string }) {
  return <Rich text={text} className="rounded-lg bg-accent-soft p-3 text-sm dark:bg-accent-soft-d" />;
}
