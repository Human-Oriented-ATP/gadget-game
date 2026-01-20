import { EdgeProps, Position } from '@xyflow/react';
import { useGameStateContext } from 'lib/state/StateContextProvider';
import { twJoin } from 'tailwind-merge';
import { GeneralConnection, toGeneralConnection } from "lib/game/Connection";
import { createEdgeCurve, CurveProps } from "lib/util/EdgeCurve";

// These constants are different between ConnectionLineComponent and CustomEdge
// since xyflow computes handle positions differently for these two components.
const SOURCE_CONNECTOR_NOTCH_OFFSET = -21;
const TARGET_CONNECTOR_NOTCH_OFFSET = 10;

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

export function CustomEdge({ ...props }: EdgeProps): React.JSX.Element {
    const equationIsSatisfied = useGameStateContext((state) => state.equationIsSatisfied)
    const generalConnection = getGeneralConnection(props)
    const isSatisfied = equationIsSatisfied.get(generalConnection) ?? false

    const curveProps = regularConnectionSVGData(props);
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