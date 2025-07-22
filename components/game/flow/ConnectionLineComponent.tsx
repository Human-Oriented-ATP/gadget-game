import { ConnectionLineComponentProps } from "@xyflow/react";
import { ConnectionDrawingData, ConnectionPath } from "../gadget/ConnectionSvg";

export function ConnectionLineComponent(props: ConnectionLineComponentProps): React.JSX.Element {
    const data: ConnectionDrawingData = {
        start: { x: props.fromX, y: props.fromY },
        end: { x: props.toX, y: props.toY },
        fromInput: true,
        toOutput: true
    };

    return <g className='stroke-black'>
        {ConnectionPath(data, 0, 20)}
    </g>;
}
