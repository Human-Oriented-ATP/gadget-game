import { Connection } from '@xyflow/react';
import { CellPosition, OUTPUT_POSITION } from "./CellPosition";
import { EqualityPosition, GadgetId } from "./Primitives";
import { getNodePositionFromHandle, getPositionOfEqualityHandle, isEqualityHandle, isTargetHandle } from './Handles';
import { Relation, Term } from './Term';
import { GeneralEquation } from './Unification';

export type GadgetConnection = { from: GadgetId, to: [GadgetId, CellPosition] }
export type EqualityConnection =
    { from: [GadgetId, EqualityPosition], to: [GadgetId, EqualityPosition] }

export type GeneralConnection =
    | { type: "gadget", connection: GadgetConnection }
    | { type: "equality", connection: EqualityConnection }

export function connectionsAreEqual(connection1: GeneralConnection, connection2: GeneralConnection): boolean {
    if (connection1.type !== connection2.type)
        return false;

    if (connection1.type === "gadget") {
        const gadget1 = connection1.connection;
        const gadget2 = connection2.connection as GadgetConnection;
        return gadget1.from === gadget2.from
            && gadget1.to[0] === gadget2.to[0]
            && gadget1.to[1] === gadget2.to[1];
    } else {
        const equality1 = connection1.connection;
        const equality2 = connection2.connection as EqualityConnection;
        return equality1.from[0] === equality2.from[0]
            && equality1.from[1] === equality2.from[1]
            && equality1.to[0] === equality2.to[0]
            && equality1.to[1] === equality2.to[1];
    }
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

export function toEqualityConnection(connection: Connection): EqualityConnection {
    if (!isValidConnection(connection)) throw Error(`Connection is not valid ${JSON.stringify(connection)}`)

    const sourcePosition = getPositionOfEqualityHandle(connection.sourceHandle);
    const targetPosition = getPositionOfEqualityHandle(connection.targetHandle);

    const firstID = [connection.source, sourcePosition] as [string, EqualityPosition];
    const secondID = [connection.target, targetPosition] as [string, EqualityPosition];
    // Sort so that connections in different directions are treated the same
    if (firstID < secondID) {
        return {from: firstID, to: secondID}
    } else {
        return {from: secondID, to: firstID}
    }
}

/** Both verify the connection is valid and convert it to GeneralConnection */
export function toGeneralConnection(connection: Connection): GeneralConnection | undefined {
    if (!isValidConnection(connection))
        return undefined;

    const sourceIsEquality = isEqualityHandle(connection.sourceHandle);
    const targetIsEquality = isEqualityHandle(connection.targetHandle);

    if (sourceIsEquality !== targetIsEquality)
        return undefined;

    if (sourceIsEquality) {
        const equalityConnection = toEqualityConnection(connection);
        return { type: 'equality', connection: equalityConnection };
    } else {
		// This must be checked as the connection mode is loose
        if (isTargetHandle(connection.sourceHandle) === isTargetHandle(connection.targetHandle))
            return undefined;

        const gadgetConnection = toGadgetConnection(connection);
        return { type: "gadget", connection: gadgetConnection };
    }
}

export function gadgetToGeneralConnection(connection: GadgetConnection): GeneralConnection {
    return {type: "gadget", connection};
}

export function getConnectionEndpoints(connection: GeneralConnection): [GadgetId, GadgetId] {
    if (connection.type === "equality")
        return [connection.connection.from[0], connection.connection.to[0]]
    if (connection.type === "gadget") 
        return [connection.connection.from, connection.connection.to[0]];
    throw Error(`Connection of unknown type: ${JSON.stringify(connection)}`);
}

export function connectionToEquation(
    connection: GeneralConnection,
    lhsRelations: Map<CellPosition, Relation>,
    rhsRelations: Map<CellPosition, Relation>
): GeneralEquation {
    const getPosition = (relations: Map<CellPosition, Relation>, pos: CellPosition) => {
        const rel = relations.get(pos);
        if (!rel) throw Error(`Missing relation at position ${pos} in `);
        return rel;
    };

    const getEqualityPosition = (relation: {equals: readonly [Term, Term]}, pos: EqualityPosition) => (
        relation.equals[pos === "top" ? 0 : 1]
    );

    if (connection.type === "equality") {
        const { from, to } = connection.connection;
        const lhs = getPosition(lhsRelations, OUTPUT_POSITION);
        const rhs = getPosition(rhsRelations, OUTPUT_POSITION);

        if (!("equals" in lhs && "equals" in rhs))
            throw Error("Equality connection not between equality relations");

        return {
            type: "term",
            equation: [getEqualityPosition(lhs, from[1]), getEqualityPosition(rhs, to[1])]
        };
    } else {
        const to = connection.connection.to;
        return {
            type: "relation",
            equation: [getPosition(lhsRelations, OUTPUT_POSITION), getPosition(rhsRelations, to[1])]
        };
    }
}