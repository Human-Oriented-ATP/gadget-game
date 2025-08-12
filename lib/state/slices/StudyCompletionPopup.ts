import { GetState, SetState } from '../Types';

export interface StudyCompletionPopupState {
  studyCompletionPopupIsOpen: boolean
}

export interface StudyCompletionPopupActions {
  reset: () => void
  openStudyCompletionPopup: () => void
  closeStudyCompletionPopup: () => void
};

export type StudyCompletionPopupSlice = StudyCompletionPopupState & StudyCompletionPopupActions

export const studyCompletionPopupSlice = (set: SetState<StudyCompletionPopupSlice>): StudyCompletionPopupSlice => {
  return {
    studyCompletionPopupIsOpen: false,
    reset: () => {
      set({ studyCompletionPopupIsOpen: false })
    },
    openStudyCompletionPopup: () => {
      set({ studyCompletionPopupIsOpen: true })
    },
    closeStudyCompletionPopup: () => {
      set({ studyCompletionPopupIsOpen: false })
    }
  }
}