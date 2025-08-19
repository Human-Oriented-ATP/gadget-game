import { ConnectionLineComponentProps, Position } from "@xyflow/react";

// These constants are different between ConnectionLineComponent and CustomEdge
// since xyflow computes handle positions differently for these two components.
const SOURCE_CONNECTOR_NOTCH_OFFSET = -2;
const TARGET_CONNECTOR_NOTCH_OFFSET = -10;

export function ConnectionLineComponent(props: ConnectionLineComponentProps): React.JSX.Element {
    const startPointIsSource = props.fromPosition == Position.Right;
    const startPointOffset = startPointIsSource ? 
        SOURCE_CONNECTOR_NOTCH_OFFSET : TARGET_CONNECTOR_NOTCH_OFFSET;
    const startPointX = props.fromX + startPointOffset;
    // Uses a tension of 0.5 for an entirely symmetric curve
    const cx = (startPointX + props.toX) / 2;

    let endPointX = props.toX; 
    if (props.toHandle && props.connectionStatus === "valid") {
        endPointX += startPointIsSource ? 
            TARGET_CONNECTOR_NOTCH_OFFSET : SOURCE_CONNECTOR_NOTCH_OFFSET;
    }

    const pathData = (
        `M ${startPointX} ${props.fromY}
         C ${cx} ${props.fromY}
           ${cx} ${props.toY}
           ${endPointX} ${props.toY}`
    );

    return <g className='stroke-black'>
        <path d={pathData} strokeWidth="2px" fill="transparent"/>
    </g>;
}
