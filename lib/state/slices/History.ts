import { CreateStateWithInitialValue } from "../Types"
import { SetupReadonlyState } from "./Setup";
import { synchronizeHistory } from "lib/study/synchronizeHistory";
import { GameHistory } from "lib/study/GameHistory";
import { GameEvent, getEvents } from "lib/game/History";
import { handleQueriesSlice, HandleQueriesSlice } from "./HandleQueries";

const HISTORY_UPLOAD_DELAY = 30 * 1000

export type HistoryStateInitializedFromData = SetupReadonlyState

export type HistoryState = {
  log: [GameEvent, Date][]
  timeoutId: NodeJS.Timeout | undefined
  startTime: Date
  finalHistoryUploaded: boolean
}

export type HistoryActions = {
  reset: () => void;
  logEvents: (events: GameEvent[]) => void;
  makeHistoryObject: () => GameHistory | undefined;
  uploadHistory: () => void;
  uploadFinalHistory: () => void;
  uploadHistoryAsynchronously: () => void;
  getGadgetBeingAddedEvent: () => GameEvent[]
  getEvents(): GameEvent[]
}

export type HistorySlice = HandleQueriesSlice & HistoryStateInitializedFromData & HistoryState & HistoryActions

export const historySlice: CreateStateWithInitialValue<HistoryStateInitializedFromData, HistorySlice> = (initialState, set, get): HistorySlice => {
  return {
    ...handleQueriesSlice(initialState, set, get),
    log: [],
    timeoutId: undefined,
    startTime: new Date(),
    finalHistoryUploaded: false,

    reset: () => {
      handleQueriesSlice(initialState, set, get).reset()
      set({
        log: [],
        timeoutId: undefined,
        startTime: new Date(),
        finalHistoryUploaded: false
      })
    },

    logEvents: (events: GameEvent[]) => {
      const time = new Date()
      const eventsWithTime: [GameEvent, Date][] = events.map((event) => [event, time])
      const newLog = [...get().log, ...eventsWithTime]
      set({ log: newLog })
      get().updateLogicalStateWithEvents(events)
    },

    makeHistoryObject: () => {
      const { problemId, configurationIdentifier } = get().setup
      if (problemId === undefined || configurationIdentifier === undefined) return undefined
      const history: GameHistory | undefined = {
        problemId: problemId,
        configId: configurationIdentifier,
        startTime: get().startTime,
        completed: get().log.some(([event]) => "GameCompleted" in event),
        log: get().log
      }
      return history
    },

    uploadHistory: async () => {
      clearTimeout(get().timeoutId)
      set({ timeoutId: undefined })
      const history = get().makeHistoryObject()
      if (history !== undefined && history.log.length !== 0 && !get().finalHistoryUploaded) {
        console.log("uploading")
        synchronizeHistory(JSON.stringify(history))
      }
    },

    uploadFinalHistory: async () => {
      get().uploadHistory()
      set({ finalHistoryUploaded: true })
    },

    uploadHistoryAsynchronously: async () => {
      if (get().timeoutId === undefined) {
        const timeoutId = setTimeout(() => {
          get().uploadHistory()
        }, HISTORY_UPLOAD_DELAY)
        set({ timeoutId })
      }
    },

    getGadgetBeingAddedEvent() {
      const gadgetBeingAdded = get().gadgetBeingDraggedFromShelf
      if (gadgetBeingAdded === undefined) return []
      else return [{ GadgetAdded: { gadgetId: gadgetBeingAdded.id, axiom: gadgetBeingAdded.axiom } }]
    },

    getEvents: () => {
      const gadgetBeingAddedEvent = get().getGadgetBeingAddedEvent()
      return [...getEvents(get().log), ...gadgetBeingAddedEvent]
    },
  }
}
