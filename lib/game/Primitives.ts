import { Relation } from "./Term"

export type EqualityPosition = "bottom" | "top"
export type GadgetId = string

export interface Axiom {
    hypotheses: Relation[]
    conclusion: Relation
}
export const GOAL_GADGET_ID = "goal"
