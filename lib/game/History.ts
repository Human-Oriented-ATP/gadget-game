import { ValueMap } from "lib/util/ValueMap";
import { CellPosition, OUTPUT_POSITION } from "./CellPosition";
import { getGadgetRelations } from "./GameLogic";
import { InitialDiagram } from "./Initialization";
import { EqualityPosition, GadgetId } from "./Primitives";
import { GeneralEquation } from "./Unification";
import { getRelationArgs } from "./Term";
import { GeneralConnection, connectionsAreEqual } from "./Connection";
import { connection } from "next/server";

export type GameEvent = { GameCompleted: null }
    | { GadgetAdded: { gadgetId: GadgetId, axiom: string } }
    | { ConnectionAdded: GeneralConnection }
    | { GadgetRemoved: { gadgetId: GadgetId } }
    | { ConnectionRemoved: GeneralConnection };

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
    return events.filter((event): event is { ConnectionAdded: GeneralConnection } | { ConnectionRemoved: GeneralConnection } =>
        "ConnectionAdded" in event || "ConnectionRemoved" in event)
}

function getCurrentConnections(initialDiagram: InitialDiagram, events: GameEvent[]) {
    let connections: GeneralConnection[] = [...initialDiagram.connections]
    const connectionEvents = getConnectionEvents(events)
    for (const event of connectionEvents) {
        if ("ConnectionAdded" in event) {
            connections.push(event.ConnectionAdded)
        } else {
            const index = connections.findIndex((connection) => connectionsAreEqual(connection, event.ConnectionRemoved))
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
    return relations.flatMap(relation => getRelationArgs(relation))
}

export function getEquationOfConnection(generalConnection: GeneralConnection, initialDiagram: InitialDiagram, events: GameEvent[]): GeneralEquation {
    if (generalConnection.type === "equality") {
        const getPosition = (v: [string, EqualityPosition]) => v[1] === "top" ? 0 : 1;

        const connection = generalConnection.connection;
        const lhsRelations = getRelationsOfGadget(connection.from[0], initialDiagram, events)
        const rhsRelations = getRelationsOfGadget(connection.to[0], initialDiagram, events)
        const lhsRelation = lhsRelations.get(OUTPUT_POSITION);
        const rhsRelation = rhsRelations.get(OUTPUT_POSITION);
        if (lhsRelation === undefined || rhsRelation === undefined)
            throw Error(`Connection has undefined relations: \n${JSON.stringify(connection)}\nlhs: ${JSON.stringify(lhsRelations)}\nrhs: ${JSON.stringify(rhsRelations)}`)
        if (!("equals" in lhsRelation && "equals" in rhsRelation))
            throw Error("Equality connection not between equality relations: "
                        + `\n${JSON.stringify(connection)}\nlhs: ${JSON.stringify(lhsRelation)}\nrhs: ${JSON.stringify(rhsRelation)}`);
        
        const lhs = lhsRelation.equals[getPosition(connection.from)];
        const rhs = rhsRelation.equals[getPosition(connection.to)];
        return {type: "term", equation: [lhs, rhs]}
    } else {
        const connection = generalConnection.connection;
        const lhsRelations = getRelationsOfGadget(connection.from, initialDiagram, events)
        const rhsRelations = getRelationsOfGadget(connection.to[0], initialDiagram, events)
        const lhs = lhsRelations.get(OUTPUT_POSITION)
        const rhs = rhsRelations.get(connection.to[1])
        if (lhs === undefined || rhs === undefined)
            throw Error(`Connection has undefined relations: \n${JSON.stringify(connection)}\nlhs: ${JSON.stringify(lhsRelations)}\nrhs: ${JSON.stringify(rhsRelations)}`)
        return {type: "relation", equation: [lhs!, rhs!]}
    }
}

export function getCurrentEquations(initialDiagram: InitialDiagram, events: GameEvent[]) {
    const connections = getCurrentConnections(initialDiagram, events)
    const connectionsWithEquations: Array<[GeneralConnection, GeneralEquation]> = connections.map((connection) =>
        [connection, getEquationOfConnection(connection, initialDiagram, events)])
    return new ValueMap(connectionsWithEquations)
}
