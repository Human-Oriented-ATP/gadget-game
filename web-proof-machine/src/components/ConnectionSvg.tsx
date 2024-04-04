import { Point, pointToString, addOffsetX } from "../util/Point";

const CONTROL_POINT_OFFSET = 40;
const CONTROL_POINT_VARIABLE_OFFSET = 0;

export interface ConnectionDrawingData {
    start: Point
    end: Point
    fromInput: boolean
    toOutput: boolean
}

export interface ConnectionSvgProps {
    connections: ConnectionDrawingData[];
}

export function connectionPath(props: ConnectionDrawingData, offsetMultiplier: number): JSX.Element {
    const svg_start_sequence = "M " + pointToString(props.start);
    let offset_start = props.fromInput
        ? CONTROL_POINT_OFFSET
        : -CONTROL_POINT_OFFSET;
    let offset_start_modified = offset_start + offsetMultiplier * CONTROL_POINT_VARIABLE_OFFSET
    let controlPoint1 = addOffsetX(props.start, offset_start_modified);
    let offset_end = props.toOutput
        ? -CONTROL_POINT_OFFSET
        : CONTROL_POINT_OFFSET;
    let controlPoint2 = addOffsetX(props.end, offset_end);
    const svg_curve =
        "C " +
        pointToString(controlPoint1) +
        ", " +
        pointToString(controlPoint2) +
        ", " +
        pointToString(props.end);

    const path_command = svg_start_sequence + " " + svg_curve;

    return (
        <path
            d={path_command}
            stroke="black"
            strokeWidth="2px"
            fill="transparent"
        />
    );
}

export function ConnectionSvg({ ...props }: ConnectionSvgProps) {
    function drawConnections(): JSX.Element[] {
        const pathElements = props.connections.map((connection, index) =>
            connectionPath(connection, index)
        );
        return pathElements;
    }

    return <svg className="connectionSvg">{drawConnections()}</svg>;
}
