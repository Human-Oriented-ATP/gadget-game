import { EdgeProps } from '@xyflow/react';
import { ConnectionDrawingData, ConnectionPath } from '../gadget/ConnectionSvg';
import { toGadgetConnection } from 'lib/state/slices/Edges';
import { useGameStateContext } from 'lib/state/StateContextProvider';
import { twJoin } from 'tailwind-merge';
import { GadgetConnection } from "lib/game/History";

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

    const drawingData: ConnectionDrawingData = {
        start: { x: props.sourceX - 21, y: props.sourceY },
        end: { x: props.targetX + 9, y: props.targetY },
        fromInput: true, toOutput: true
    }

    return <g className={twJoin("stroke-black", !isSatisfied && "animate-dashdraw")} strokeDasharray={isSatisfied ? 0 : 5}>
        {ConnectionPath(drawingData, 0, 20)}
    </g>
}
