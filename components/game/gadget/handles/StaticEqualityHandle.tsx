import { EqualityPosition } from "lib/game/Primitives"
import { twMerge } from "tailwind-merge"
import { EqualityConnector } from "./EqualityConnector"
import { ConnectorDetails } from "./ConnectorTypes"

interface StaticEqualityHandleProps extends ConnectorDetails {
    equalityPosition: EqualityPosition
}

export function StaticEqualityHandle(props: StaticEqualityHandleProps) {
    const className = props.equalityPosition === "left" ? "equality-handle-left" : "equality-handle-right";
    return <div className={twMerge("react-flow__handle equality-handle", className)}>
        <EqualityConnector {...props} />
    </div>
}
