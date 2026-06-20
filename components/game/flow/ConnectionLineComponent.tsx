import { ConnectionLineComponentProps, Position } from "@xyflow/react";
import { isEqualityHandle, isSwapperHandle } from "lib/game/Handles";
import { createEdgeCurve, CurveProps } from "lib/util/EdgeCurve";
import { EqualityPosition } from "lib/game/Primitives";

// These constants are different between ConnectionLineComponent and CustomEdge
// since xyflow computes handle positions differently for these two components.
const SOURCE_CONNECTOR_NOTCH_OFFSET = -2;
const TARGET_CONNECTOR_NOTCH_OFFSET = -10;
const EQUALITY_CONNECTOR_OFFSET = 7;
const SWAPPER_HANDLE_OFFSET = -8;

// This function is specific to ConnectionLineComponent: see the 
// note on constants varying.
function adjustBasedOnPosition(value: number, pos: Position): number {
    const isLeft = pos == Position.Left;
    const offsetDir = isLeft ? -1 : 1;
    return value + EQUALITY_CONNECTOR_OFFSET * offsetDir;
}

export function positionToEquality(pos: Position): EqualityPosition {
    return pos == Position.Left ? "left" : "right";
}

function regularConnectionSVGData(props: ConnectionLineComponentProps): CurveProps {
    const startPointIsSource = props.fromPosition == Position.Right;
    const startPointOffset = startPointIsSource ?
        SOURCE_CONNECTOR_NOTCH_OFFSET : TARGET_CONNECTOR_NOTCH_OFFSET;
    const startPointX = props.fromX + startPointOffset;

    let endPointX = props.toX;
    if (props.toHandle && props.connectionStatus === "valid") {
        endPointX += startPointIsSource ?
            TARGET_CONNECTOR_NOTCH_OFFSET : SOURCE_CONNECTOR_NOTCH_OFFSET;
    }

    return {
        startPos: { x: startPointX, y: props.fromY },
        endPos: { x: endPointX, y: props.toY },
        tensionDir: { type: "cell" }
    }
}

function equalityConnectionSVGData(props: ConnectionLineComponentProps): CurveProps {
    const startPointX = adjustBasedOnPosition(props.fromX, props.fromPosition);

    let endPointX;
    let targetPosition: EqualityPosition | undefined;
    if (props.toHandle && props.connectionStatus === "valid") {
        endPointX = adjustBasedOnPosition(props.toX, props.toPosition);
        targetPosition = positionToEquality(props.toPosition);
    } else {
        endPointX = props.toX;
        targetPosition = undefined;
    }

    return {
        startPos: { x: startPointX, y: props.fromY },
        endPos: { x: endPointX, y: props.toY },
        tensionDir: {
            type: "equality",
            sourcePosition: positionToEquality(props.fromPosition),
            targetPosition: targetPosition
        }
    }
}

function swapperConnectionSVGData(props: ConnectionLineComponentProps): CurveProps {
    // Ensure equality handle is always startPos, swapper handle is always endPos
    const sourceIsEquality = isEqualityHandle(props.fromHandle.id!);

    let [equalityX, equalityY, equalityPos, swapperX, swapperY] = sourceIsEquality
        ? [props.fromX, props.fromY, props.fromPosition, props.toX, props.toY]
        : [props.toX, props.toY, props.toPosition, props.fromX, props.fromY];

    const shouldSnap = props.toHandle && props.connectionStatus === "valid";

    if (!sourceIsEquality || shouldSnap)
        swapperY += SWAPPER_HANDLE_OFFSET;

    if (sourceIsEquality || shouldSnap) {
        equalityX = adjustBasedOnPosition(equalityX, equalityPos);
    }

    const sourcePosition = shouldSnap ? positionToEquality(equalityPos) : undefined;

    return {
        startPos: { x: equalityX, y: equalityY },
        endPos: { x: swapperX, y: swapperY },
        tensionDir: {
            type: "mixed",
            sourcePosition,
        }
    };
}

export function ConnectionLineComponent(props: ConnectionLineComponentProps): React.JSX.Element {
    const sourceIsEquality = isEqualityHandle(props.fromHandle.id!);
    const swapperPresent = isSwapperHandle(props.fromHandle.id!)
        || (props.toHandle && isSwapperHandle(props.toHandle.id!));

    let curveProps: CurveProps;

    if (swapperPresent) {
        curveProps = swapperConnectionSVGData(props);
    } else if (sourceIsEquality) {
        curveProps = equalityConnectionSVGData(props);
    } else {
        curveProps = regularConnectionSVGData(props);
    }

    const pathData = createEdgeCurve(curveProps);

    return <g className='stroke-black'>
        <path d={pathData} strokeWidth="2px" fill="transparent" />
    </g>;
}
