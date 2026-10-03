// Print sample items for a generator prefix: npx tsx scripts/sample-items.ts pre-quad 2
import { makeItem } from '../src/engine/framework';
import { GENERATORS } from '../src/engine/generators';
import type { Tier } from '../src/engine/types';

const [prefix = '', n = '1'] = process.argv.slice(2);
for (const g of GENERATORS.filter((g) => g.id.startsWith(prefix))) {
  for (const tier of [1, 2, 3] as Tier[]) {
    for (let s = 0; s < Number(n); s++) {
      const it = makeItem(g, 1000 + s, tier);
      console.log(`\n## ${g.id} t${tier}: ${it.stem}`);
      if (it.choices) it.choices.forEach((c) => console.log(`   ${c.correct ? '*' : '-'} ${c.tex}${c.misconception ? `   [${c.misconception}]` : ''}`));
      if (it.fields) it.fields.forEach((f) => console.log(`   ${f.prefix ?? f.label ?? ''} ${f.answer.tex}`));
      it.solution.forEach((st, i) => console.log(`   ${i + 1}. ${st.tex}${st.why ? `  (why: ${st.why})` : ''}`));
    }
  }
}
