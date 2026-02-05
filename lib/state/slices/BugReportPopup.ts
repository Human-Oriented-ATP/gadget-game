import { GetState, SetState } from '../Types';

export interface BugReportPopupState {
  bugReportPopupIsOpen: boolean
}

export interface BugReportPopupActions {
  reset: () => void
  openBugReportPopup: () => void
  closeBugReportPopup: () => void
};

export type BugReportPopupSlice = BugReportPopupState & BugReportPopupActions

export const bugReportPopupSlice = (set: SetState<BugReportPopupSlice>): BugReportPopupSlice => {
  return {
    bugReportPopupIsOpen: false,
    reset: () => {
      set({ bugReportPopupIsOpen: false })
    },
    openBugReportPopup: () => {
      set({ bugReportPopupIsOpen: true })
    },
    closeBugReportPopup: () => {
      set({ bugReportPopupIsOpen: false })
    }
  }
}
