import { CellPosition, OUTPUT_POSITION } from 'lib/game/CellPosition';
import { Relation } from './Term';
import { EqualityPosition } from './Primitives';

export function makeHandleId(position: CellPosition, gadgetId: string): string {
    return `handle_${JSON.stringify(position)}_of_${gadgetId}`;
}

export function makeEqualityHandleId(gadgetId: string, equalityPosition: EqualityPosition): string {
    return `equalityhandle_${equalityPosition}_of_${gadgetId}`;
}

export function isTargetHandle(handleId: string): boolean {
    return handleId.slice(0, 10) !== `handle_${OUTPUT_POSITION}_`;
}

export function isEqualityHandle(handleId: string): boolean {
    return handleId.slice(0, 14) === `equalityhandle`;
}

export function getPositionOfEqualityHandle(handleId: string): EqualityPosition {
    const res = handleId.split("_")[1];
    if (res !== "top" && res !== "bottom")
        throw  Error(`Bad equality handle: ${handleId}`);
    return res;
}

export function getRelationOfHandle(handleId: string, relations: Map<CellPosition, Relation>) {
    const position = handleId.split("_")[1];
    for (const [relationPosition, relation] of relations) {
        if (JSON.stringify(relationPosition) === position) {
            return relation;
        }
    }
    throw Error("Relation not found for handle " + handleId);
}

export function getGadgetIdFromHandle(handleId: string): string {
    return handleId.split("_of_")[1];
}

export function getNodePositionFromHandle(handleId: string): CellPosition {
    const position = handleId.split("_")[1];
    return JSON.parse(position);
}