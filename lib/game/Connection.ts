import { Connection } from '@xyflow/react';
import { CellPosition, OUTPUT_POSITION } from "./CellPosition";
import { GadgetId } from "./Primitives";
import { getNodePositionFromHandle, isTargetHandle } from './Handles';

export type GadgetConnection = { from: GadgetId, to: [GadgetId, CellPosition] }

export type GeneralConnection =
    | { type: "gadget", connection: GadgetConnection }

export function connectionsAreEqual(connection1: GeneralConnection, connection2: GeneralConnection): boolean {
    if (connection1.type !== connection2.type)
        return false;

    const gadget1 = connection1.connection;
    const gadget2 = connection2.connection as GadgetConnection;
    return gadget1.from === gadget2.from
        && gadget1.to[0] === gadget2.to[0]
        && gadget1.to[1] === gadget2.to[1];
}

export function isValidConnection(connection: Connection): connection is { source: string, target: string, sourceHandle: string; targetHandle: string } {
    return connection.sourceHandle !== null && connection.targetHandle !== null;
}

export function toGadgetConnection(connection: Connection): GadgetConnection {
    if (!isValidConnection(connection)) throw Error(`Connection is not valid ${JSON.stringify(connection)}`)
    const sourcePosition = getNodePositionFromHandle(connection.sourceHandle)
    const targetPosition = getNodePositionFromHandle(connection.targetHandle)
    if (sourcePosition === OUTPUT_POSITION) {
        return {
            from: connection.source,
            to: [connection.target, targetPosition]
        }
    } else {
        return {
            from: connection.target,
            to: [connection.source, sourcePosition]
        }
    }
}

/** Both verify the connection is valid and convert it to GeneralConnection */
export function toGeneralConnection(connection: Connection): GeneralConnection | undefined {
    if (!isValidConnection(connection))
        return undefined;


    // This must be checked as the connection mode is loose
    if (isTargetHandle(connection.sourceHandle) === isTargetHandle(connection.targetHandle))
        return undefined;

    const gadgetConnection = toGadgetConnection(connection);
    return { type: "gadget", connection: gadgetConnection };
}

export function gadgetToGeneralConnection(connection: GadgetConnection): GeneralConnection {
    return {type: "gadget", connection};
}