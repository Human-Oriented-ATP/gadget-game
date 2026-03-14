import { Handle as ReactFlowHandle, Position } from "@xyflow/react"
import { StaticCellHandle } from "./StaticCellHandle"
import { CellConnector } from "./CellConnector"
import { HandleDoubleClickProps, toDoubleClickHandler, useConnectorDetails } from "./Connector"

export interface CustomCellHandleProps extends HandleDoubleClickProps {
    type: "source" | "target"
    handleId?: string
}

export function CustomCellHandle(props: CustomCellHandleProps) {
    const connectorDetails = useConnectorDetails(props.handleId); 

    if (props.handleId === undefined) {
        return <StaticCellHandle type={props.type} />
    } else {
        const position = props.type === "source" ? Position.Right : Position.Left;

        return <ReactFlowHandle type={props.type} position={position} id={props.handleId}
            onDoubleClick={toDoubleClickHandler(props)}>
            <CellConnector type={props.type} {...connectorDetails} />
        </ReactFlowHandle>
    }
}
