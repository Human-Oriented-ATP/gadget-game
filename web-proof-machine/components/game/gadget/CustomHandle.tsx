import { Handle as ReactFlowHandle, Position } from "@xyflow/react"
import { StaticHandle } from "./StaticHandle"
import { Connector } from "./Connector"
import { useGameStateContext } from "lib/state/StateContextProvider"

export type CustomHandleProps = {
    type: "source" | "target"
    handleId?: string
}

export function CustomHandle(props: CustomHandleProps) {
    const handleStatus = useGameStateContext((state) => state.handleStatus)
    const connectingHandles = useGameStateContext((state) => state.connectingHandles)
    if (props.handleId === undefined) {
        return <StaticHandle {...props} />
    }
    else {
        const position = props.type === "source" ? Position.Right : Position.Left
        const status = handleStatus.get(props.handleId)
        const isConnecting = connectingHandles.includes(props.handleId)
        return <ReactFlowHandle type={props.type} position={position} id={props.handleId}>
            <Connector type={props.type} status={status} isConnecting={isConnecting} />
        </ReactFlowHandle>
    }
}