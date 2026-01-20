import { ConnectionLineComponentProps, Position } from "@xyflow/react";
import { createEdgeCurve, CurveProps } from "lib/util/EdgeCurve";

// These constants are different between ConnectionLineComponent and CustomEdge
// since xyflow computes handle positions differently for these two components.
const SOURCE_CONNECTOR_NOTCH_OFFSET = -2;
const TARGET_CONNECTOR_NOTCH_OFFSET = -10;

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

export function ConnectionLineComponent(props: ConnectionLineComponentProps): React.JSX.Element {
    const curveProps = regularConnectionSVGData(props);
    const pathData = createEdgeCurve(curveProps);
        

    return <g className='stroke-black'>
        <path d={pathData} strokeWidth="2px" fill="transparent"/>
    </g>;
}
