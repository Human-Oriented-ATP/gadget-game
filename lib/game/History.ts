import { ValueMap } from "lib/util/ValueMap";
import { CellPosition, OUTPUT_POSITION } from "./CellPosition";
import { getGadgetTerms, termToString } from "./GameLogic";
import { InitialDiagram } from "./Initialization";
import { GadgetId } from "./Primitives";
import { Equation } from "./Unification";

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

function getTermsOfGadget(gadgetId: GadgetId, initialDiagram: InitialDiagram, events: GameEvent[]) {
  const statement = getStatementOfGadget(gadgetId, initialDiagram, events)
  const terms = getGadgetTerms(statement, gadgetId)
  return terms
}

function getCurrentCellTerms(initialDiagram: InitialDiagram, events: GameEvent[]) {
  const gadgets = getCurrentGadgets(initialDiagram, events)
  const terms = gadgets.flatMap(gadgetId =>
    Array.from(getTermsOfGadget(gadgetId, initialDiagram, events).values()))
  return terms
}

export function getCurrentHoleTerms(initialDiagram: InitialDiagram, events: GameEvent[]) {
  const terms = getCurrentCellTerms(initialDiagram, events)
  const holeTerms = terms.flatMap((term => {
    if ("variable" in term) {
      throw Error(`Invalid term! A cell cannot have a single variable as a term: ${termToString(term)}`)
    } else {
      return term.args
    }
  }))
  return holeTerms
}

export function getEquationOfConnection(connection: GadgetConnection, initialDiagram: InitialDiagram, events: GameEvent[]): Equation {
  const lhsTerms = getTermsOfGadget(connection.from, initialDiagram, events)
  const rhsTerms = getTermsOfGadget(connection.to[0], initialDiagram, events)
  const lhs = lhsTerms.get(OUTPUT_POSITION)
  const rhs = rhsTerms.get(connection.to[1])
  if (lhs === undefined || rhs === undefined)
    throw Error(`Connection has undefined terms: \n${JSON.stringify(connection)}\nlhs: ${JSON.stringify(lhsTerms)}\nrhs: ${JSON.stringify(rhsTerms)}`)
  return [lhs!, rhs!]
}

export function getCurrentEquations(initialDiagram: InitialDiagram, events: GameEvent[]) {
  const connections = getCurrentConnections(initialDiagram, events)
  const connectionsWithEquations: Array<[GadgetConnection, Equation]> = connections.map((connection) =>
    [connection, getEquationOfConnection(connection, initialDiagram, events)])
  return new ValueMap(connectionsWithEquations)
}
