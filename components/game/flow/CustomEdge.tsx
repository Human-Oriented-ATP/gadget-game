import { EdgeProps } from '@xyflow/react';
import { toGadgetConnection } from 'lib/state/slices/Edges';
import { useGameStateContext } from 'lib/state/StateContextProvider';
import { twJoin } from 'tailwind-merge';
import { GadgetConnection } from "lib/game/History";

// These constants are different between ConnectionLineComponent and CustomEdge
// since xyflow computes handle positions differently for these two components.
const SOURCE_CONNECTOR_NOTCH_OFFSET = -21;
const TARGET_CONNECTOR_NOTCH_OFFSET = 10;

function getGadgetConnection(props: EdgeProps): GadgetConnection {
    if (!props.sourceHandleId || !props.targetHandleId)
        throw Error('CustomEdge: sourceHandleId and targetHandleId must be defined')
    const connection = { source: props.source, target: props.target, sourceHandle: props.sourceHandleId, targetHandle: props.targetHandleId }
    return toGadgetConnection(connection)
}

export function CustomEdge({ ...props }: EdgeProps): React.JSX.Element {
    const equationIsSatisfied = useGameStateContext((state) => state.equationIsSatisfied)
    const gadgetConnection = getGadgetConnection(props)
    const isSatisfied = equationIsSatisfied.get(gadgetConnection) ?? false

    const startPointX = props.sourceX + SOURCE_CONNECTOR_NOTCH_OFFSET; 
    const endPointX = props.targetX + TARGET_CONNECTOR_NOTCH_OFFSET;
    // Uses a tension of 0.5 for an entirely symmetric curve
    const cx = (props.sourceX + props.targetX) / 2;

    const pathData = (
        `M ${startPointX} ${props.sourceY}
         C ${cx} ${props.sourceY}
           ${cx} ${props.targetY}
           ${endPointX} ${props.targetY}`
    );

    return <>
        <g className={twJoin("stroke-black", !isSatisfied && "animate-dashdraw")} strokeDasharray={isSatisfied ? 0 : 5}>
            <path d={pathData} strokeWidth="2px" fill="transparent"/>
        </g>
        <g className="stroke-transparent">
            <path d={pathData} strokeWidth="10px" fill="transparent"/>
        </g>
    </>
}