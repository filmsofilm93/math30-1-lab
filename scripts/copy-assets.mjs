// Copy MathLive fonts into public/ so the math keyboard works offline.
import { cpSync, mkdirSync } from 'node:fs';
mkdirSync('public/mathlive', { recursive: true });
cpSync('node_modules/mathlive/fonts', 'public/mathlive/fonts', { recursive: true });
