import curriculum from './curriculum.json';
import { U1_LESSONS } from './lessons/u1';
import { PRE_LESSONS } from './lessons/pre';
import { U2_LESSONS } from './lessons/u2';
import { U3_LESSONS } from './lessons/u3';
import { U4_LESSONS } from './lessons/u4';
import { U5_LESSONS } from './lessons/u5';
import { U6_LESSONS } from './lessons/u6';
import type { Lesson } from './lessons/types';

export type SkillNode = (typeof curriculum.nodes)[number];
export type Unit = (typeof curriculum.units)[number];

export const NODES = curriculum.nodes;
export const UNITS = curriculum.units;
export const NODE = new Map(NODES.map((n) => [n.id, n]));
export const MISCONCEPTION = new Map(curriculum.misconceptions.map((m) => [m.id, m.description]));
export const EXAM = curriculum.meta.exam;

const LESSONS = new Map<string, Lesson>([...PRE_LESSONS, ...U1_LESSONS, ...U2_LESSONS, ...U3_LESSONS, ...U4_LESSONS, ...U5_LESSONS, ...U6_LESSONS].map((l) => [l.nodeId, l]));
export const lessonFor = (nodeId: string) => LESSONS.get(nodeId);
export const hasContent = (nodeId: string) => LESSONS.has(nodeId);

/** Workbook section (McGraw-Hill Ryerson Pre-Calculus 12 numbering), e.g. "2.1". */
export const sectionOf = (n: SkillNode): string | undefined => (n as { section?: string }).section;
export const nodesInUnit = (unitId: string) => NODES.filter((n) => n.unit === unitId);
export const unitTitle = (unitId: string) => UNITS.find((u) => u.id === unitId)?.title ?? unitId;
