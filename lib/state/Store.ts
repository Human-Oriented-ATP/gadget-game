import { createStore } from 'zustand'
import { FlowSlice, flowSlice, FlowStateInitializedFromData } from './slices/Flow'
import { HelpPopupSlice, helpPopupSlice } from './slices/HelpPopup'
import { devtools } from 'zustand/middleware'
import { StudyCompletionPopupSlice, studyCompletionPopupSlice } from './slices/StudyCompletionPopup'
import { BugReportPopupSlice, bugReportPopupSlice } from './slices/BugReportPopup'

export type GameStateInitializedFromData = FlowStateInitializedFromData
export type GameSlice = FlowSlice & HelpPopupSlice & StudyCompletionPopupSlice & BugReportPopupSlice & {
  reset: () => void
}

export type GameStore = ReturnType<typeof createGameStore>

export const createGameStore = (initialState: GameStateInitializedFromData) => {
  return createStore<GameSlice>()(devtools((set, get) => ({
    ...initialState,
    ...flowSlice(initialState, set, get),
    ...helpPopupSlice(set),
    ...studyCompletionPopupSlice(set),
    ...bugReportPopupSlice(set),
    reset: () => {
      flowSlice(initialState, set, get).reset()
      helpPopupSlice(set).reset()
      studyCompletionPopupSlice(set).reset()
      bugReportPopupSlice(set).reset()
    }
  })))
}
