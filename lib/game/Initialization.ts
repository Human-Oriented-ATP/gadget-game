import { GeneralConnection } from "./Connection";
import { FixedAxiom, GadgetId, GOAL_GADGET_ID } from "./Primitives";
import { Relation } from "./Term";
import { axiomToString, goalToString } from "./GameLogic";

export type Statement = { fixedAxiom: FixedAxiom } | { goal: Relation }

export interface ProblemFileData {
    goal: string
    axioms: string[]
}

export function isGoal(statement: Statement): statement is { goal: Relation } {
    return "goal" in statement
}

export function isAxiom(statement: Statement): statement is { fixedAxiom: FixedAxiom } {
    return "fixedAxiom" in statement
}

export function makeProblemFileDataFromStatements(statements: Statement[]): ProblemFileData {
    const goals = statements.filter(isGoal)
    if (goals.length !== 1) {
        throw new Error(`Expected exactly one goal, found ${goals.length}.`)
    }
    return {
        goal: goalToString(goals[0].goal),
        axioms: statements.filter(isAxiom).map(statement => axiomToString(statement.fixedAxiom))
    }
}

export type InitialDiagramGadget = {
    statement: string
    position: { x: number; y: number }
}

export interface InitialDiagram {
    gadgets: Map<GadgetId, InitialDiagramGadget>
    connections: GeneralConnection[]
}

export interface InitializationData {
    initialDiagram: InitialDiagram
    axioms: string[]
}

export function makeInitializationDataFromProblemFileData(problemFileData: ProblemFileData): InitializationData {
    const goalGadget: InitialDiagramGadget = {
        statement: problemFileData.goal,
        position: { x: 0, y: 0 }
    }
    const initialDiagram = {
        gadgets: new Map([[GOAL_GADGET_ID, goalGadget]]),
        connections: []
    }
    return {
        initialDiagram,
        axioms: problemFileData.axioms
    }
}