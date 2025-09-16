import { GadgetConnection } from "./History";
import { Axiom, GadgetId, GOAL_GADGET_ID } from "./Primitives";
import { Relation, makeTermWithFreshVariables } from "./Term";
import { Equation } from "./Unification";
import { parseStatement } from "../parsing/Semantics";
import { axiomToString, goalToString } from "./GameLogic";

export type Statement = { axiom: Axiom } | { goal: Relation }

export interface ProblemFileData {
    goal: string
    axioms: string[]
}

export function isGoal(statement: Statement): statement is { goal: Term } {
    return "goal" in statement
}

export function isAxiom(statement: Statement): statement is { axiom: Axiom } {
    return "axiom" in statement
}

export function makeProblemFileDataFromStatements(statements: Statement[]): ProblemFileData {
    const goals = statements.filter(isGoal)
    if (goals.length !== 1) {
        throw new Error(`Expected exactly one goal, found ${goals.length}.`)
    }
    return {
        goal: goalToString(goals[0].goal),
        axioms: statements.filter(isAxiom).map(statement => axiomToString(statement.axiom))
    }
}

export type InitialDiagramGadget = {
    statement: string
    position: { x: number; y: number }
}

export interface InitialDiagram {
    gadgets: Map<GadgetId, InitialDiagramGadget>
    connections: GadgetConnection[]
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

export function getEquationFromInitialConnection(connection: GadgetConnection, initialDiagram: InitialDiagram): Equation {
    try {
        const sourceGadget = initialDiagram.gadgets.get(connection.from)!
        const targetGadget = initialDiagram.gadgets.get(connection.to[0])!
        const sourceGadgetStatement: Statement = parseStatement(sourceGadget.statement)
        const targetGadgetStatement: Statement = parseStatement(targetGadget.statement)
        if (isGoal(sourceGadgetStatement)) {
            throw new Error("Invalid connection in initial diagram: goal gadget cannot be a source.")
        }
        const sourceTerm = sourceGadgetStatement.axiom.conclusion
        const targetTerm = isGoal(targetGadgetStatement) ? targetGadgetStatement.goal : targetGadgetStatement.axiom.hypotheses[connection.to[1]]
        return [makeTermWithFreshVariables(sourceTerm, connection.from!), makeTermWithFreshVariables(targetTerm, connection.to[0]!)]
    } catch (error) {
        throw new Error(`Invalid connection in initial diagram: possibly gadget ${connection.from} or ${connection.to} is missing in the diagram.`)
    }
}