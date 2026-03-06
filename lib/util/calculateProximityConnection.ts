import { Connection, ReactFlowInstance, XYPosition } from "@xyflow/react";
import { getCenter } from './XYPosition';
import { getGadgetIdFromHandle, isTargetHandle, isEqualityHandle, getPositionOfEqualityHandle } from "lib/game/Handles";

const MIN_DISTANCE = 60

function distance(a: XYPosition, b: XYPosition) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

export type HandlesWithPositions = Map<string, XYPosition>;

export function getPositionOfHandle(handleId: string, rf: ReactFlowInstance): XYPosition {
    const handle = document.querySelector(`[data-handleid="${handleId}"]`);
    if (handle) {
        const positionOnScreen = getCenter(handle.getBoundingClientRect());
        return rf.screenToFlowPosition(positionOnScreen);
    } else {
        throw Error("Trying to access handle which doesn't exist:" + handleId)
    }
}

function getEqualityHandles<T>(handles: Map<string, T>): Map<string, T> {
    return new Map([...handles].filter(([handle, position]) => isEqualityHandle(handle)))
}

function getSourceHandles<T>(handles: Map<string, T>): Map<string, T> {
    return new Map([...handles].filter(([handle, position]) => !isTargetHandle(handle) && !isEqualityHandle(handle)))
}

function getTargetHandles<T>(handles: Map<string, T>): Map<string, T> {
    return new Map([...handles].filter(([handle, position]) => isTargetHandle(handle) && !isEqualityHandle(handle)))
}

function findClosestHandle(position: XYPosition, otherHandles: HandlesWithPositions): { distance: number, id: string } {
    let closestHandle: { distance: number, id: string } = { distance: Infinity, id: "" }
    for (const [id, otherPosition] of otherHandles) {
        const dist = distance(position, otherPosition)
        if (dist < closestHandle.distance) {
            closestHandle = { distance: dist, id }
        }
    }
    return closestHandle
}

function findClosestEqualityHandle(position: XYPosition, otherHandles: HandlesWithPositions): { distance: number, id: string } {
    return findClosestHandle(position, getEqualityHandles(otherHandles))
}

function findClosestTargetHandle(position: XYPosition, otherHandles: HandlesWithPositions): { distance: number, id: string } {
    return findClosestHandle(position, getTargetHandles(otherHandles))
}

function findClosestSourceHandle(position: XYPosition, otherHandles: HandlesWithPositions): { distance: number, id: string } {
    return findClosestHandle(position, getSourceHandles(otherHandles))
}

function findProximityConnectionForHandle(handle: string, position: XYPosition, otherHandles: HandlesWithPositions) {
    if (isEqualityHandle(handle)) {
        const { distance, id } = findClosestEqualityHandle(position, otherHandles)
        return { distance, sourceHandle: handle, targetHandle: id }
    } else if (isTargetHandle(handle)) {
        const { distance, id } = findClosestSourceHandle(position, otherHandles)
        return { distance, targetHandle: handle, sourceHandle: id }
    } else {
        const { distance, id } = findClosestTargetHandle(position, otherHandles)
        return { distance, sourceHandle: handle, targetHandle: id }
    }
}

function calculateProximityConnectionHandles(handlesOfNodeBeingDragged: HandlesWithPositions, otherHandles: HandlesWithPositions)
    : { sourceHandle: string, targetHandle: string } | null {
    let shortestConnection: { distance: number, sourceHandle: string, targetHandle: string } = { distance: Infinity, sourceHandle: "", targetHandle: "" }
    for (const [handle, position] of handlesOfNodeBeingDragged) {
        const connection = findProximityConnectionForHandle(handle, position, otherHandles)

        let isBetter = connection.distance < shortestConnection.distance;

        // Break ties for parallel equality handles by favoring left handles if the dragged gadget is to the left
        const isTie = Math.abs(connection.distance - shortestConnection.distance) < 0.001;
        if (isTie && isEqualityHandle(handle) && isEqualityHandle(connection.targetHandle)) {
            const targetPos = otherHandles.get(connection.targetHandle);
            if (targetPos) {
                const draggedIsLeft = position.x < targetPos.x;
                const handleSide = getPositionOfEqualityHandle(handle);
                if ((draggedIsLeft && handleSide === "left") || (!draggedIsLeft && handleSide === "right")) {
                    isBetter = true;
                }
            }
        }

        if (isBetter) {
            shortestConnection = { ...connection }
        }
    }
    if (shortestConnection.distance < MIN_DISTANCE) {
        return { sourceHandle: shortestConnection.sourceHandle, targetHandle: shortestConnection.targetHandle }
    } else {
        return null
    }
}

export type ConnectionWithHandles = {
    source: string,
    target: string,
    sourceHandle: string,
    targetHandle: string
}

export function calculateProximityConnection(handlesOfNodeBeingDragged: HandlesWithPositions, otherHandles: HandlesWithPositions)
    : ConnectionWithHandles | null {
    const proximityConnectionHandles = calculateProximityConnectionHandles(handlesOfNodeBeingDragged, otherHandles)
    if (proximityConnectionHandles) {
        const source = getGadgetIdFromHandle(proximityConnectionHandles.sourceHandle)
        const target = getGadgetIdFromHandle(proximityConnectionHandles.targetHandle)
        return { source, target, ...proximityConnectionHandles }
    } else {
        return null
    }
}

