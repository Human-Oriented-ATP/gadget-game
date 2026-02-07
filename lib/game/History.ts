import { InitialDiagram } from "./Initialization";
import { GadgetId } from "./Primitives";
import { GeneralConnection } from "./Connection";

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

