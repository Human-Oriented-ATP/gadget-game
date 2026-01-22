import { ConnectionLineComponentProps, Position } from "@xyflow/react";
import { isEqualityHandle } from "lib/game/Handles";
import { createEdgeCurve, CurveProps } from "lib/util/EdgeCurve";
import { EqualityPosition } from "lib/game/Primitives";

// These constants are different between ConnectionLineComponent and CustomEdge
// since xyflow computes handle positions differently for these two components.
const SOURCE_CONNECTOR_NOTCH_OFFSET = -2;
const TARGET_CONNECTOR_NOTCH_OFFSET = -10;
const EQUALITY_CONNECTOR_OFFSET = 7;

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
        startPos: {x: startPointX, y: props.fromY},
        endPos: {x: endPointX, y: props.toY},
        tensionDir: { type: "horizontal" }
    }
}

function equalityConnectionSVGData(props: ConnectionLineComponentProps): CurveProps {
    const adjustBasedOnPosition = (value: number, pos: Position) => {
        const isTop = pos == Position.Top;
        const offsetDir = isTop ? -1 : 1;
        return value + EQUALITY_CONNECTOR_OFFSET * offsetDir;
    };

    const positionToEquality = (pos: Position): EqualityPosition =>
        pos == Position.Top ? "top" : "bottom";

    const startPointY = adjustBasedOnPosition(props.fromY, props.fromPosition);

    let endPointY;
    let targetPosition: EqualityPosition | undefined;
    if (props.toHandle && props.connectionStatus === "valid") {
        endPointY = adjustBasedOnPosition(props.toY, props.toPosition);
        targetPosition = positionToEquality(props.toPosition);
    } else {
        endPointY = props.toY;
        targetPosition = undefined;
    }

    return {
        startPos: {x: props.fromX, y: startPointY},
        endPos: {x: props.toX, y: endPointY},
        tensionDir: {
            type: "vertical",
            sourcePosition: positionToEquality(props.fromPosition),
            targetPosition: targetPosition
        }
    }
}

export function ConnectionLineComponent(props: ConnectionLineComponentProps): React.JSX.Element {
    const curveProps = isEqualityHandle(props.fromHandle.id!) ? 
        equalityConnectionSVGData(props) : regularConnectionSVGData(props);
    const pathData = createEdgeCurve(curveProps);
        

    return <g className='stroke-black'>
        <path d={pathData} strokeWidth="2px" fill="transparent"/>
    </g>;
}
