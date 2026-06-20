import { CellPosition, OUTPUT_POSITION } from 'lib/game/CellPosition';
import { EqualityPosition, SwapperPosition } from './Primitives';
import { HolePosition } from './GadgetInternalConnections';

export function makeHandleId(position: CellPosition, gadgetId: string): string {
    return `handle_${JSON.stringify(position)}_of_${gadgetId}`;
}

export function makeEqualityHandleId(gadgetId: string, equalityPosition: EqualityPosition): string {
    return `equalityhandle_${equalityPosition}_of_${gadgetId}`;
}

export function makeSwapperHandleId(gadgetId: string, holeIndex: number, bindingHole: SwapperPosition): string {
    return `swapperhandle_${holeIndex}_${bindingHole}_of_${gadgetId}`;
}

export function isTargetHandle(handleId: string): boolean {
    const outputHandleStart =  `handle_${OUTPUT_POSITION}_`
    return handleId.startsWith("handle") && !handleId.startsWith(outputHandleStart);
}

export function isGadgetHandle(handleId: string): boolean {
    return handleId.slice(0, 6) === `handle`;
}

export function isEqualityHandle(handleId: string): boolean {
    return handleId.slice(0, 14) === `equalityhandle`;
}

export function isSwapperHandle(handleId: string): boolean {
    return handleId.slice(0, 13) === `swapperhandle`;
}

export function getHandleType(handleId: string): "gadget" | "equality" | "swapper" {
    if (isGadgetHandle(handleId)) return "gadget";
    if (isEqualityHandle(handleId)) return "equality";
    if (isSwapperHandle(handleId)) return "swapper";
    throw Error(`Couldn't determine type of handle ${handleId}`);
}


export function getPositionOfEqualityHandle(handleId: string): EqualityPosition {
    const res = handleId.split("_")[1];
    if (res !== "left" && res !== "right")
        throw Error(`Bad equality handle: ${handleId}`);
    return res;
}

export function getPositionOfSwapperHandle(handleId: string): HolePosition {
    const holeIndex = Number(handleId.split("_")[1]);
    const nodePosition = handleId.split("_")[2] === "left" ?
        0 : "output";
    return [nodePosition, holeIndex];
}

export function getGadgetIdFromHandle(handleId: string): string {
    return handleId.split("_of_")[1];
}

export function getNodePositionFromHandle(handleId: string): CellPosition {
    const position = handleId.split("_")[1];
    return JSON.parse(position);
}
