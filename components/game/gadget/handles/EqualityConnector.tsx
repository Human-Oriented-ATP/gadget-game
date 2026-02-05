import { EqualityPosition } from "lib/game/Primitives"
import { twMerge } from "tailwind-merge"
import { ConnectorDetails } from "./ConnectorTypes"

interface EqualityConnectorProps extends ConnectorDetails {
    equalityPosition?: EqualityPosition
}

function EqualityConnectorPolygon() {
    return <polygon points="10,0 10,10 15,15 10,20 5,15 10,10" />
}

export function EqualityConnector({ equalityPosition, status = "DEFAULT", isConnecting = false, isInline = false }: EqualityConnectorProps) {
    if (equalityPosition === undefined && !isInline) throw Error("Position of equality connector unspecified")

    const circleClassName = twMerge("stroke-[1.5px] fill-black stroke-black pointer-events-none fill-white",
        status === "BROKEN" && isConnecting === false && "animate-svg-stroke-glow-red",
        isConnecting && "fill-green",
        isInline && "inline align-text-bottom");

    const transformProps = equalityPosition === "top" ? "scale(1,-1)" : undefined;

    return <svg width="20" height="21" xmlns="http://www.w3.org/2000/svg" className={circleClassName} transform={transformProps}>
        <EqualityConnectorPolygon />
    </svg>
}
