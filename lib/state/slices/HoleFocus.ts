import { Term } from 'lib/game/Term';
import { GetState, SetState } from '../Types';

export interface HoleFocusState {
  focussedHole: Term | undefined
  showHoleFocus: boolean
}

export interface HoleFocusActions {
  reset: () => void
  focus: (term: Term) => void
  removeFocus: () => void
};

export type HoleFocusSlice = HoleFocusState & HoleFocusActions

export const holeFocusSlice = (set: SetState<HoleFocusSlice>, get: GetState<HoleFocusSlice>): HoleFocusSlice => {
  return {
    focussedHole: undefined,
    showHoleFocus: true,
    reset: () => {
      set({ focussedHole: undefined, showHoleFocus: true })
    },
    focus: (term: Term) => {
      if (get().showHoleFocus) {
        set({ focussedHole: term })
      } else {
        set({ focussedHole: undefined })
      }
    },
    removeFocus: () => set({ focussedHole: undefined })
  }
}