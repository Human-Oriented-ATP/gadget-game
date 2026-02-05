import { Handle as ReactFlowHandle, Position } from "@xyflow/react"
import { StaticHandle } from "./StaticHandle"
import { Connector } from "./Connector"
import { useGameStateContext } from "lib/state/StateContextProvider"
import { EqualityPosition } from "lib/game/Primitives"

export type DoubleClickHandler = (event: React.MouseEvent, handleId: string) => void

export type HandleDoubleClickProps = {
    onHandleDoubleClick?: DoubleClickHandler;
}

export type CustomHandleProps = {
    type: "source" | "target" | "equality"
    equalityPosition?: EqualityPosition
    handleId?: string
}

export function CustomHandle(props: CustomHandleProps & HandleDoubleClickProps) {
    const handleStatus = useGameStateContext((state) => state.handleStatus)
    const connectingHandles = useGameStateContext((state) => state.connectingHandles)
    if (props.handleId === undefined) {
        return <StaticHandle {...props} />
    }
    else {
        let position: Position;
        if (props.type === "equality") {
            position = props.equalityPosition === "top" ? Position.Top : Position.Bottom;
        } else {
            position = props.type === "source" ? Position.Right : Position.Left;
        }

        const status = handleStatus.get(props.handleId)
        const isConnecting = connectingHandles.includes(props.handleId)
        const onDoubleClick = (event: React.MouseEvent) => {
            if (props.onHandleDoubleClick !== undefined) {
                props.onHandleDoubleClick(event, props.handleId!);
            }
        };
        
        const reactFlowType = props.type === "equality" ? "source" : props.type;
        const equalityClass = props.type === "equality" ? "equality-handle" : "";

        return <ReactFlowHandle type={reactFlowType} position={position} id={props.handleId}
            onDoubleClick={onDoubleClick} className={equalityClass}>
            <Connector type={props.type} equalityPosition={props.equalityPosition} status={status} isConnecting={isConnecting} />
        </ReactFlowHandle>
    }
}