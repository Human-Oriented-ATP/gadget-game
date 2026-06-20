import { EdgeProps, Position } from '@xyflow/react';
import { useGameStateContext } from 'lib/state/StateContextProvider';
import { twJoin } from 'tailwind-merge';
import { GeneralConnection, toGeneralConnection } from "lib/game/Connection";
import { createEdgeCurve, CurveProps } from "lib/util/EdgeCurve";
import { isEqualityHandle, isSwapperHandle } from 'lib/game/Handles';
import { positionToEquality } from './ConnectionLineComponent';

// These constants are different between ConnectionLineComponent and CustomEdge
// since xyflow computes handle positions differently for these two components.
const SOURCE_CONNECTOR_NOTCH_OFFSET = -21;
const TARGET_CONNECTOR_NOTCH_OFFSET = 10;
const EQUALITY_CONNECTOR_OFFSET = -6;
const SWAPPER_HANDLE_OFFSET = 5;

// This function is specific to CustomEdge: see the 
// note on constants varying.
function adjustBasedOnPosition(value: number, pos: Position): number {
    const isLeft = pos == Position.Left;
    const offsetDir = isLeft ? -1 : 1;
    return value + EQUALITY_CONNECTOR_OFFSET * offsetDir;
}


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
        startPos: { x: startPointX, y: props.sourceY },
        endPos: { x: endPointX, y: props.targetY },
        tensionDir: { type: "cell" }
    };
}

function equalityConnectionSVGData(props: EdgeProps): CurveProps {
    const startPointX = adjustBasedOnPosition(props.sourceX, props.sourcePosition);
    const endPointX = adjustBasedOnPosition(props.targetX, props.targetPosition);

    return {
        startPos: { x: startPointX, y: props.sourceY },
        endPos: { x: endPointX, y: props.targetY },
        tensionDir: {
            type: "equality",
            sourcePosition: positionToEquality(props.sourcePosition),
            targetPosition: positionToEquality(props.targetPosition)
        }
    };
}

function swapperConnectionSVGData(props: EdgeProps): CurveProps {
    const startPointX = adjustBasedOnPosition(props.sourceX, props.sourcePosition);
    const endPointY = props.targetY + SWAPPER_HANDLE_OFFSET;

    return {
        startPos: { x: startPointX, y: props.sourceY },
        endPos: { x: props.targetX, y: endPointY },
        tensionDir: {
            type: "mixed",
            sourcePosition: positionToEquality(props.sourcePosition),
        }
    };
}

export function CustomEdge({ ...props }: EdgeProps): React.JSX.Element {
    const equationIsSatisfied = useGameStateContext((state) => state.equationIsSatisfied)
    const generalConnection = getGeneralConnection(props)
    const isSatisfied = equationIsSatisfied.get(generalConnection) ?? false


    const sourceIsEquality = isEqualityHandle(props.sourceHandleId!);
    const swapperPresent = isSwapperHandle(props.targetHandleId!);

    let curveProps: CurveProps;

    if (swapperPresent) {
        curveProps = swapperConnectionSVGData(props);
    } else if (sourceIsEquality) {
        curveProps = equalityConnectionSVGData(props);
    } else {
        curveProps = regularConnectionSVGData(props);
    }

    const pathData = createEdgeCurve(curveProps);


    return <>
        <g className={twJoin("stroke-black", !isSatisfied && "animate-dashdraw")} strokeDasharray={isSatisfied ? 0 : 5}>
            <path d={pathData} strokeWidth="2px" fill="transparent" />
        </g>
        <g className="stroke-transparent">
            <path d={pathData} strokeWidth="10px" fill="transparent" />
        </g>
    </>
}