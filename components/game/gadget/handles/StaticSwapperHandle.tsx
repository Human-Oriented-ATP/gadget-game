import { twMerge } from "tailwind-merge"
import { ConnectorDetails } from "./Connector"
import { SwapperPosition } from "lib/game/Primitives";
import { SwapperConnector } from "./SwapperConnector";

export interface StaticSwapperHandleProps extends ConnectorDetails {
    swapperPosition: SwapperPosition
}

export function StaticSwapperHandle(props: StaticSwapperHandleProps) {
    const className = twMerge(
        "swapper-handle z-25", 
        props.swapperPosition == "left" ? "swapper-handle-left" : "swapper-handle-right"
    );

    return <div className={className}>
        <SwapperConnector {...props} />
    </div>
}