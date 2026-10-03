// PCBT1–PCBT3: fundamental counting principle, factorials, permutations, combinations.
// Answers come from the counting method; `verify` recounts by brute-force enumeration where that is cheap.
import { arrangements, countDistinct, distinctArrangements, fact, letterCounts, nCr, nPr, permutations, subsets } from '../../counting';
import { field, m, mc } from '../../framework';
import { polyTex } from '../../frac';
import type { AnswerSpec, Draft, Generator } from '../../types';
import { Reject } from '../../types';
import { num } from '../pre/shared';

const fmt = (n: number) => (Math.abs(n) >= 10000 ? n.toLocaleString('en-CA').replace(/,/g, '\\ ') : String(n));
const P = (n: number | string, r: number | string) => `{}_{${n}}P_{${r}}`;
const C = (n: number | string, r: number | string) => `{}_{${n}}C_{${r}}`;
const nAns = (v: number): AnswerSpec => ({ ...num(v), tex: String(v) });
const VOWELS = 'AEIOU';
const DISTINCT_WORDS = ['MATH', 'PLANE', 'CHAIR', 'FACTOR', 'PLANET', 'GARDEN', 'NUMBER', 'BRIGHT', 'CLOUDY', 'PRODUCE', 'TRIANGLE'];
const REPEAT_WORDS = ['BANANA', 'LETTER', 'COFFEE', 'PEPPER', 'ALBERTA', 'CANADA', 'TORONTO', 'SUCCESS', 'CALGARY', 'EDMONTON'];
const vowelsIn = (w: string) => w.split('').filter((c) => VOWELS.includes(c)).length;
const slots = (xs: (number | string)[]) => xs.map((x) => `\\boxed{${x}}`).join('\\,');
const prod = (xs: number[]) => xs.reduce((a, b) => a * b, 1);
const times = (xs: (number | string)[]) => xs.join(' \\times ');

// ---------------------------------------------------------------- PCBT1.fcp

const fcpSlots: Generator = {
  id: 'u6-fcp-slots',
  nodeId: 'PCBT1.fcp',
  title: 'Codes and licence plates',
  make(rng, tier): Draft {
    const L = rng.int(tier === 1 ? 1 : 2, 3);
    const D = rng.int(2, 3);
    const rep = tier === 1;
    const noZero = tier === 3;
    const letters = Array.from({ length: L }, (_, i) => (rep ? 26 : 26 - i));
    const digits = Array.from({ length: D }, (_, i) => (rep ? 10 : noZero ? (i === 0 ? 9 : 9 - i + 1) : 10 - i));
    // With no repetition and no leading 0: first digit 9 ways (1–9), then 9, 8, … (0 is available again).
    const ans = prod(letters) * prod(digits);
    return {
      cognitive: 'procedural',
      stem: `A code is ${L} letters followed by ${D} digits. ${rep ? 'Letters and digits may repeat.' : 'No letter or digit may repeat.'}${noZero ? ' The first digit cannot be 0.' : ''} How many codes are possible?`,
      format: 'input',
      fields: [field(nAns(ans))],
      hints: ['Draw one slot for each character.', `Letters: 26 choices for the first${rep ? ', and every one after' : ', one fewer each time'}. Digits: ${noZero ? '9 choices for the first (not 0)' : '10 for the first'}.`, 'Multiply the slot counts: every slot must be filled ("and").'],
      solution: [
        { tex: m(slots([...letters, ...digits])), why: noZero ? 'Fill the restricted slot first: the first digit has 9 options; after it, 0 is allowed but one digit is used.' : rep ? 'Repetition allowed: each slot has the full set.' : 'Without repetition each slot has one fewer option.' },
        { tex: m(`${times([...letters, ...digits])} = ${fmt(ans)}`), why: 'Fundamental counting principle: multiply.' },
      ],
    };
  },
};

const fcpConstraint: Generator = {
  id: 'u6-fcp-constraint',
  nodeId: 'PCBT1.fcp',
  title: 'Fill the restricted slot first',
  make(rng, tier): Draft {
    const n = rng.int(5, 8); // digits 1..n
    const r = rng.int(3, 4);
    const kind = rng.pick(['odd', 'even'] as const);
    const digits = Array.from({ length: n }, (_, i) => i + 1);
    const c = digits.filter((d) => (kind === 'odd' ? d % 2 === 1 : d % 2 === 0)).length;
    const ans = c * nPr(n - 1, r - 1);
    const naive = nPr(n, r - 1) * c;
    const stem = `How many ${r}-digit ${kind} numbers can be formed from the digits 1 to ${n} if no digit may repeat?`;
    const slotsTex = slots([...Array.from({ length: r - 1 }, (_, i) => n - 1 - i), c]);
    const sol = [
      { tex: `Last digit first: ${m(String(c))} ${kind} choices.`, why: 'Fill the restricted slot before the others, or you cannot know how many options it has left.' },
      { tex: `${m(slotsTex)}: ${m(`${c} \\times ${P(n - 1, r - 1)} = ${ans}`)}.` },
    ];
    const verify = () => [...arrangements(digits, r)].filter((a) => (kind === 'odd' ? a[r - 1] % 2 === 1 : a[r - 1] % 2 === 0)).length === ans;
    if (tier === 2) {
      return {
        cognitive: 'conceptual',
        stem,
        format: 'mc',
        choices: mc({ tex: m(String(ans)), key: ans }, [
          { tex: m(String(naive)), key: naive, mis: 'fcp-constraint-last', feedback: 'Filling the first slots first means some of the last digit’s options may already be used.' },
          { tex: m(String(nPr(n, r))), key: nPr(n, r), mis: 'fcp-constraint-last', feedback: `This ignores the ${kind} condition.` },
          { tex: m(String(c * n ** (r - 1))), key: c * n ** (r - 1), mis: 'fcp-add-multiply', feedback: 'Digits cannot repeat.' },
          { tex: m(String(c + nPr(n - 1, r - 1))), key: c + nPr(n - 1, r - 1), mis: 'fcp-add-multiply' },
        ]),
        hints: ['Which slot has a restriction?', 'Fill it first.', `Then fill the other ${r - 1} slots from the remaining ${n - 1} digits.`],
        solution: sol,
        verify,
      };
    }
    return { cognitive: 'procedural', stem, format: 'input', fields: [field(nAns(ans))], hints: ['Which slot has a restriction?', `The last digit must be ${kind}: ${c} choices.`, `Then ${n - 1} digits remain for the first slot, ${n - 2} for the next, …`], solution: sol, verify };
  },
};

const fcpAndOr: Generator = {
  id: 'u6-fcp-and-or',
  nodeId: 'PCBT1.fcp',
  title: '"And" multiplies, "or" adds',
  make(rng, tier): Draft {
    const a = rng.int(2, 6);
    const b = rng.int(2, 6);
    const c = rng.int(2, 6);
    if (tier === 1) {
      const ans = a * b * c;
      return {
        cognitive: 'conceptual',
        stem: `A café offers ${a} sandwiches, ${b} soups and ${c} drinks. A lunch special is one sandwich, one soup and one drink. How many different specials are there?`,
        format: 'mc',
        choices: mc({ tex: m(String(ans)), key: ans }, [
          { tex: m(String(a + b + c)), key: a + b + c, mis: 'fcp-add-multiply', feedback: 'You choose a sandwich and a soup and a drink: multiply.' },
          { tex: m(String(a * b + c)), key: a * b + c, mis: 'fcp-add-multiply' },
          { tex: m(String(nCr(a + b + c, 3))), key: nCr(a + b + c, 3), mis: 'perm-vs-comb', feedback: 'Choosing any 3 items would allow, e.g., three soups.' },
        ]),
        hints: ['Does the special need all three items?', '"And" means multiply.', `${m(`${a} \\times ${b} \\times ${c}`)}`],
        solution: [{ tex: `Sandwich and soup and drink: ${m(`${a} \\times ${b} \\times ${c} = ${ans}`)}.`, why: 'Each sandwich pairs with each soup, and each pair with each drink.' }, { tex: `${m(String(ans))} specials.` }],
      };
    }
    // Routes: A→B (a) then B→C (b), or A→C directly (c); tier 3 also adds the return trip.
    const one = a * b + c;
    const ans = tier === 2 ? one : one * (one - 1);
    const stem =
      tier === 2
        ? `There are ${a} roads from Airdrie to Banff and ${b} roads from Banff to Canmore. There are also ${c} roads from Airdrie to Canmore that skip Banff. How many routes go from Airdrie to Canmore?`
        : `There are ${a} roads from Airdrie to Banff, ${b} roads from Banff to Canmore, and ${c} roads from Airdrie to Canmore that skip Banff. How many round trips from Airdrie to Canmore and back are possible if the return route must differ from the route there?`;
    return {
      cognitive: 'problemSolving',
      stem,
      format: 'input',
      fields: [field(nAns(ans))],
      hints: ['Split into cases: through Banff, or direct.', `Through Banff: ${m(`${a} \\times ${b}`)} ("and"). Direct: ${m(String(c))}. Cases add ("or").`, tier === 3 ? `There are ${one} one-way routes; the return uses any of the other ${one - 1}.` : 'Add the cases.'],
      solution: [
        { tex: `Through Banff: ${m(`${a} \\times ${b} = ${a * b}`)}. Direct: ${m(String(c))}.`, why: 'Within a case, steps happen in sequence: multiply.' },
        { tex: `One way: ${m(`${a * b} + ${c} = ${one}`)}.`, why: 'Different cases cannot happen together: add.' },
        ...(tier === 3 ? [{ tex: `Round trip: ${m(`${one} \\times ${one - 1} = ${ans}`)}.`, why: 'The return route is any one-way route except the one used.' }] : []),
      ],
    };
  },
};

// ---------------------------------------------------------------- PCBT1.factorial

const factEval: Generator = {
  id: 'u6-fact-eval',
  nodeId: 'PCBT1.factorial',
  title: 'Evaluate a factorial expression',
  make(rng, tier): Draft {
    const n = rng.int(6, 12);
    const k = rng.int(2, 4);
    const top = n;
    const bottom = n - k;
    const extra = tier === 3 ? rng.int(2, 3) : 0;
    const val = nPr(top, k) / fact(extra);
    if (!Number.isInteger(val)) throw new Reject();
    const tex = extra ? `\\frac{${top}!}{${bottom}!\\,${extra}!}` : `\\frac{${top}!}{${bottom}!}`;
    const expanded = Array.from({ length: k }, (_, i) => top - i);
    const stem = `Evaluate ${m(tex)}.`;
    const sol = [
      { tex: m(`\\frac{${top}!}{${bottom}!} = \\frac{${expanded.join(' \\times ')} \\times ${bottom}!}{${bottom}!} = ${expanded.join(' \\times ')}`), why: `Write ${top}! down to ${bottom}! so it cancels.` },
      { tex: m(extra ? `\\frac{${nPr(top, k)}}{${extra}!} = ${val}` : `= ${val}`) },
    ];
    if (tier === 1) {
      return {
        cognitive: 'procedural',
        stem,
        format: 'mc',
        choices: mc({ tex: m(String(val)), key: val }, [
          { tex: m(String(fact(k))), key: fact(k), mis: 'fact-simplify', feedback: `${m(`\\frac{${top}!}{${bottom}!} \\ne (${top} - ${bottom})!`)}.` },
          { tex: m(`\\frac{${top}}{${bottom}}`), key: top / bottom, mis: 'fact-simplify', feedback: 'Factorials do not cancel like the numbers themselves.' },
          { tex: m(String(top)), key: top, mis: 'fact-simplify' },
          { tex: m(String(nPr(top, k + 1))), key: nPr(top, k + 1), mis: 'fact-simplify', feedback: `Stop at ${bottom + 1}: ${m(`${bottom}!`)} cancels.` },
        ]),
        hints: [`Write ${m(`${top}!`)} as ${m(`${top} \\times ${top - 1} \\times \\cdots`)}.`, `Stop when you reach ${m(`${bottom}!`)}.`, 'Cancel and multiply what is left.'],
        solution: sol,
      };
    }
    return { cognitive: 'procedural', stem, format: 'input', fields: [field(nAns(val))], hints: [`Expand ${m(`${top}!`)} until ${m(`${bottom}!`)} appears.`, 'Cancel the common factorial.', extra ? `Then divide by ${m(`${extra}! = ${fact(extra)}`)}.` : 'Multiply the remaining factors.'], solution: sol, verify: () => fact(top) / fact(bottom) / fact(extra) === val };
  },
};

const factSimplify: Generator = {
  id: 'u6-fact-simplify',
  nodeId: 'PCBT1.factorial',
  title: 'Simplify a factorial quotient',
  make(rng, tier): Draft {
    const a = rng.int(tier === 3 ? -1 : 0, 2);
    const gap = tier === 1 ? 1 : rng.int(2, 3);
    const b = a - gap;
    const nt = (s: number) => (s === 0 ? 'n' : `n ${s > 0 ? '+' : '-'} ${Math.abs(s)}`);
    const factors = Array.from({ length: gap }, (_, i) => a - i);
    const tex = gap === 1 ? nt(a) : factors.map((s) => (s === 0 ? 'n' : `\\left(${nt(s)}\\right)`)).join('');
    const fn = (n: number) => factors.reduce((acc, s) => acc * (n + s), 1);
    return {
      cognitive: 'procedural',
      stem: `Simplify ${m(`\\frac{(${nt(a)})!}{(${nt(b)})!}`)}, where ${m('n')} is large enough for both factorials to exist.`,
      format: 'input',
      fields: [field({ kind: 'expr', tex, variable: 'n', fn, sample: [4, 12], exact: true, form: 'simplified' })],
      hints: [`Write ${m(`(${nt(a)})!`)} as a product that stops at ${m(`(${nt(b)})!`)}.`, `${m(`(${nt(a)})! = ${factors.map((s) => `(${nt(s)})`).join('')}(${nt(b)})!`)}`, 'Cancel the common factorial.'],
      solution: [
        { tex: m(`\\frac{(${nt(a)})!}{(${nt(b)})!} = \\frac{${factors.map((s) => `(${nt(s)})`).join('')}(${nt(b)})!}{(${nt(b)})!}`), why: 'Each factorial is its first factor times the next factorial down.' },
        { tex: m(`= ${tex}`), why: gap === 1 ? 'Only one factor is left.' : `${gap} factors remain, not ${gap === 2 ? '$n - 2$' : 'a single term'}.` },
      ],
      verify: () => [5, 7, 9].every((n) => fact(n + a) / fact(n + b) === fn(n)),
    };
  },
};

const factWrite: Generator = {
  id: 'u6-fact-write',
  nodeId: 'PCBT1.factorial',
  title: 'Write a product as a factorial quotient',
  make(rng, tier): Draft {
    const n = rng.int(7, 12);
    const k = rng.int(3, 5);
    const prodTex = tier === 3 ? Array.from({ length: k }, (_, i) => (i === 0 ? 'n' : `(n - ${i})`)).join('') : Array.from({ length: k }, (_, i) => n - i).join(' \\times ');
    const N = tier === 3 ? 'n' : String(n);
    const low = (d: number) => (tier === 3 ? `(n - ${k + d})` : String(n - k + d));
    return {
      cognitive: 'conceptual',
      stem: `Which expression equals ${m(prodTex)}?`,
      format: 'mc',
      choices: mc({ tex: m(`\\frac{${N}!}{${low(0)}!}`), key: 'ok' }, [
        { tex: m(`\\frac{${N}!}{${low(1)}!}`), key: 'one', mis: 'fact-simplify', feedback: `That leaves only ${k - 1} factors.` },
        { tex: m(`\\frac{${N}!}{${low(-1)}!}`), key: 'more', mis: 'fact-simplify', feedback: `That leaves ${k + 1} factors.` },
        { tex: m(`\\frac{${N}!}{${low(0)}!\\,${k}!}`), key: 'comb', mis: 'perm-vs-comb', feedback: `Dividing by ${k}! gives a combination, not this product.` },
        { tex: m(`\\frac{${N}!}{${k}!}`), key: 'k', mis: 'fact-simplify' },
      ]),
      hints: [`The product has ${k} factors, starting at ${m(N)}.`, `${m(`${N}!`)} keeps going below the last factor.`, `Divide by the factorial that starts just below the last factor.`],
      solution: [
        { tex: `The last factor is ${m(tier === 3 ? `(n - ${k - 1})` : String(n - k + 1))}, so divide out everything below it: ${m(`${low(0)}!`)}.` },
        { tex: m(`\\frac{${N}!}{${low(0)}!} = ${prodTex}`), why: `In general ${m(`\\frac{n!}{(n - r)!} = ${P('n', 'r')}`)} has ${m('r')} factors.` },
      ],
    };
  },
};

// ---------------------------------------------------------------- PCBT2.npr

const nprEval: Generator = {
  id: 'u6-npr-eval',
  nodeId: 'PCBT2.npr',
  title: 'Evaluate nPr',
  make(rng, tier): Draft {
    const n = rng.int(5, 10);
    const r = rng.int(2, tier === 1 ? 3 : 4);
    const val = nPr(n, r);
    const sol = [
      { tex: m(`${P(n, r)} = \\frac{${n}!}{(${n} - ${r})!} = \\frac{${n}!}{${n - r}!}`) },
      { tex: m(`= ${Array.from({ length: r }, (_, i) => n - i).join(' \\times ')} = ${val}`), why: `${r} factors, starting at ${n}.` },
    ];
    if (tier === 3)
      return {
        cognitive: 'procedural',
        stem: `Evaluate ${m(P(n, r))}.`,
        format: 'mc',
        choices: mc({ tex: m(String(val)), key: val }, [
          { tex: m(String(nCr(n, r))), key: nCr(n, r), mis: 'perm-vs-comb', feedback: `That is ${m(C(n, r))}; permutations do not divide by ${r}!.` },
          { tex: m(String(n ** r)), key: n ** r, mis: 'fcp-add-multiply', feedback: 'That allows repetition.' },
          { tex: m(String(fact(n) / fact(r))), key: fact(n) / fact(r), mis: 'fact-simplify', feedback: `The denominator is ${m(`(n - r)!`)}, not ${m('r!')}.` },
        ]),
        hints: [`${m(`${P('n', 'r')} = \\frac{n!}{(n - r)!}`)}`, `${m(`(${n} - ${r})! = ${n - r}!`)}`, `Multiply ${r} factors starting at ${n}.`],
        solution: sol,
      };
    return { cognitive: 'procedural', stem: `Evaluate ${m(P(n, r))}.`, format: 'input', fields: [field(nAns(val))], hints: [`${m(`${P('n', 'r')} = \\frac{n!}{(n - r)!}`)}`, `${m(`(${n} - ${r})! = ${n - r}!`)}`, `Multiply ${r} factors starting at ${n}.`], solution: sol };
  },
};

const nprOfficers: Generator = {
  id: 'u6-npr-officers',
  nodeId: 'PCBT2.npr',
  title: 'Ordered selections',
  make(rng, tier): Draft {
    const n = rng.int(6, 15);
    const ctx = rng.pick([
      { r: 3, text: (k: number) => `A club has ${k} members. In how many ways can a president, a vice-president and a treasurer be chosen?` },
      { r: 3, text: (k: number) => `${k} runners are in a race. In how many ways can the gold, silver and bronze medals be awarded (no ties)?` },
      { r: 4, text: (k: number) => `In how many ways can 4 of ${k} different books be arranged in a row on a shelf?` },
      { r: 2, text: (k: number) => `A committee of ${k} must choose a chair and a secretary (different people). In how many ways can this be done?` },
    ]);
    const val = nPr(n, ctx.r);
    return {
      cognitive: tier === 1 ? 'procedural' : 'problemSolving',
      stem: ctx.text(n),
      format: 'input',
      fields: [field(nAns(val))],
      hints: ['Does order matter? (Is first different from second?)', `Yes: positions are distinct, so use ${m(P('n', 'r'))}.`, `${m(`${P(n, ctx.r)}`)}`],
      solution: [
        { tex: `Order matters (each position is different), no repetition: ${m(P(n, ctx.r))}.`, why: 'Swapping two people between positions gives a different outcome.' },
        { tex: m(`${P(n, ctx.r)} = ${Array.from({ length: ctx.r }, (_, i) => n - i).join(' \\times ')} = ${val}`) },
      ],
    };
  },
};

const nprWords: Generator = {
  id: 'u6-npr-words',
  nodeId: 'PCBT2.npr',
  title: 'Arrangements of letters',
  make(rng, tier): Draft {
    const word = rng.pick(DISTINCT_WORDS.filter((w) => w.length <= (tier === 1 ? 6 : 8)));
    const n = word.length;
    const r = tier === 1 ? n : rng.int(2, Math.min(4, n - 1));
    const val = nPr(n, r);
    return {
      cognitive: 'procedural',
      stem: r === n ? `How many arrangements of all the letters of ${word} are possible?` : `How many ${r}-letter arrangements can be made from the letters of ${word}, using each letter at most once?`,
      format: 'input',
      fields: [field(nAns(val))],
      hints: [`${word} has ${n} different letters.`, r === n ? `All ${n} letters in order: ${m(`${n}!`)}.` : `${r} slots from ${n} letters: ${m(P(n, r))}.`, 'Multiply the slot counts.'],
      solution: [
        { tex: m(slots(Array.from({ length: r }, (_, i) => n - i))), why: 'Each slot has one fewer letter available.' },
        { tex: m(`${r === n ? `${n}!` : P(n, r)} = ${val}`) },
      ],
      verify: () => [...arrangements(word.split(''), r)].length === val || n > 7,
    };
  },
};

// ---------------------------------------------------------------- PCBT2.constraints

const PEOPLE = ['Ava', 'Ben', 'Chen', 'Dara', 'Eli', 'Farah', 'Gus', 'Hana', 'Ira'];

const permTogether: Generator = {
  id: 'u6-perm-together',
  nodeId: 'PCBT2.constraints',
  title: 'Items that must stay together',
  make(rng, tier): Draft {
    const n = rng.int(5, 7);
    const k = tier === 1 ? 2 : rng.int(2, 3);
    const names = PEOPLE.slice(0, k);
    const ans = fact(n - k + 1) * fact(k);
    const stem = `${n} people, including ${names.join(' and ').replace(/ and (?=[^,]* and )/, ', ')}, line up in a row. In how many ways can they line up if ${names.join(', ').replace(/, ([^,]*)$/, ' and $1')} must stand together?`;
    const verify = () => {
      let c = 0;
      for (const p of permutations([...Array(n).keys()])) {
        const pos = Array.from({ length: k }, (_, i) => p.indexOf(i));
        if (Math.max(...pos) - Math.min(...pos) === k - 1) c++;
      }
      return c === ans;
    };
    const sol = [
      { tex: `Glue the ${k} into one block: ${m(`${n - k + 1}`)} units to arrange, ${m(`${n - k + 1}!`)} ways.` },
      { tex: `Inside the block: ${m(`${k}!`)} orders.`, why: 'The block’s members can swap among themselves.' },
      { tex: m(`${n - k + 1}! \\times ${k}! = ${fact(n - k + 1)} \\times ${fact(k)} = ${ans}`) },
    ];
    if (tier === 2)
      return {
        cognitive: 'problemSolving',
        stem,
        format: 'mc',
        choices: mc({ tex: m(String(ans)), key: ans }, [
          { tex: m(String(fact(n - k + 1))), key: fact(n - k + 1), mis: 'perm-together-internal', feedback: `The ${k} in the block can also be arranged among themselves: multiply by ${k}!.` },
          { tex: m(String(fact(n) - ans)), key: fact(n) - ans, mis: 'perm-apart-subtract', feedback: 'That counts arrangements where they are not all together.' },
          { tex: m(String(fact(n - k) * fact(k))), key: fact(n - k) * fact(k), mis: 'perm-together-internal', feedback: 'The block itself is one of the units being arranged.' },
        ]),
        hints: ['Treat the group as a single block.', `Arrange ${n - k + 1} units, then arrange inside the block.`, `${m(`${n - k + 1}! \\times ${k}!`)}`],
        solution: sol,
        verify,
      };
    return { cognitive: 'problemSolving', stem, format: 'input', fields: [field(nAns(ans))], hints: ['Treat the group as a single block.', `That leaves ${n - k + 1} units to arrange.`, `Then multiply by the ${k}! orders inside the block.`], solution: sol, verify };
  },
};

const permApart: Generator = {
  id: 'u6-perm-apart',
  nodeId: 'PCBT2.constraints',
  title: 'Two items that must be apart',
  make(rng, tier): Draft {
    const useWord = tier === 3;
    const n = useWord ? 0 : rng.int(5, 7);
    const word = useWord ? rng.pick(DISTINCT_WORDS.filter((w) => w.length <= 7 && vowelsIn(w) === 2)) : '';
    const N = useWord ? word.length : n;
    const total = fact(N);
    const together = fact(N - 1) * 2;
    const ans = total - together;
    const what = useWord ? `arrangements of the letters of ${word} have the two vowels apart (not next to each other)` : `ways can ${n} people line up if ${PEOPLE[0]} and ${PEOPLE[1]} refuse to stand next to each other`;
    return {
      cognitive: 'problemSolving',
      stem: `How many ${what}?`,
      format: 'input',
      fields: [field(nAns(ans))],
      hints: ['Count the opposite: arrangements where they are together.', `Together: block of 2 → ${m(`${N - 1}! \\times 2!`)}.`, `Apart = total − together = ${m(`${N}! - ${N - 1}! \\times 2!`)}.`],
      solution: [
        { tex: `Total: ${m(`${N}! = ${total}`)}.` },
        { tex: `Together: ${m(`${N - 1}! \\times 2! = ${together}`)}.`, why: 'Block of two, arranged with the rest, times 2 internal orders.' },
        { tex: `Apart: ${m(`${total} - ${together} = ${ans}`)}.`, why: 'Every arrangement is either together or apart, never both.' },
      ],
      verify: () => {
        if (N > 7) return true;
        const items = useWord ? word.split('') : [...Array(n).keys()].map(String);
        const [x, y] = useWord ? word.split('').filter((c) => VOWELS.includes(c)) : ['0', '1'];
        let c = 0;
        for (const p of permutations(items)) if (Math.abs(p.indexOf(x) - p.indexOf(y)) > 1) c++;
        return c === ans;
      },
    };
  },
};

const permEnds: Generator = {
  id: 'u6-perm-ends',
  nodeId: 'PCBT2.constraints',
  title: 'Fixed positions and ends',
  make(rng, tier): Draft {
    const word = rng.pick(DISTINCT_WORDS.filter((w) => w.length >= 5 && w.length <= 7 && vowelsIn(w) >= 2));
    const n = word.length;
    const v = vowelsIn(word);
    const kind = tier === 1 ? 'starts' : tier === 2 ? 'both-ends' : 'ends-consonant';
    let ans: number;
    let stem: string;
    let slotRow: (number | string)[];
    let pred: (s: string) => boolean;
    if (kind === 'starts') {
      ans = v * fact(n - 1);
      stem = `How many arrangements of the letters of ${word} begin with a vowel?`;
      slotRow = [v, ...Array.from({ length: n - 1 }, (_, i) => n - 1 - i)];
      pred = (s) => VOWELS.includes(s[0]);
    } else if (kind === 'both-ends') {
      ans = v * (v - 1) * fact(n - 2);
      stem = `How many arrangements of the letters of ${word} begin and end with a vowel?`;
      slotRow = [v, ...Array.from({ length: n - 2 }, (_, i) => n - 2 - i), v - 1];
      pred = (s) => VOWELS.includes(s[0]) && VOWELS.includes(s[n - 1]);
    } else {
      const c = n - v;
      ans = v * c * fact(n - 2);
      stem = `How many arrangements of the letters of ${word} begin with a vowel and end with a consonant?`;
      slotRow = [v, ...Array.from({ length: n - 2 }, (_, i) => n - 2 - i), c];
      pred = (s) => VOWELS.includes(s[0]) && !VOWELS.includes(s[n - 1]);
    }
    return {
      cognitive: 'problemSolving',
      stem,
      format: 'input',
      fields: [field(nAns(ans))],
      hints: [`${word} has ${v} vowels and ${n - v} consonants.`, 'Fill the restricted end slots first.', 'Then the middle letters can go in any order.'],
      solution: [
        { tex: m(slots(slotRow)), why: 'Restricted positions first, then the rest in decreasing order.' },
        { tex: m(`${times(slotRow)} = ${ans}`) },
      ],
      verify: () => countDistinct(word, pred) === ans,
    };
  },
};

// ---------------------------------------------------------------- PCBT2.repeated

const repDenom = (w: string) => Object.entries(letterCounts(w)).filter(([, c]) => c > 1);
const repTex = (w: string) => {
  const d = repDenom(w).map(([, c]) => `${c}!`);
  return d.length ? `\\frac{${w.length}!}{${d.join('\\,')}}` : `${w.length}!`;
};

const repWord: Generator = {
  id: 'u6-rep-word',
  nodeId: 'PCBT2.repeated',
  title: 'Arrangements with identical letters',
  make(rng, tier): Draft {
    const word = rng.pick(REPEAT_WORDS.filter((w) => (tier === 1 ? repDenom(w).length === 1 : true)));
    const ans = distinctArrangements(word);
    const reps = repDenom(word).map(([ch, c]) => `${c} ${ch}s`).join(', ');
    const stem = `How many different arrangements of all the letters of ${word} are possible?`;
    const sol = [
      { tex: `${word}: ${word.length} letters with ${reps}.` },
      { tex: m(`${repTex(word)} = ${ans}`), why: 'Swapping identical letters gives the same arrangement, so divide out those duplicate orders.' },
    ];
    const verify = () => word.length > 7 || countDistinct(word) === ans;
    if (tier === 2)
      return {
        cognitive: 'procedural',
        stem,
        format: 'mc',
        choices: mc({ tex: m(String(ans)), key: ans }, [
          { tex: m(String(fact(word.length))), key: fact(word.length), mis: 'perm-repeat-divide', feedback: 'Identical letters make some of these the same.' },
          { tex: m(String(fact(word.length) / repDenom(word).reduce((a, [, c]) => a * c, 1))), key: fact(word.length) / repDenom(word).reduce((a, [, c]) => a * c, 1), mis: 'perm-repeat-divide', feedback: 'Divide by the factorial of each count, not the count.' },
          { tex: m(String(fact(word.length) - repDenom(word).reduce((a, [, c]) => a + fact(c), 0))), key: 'sub', mis: 'perm-repeat-divide' },
          { tex: m(String(fact(new Set(word).size))), key: fact(new Set(word).size), mis: 'perm-repeat-divide' },
        ]),
        hints: ['Count each repeated letter.', `${reps}.`, `${m(`\\frac{n!}{a!\\,b!\\cdots}`)}`],
        solution: sol,
        verify,
      };
    return { cognitive: 'procedural', stem, format: 'input', fields: [field(nAns(ans))], hints: ['Count each repeated letter.', `${reps}.`, `${m(`\\frac{n!}{a!\\,b!\\cdots}`)}`], solution: sol, verify };
  },
};

/** Lattice paths by dynamic programming (independent of the factorial formula). */
function lattice(a: number, b: number): number {
  const g = Array.from({ length: a + 1 }, () => Array(b + 1).fill(1));
  for (let i = 1; i <= a; i++) for (let j = 1; j <= b; j++) g[i][j] = g[i - 1][j] + g[i][j - 1];
  return g[a][b];
}

const repGrid: Generator = {
  id: 'u6-rep-grid',
  nodeId: 'PCBT2.repeated',
  title: 'Pathways on a grid',
  make(rng, tier): Draft {
    const a = rng.int(2, 5);
    const b = rng.int(2, 5);
    if (tier < 3) {
      const ans = nCr(a + b, a);
      return {
        cognitive: 'problemSolving',
        stem: `A city has a rectangular street grid. Point B is ${a} blocks east and ${b} blocks south of point A. Moving only east or south, how many different paths go from A to B?`,
        format: 'input',
        fields: [field(nAns(ans))],
        hints: ['Every path is a list of moves: E and S.', `Each path has ${a} E's and ${b} S's in some order.`, `Arrange ${a + b} letters with ${a} alike and ${b} alike.`],
        solution: [
          { tex: `A path is an arrangement of ${m(`${'E'.repeat(a)}${'S'.repeat(b)}`)}.`, why: 'Each block east is E, each block south is S; order decides the path.' },
          { tex: m(`\\frac{${a + b}!}{${a}!\\,${b}!} = ${ans}`) },
        ],
        verify: () => lattice(a, b) === ans,
      };
    }
    const c = rng.int(1, a - 1);
    const d = rng.int(1, b - 1);
    const ans = nCr(c + d, c) * nCr(a - c + b - d, a - c);
    return {
      cognitive: 'problemSolving',
      stem: `B is ${a} blocks east and ${b} blocks south of A. Moving only east or south, how many paths from A to B pass through point C, which is ${c} block${c > 1 ? 's' : ''} east and ${d} block${d > 1 ? 's' : ''} south of A?`,
      format: 'input',
      fields: [field(nAns(ans))],
      hints: ['Split the trip at C.', `A to C: ${c} E and ${d} S. C to B: ${a - c} E and ${b - d} S.`, 'Multiply ("and").'],
      solution: [
        { tex: `A to C: ${m(`\\frac{${c + d}!}{${c}!\\,${d}!} = ${nCr(c + d, c)}`)}. C to B: ${m(`\\frac{${a - c + b - d}!}{${a - c}!\\,${b - d}!} = ${nCr(a - c + b - d, a - c)}`)}.` },
        { tex: m(`${nCr(c + d, c)} \\times ${nCr(a - c + b - d, a - c)} = ${ans}`), why: 'Each first half pairs with each second half.' },
      ],
      verify: () => lattice(c, d) * lattice(a - c, b - d) === ans,
    };
  },
};

const repStart: Generator = {
  id: 'u6-rep-start',
  nodeId: 'PCBT2.repeated',
  title: 'Identical letters with a condition',
  make(rng, tier): Draft {
    const word = rng.pick(REPEAT_WORDS.filter((w) => w.length <= 7));
    const counts = letterCounts(word);
    const letter = tier === 1 ? rng.pick(Object.keys(counts).filter((c) => counts[c] > 1)) : rng.pick(Object.keys(counts));
    const rest = word.replace(letter, '');
    const ans = distinctArrangements(rest);
    const both = tier === 3 && counts[letter] > 1;
    const rest2 = rest.replace(letter, '');
    const ans2 = distinctArrangements(rest2);
    const final = both ? ans2 : ans;
    return {
      cognitive: 'problemSolving',
      stem: both ? `How many different arrangements of the letters of ${word} begin and end with ${letter}?` : `How many different arrangements of the letters of ${word} begin with ${letter}?`,
      format: 'input',
      fields: [field(nAns(final))],
      hints: [`Place ${letter} first${both ? ' and last' : ''}.`, `Arrange the remaining letters: ${both ? rest2 : rest}.`, 'Divide by the factorials of any letters still repeated.'],
      solution: [
        { tex: `Fix ${letter}${both ? ' at both ends' : ' first'}; arrange ${both ? rest2 : rest}.` },
        { tex: m(`${repTex(both ? rest2 : rest)} = ${final}`), why: 'Only the letters still repeated in the remaining set are divided out.' },
      ],
      verify: () => countDistinct(word, (s) => s[0] === letter && (!both || s[s.length - 1] === letter)) === final,
    };
  },
};

// ---------------------------------------------------------------- PCBT2.cases

const casesEven: Generator = {
  id: 'u6-cases-even',
  nodeId: 'PCBT2.cases',
  title: 'Even numbers when 0 is a digit',
  make(rng, tier): Draft {
    const top = rng.int(5, 9); // digits 0..top
    const r = tier === 1 ? 3 : rng.int(3, 4);
    const n = top + 1;
    const evens = Array.from({ length: n }, (_, i) => i).filter((d) => d % 2 === 0).length; // includes 0
    const caseZero = nPr(n - 1, r - 1);
    const caseOther = (evens - 1) * (n - 2) * nPr(n - 2, r - 2);
    const ans = caseZero + caseOther;
    const digits = Array.from({ length: n }, (_, i) => i);
    return {
      cognitive: 'problemSolving',
      stem: `How many ${r}-digit even numbers can be formed from the digits 0 to ${top} if no digit may repeat? (A number cannot start with 0.)`,
      format: 'input',
      fields: [field(nAns(ans))],
      hints: ['Two restricted slots: the last (even) and the first (not 0). They interact through the digit 0.', 'Split into cases: last digit 0, or last digit another even digit.', `Case 1: ${m(slots([n - 1, '\\cdots', 1]))}. Case 2: the first digit has ${n - 2} choices (not 0, not the last digit).`],
      solution: [
        { tex: `Case 1, last digit 0: ${m(slots([...Array.from({ length: r - 1 }, (_, i) => n - 1 - i), 1]))} = ${m(String(caseZero))}.`, why: 'With 0 used, the first digit has no extra restriction.' },
        { tex: `Case 2, last digit ${Array.from({ length: n }, (_, i) => i).filter((d) => d % 2 === 0 && d > 0).join(', ')}: ${m(slots([n - 2, ...Array.from({ length: r - 2 }, (_, i) => n - 2 - i), evens - 1]))} = ${m(String(caseOther))}.`, why: 'First digit: not 0 and not the chosen last digit.' },
        { tex: m(`${caseZero} + ${caseOther} = ${ans}`), why: 'The cases do not overlap, so add.' },
      ],
      verify: () => [...arrangements(digits, r)].filter((a) => a[0] !== 0 && a[r - 1] % 2 === 0).length === ans,
    };
  },
};

const casesOr: Generator = {
  id: 'u6-cases-or',
  nodeId: 'PCBT2.cases',
  title: 'Overlapping cases',
  make(rng, tier): Draft {
    const word = rng.pick(DISTINCT_WORDS.filter((w) => w.length >= 5 && w.length <= 7 && vowelsIn(w) >= 2));
    const n = word.length;
    const v = vowelsIn(word);
    const start = v * fact(n - 1);
    const both = v * (v - 1) * fact(n - 2);
    const ans = 2 * start - both;
    const stem = `How many arrangements of the letters of ${word} begin with a vowel or end with a vowel (or both)?`;
    const sol = [
      { tex: `Begin with a vowel: ${m(`${v} \\times ${n - 1}! = ${start}`)}. End with a vowel: also ${m(String(start))}.` },
      { tex: `Both: ${m(`${v} \\times ${v - 1} \\times ${n - 2}! = ${both}`)}.`, why: 'These arrangements were counted in both cases.' },
      { tex: m(`${start} + ${start} - ${both} = ${ans}`), why: 'Add the cases, then subtract the overlap once.' },
    ];
    const verify = () => countDistinct(word, (s) => VOWELS.includes(s[0]) || VOWELS.includes(s[n - 1])) === ans;
    if (tier === 3)
      return { cognitive: 'problemSolving', stem, format: 'input', fields: [field(nAns(ans))], hints: ['The two conditions overlap.', 'Count each, then subtract arrangements that satisfy both.', `Both: vowel first and a different vowel last.`], solution: sol, verify };
    return {
      cognitive: 'problemSolving',
      stem,
      format: 'mc',
      choices: mc({ tex: m(String(ans)), key: ans }, [
        { tex: m(String(2 * start)), key: 2 * start, mis: 'perm-case-overlap', feedback: 'Arrangements with vowels at both ends were counted twice.' },
        { tex: m(String(both)), key: both, mis: 'fcp-add-multiply', feedback: 'That is "begin and end", not "or".' },
        { tex: m(String(start * start)), key: start * start, mis: 'fcp-add-multiply' },
        { tex: m(String(fact(n) - both)), key: fact(n) - both, mis: 'perm-case-overlap' },
      ]),
      hints: ['"Or" means add the cases, but watch for overlap.', `Begin with a vowel: ${m(`${v} \\times ${n - 1}!`)}; same for end.`, 'Subtract the arrangements counted twice.'],
      solution: sol,
      verify,
    };
  },
};

const casesThree: Generator = {
  id: 'u6-cases-three',
  nodeId: 'PCBT2.cases',
  title: 'Three or more conditions',
  make(rng, tier): Draft {
    if (tier < 3) {
      const n = rng.int(5, 7);
      const ans = 2 * 2 * fact(n - 2);
      return {
        cognitive: 'problemSolving',
        stem: `${n} people line up in a row. ${PEOPLE[0]} and ${PEOPLE[1]} must stand together, and ${PEOPLE[2]} must stand at one of the ends. How many arrangements are possible?`,
        format: 'input',
        fields: [field(nAns(ans))],
        hints: [`Glue ${PEOPLE[0]} and ${PEOPLE[1]}: ${n - 1} units.`, `Place ${PEOPLE[2]} first: 2 ends.`, `Arrange the other ${n - 2} units, then the 2 orders inside the block.`],
        solution: [
          { tex: `${PEOPLE[2]} at an end: ${m('2')} ways.`, why: 'Most restricted first.' },
          { tex: `The block and the other ${n - 3} people: ${m(`${n - 2}!`)} ways; inside the block ${m('2!')}.` },
          { tex: m(`2 \\times ${n - 2}! \\times 2! = ${ans}`) },
        ],
        verify: () => {
          let c = 0;
          for (const p of permutations([...Array(n).keys()])) if (Math.abs(p.indexOf(0) - p.indexOf(1)) === 1 && (p[0] === 2 || p[n - 1] === 2)) c++;
          return c === ans;
        },
      };
    }
    // 4-digit even numbers greater than T000 from digits 1–7, no repeats: case on the first digit's parity.
    const T = rng.int(3, 5);
    const digits = [1, 2, 3, 4, 5, 6, 7];
    const firstEven = digits.filter((d) => d >= T && d % 2 === 0).length;
    const firstOdd = digits.filter((d) => d >= T && d % 2 === 1).length;
    const caseE = firstEven * 2 * 5 * 4; // last: 3 evens minus the one used
    const caseO = firstOdd * 3 * 5 * 4;
    const ans = caseE + caseO;
    return {
      cognitive: 'problemSolving',
      stem: `How many even 4-digit numbers greater than ${T}000 can be made from the digits 1 to 7 with no digit repeated?`,
      format: 'input',
      fields: [field(nAns(ans))],
      hints: ['Restricted slots: the first (at least ' + T + ') and the last (even).', 'They interact when the first digit is even. Split into cases on the first digit.', 'In each case fill first, then last, then the middle two.'],
      solution: [
        { tex: `First digit even (${digits.filter((d) => d >= T && d % 2 === 0).join(', ')}): ${m(slots([firstEven, 5, 4, 2]))} = ${m(String(caseE))}.`, why: 'One even digit is used up, so 2 remain for the last slot.' },
        { tex: `First digit odd (${digits.filter((d) => d >= T && d % 2 === 1).join(', ')}): ${m(slots([firstOdd, 5, 4, 3]))} = ${m(String(caseO))}.` },
        { tex: m(`${caseE} + ${caseO} = ${ans}`), why: 'Separate cases add.' },
      ],
      verify: () => [...arrangements(digits, 4)].filter((a) => a[0] >= T && a[3] % 2 === 0).length === ans,
    };
  },
};

// ---------------------------------------------------------------- PCBT2.solve-n / PCBT3.solve-n

const solveNpr: Generator = {
  id: 'u6-solven-npr',
  nodeId: 'PCBT2.solve-n',
  title: 'Solve nP2 = k',
  make(rng, tier): Draft {
    const n = rng.int(4, 15);
    const val = nPr(n, 2);
    return {
      cognitive: 'procedural',
      stem: `Solve for ${m('n')}: ${m(`${P('n', 2)} = ${val}`)}.`,
      format: 'input',
      fields: [field(nAns(n), 'n =')],
      hints: [`${m(`${P('n', 2)} = \\frac{n!}{(n - 2)!} = n(n - 1)`)}`, `${m(`n^2 - n - ${val} = 0`)}`, 'Factor and keep only a natural number with $n \\ge 2$.'],
      solution: [
        { tex: m(`n(n - 1) = ${val} \\Rightarrow n^2 - n - ${val} = 0`) },
        { tex: m(`(n - ${n})(n + ${n - 1}) = 0`), why: tier === 1 ? 'Two consecutive numbers multiply to ' + val + '.' : 'Factor the quadratic.' },
        { tex: `${m(`n = ${n}`)}; ${m(`n = -${n - 1}`)} is rejected.`, why: '$n$ counts objects, so it is a natural number.' },
      ],
      verify: () => n * (n - 1) === val,
    };
  },
};

const solveNprMc: Generator = {
  id: 'u6-solven-npr-mc',
  nodeId: 'PCBT2.solve-n',
  title: 'Which value of n?',
  make(rng, tier): Draft {
    const n = rng.int(5, 12);
    const shift = tier === 3 ? 1 : 0;
    const val = nPr(n + shift, 2);
    const left = shift ? P('n + 1', 2) : P('n', 2);
    return {
      cognitive: 'procedural',
      stem: `What is the solution of ${m(`${left} = ${val}`)}?`,
      format: 'mc',
      choices: mc({ tex: m(`n = ${n}`), key: n }, [
        { tex: `${m(`n = ${n}`)} or ${m(`n = ${-(n + shift - 1) - shift}`)}`, key: 'both', mis: 'perm-solve-n-negative', feedback: 'A negative $n$ is not a number of objects.' },
        { tex: m(`n = ${val / 2}`), key: val / 2, mis: 'fact-simplify', feedback: `${m(`\\frac{n!}{(n - 2)!}`)} is ${m('n(n - 1)')}, not ${m('2n')}.` },
        { tex: m(`n = ${n + 1 - 2 * shift}`), key: n + 1 - 2 * shift, mis: 'fact-simplify', feedback: shift ? 'Solve for $n$, not $n + 1$.' : 'Check: $n(n - 1)$ must equal ' + val + '.' },
        { tex: m(`n = ${-(n + shift - 1) - shift}`), key: 'neg', mis: 'perm-solve-n-negative' },
      ]),
      hints: [shift ? `${m(`${left} = (n + 1)n`)}` : `${m(`${left} = n(n - 1)`)}`, 'Set up a quadratic and factor.', 'Reject negative values.'],
      solution: [
        { tex: m(shift ? `(n + 1)n = ${val} \\Rightarrow n^2 + n - ${val} = 0` : `n(n - 1) = ${val} \\Rightarrow n^2 - n - ${val} = 0`) },
        { tex: m(shift ? `(n - ${n})(n + ${n + 1}) = 0` : `(n - ${n})(n + ${n - 1}) = 0`) },
        { tex: `${m(`n = ${n}`)}; the negative root is rejected.`, why: '$n$ must be a natural number at least as large as $r$.' },
      ],
    };
  },
};

const solveNpr3: Generator = {
  id: 'u6-solven-npr3',
  nodeId: 'PCBT2.solve-n',
  title: 'Equations with nP3 and nP2',
  make(rng, tier): Draft {
    const n = rng.int(5, 12);
    if (tier === 1) {
      const k = n - 2;
      return {
        cognitive: 'problemSolving',
        stem: `Solve for ${m('n')}: ${m(`${P('n', 3)} = ${k} \\cdot ${P('n', 2)}`)}.`,
        format: 'input',
        fields: [field(nAns(n), 'n =')],
        hints: [`${m(`${P('n', 3)} = n(n - 1)(n - 2)`)}`, `${m(`${P('n', 2)} = n(n - 1)`)}`, 'Divide both sides by $n(n - 1)$, which is not 0.'],
        solution: [
          { tex: m(`n(n - 1)(n - 2) = ${k}\\,n(n - 1)`) },
          { tex: m(`n - 2 = ${k} \\Rightarrow n = ${n}`), why: 'Divide by $n(n - 1)$; $n \\ge 3$ so it is not zero.' },
        ],
        verify: () => nPr(n, 3) === k * nPr(n, 2),
      };
    }
    const k = (n - 1) * (n - 2);
    return {
      cognitive: 'problemSolving',
      stem: `Solve for ${m('n')}: ${m(`${P('n', 3)} = ${k}n`)}.`,
      format: 'input',
      fields: [field(nAns(n), 'n =')],
      hints: [`${m(`${P('n', 3)} = n(n - 1)(n - 2)`)}`, `Divide by ${m('n')}: ${m(`(n - 1)(n - 2) = ${k}`)}.`, 'Expand, factor, reject the negative root.'],
      solution: [
        { tex: m(`(n - 1)(n - 2) = ${k} \\Rightarrow ${polyTex([1, -3, 2 - k], 'n')} = 0`) },
        { tex: m(`(n - ${n})(n + ${n - 3}) = 0`), why: 'Factor.' },
        { tex: `${m(`n = ${n}`)}; ${m(`n = ${3 - n}`)} is rejected.`, why: '$n \\ge 3$ is needed for $' + P('n', 3) + '$.' },
      ],
      verify: () => nPr(n, 3) === k * n,
    };
  },
};

const solveNcr: Generator = {
  id: 'u6-solven-ncr',
  nodeId: 'PCBT3.solve-n',
  title: 'Solve nC2 = k',
  make(rng, tier): Draft {
    const n = rng.int(4, 16);
    const val = nCr(n, 2);
    const left = tier === 3 ? C('n', 'n - 2') : C('n', 2);
    return {
      cognitive: 'procedural',
      stem: `Solve for ${m('n')}: ${m(`${left} = ${val}`)}.`,
      format: 'input',
      fields: [field(nAns(n), 'n =')],
      hints: [tier === 3 ? `${m(`${C('n', 'n - 2')} = ${C('n', 2)}`)}: choosing ${m('n - 2')} to keep is choosing 2 to leave out.` : `${m(`${C('n', 2)} = \\frac{n(n - 1)}{2}`)}`, `${m(`n(n - 1) = ${2 * val}`)}`, 'Factor; keep the natural-number root.'],
      solution: [
        ...(tier === 3 ? [{ tex: m(`${C('n', 'n - 2')} = \\frac{n!}{(n - 2)!\\,2!} = ${C('n', 2)}`), why: '$_nC_r = {}_nC_{n - r}$.' }] : []),
        { tex: m(`\\frac{n(n - 1)}{2} = ${val} \\Rightarrow n^2 - n - ${2 * val} = 0`) },
        { tex: m(`(n - ${n})(n + ${n - 1}) = 0 \\Rightarrow n = ${n}`), why: 'Reject the negative root.' },
      ],
      verify: () => nCr(n, 2) === val,
    };
  },
};

const solveNcrMc: Generator = {
  id: 'u6-solven-ncr-mc',
  nodeId: 'PCBT3.solve-n',
  title: 'Which value of n? (combinations)',
  make(rng, tier): Draft {
    const n = rng.int(5, 14);
    const val = nCr(n, 2);
    return {
      cognitive: 'procedural',
      stem: `What is the solution of ${m(`${C('n', 2)} = ${val}`)}?`,
      format: 'mc',
      choices: mc({ tex: m(`n = ${n}`), key: n }, [
        { tex: `${m(`n = ${n}`)} or ${m(`n = ${1 - n}`)}`, key: 'both', mis: 'perm-solve-n-negative', feedback: 'Reject the negative root.' },
        { tex: m(`n = ${n + 1}`), key: n + 1, mis: 'fact-simplify', feedback: `Check: ${m(`${C(n + 1, 2)} = ${nCr(n + 1, 2)}`)}.` },
        { tex: m(`n = ${val}`), key: val, mis: 'fact-simplify' },
        { tex: m(`n = ${2 * val}`), key: 2 * val, mis: 'fact-simplify' },
      ]),
      hints: [`${m(`${C('n', 2)} = \\frac{n(n - 1)}{2}`)}`, `${m(`n(n - 1) = ${2 * val}`)}`, tier > 1 ? 'Two consecutive integers with that product.' : 'Factor the quadratic.'],
      solution: [
        { tex: m(`n(n - 1) = ${2 * val} \\Rightarrow (n - ${n})(n + ${n - 1}) = 0`) },
        { tex: `${m(`n = ${n}`)}.`, why: 'A count of objects is a natural number.' },
      ],
    };
  },
};

const solveNcrMixed: Generator = {
  id: 'u6-solven-ncr-mixed',
  nodeId: 'PCBT3.solve-n',
  title: 'Equations mixing nCr and nPr',
  make(rng, tier): Draft {
    const n = rng.int(5, 13);
    if (tier === 3) {
      // (n+1)C2 = k
      const val = nCr(n + 1, 2);
      return {
        cognitive: 'problemSolving',
        stem: `Solve for ${m('n')}: ${m(`${C('n + 1', 2)} = ${val}`)}.`,
        format: 'input',
        fields: [field(nAns(n), 'n =')],
        hints: [`${m(`${C('n + 1', 2)} = \\frac{(n + 1)n}{2}`)}`, `${m(`n^2 + n - ${2 * val} = 0`)}`, 'Factor and reject the negative root.'],
        solution: [
          { tex: m(`\\frac{(n + 1)n}{2} = ${val} \\Rightarrow n^2 + n - ${2 * val} = 0`) },
          { tex: m(`(n - ${n})(n + ${n + 1}) = 0 \\Rightarrow n = ${n}`), why: 'Reject the negative root.' },
        ],
        verify: () => nCr(n + 1, 2) === val,
      };
    }
    // nC2 = k·nC1 → (n − 1)/2 = k
    if ((n - 1) % 2) throw new Reject();
    const k = (n - 1) / 2;
    return {
      cognitive: 'problemSolving',
      stem: `Solve for ${m('n')}: ${m(`${C('n', 2)} = ${k} \\cdot ${C('n', 1)}`)}.`,
      format: 'input',
      fields: [field(nAns(n), 'n =')],
      hints: [`${m(`${C('n', 1)} = n`)}`, `${m(`\\frac{n(n - 1)}{2} = ${k}n`)}`, 'Divide by $n$ (not 0).'],
      solution: [
        { tex: m(`\\frac{n(n - 1)}{2} = ${k}n`) },
        { tex: m(`n - 1 = ${2 * k} \\Rightarrow n = ${n}`), why: 'Divide both sides by $n$ and multiply by 2.' },
      ],
      verify: () => nCr(n, 2) === k * n,
    };
  },
};

// ---------------------------------------------------------------- PCBT3.ncr

const ncrEval: Generator = {
  id: 'u6-ncr-eval',
  nodeId: 'PCBT3.ncr',
  title: 'Evaluate nCr',
  make(rng, tier): Draft {
    const n = rng.int(5, 12);
    const r = rng.int(2, Math.min(5, n - 2));
    const val = nCr(n, r);
    const notation = tier === 2 ? `\\binom{${n}}{${r}}` : C(n, r);
    if (tier === 3) {
      return {
        cognitive: 'conceptual',
        stem: `Which expression has the same value as ${m(C(n, r))}?`,
        format: 'mc',
        choices: mc({ tex: m(C(n, n - r)), key: 'sym' }, [
          { tex: m(P(n, r)), key: 'p', mis: 'perm-vs-comb', feedback: `${m(P(n, r))} is ${r}! times larger.` },
          { tex: m(C(n, r + 1)), key: 'r1', mis: 'binom-pascal-row' },
          { tex: m(C(n - r, r)), key: 'nr', mis: 'fact-simplify' },
        ]),
        hints: ['Choosing $r$ items to take is the same as choosing which items to leave.', `Leaving out ${n - r} of ${n}.`, `${m(`${C('n', 'r')} = ${C('n', 'n - r')}`)}`],
        solution: [
          { tex: m(`${C(n, r)} = \\frac{${n}!}{${r}!\\,${n - r}!} = ${C(n, n - r)}`), why: 'The formula is symmetric in $r$ and $n - r$.' },
          { tex: `Both equal ${m(String(val))}.` },
        ],
      };
    }
    return {
      cognitive: 'procedural',
      stem: `Evaluate ${m(notation)}.`,
      format: 'input',
      fields: [field(nAns(val))],
      hints: [`${m(`${C('n', 'r')} = \\binom{n}{r} = \\frac{n!}{(n - r)!\\,r!}`)}`, `${m(`\\frac{${n}!}{${n - r}!\\,${r}!}`)}`, `Cancel ${m(`${n - r}!`)} first, then divide by ${m(`${r}! = ${fact(r)}`)}.`],
      solution: [
        { tex: m(`${notation} = \\frac{${n}!}{${n - r}!\\,${r}!} = \\frac{${Array.from({ length: r }, (_, i) => n - i).join(' \\times ')}}{${r}!}`) },
        { tex: m(`= \\frac{${nPr(n, r)}}{${fact(r)}} = ${val}`), why: 'Divide by $r!$ because order does not matter.' },
      ],
    };
  },
};

const ncrCommittee: Generator = {
  id: 'u6-ncr-committee',
  nodeId: 'PCBT3.ncr',
  title: 'Committees and selections',
  make(rng, tier): Draft {
    if (tier === 1) {
      const n = rng.int(7, 15);
      const r = rng.int(2, 5);
      const ans = nCr(n, r);
      return {
        cognitive: 'procedural',
        stem: `In how many ways can a committee of ${r} be chosen from ${n} people?`,
        format: 'input',
        fields: [field(nAns(ans))],
        hints: ['Does order matter on a committee?', 'No: use combinations.', `${m(C(n, r))}`],
        solution: [{ tex: `Order does not matter: ${m(C(n, r))}.`, why: 'The same people in a different order form the same committee.' }, { tex: m(`${C(n, r)} = ${ans}`) }],
        verify: () => [...subsets([...Array(n).keys()], r)].length === ans,
      };
    }
    if (tier === 2) {
      const g = rng.int(5, 9);
      const b = rng.int(5, 9);
      const x = rng.int(2, 3);
      const y = rng.int(1, 3);
      const ans = nCr(g, x) * nCr(b, y);
      return {
        cognitive: 'problemSolving',
        stem: `A team of ${x} Grade 11 students and ${y} Grade 12 student${y > 1 ? 's' : ''} is chosen from ${g} Grade 11 and ${b} Grade 12 volunteers. How many teams are possible?`,
        format: 'input',
        fields: [field(nAns(ans))],
        hints: ['Choose from each group separately.', `${m(C(g, x))} and ${m(C(b, y))}.`, 'Multiply ("and").'],
        solution: [
          { tex: m(`${C(g, x)} = ${nCr(g, x)},\\quad ${C(b, y)} = ${nCr(b, y)}`) },
          { tex: m(`${nCr(g, x)} \\times ${nCr(b, y)} = ${ans}`), why: 'Each Grade 11 group pairs with each Grade 12 group.' },
        ],
      };
    }
    const n = rng.int(8, 13);
    const r = rng.int(3, 5);
    const inc = rng.chance(0.5);
    const ans = inc ? nCr(n - 1, r - 1) : nCr(n - 1, r);
    return {
      cognitive: 'problemSolving',
      stem: `A committee of ${r} is chosen from ${n} people, one of whom is ${PEOPLE[3]}. How many committees ${inc ? 'include' : 'do not include'} ${PEOPLE[3]}?`,
      format: 'input',
      fields: [field(nAns(ans))],
      hints: [inc ? `Put ${PEOPLE[3]} on the committee first.` : `Remove ${PEOPLE[3]} from the pool.`, inc ? `Choose the other ${r - 1} from ${n - 1}.` : `Choose all ${r} from the other ${n - 1}.`, `${m(inc ? C(n - 1, r - 1) : C(n - 1, r))}`],
      solution: [
        { tex: inc ? `${PEOPLE[3]} is in: choose ${r - 1} more from ${n - 1}.` : `${PEOPLE[3]} is out: choose ${r} from ${n - 1}.` },
        { tex: m(`${inc ? C(n - 1, r - 1) : C(n - 1, r)} = ${ans}`) },
      ],
      verify: () => [...subsets([...Array(n).keys()], r)].filter((s) => s.includes(0) === inc).length === ans,
    };
  },
};

const ncrVsNpr: Generator = {
  id: 'u6-ncr-vs-npr',
  nodeId: 'PCBT3.ncr',
  title: 'Permutation or combination?',
  make(rng, tier): Draft {
    const n = rng.int(8, 20);
    const r = rng.int(2, tier === 1 ? 3 : 4);
    const roles = ['a president', 'a vice-president', 'a secretary', 'a treasurer'].slice(0, r);
    const ctx = rng.pick([
      { order: false, text: `choose ${r} of ${n} songs for a sample, where only which songs matters` },
      { order: true, text: `award ${r} different prizes to ${r} of ${n} entrants` },
      { order: false, text: `select ${r} toppings from ${n} available toppings` },
      { order: true, text: `elect ${roles.slice(0, -1).join(', ')} and ${roles[roles.length - 1]} from ${n} members` },
      { order: false, text: `deal a hand of ${r} cards from ${n} different cards` },
    ]);
    const right = ctx.order ? P(n, r) : C(n, r);
    const wrong = ctx.order ? C(n, r) : P(n, r);
    return {
      cognitive: 'conceptual',
      stem: `Which expression gives the number of ways to ${ctx.text}?`,
      format: 'mc',
      choices: mc({ tex: m(right), key: 'ok' }, [
        { tex: m(wrong), key: 'swap', mis: 'perm-vs-comb', feedback: ctx.order ? 'The positions (prizes) are different, so order matters.' : 'Rearranging the same selection gives nothing new, so order does not matter.' },
        { tex: m(`${n}^{${r}}`), key: 'pow', mis: 'fcp-add-multiply', feedback: 'That allows the same item more than once.' },
        { tex: m(`${n}!`), key: 'fact', mis: 'fact-simplify' },
        { tex: m(`${r}!`), key: 'r', mis: 'fact-simplify' },
      ]),
      hints: ['Ask: if I swap two chosen items, is it a different outcome?', ctx.order ? 'Here, yes.' : 'Here, no.', ctx.order ? 'Different outcome → permutation.' : 'Same outcome → combination.'],
      solution: [
        { tex: ctx.order ? 'Swapping two chosen items changes the outcome: order matters.' : 'Swapping two chosen items gives the same outcome: order does not matter.' },
        { tex: `Use ${m(right)}.`, why: `${m(`${C('n', 'r')} = \\frac{${P('n', 'r')}}{r!}`)}: dividing by ${m('r!')} removes the orderings.` },
      ],
    };
  },
};

// ---------------------------------------------------------------- PCBT3.at-least

const atLeastOne: Generator = {
  id: 'u6-atleast-one',
  nodeId: 'PCBT3.at-least',
  title: '"At least one": total minus none',
  make(rng, tier): Draft {
    const w = rng.int(3, 7);
    const mN = rng.int(3, 7);
    const r = rng.int(3, 4);
    const total = nCr(w + mN, r);
    const none = nCr(mN, r);
    const ans = total - none;
    const over = w * nCr(w + mN - 1, r - 1);
    const stem = `A committee of ${r} is chosen from ${w} teachers and ${mN} parents. How many committees include at least one teacher?`;
    const sol = [
      { tex: `Total: ${m(`${C(w + mN, r)} = ${total}`)}. No teachers: ${m(`${C(mN, r)} = ${none}`)}.` },
      { tex: m(`${total} - ${none} = ${ans}`), why: '"At least one" is everything except "none".' },
    ];
    const verify = () => [...subsets([...Array(w + mN).keys()], r)].filter((s) => s.some((x) => x < w)).length === ans;
    if (tier === 2)
      return {
        cognitive: 'problemSolving',
        stem,
        format: 'mc',
        choices: mc({ tex: m(String(ans)), key: ans }, [
          { tex: m(String(over)), key: over, mis: 'comb-at-least-overcount', feedback: 'Fixing one teacher and choosing the rest freely counts committees with two teachers more than once.' },
          { tex: m(String(total)), key: total, mis: 'comb-at-least-overcount', feedback: 'This includes committees with no teachers.' },
          { tex: m(String(none)), key: none, mis: 'comb-at-least-overcount' },
        ]),
        hints: ['Count the complement.', '"At least one teacher" = total − "no teachers".', `No teachers: all ${r} from the ${mN} parents.`],
        solution: sol,
        verify,
      };
    return { cognitive: 'problemSolving', stem, format: 'input', fields: [field(nAns(ans))], hints: ['Count the complement.', '"At least one teacher" = total − "no teachers".', `No teachers: ${m(C(mN, r))}.`], solution: sol, verify };
  },
};

const atLeastK: Generator = {
  id: 'u6-atleast-k',
  nodeId: 'PCBT3.at-least',
  title: '"At least" and "at most" by cases',
  make(rng, tier): Draft {
    const g = rng.int(4, 7);
    const b = rng.int(4, 7);
    const r = rng.int(3, 4);
    const atMost = tier === 3;
    const k = atMost ? 1 : 2;
    const cases = atMost ? [0, 1] : Array.from({ length: r - k + 1 }, (_, i) => k + i);
    const terms = cases.map((j) => nCr(g, j) * nCr(b, r - j));
    const ans = terms.reduce((a, c) => a + c, 0);
    return {
      cognitive: 'problemSolving',
      stem: `A group of ${r} is chosen from ${g} girls and ${b} boys. How many groups have ${atMost ? 'at most 1 girl' : 'at least 2 girls'}?`,
      format: 'input',
      fields: [field(nAns(ans))],
      hints: ['List the cases by number of girls.', `Cases: ${cases.map((j) => `${j} girl${j === 1 ? '' : 's'}`).join(', ')}.`, `Each case: ${m(`${C(g, 'j')} \\times ${C(b, 'r - j')}`)}; add the cases.`],
      solution: [
        ...cases.map((j, i) => ({ tex: `${j} girl${j === 1 ? '' : 's'}: ${m(`${C(g, j)} \\times ${C(b, r - j)} = ${terms[i]}`)}` })),
        { tex: m(`${terms.join(' + ')} = ${ans}`), why: 'The cases cannot happen together, so add them.' },
      ],
      verify: () => [...subsets([...Array(g + b).keys()], r)].filter((s) => (atMost ? s.filter((x) => x < g).length <= 1 : s.filter((x) => x < g).length >= 2)).length === ans,
    };
  },
};

const atLeastCards: Generator = {
  id: 'u6-atleast-cards',
  nodeId: 'PCBT3.at-least',
  title: 'Card hands',
  make(rng, tier): Draft {
    const r = rng.int(3, 5);
    const kind = rng.pick([
      { name: 'hearts', c: 13 },
      { name: 'face cards (J, Q, K)', c: 12 },
      { name: 'aces', c: 4 },
      { name: 'red cards', c: 26 },
    ]);
    const exact = tier === 1;
    const j = exact ? rng.int(1, Math.min(2, r)) : 1;
    const ans = exact ? nCr(kind.c, j) * nCr(52 - kind.c, r - j) : nCr(52, r) - nCr(52 - kind.c, r);
    return {
      cognitive: 'problemSolving',
      stem: `From a standard 52-card deck, how many ${r}-card hands contain ${exact ? `exactly ${j} of the ${kind.name}` : `at least one of the ${kind.name}`}? (There are ${kind.c} ${kind.name.replace(/ \(.*\)/, '')} in the deck.)`,
      format: 'input',
      fields: [field(nAns(ans))],
      hints: exact ? [`Choose ${j} from the ${kind.c}, and the rest from the other ${52 - kind.c}.`, `${m(`${C(kind.c, j)} \\times ${C(52 - kind.c, r - j)}`)}`, 'Multiply.'] : ['Use the complement.', `Hands with none: ${m(C(52 - kind.c, r))}.`, `${m(`${C(52, r)} - ${C(52 - kind.c, r)}`)}`],
      solution: exact
        ? [{ tex: m(`${C(kind.c, j)} \\times ${C(52 - kind.c, r - j)} = ${nCr(kind.c, j)} \\times ${fmt(nCr(52 - kind.c, r - j))}`), why: 'Choose from each part of the deck, then multiply.' }, { tex: m(`= ${fmt(ans)}`) }]
        : [{ tex: m(`${C(52, r)} - ${C(52 - kind.c, r)} = ${fmt(nCr(52, r))} - ${fmt(nCr(52 - kind.c, r))}`), why: 'All hands minus hands with none of them.' }, { tex: m(`= ${fmt(ans)}`) }],
    };
  },
};

// ---------------------------------------------------------------- PCBT3.mixed

const mixedChooseArrange: Generator = {
  id: 'u6-mixed-choose-arrange',
  nodeId: 'PCBT3.mixed',
  title: 'Choose, then arrange',
  make(rng, tier): Draft {
    const c = rng.int(5, 9);
    const v = rng.int(3, 5);
    const x = rng.int(2, 3);
    const y = tier === 1 ? 1 : 2;
    const choose = nCr(c, x) * nCr(v, y);
    const ans = choose * fact(x + y);
    return {
      cognitive: 'problemSolving',
      stem: `How many ${x + y}-letter arrangements can be made using ${x} different consonants chosen from ${c} and ${y === 1 ? '1 vowel' : `${y} different vowels`} chosen from ${v}?`,
      format: 'input',
      fields: [field(nAns(ans))],
      hints: ['First choose the letters (order does not matter), then arrange them (order matters).', `${m(`${C(c, x)} \\times ${C(v, y)}`)} ways to choose.`, `Then ${m(`${x + y}!`)} ways to arrange.`],
      solution: [
        { tex: `Choose: ${m(`${C(c, x)} \\times ${C(v, y)} = ${nCr(c, x)} \\times ${nCr(v, y)} = ${choose}`)}.` },
        { tex: `Arrange: ${m(`${x + y}! = ${fact(x + y)}`)}.`, why: 'Once the letters are chosen, every order is a different arrangement.' },
        { tex: m(`${choose} \\times ${fact(x + y)} = ${fmt(ans)}`) },
      ],
    };
  },
};

const mixedRoles: Generator = {
  id: 'u6-mixed-roles',
  nodeId: 'PCBT3.mixed',
  title: 'Committees with special roles',
  make(rng, tier): Draft {
    const n = rng.int(8, 14);
    const r = rng.int(4, 6);
    const roles = tier === 1 ? 1 : 2;
    const ans = nCr(n, r) * nPr(r, roles);
    return {
      cognitive: 'problemSolving',
      stem: `A committee of ${r} is chosen from ${n} people, and then ${roles === 1 ? 'one member is named chair' : 'a chair and a secretary are named from the committee'}. In how many ways can this be done?`,
      format: 'input',
      fields: [field(nAns(ans))],
      hints: ['Two stages: choose the committee, then assign roles.', `Committee: ${m(C(n, r))}.`, roles === 1 ? `Chair: ${r} choices.` : `Chair and secretary: ${m(P(r, 2))} (order matters).`],
      solution: [
        { tex: `Committee: ${m(`${C(n, r)} = ${nCr(n, r)}`)}.`, why: 'Members are unordered.' },
        { tex: `Roles: ${m(roles === 1 ? String(r) : `${P(r, 2)} = ${nPr(r, 2)}`)}.`, why: 'Distinct roles are ordered.' },
        { tex: m(`${nCr(n, r)} \\times ${nPr(r, roles)} = ${fmt(ans)}`) },
      ],
      verify: () => ans === (roles === 1 ? n * nCr(n - 1, r - 1) : n * (n - 1) * nCr(n - 2, r - 2)),
    };
  },
};

const mixedMc: Generator = {
  id: 'u6-mixed-mc',
  nodeId: 'PCBT3.mixed',
  title: 'Which expression counts it?',
  make(rng, tier): Draft {
    const c = rng.int(10, 21);
    const v = 5;
    const x = rng.int(2, 3);
    const y = 2;
    const right = `${C(c, x)} \\times ${C(v, y)} \\times ${x + y}!`;
    return {
      cognitive: 'conceptual',
      stem: `Which expression gives the number of ${x + y}-letter arrangements that use ${x} different consonants from ${c} and ${y} different vowels from ${v}?`,
      format: 'mc',
      choices: mc({ tex: m(right), key: 'ok' }, [
        { tex: m(`${C(c, x)} \\times ${C(v, y)}`), key: 'noarr', mis: 'perm-vs-comb', feedback: 'This chooses the letters but never arranges them.' },
        { tex: m(`${P(c, x)} \\times ${P(v, y)}`), key: 'pp', mis: 'perm-vs-comb', feedback: 'This orders consonants and vowels separately but never mixes their positions.' },
        { tex: m(`\\left(${C(c, x)} + ${C(v, y)}\\right) \\times ${x + y}!`), key: 'add', mis: 'fcp-add-multiply', feedback: 'Consonants and vowels are both chosen: multiply.' },
        { tex: m(`${C(c + v, x + y)} \\times ${x + y}!`), key: 'pool', mis: 'perm-case-overlap', feedback: 'This does not guarantee exactly ' + x + ' consonants.' },
      ]),
      hints: ['Choose the consonants and the vowels, then arrange all the chosen letters.', 'Choosing: combinations. Arranging: factorial.', tier > 1 ? 'Check that each option guarantees exactly the right mix.' : 'Multiply the stages.'],
      solution: [
        { tex: `Choose: ${m(`${C(c, x)} \\times ${C(v, y)}`)}.` },
        { tex: `Arrange the ${x + y} chosen letters: ${m(`${x + y}!`)}. Total ${m(right)}.`, why: 'Choosing fixes which letters; arranging fixes their order.' },
      ],
    };
  },
};

export const countingGenerators: Generator[] = [fcpSlots, fcpConstraint, fcpAndOr, factEval, factSimplify, factWrite, nprEval, nprOfficers, nprWords, permTogether, permApart, permEnds, repWord, repGrid, repStart, casesEven, casesOr, casesThree, solveNpr, solveNprMc, solveNpr3, ncrEval, ncrCommittee, ncrVsNpr, atLeastOne, atLeastK, atLeastCards, mixedChooseArrange, mixedRoles, mixedMc, solveNcr, solveNcrMc, solveNcrMixed];
