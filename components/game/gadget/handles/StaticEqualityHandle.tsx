import { EqualityPosition } from "lib/game/Primitives"
import { twMerge } from "tailwind-merge"
import { EqualityConnector } from "./EqualityConnector"
import { ConnectorDetails } from "./ConnectorTypes"

interface StaticEqualityHandleProps extends ConnectorDetails {
    equalityPosition: EqualityPosition
}

export function StaticEqualityHandle(props: StaticEqualityHandleProps) {
    const handlePositionClass = props.equalityPosition == "top" ? "react-flow__handle-top" : "react-flow__handle-bottom";
    return <div className={twMerge("react-flow__handle equality-handle", handlePositionClass)}>
        <EqualityConnector {...props} />
    </div>
}
