import { Relation } from "./Term"

export type EqualityPosition = "left" | "right"
export type SwapperPosition = "left" | "right"
export type GadgetId = string

export interface FixedAxiom {
    hypotheses: Relation[]
    conclusion: Relation
}
export const GOAL_GADGET_ID = "goal"
