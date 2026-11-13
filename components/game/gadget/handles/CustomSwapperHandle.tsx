import { Handle as ReactFlowHandle, Position } from "@xyflow/react"
import { StaticSwapperHandle } from "./StaticSwapperHandle"
import { SwapperConnector } from "./SwapperConnector"
import { HandleDoubleClickProps, toDoubleClickHandler, useConnectorDetails } from "./Connector"
import { SwapperPosition } from "lib/game/Primitives"
import { twMerge } from "tailwind-merge"

export interface CustomSwapperHandleProps extends HandleDoubleClickProps {
    swapperPosition: SwapperPosition
    handleId?: string
}

export function CustomSwapperHandle(props: CustomSwapperHandleProps) {
    const connectorDetails = useConnectorDetails(props.handleId); 

    if (props.handleId === undefined) {
        return <StaticSwapperHandle {...props} />
    } else {
        const className = twMerge(
            "swapper-handle z-25", 
            props.swapperPosition == "left" ? "swapper-handle-left" : "swapper-handle-right"
        );

        return <ReactFlowHandle type={"target"} position={Position.Top} id={props.handleId}
            onDoubleClick={toDoubleClickHandler(props)} className={className}>
            <SwapperConnector {...connectorDetails} />
        </ReactFlowHandle>
    }
}
