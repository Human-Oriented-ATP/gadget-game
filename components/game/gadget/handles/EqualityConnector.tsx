import { EqualityPosition } from "lib/game/Primitives"
import { twMerge } from "tailwind-merge"
import { ConnectorDetails } from "./ConnectorTypes"

interface EqualityConnectorProps extends ConnectorDetails {
    equalityPosition?: EqualityPosition
}

function EqualityConnectorPolygon() {
    return <polygon points="20,10 11,10 6,15 1,10 6,5 11,10" />
}

export function EqualityConnector({ equalityPosition, status = "DEFAULT", isConnecting = false, isInline = false }: EqualityConnectorProps) {
    if (equalityPosition === undefined && !isInline) throw Error("Position of equality connector unspecified")

    const circleClassName = twMerge("stroke-[1.5px] fill-black stroke-black pointer-events-none fill-white",
        status === "BROKEN" && isConnecting === false && "animate-svg-stroke-glow-red",
        isConnecting && "fill-green",
        isInline && "inline align-text-bottom");

    const transformProps = equalityPosition === "left" ? "rotate(0)" : "rotate(180)";

    return <svg width="21" height="20" xmlns="http://www.w3.org/2000/svg" className={circleClassName} transform={transformProps}>
        <EqualityConnectorPolygon />
    </svg>
}
