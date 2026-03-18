import { LevelConfiguration, InteractiveStep } from 'components/tutorial/InteractiveLevel';
import { InitialDiagram } from 'lib/game/Initialization';

export type ReadonlyGameSetup = {
  initialDiagram: InitialDiagram;
  axioms: string[];
  settings: LevelConfiguration;
  tutorialSteps: InteractiveStep[];
  destinationIfSolvedHref: string;
  problemId?: string;
  configurationIdentifier?: string;
};

export type SetupReadonlyState = {
  setup: ReadonlyGameSetup
}

export const setupSlice = (initialState: SetupReadonlyState) => {
  return {
    ...initialState,
  }
}