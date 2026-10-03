import type { Generator } from '../types';
import { basicsGenerators } from './u1/basics';
import { combinedGenerators } from './u1/combined';
import { inverseGenerators } from './u1/inverse';
import { opsGenerators } from './u1/ops';
import { preAlgebraGenerators } from './pre/algebra';
import { preQuadGenerators } from './pre/quadratics';
import { preFunctionGenerators } from './pre/functions';
import { preEquationGenerators } from './pre/equations';
import { preTrigGenerators } from './pre/trig';
import { divisionGenerators } from './u2/division';
import { graphGenerators } from './u2/graphs';
import { expLogGraphGenerators } from './u3/graphs';
import { expLogEquationGenerators } from './u3/equations';

export const GENERATORS: Generator[] = [...basicsGenerators, ...combinedGenerators, ...inverseGenerators, ...opsGenerators, ...preAlgebraGenerators, ...preQuadGenerators, ...preFunctionGenerators, ...preEquationGenerators, ...preTrigGenerators, ...divisionGenerators, ...graphGenerators, ...expLogGraphGenerators, ...expLogEquationGenerators];

export const generatorsFor = (nodeId: string) => GENERATORS.filter((g) => g.nodeId === nodeId);
export const generatorById = (id: string) => GENERATORS.find((g) => g.id === id);
