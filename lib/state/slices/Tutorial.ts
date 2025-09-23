import { GadgetSelector, Trigger, ConnectionSelector, GadgetConnectionSelector } from "components/tutorial/InteractiveLevel";
import { CreateStateWithInitialValue } from "../Types"
import { HistorySlice, historySlice, HistoryState, HistoryStateInitializedFromData } from "./History";
import { GeneralConnection } from "lib/game/Connection";
import { GameEvent } from "lib/game/History";
import { CellPosition } from "lib/game/CellPosition";

export type TutorialStateInitializedFromData = HistoryStateInitializedFromData

export type TutorialState = HistoryState & {
  tutorialStep: number
  displayAnimatedTutorialContent: boolean
}

export type TutorialActions = {
  reset: () => void
  triggers: (event: GameEvent, trigger: Trigger) => boolean
  gadgetMatchesSelector: (gadgetId: string, gadgetSelector: GadgetSelector) => boolean
  triggersGadgetAdded: (gadgetAdded: { gadgetId: string, axiom: string }, gadgetSelector: GadgetSelector) => boolean
  triggersGadgetRemoved: (gadgetId: string, trigger: GadgetSelector) => boolean
  triggersConnection: (connection: GeneralConnection, trigger: ConnectionSelector) => boolean
  getCurrentTrigger: () => Trigger | undefined
  advanceTutorial: (event: GameEvent) => void
  advanceTutorialWithEvents: (events: GameEvent[]) => void
  hideAnimatedTutorialContent: () => void
  showAnimatedTutorialContent: () => void
}

export type TutorialSlice = TutorialStateInitializedFromData & HistorySlice & TutorialState & TutorialActions

export const tutorialSlice: CreateStateWithInitialValue<TutorialStateInitializedFromData, TutorialSlice> = (initialState, set, get): TutorialSlice => {
  return {
    ...historySlice(initialState, set, get),
    tutorialStep: 0,
    displayAnimatedTutorialContent: false,

    reset: () => {
      historySlice(initialState, set, get).reset()
      set({
        tutorialStep: 0,
        displayAnimatedTutorialContent: false
      })
    },

    triggers: (event: GameEvent, trigger: Trigger): boolean => {
      if ("GameCompleted" in event && "GameCompleted" in trigger) {
        return true
      }
      if ("GadgetAdded" in event && "GadgetAdded" in trigger) {
        return get().triggersGadgetAdded(event.GadgetAdded, trigger.GadgetAdded);
      }
      if ("ConnectionAdded" in event && "ConnectionAdded" in trigger) {
        return get().triggersConnection(event.ConnectionAdded, trigger.ConnectionAdded);
      }
      if ("GadgetRemoved" in event && "GadgetRemoved" in trigger) {
        return get().triggersGadgetRemoved(event.GadgetRemoved.gadgetId, trigger.GadgetRemoved);
      }
      if ("ConnectionRemoved" in event && "ConnectionRemoved" in trigger) {
        return get().triggersConnection(event.ConnectionRemoved, trigger.ConnectionRemoved);
      }
      return false;
    },

    gadgetMatchesSelector(gadgetId: string, gadgetSelector: GadgetSelector): boolean {
      if (gadgetSelector === "ANY_GADGET") {
        return true
      } else if ("gadgetId" in gadgetSelector) {
        return gadgetId === gadgetSelector.gadgetId
      } else {
        const statement = get().getStatementOfGadget(gadgetId)
        return statement === gadgetSelector.axiom
      }
    },

    triggersGadgetAdded: (gadgetAdded: { gadgetId: string, axiom: string }, gadgetSelector: GadgetSelector): boolean => {
      if (gadgetSelector === "ANY_GADGET") {
        return true
      } else if ("gadgetId" in gadgetSelector) {
        return gadgetAdded.gadgetId === gadgetSelector.gadgetId
      } else {
        return gadgetAdded.axiom === gadgetSelector.axiom
      }
    },

    triggersGadgetRemoved: (gadgetId: string, trigger: GadgetSelector): boolean => {
      return get().gadgetMatchesSelector(gadgetId, trigger)
    },

    triggersConnection: (connection: GeneralConnection, trigger: ConnectionSelector): boolean => {
      if (trigger.type === undefined) return true;

      const matchesTuple = (actual: [string, any], expected: [GadgetSelector, any]) =>
        get().gadgetMatchesSelector(actual[0], expected[0]) && actual[1] === expected[1];

      const { from, to } = connection.connection;
      const triggerConn = trigger.connection as GadgetConnectionSelector;

      return (!triggerConn.from || get().gadgetMatchesSelector(from, triggerConn.from)) &&
              (!triggerConn.to || matchesTuple(to, triggerConn.to));
    },

    getCurrentTrigger: () => {
      const currentStep = get().setup.tutorialSteps[get().tutorialStep]
      return currentStep?.trigger
    },

    advanceTutorial: (event: GameEvent) => {
      const trigger = get().getCurrentTrigger()
      if (trigger) {
        if (get().triggers(event, trigger)) {
          set(state => ({ ...state, tutorialStep: state.tutorialStep + 1 }))
        }
      }
    },
    advanceTutorialWithEvents: (events: GameEvent[]) => {
      events.forEach(event => get().advanceTutorial(event))
    },

    hideAnimatedTutorialContent: () => {
      set({ displayAnimatedTutorialContent: false })
    },

    showAnimatedTutorialContent: () => {
      set({ displayAnimatedTutorialContent: true })
    }
  }
}
