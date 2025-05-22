import { GetState, SetState } from '../Types';

export interface HoleFocusState {
  focussedHole: string | undefined
  showHoleFocus: boolean
}

export interface HoleFocusActions {
  reset: () => void
  focus: (term: string) => void
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
    focus: (variableName: string) => {
      if (get().showHoleFocus) {
        set({ focussedHole: variableName })
      } else {
        set({ focussedHole: undefined })
      }
    },
    removeFocus: () => set({ focussedHole: undefined })
  }
}