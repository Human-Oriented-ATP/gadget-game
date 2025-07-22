import { XYPosition } from "@xyflow/react";
import { pointToString, addOffsetX } from 'lib/util/XYPosition';

const CONTROL_POINT_OFFSET = 30;
const CONTROL_POINT_VARIABLE_OFFSET = 10;

export interface ConnectionDrawingData {
    start: XYPosition
    end: XYPosition
    fromInput: boolean
    toOutput: boolean
}

export interface ConnectionSvgProps {
    connections: ConnectionDrawingData[];
}

export function ConnectionPath(props: ConnectionDrawingData, index: number,
    fixedOffset = CONTROL_POINT_OFFSET): React.JSX.Element {
    const svg_start_sequence = "M " + pointToString(props.start);
    let offset_start = props.fromInput
        ? fixedOffset
        : -fixedOffset;
    let offset_start_modified = offset_start + index * CONTROL_POINT_VARIABLE_OFFSET
    let controlPoint1 = addOffsetX(props.start, offset_start_modified);
    let offset_end = props.toOutput
        ? -fixedOffset
        : fixedOffset;
    let controlPoint2 = addOffsetX(props.end, offset_end);
    const svg_curve =
        "C " +
        pointToString(controlPoint1) +
        ", " +
        pointToString(controlPoint2) +
        ", " +
        pointToString(props.end);

    const path_command = svg_start_sequence + " " + svg_curve;

    return <path key={index}
        d={path_command}
        strokeWidth="2px"
        fill="transparent"
    />
}

export function ConnectionSvg({ ...props }: ConnectionSvgProps) {
    return <svg className="absolute top-0 left-0 w-full h-full z-5 pointer-events-none stroke-black">
        {props.connections.map((connection, index) => ConnectionPath(connection, index))}
    </svg>;
}
