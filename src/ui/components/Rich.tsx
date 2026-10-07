import katex from 'katex';
import { useMemo } from 'react';

type Seg = { t: 'text' | 'math' | 'display' | 'bold'; v: string };

function parse(src: string): Seg[] {
  const out: Seg[] = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$|\*\*([^*]+?)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m.index > last) out.push({ t: 'text', v: src.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ t: 'display', v: m[1] });
    else if (m[2] !== undefined) out.push({ t: 'math', v: m[2] });
    else out.push({ t: 'bold', v: m[3] });
    last = re.lastIndex;
  }
  if (last < src.length) out.push({ t: 'text', v: src.slice(last) });
  return out;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

/** Keep punctuation that follows inline math on the same line as the math. */
function render(segs: Seg[]): string {
  let html = '';
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    if (s.t === 'text') html += esc(s.v);
    else if (s.t === 'bold') html += `<strong>${render(parse(s.v))}</strong>`;
    else if (s.t === 'display') html += tex(s.v, true);
    else {
      const nxt = segs[i + 1];
      const punct = nxt?.t === 'text' ? /^[.,;:?!)]+/.exec(nxt.v)?.[0] : undefined;
      if (punct) {
        html += `<span class="whitespace-nowrap">${tex(s.v)}${esc(punct)}</span>`;
        segs[i + 1] = { t: 'text', v: nxt.v.slice(punct.length) };
      } else html += tex(s.v);
    }
  }
  return html;
}

export function tex(src: string, display = false): string {
  return katex.renderToString(src, { throwOnError: false, displayMode: display, strict: 'ignore' });
}

/** Text with $inline$, $$display$$ math and **bold**. */
export function Rich({ text, className }: { text: string; className?: string }) {
  const html = useMemo(() => render(parse(text)), [text]);
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function Tex({ src, display }: { src: string; display?: boolean }) {
  const html = useMemo(() => tex(src, display), [src, display]);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
