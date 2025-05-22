import { GadgetConnection } from "lib/game/History";
import { CreateStateWithInitialValue } from "../Types";
import { unifyEquations } from "lib/game/Unification";
import { Assignment, Term } from "lib/game/Term";
import { ValueMap } from "lib/util/ValueMap";
import { TermEnumeration, updateEnumeration } from "lib/game/TermEnumeration";
import { Connection, Edge } from "@xyflow/react";
import { toGadgetConnection } from "./Edges";
import { TutorialSlice, tutorialSlice, TutorialStateInitializedFromData } from "./Tutorial";
import { DisjointSetWithAssignment } from "lib/util/DisjointSetWithAssignment";

export type UnificationStateInitializedFromData = TutorialStateInitializedFromData

export type UnificationState = {
  termEnumeration: TermEnumeration
  equationIsSatisfied: ValueMap<GadgetConnection, boolean>
  assignment: Assignment
}

export type UnificationActions = {
  reset: () => void
  runUnification: () => void
  edgeIsSatisfied: (edge: Edge) => boolean
}

export type UnificationSlice = TutorialSlice & UnificationState & UnificationActions

export const unificationSlice: CreateStateWithInitialValue<UnificationStateInitializedFromData, UnificationSlice> = (initialState, set, get): UnificationSlice => {
  return {
    ...tutorialSlice(initialState, set, get),
    termEnumeration: new ValueMap<Term, number>(),
    equationIsSatisfied: new ValueMap<GadgetConnection, boolean>(),
    assignment: new DisjointSetWithAssignment(),

    reset: () => {
      tutorialSlice(initialState, set, get).reset()
      set({
        termEnumeration: new ValueMap<Term, number>(),
        equationIsSatisfied: new ValueMap<GadgetConnection, boolean>(),
        assignment: new DisjointSetWithAssignment(),
      })
    },

    runUnification: () => {
      const equations = get().getCurrentEquations()
      const { assignment, equationIsSatisfied } = unifyEquations<GadgetConnection>(equations)
      const newTermEnumeration = updateEnumeration(get().termEnumeration, get().getCurrentHoleTerms(), assignment)
      set({ equationIsSatisfied: equationIsSatisfied, assignment, termEnumeration: newTermEnumeration })
    },

    edgeIsSatisfied: (edge: Edge) => {
      const gadgetConnection = toGadgetConnection(edge as Connection)
      const isSatisfied = get().equationIsSatisfied.get(gadgetConnection)
      if (isSatisfied === undefined) throw Error(`Edge is not in the equationIsSatisfied map ${JSON.stringify(edge)}`)
      return isSatisfied
    },
  }
}