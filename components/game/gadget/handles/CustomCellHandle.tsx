import { Handle as ReactFlowHandle, Position } from "@xyflow/react"
import { useGameStateContext } from "lib/state/StateContextProvider"
import { StaticCellHandle } from "./StaticCellHandle"
import { CellConnector } from "./CellConnector"
import { HandleDoubleClickProps } from "./ConnectorTypes"

export interface CustomCellHandleProps extends HandleDoubleClickProps {
    type: "source" | "target"
    handleId?: string
}

export function CustomCellHandle(props: CustomCellHandleProps) {
    const handleStatus = useGameStateContext((state) => state.handleStatus)
    const connectingHandles = useGameStateContext((state) => state.connectingHandles)

    if (props.handleId === undefined) {
        return <StaticCellHandle type={props.type} />
    } else {
        const position = props.type === "source" ? Position.Right : Position.Left;
        const status = handleStatus.get(props.handleId)
        const isConnecting = connectingHandles.includes(props.handleId)

        const onDoubleClick = (event: React.MouseEvent) => {
            if (props.onHandleDoubleClick !== undefined) {
                props.onHandleDoubleClick(event, props.handleId!);
            }
        };

        return <ReactFlowHandle type={props.type} position={position} id={props.handleId}
            onDoubleClick={onDoubleClick}>
            <CellConnector type={props.type} status={status} isConnecting={isConnecting} />
        </ReactFlowHandle>
    }
}
