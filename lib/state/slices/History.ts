import { CreateStateWithInitialValue } from "../Types"
import { GadgetId } from "lib/game/Primitives"
import { Equation } from "lib/game/Unification";
import { Term } from "lib/game/Term";
import { ValueMap } from "lib/util/ValueMap";
import { SetupReadonlyState, setupSlice } from "./Setup";
import { GadgetDndFromShelfSlice, gadgetDndFromShelfSlice, GadgetDndFromShelfState } from "./DragGadgetFromShelf";
import { synchronizeHistory } from "lib/study/synchronizeHistory";
import { GameHistory } from "lib/study/GameHistory";
import { GadgetConnection, GameEvent, getCurrentEquations, getCurrentHoleTerms, getEquationOfConnection, getEvents, getSomeGadgetWithAxiom, getStatementOfGadget } from "lib/game/History";

const HISTORY_UPLOAD_DELAY = 30 * 1000

export type HistoryStateInitializedFromData = SetupReadonlyState

export type HistoryState = GadgetDndFromShelfState & {
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
  getStatementOfGadget: (gadgetId: GadgetId) => string
  getSomeGadgetWithAxiom: (axiom: string) => GadgetId
  getCurrentHoleTerms: () => Term[]
  getEquationOfConnection: (connection: GadgetConnection) => Equation
  getCurrentEquations: () => ValueMap<GadgetConnection, Equation>
}

export type HistorySlice = SetupReadonlyState & GadgetDndFromShelfSlice & HistoryState & HistoryActions

export const historySlice: CreateStateWithInitialValue<HistoryStateInitializedFromData, HistorySlice> = (initialState, set, get): HistorySlice => {
  return {
    ...setupSlice(initialState),
    ...gadgetDndFromShelfSlice(set, get),
    log: [],
    timeoutId: undefined,
    startTime: new Date(),
    finalHistoryUploaded: false,

    reset: () => {
      gadgetDndFromShelfSlice(set, get).reset()
      set({
        ...initialState,
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

    getStatementOfGadget: (gadgetId: GadgetId) => {
      const initialDiagram = get().setup.initialDiagram
      const events = get().getEvents()
      return getStatementOfGadget(gadgetId, initialDiagram, events)
    },

    getSomeGadgetWithAxiom: (axiom: string) => {
      const initialDiagram = get().setup.initialDiagram
      const events = get().getEvents()
      return getSomeGadgetWithAxiom(axiom, initialDiagram, events)
    },

    getEquationOfConnection: (connection: GadgetConnection): Equation => {
      const initialDiagram = get().setup.initialDiagram
      const events = get().getEvents()
      return getEquationOfConnection(connection, initialDiagram, events)
    },

    getCurrentHoleTerms: () => {
      const initialDiagram = get().setup.initialDiagram
      const events = get().getEvents()
      return getCurrentHoleTerms(initialDiagram, events)
    },

    getCurrentEquations: () => {
      const initialDiagram = get().setup.initialDiagram
      const events = get().getEvents()
      return getCurrentEquations(initialDiagram, events)
    },

  }
}
