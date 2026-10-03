import { MathfieldElement } from 'mathlive';
import { useEffect, useRef } from 'react';

let configured = false;
function configure() {
  if (configured) return;
  configured = true;
  MathfieldElement.fontsDirectory = `${import.meta.env.BASE_URL}mathlive/fonts`;
  MathfieldElement.soundsDirectory = null;
}

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<MathfieldElement>, MathfieldElement>;
    }
  }
}

export function MathField({ value, onChange, onEnter, disabled, label, autoFocus }: { value: string; onChange: (v: string) => void; onEnter?: () => void; disabled?: boolean; label: string; autoFocus?: boolean }) {
  configure();
  const ref = useRef<MathfieldElement>(null);
  const cb = useRef({ onChange, onEnter });
  cb.current = { onChange, onEnter };

  useEffect(() => {
    const mf = ref.current;
    if (!mf) return;
    mf.smartFence = true;
    mf.mathVirtualKeyboardPolicy = 'auto';
    mf.setAttribute('aria-label', label);
    const onInput = (e: Event) => {
      const ie = e as InputEvent;
      if (ie.inputType === 'insertLineBreak') {
        cb.current.onEnter?.();
        return;
      }
      cb.current.onChange(mf.value);
    };
    mf.addEventListener('input', onInput);
    if (autoFocus) setTimeout(() => mf.focus(), 50);
    return () => mf.removeEventListener('input', onInput);
  }, [label, autoFocus]);

  useEffect(() => {
    const mf = ref.current;
    if (mf && mf.value !== value) mf.value = value;
  }, [value]);

  useEffect(() => {
    if (ref.current) ref.current.disabled = !!disabled;
  }, [disabled]);

  return <math-field ref={ref} />;
}
