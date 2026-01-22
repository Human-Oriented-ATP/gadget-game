import { Handle as ReactFlowHandle, Position } from "@xyflow/react"
import { useGameStateContext } from "lib/state/StateContextProvider"
import { EqualityPosition } from "lib/game/Primitives"
import { StaticEqualityHandle } from "./StaticEqualityHandle"
import { EqualityConnector } from "./EqualityConnector"
import { HandleDoubleClickProps } from "./ConnectorTypes"

export interface CustomEqualityHandleProps extends HandleDoubleClickProps {
    equalityPosition: EqualityPosition
    handleId?: string
}

export function CustomEqualityHandle(props: CustomEqualityHandleProps) {
    const handleStatus = useGameStateContext((state) => state.handleStatus)
    const connectingHandles = useGameStateContext((state) => state.connectingHandles)

    if (props.handleId === undefined) {
        return <StaticEqualityHandle equalityPosition={props.equalityPosition} />
    } else {
        const position = props.equalityPosition === "top" ? Position.Top : Position.Bottom;
        const status = handleStatus.get(props.handleId)
        const isConnecting = connectingHandles.includes(props.handleId)

        const onDoubleClick = (event: React.MouseEvent) => {
            if (props.onHandleDoubleClick !== undefined) {
                props.onHandleDoubleClick(event, props.handleId!);
            }
        };

        return <ReactFlowHandle type="source" position={position} id={props.handleId}
            onDoubleClick={onDoubleClick} className="equality-handle">
            <EqualityConnector equalityPosition={props.equalityPosition} status={status} isConnecting={isConnecting} />
        </ReactFlowHandle>
    }
}
