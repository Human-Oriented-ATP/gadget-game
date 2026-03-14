import { Handle as ReactFlowHandle, Position } from "@xyflow/react"
import { EqualityPosition } from "lib/game/Primitives"
import { StaticEqualityHandle } from "./StaticEqualityHandle"
import { EqualityConnector } from "./EqualityConnector"
import { HandleDoubleClickProps, toDoubleClickHandler, useConnectorDetails } from "./Connector"
import { twMerge } from "tailwind-merge"

export interface CustomEqualityHandleProps extends HandleDoubleClickProps {
    equalityPosition: EqualityPosition
    handleId?: string
}

export function CustomEqualityHandle(props: CustomEqualityHandleProps) {
    const connectorDetails = useConnectorDetails(props.handleId); 

    if (props.handleId === undefined) {
        return <StaticEqualityHandle equalityPosition={props.equalityPosition} />
    } else {
        const position = props.equalityPosition === "left" ? Position.Left : Position.Right;
        const className = props.equalityPosition === "left" ? "equality-handle-left" : "equality-handle-right";

        return <ReactFlowHandle type="source" position={position} id={props.handleId}
            onDoubleClick={toDoubleClickHandler(props)}
            className={twMerge("equality-handle", className)}
        >
            <EqualityConnector equalityPosition={props.equalityPosition} {...connectorDetails} />
        </ReactFlowHandle>
    }
}
