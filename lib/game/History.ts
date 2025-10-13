import { ValueMap } from "lib/util/ValueMap";
import { CellPosition, OUTPUT_POSITION } from "./CellPosition";
import { getGadgetRelations } from "./GameLogic";
import { InitialDiagram } from "./Initialization";
import { GadgetId } from "./Primitives";
import { RelationEquation } from "./Unification";

export type GadgetConnection = { from: GadgetId, to: [GadgetId, CellPosition] }

function isEqualConnection(connection1: GadgetConnection, connection2: GadgetConnection) {
    return connection1.from === connection2.from
        && connection1.to[0] === connection2.to[0]
        && connection1.to[1] === connection2.to[1]
}

export type GameEvent = { GameCompleted: null }
    | { GadgetAdded: { gadgetId: GadgetId, axiom: string } }
    | { ConnectionAdded: GadgetConnection }
    | { GadgetRemoved: { gadgetId: GadgetId } }
    | { ConnectionRemoved: GadgetConnection };

export type Log = [GameEvent, Date][]


export function getEvents(log: Log): GameEvent[] {
    return log.map(([event, date]) => event)
}

function getAddedGadgets(events: GameEvent[]) {
    return events.filter((event): event is { GadgetAdded: { gadgetId: GadgetId, axiom: string } } => "GadgetAdded" in event)
        .map((event) => event.GadgetAdded.gadgetId)
}

function getRemovedGadgets(events: GameEvent[]) {
    return events.filter((event): event is { GadgetRemoved: { gadgetId: GadgetId } } => "GadgetRemoved" in event)
        .map((event) => event.GadgetRemoved.gadgetId)
}

function getCurrentGadgets(initialDiagram: InitialDiagram, events: GameEvent[]) {
    const initialGadgets = Array.from(initialDiagram.gadgets.keys())
    const addedGadgets = getAddedGadgets(events)
    const removedGadgets = getRemovedGadgets(events)
    return [...initialGadgets, ...addedGadgets].filter((gadgetId) => !removedGadgets.includes(gadgetId))
}

function getConnectionEvents(events: GameEvent[]) {
    return events.filter((event): event is { ConnectionAdded: GadgetConnection } | { ConnectionRemoved: GadgetConnection } =>
        "ConnectionAdded" in event || "ConnectionRemoved" in event)
}

function getCurrentConnections(initialDiagram: InitialDiagram, events: GameEvent[]) {
    let connections: GadgetConnection[] = [...initialDiagram.connections]
    const connectionEvents = getConnectionEvents(events)
    for (const event of connectionEvents) {
        if ("ConnectionAdded" in event) {
            connections.push(event.ConnectionAdded)
        } else {
            const index = connections.findIndex((connection) => isEqualConnection(connection, event.ConnectionRemoved))
            if (index === -1) throw Error(`Invalid history log: Connection that is to be removed has not been added before 
                        ${JSON.stringify(event.ConnectionRemoved)}`)
            connections.splice(index, 1)
        }
    }
    return connections
}

function getStatementOfInitialGadget(initialDiagram: InitialDiagram, gadgetId: GadgetId) {
    const statement = initialDiagram.gadgets.get(gadgetId)?.statement
    if (statement === undefined)
        return undefined
    return statement
}

function getAxiomOfGadgetInEvents(gadgetId: GadgetId, events: GameEvent[]) {
    const event = events.find((event) => "GadgetAdded" in event && event.GadgetAdded.gadgetId === gadgetId)
    if (event === undefined) throw Error(`Gadget with id ${gadgetId} not found`)
    if (!("GadgetAdded"! in event)) throw Error(`Something very weird happened`)
    return event.GadgetAdded.axiom
}

export function getStatementOfGadget(gadgetId: GadgetId, initialDiagram: InitialDiagram, events: GameEvent[]) {
    const statement = getStatementOfInitialGadget(initialDiagram, gadgetId) ?? getAxiomOfGadgetInEvents(gadgetId, events);
    return statement
}

export function getSomeGadgetWithAxiom(axiom: string, initialDiagram: InitialDiagram, events: GameEvent[]) {
    const currentGadgets = getCurrentGadgets(initialDiagram, events)
    for (const gadget of currentGadgets) {
        const statement = getStatementOfGadget(gadget, initialDiagram, events)
        if (statement === axiom)
            return gadget
    }
    throw Error(`No gadget with axiom ${axiom} found`)
}

function getRelationsOfGadget(gadgetId: GadgetId, initialDiagram: InitialDiagram, events: GameEvent[]) {
    const statement = getStatementOfGadget(gadgetId, initialDiagram, events)
    const relations = getGadgetRelations(statement, gadgetId)
    return relations
}

function getCurrentCellRelations(initialDiagram: InitialDiagram, events: GameEvent[]) {
    const gadgets = getCurrentGadgets(initialDiagram, events)
    const relations = gadgets.flatMap(gadgetId =>
        Array.from(getRelationsOfGadget(gadgetId, initialDiagram, events).values()))
    return relations
}

export function getCurrentHoleTerms(initialDiagram: InitialDiagram, events: GameEvent[]) {
    const relations = getCurrentCellRelations(initialDiagram, events)
    return relations.flatMap(term => term.args)
}

export function getEquationOfConnection(connection: GadgetConnection, initialDiagram: InitialDiagram, events: GameEvent[]): RelationEquation {
    const lhsRelations = getRelationsOfGadget(connection.from, initialDiagram, events)
    const rhsRelations = getRelationsOfGadget(connection.to[0], initialDiagram, events)
    const lhs = lhsRelations.get(OUTPUT_POSITION)
    const rhs = rhsRelations.get(connection.to[1])
    if (lhs === undefined || rhs === undefined)
        throw Error(`Connection has undefined relations: \n${JSON.stringify(connection)}\nlhs: ${JSON.stringify(lhsRelations)}\nrhs: ${JSON.stringify(rhsRelations)}`)
    return [lhs!, rhs!]
}

export function getCurrentEquations(initialDiagram: InitialDiagram, events: GameEvent[]) {
    const connections = getCurrentConnections(initialDiagram, events)
    const connectionsWithEquations: Array<[GadgetConnection, RelationEquation]> = connections.map((connection) =>
        [connection, getEquationOfConnection(connection, initialDiagram, events)])
    return new ValueMap(connectionsWithEquations)
}
