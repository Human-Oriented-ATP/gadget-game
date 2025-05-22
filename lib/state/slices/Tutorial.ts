import { GadgetSelector, Trigger } from "components/tutorial/InteractiveLevel";
import { CreateStateWithInitialValue } from "../Types"
import { HistorySlice, historySlice, HistoryState, HistoryStateInitializedFromData } from "./History";
import { GadgetConnection } from "lib/game/History";
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
  triggersConnection: (connectionAdded: GadgetConnection,
    trigger: { from?: GadgetSelector, to?: [GadgetSelector, CellPosition] }) => boolean
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

    triggersConnection: (connection: GadgetConnection,
      trigger: { from?: GadgetSelector, to?: [GadgetSelector, CellPosition] }): boolean => {
      if (trigger.from) {
        if (!get().gadgetMatchesSelector(connection.from, trigger.from)) {
          return false
        }
      }
      if (trigger.to) {
        const [selector, position] = trigger.to
        if (!get().gadgetMatchesSelector(connection.to[0], selector)) {
          return false
        }
        if (position !== connection.to[1]) {
          return false
        }
      }
      return true
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
