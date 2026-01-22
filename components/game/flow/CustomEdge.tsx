import { EdgeProps, Position } from '@xyflow/react';
import { useGameStateContext } from 'lib/state/StateContextProvider';
import { twJoin } from 'tailwind-merge';
import { GeneralConnection, toGeneralConnection } from "lib/game/Connection";
import { createEdgeCurve, CurveProps } from "lib/util/EdgeCurve";
import { isEqualityHandle } from 'lib/game/Handles';
import { EqualityPosition } from 'lib/game/Primitives';

// These constants are different between ConnectionLineComponent and CustomEdge
// since xyflow computes handle positions differently for these two components.
const SOURCE_CONNECTOR_NOTCH_OFFSET = -21;
const TARGET_CONNECTOR_NOTCH_OFFSET = 10;
const EQUALITY_CONNECTOR_OFFSET = -5;

function getGeneralConnection(props: EdgeProps): GeneralConnection {
    if (!props.sourceHandleId || !props.targetHandleId)
        throw Error('CustomEdge: sourceHandleId and targetHandleId must be defined')
    const connection = { source: props.source, target: props.target, sourceHandle: props.sourceHandleId, targetHandle: props.targetHandleId }
    return toGeneralConnection(connection)!
}

function regularConnectionSVGData(props: EdgeProps): CurveProps {
    const startPointX = props.sourceX + SOURCE_CONNECTOR_NOTCH_OFFSET;
    const endPointX = props.targetX + TARGET_CONNECTOR_NOTCH_OFFSET;

    return {
        startPos: {x: startPointX, y: props.sourceY},
        endPos: {x: endPointX, y: props.targetY},
        tensionDir: { type: "horizontal" }
    };
}

function equalityConnectionSVGData(props: EdgeProps): CurveProps {
    const adjustBasedOnPosition = (value: number, pos: Position) => {
        const isTop = pos == Position.Top;
        const offsetDir = isTop ? -1 : 1;
        return value + EQUALITY_CONNECTOR_OFFSET * offsetDir;
    };

    const positionToEquality = (pos: Position): EqualityPosition =>
        pos == Position.Top ? "top" : "bottom";

    const startPointY = adjustBasedOnPosition(props.sourceY, props.sourcePosition);
    const endPointY = adjustBasedOnPosition(props.targetY, props.targetPosition);

    return {
        startPos: {x: props.sourceX, y: startPointY},
        endPos: {x: props.targetX, y: endPointY},
        tensionDir: {
            type: "vertical",
            sourcePosition: positionToEquality(props.sourcePosition),
            targetPosition: positionToEquality(props.targetPosition)
        }
    };
}

export function CustomEdge({ ...props }: EdgeProps): React.JSX.Element {
    const equationIsSatisfied = useGameStateContext((state) => state.equationIsSatisfied)
    const generalConnection = getGeneralConnection(props)
    const isSatisfied = equationIsSatisfied.get(generalConnection) ?? false

    const curveProps = isEqualityHandle(props.sourceHandleId!) ? 
        equalityConnectionSVGData(props) : regularConnectionSVGData(props);
    const pathData = createEdgeCurve(curveProps);


    return <>
        <g className={twJoin("stroke-black", !isSatisfied && "animate-dashdraw")} strokeDasharray={isSatisfied ? 0 : 5}>
            <path d={pathData} strokeWidth="2px" fill="transparent"/>
        </g>
        <g className="stroke-transparent">
            <path d={pathData} strokeWidth="10px" fill="transparent"/>
        </g>
    </>
}