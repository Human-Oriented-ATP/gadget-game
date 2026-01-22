import { twMerge } from "tailwind-merge"
import { ConnectorDetails } from "./ConnectorTypes"

interface CellConnectorProps extends ConnectorDetails {
    type: "source" | "target"
}

export function SourceConnectorPolygon() {
    return <polygon points="3,2 14,2 19,10 14,18 3,18" />
}

export function TargetConnectorPolygon() {
    return <polygon points="10,10 5,2 17,2 22,10 17,18 5,18" />
}

export function CellConnector({ type, status = "DEFAULT", isConnecting = false, isInline = false }: CellConnectorProps) {
    const className = twMerge("stroke-[1.5px] stroke-black pointer-events-none fill-white",
        status === "BROKEN" && isConnecting === false && "animate-svg-stroke-glow-red",
        status === "CONNECTED" && isConnecting === false && "fill-dark-gray",
        isConnecting && "fill-green",
        isInline && "inline align-text-bottom")

    return <svg width="24" height="20" xmlns="http://www.w3.org/2000/svg" className={className}>
        {type === "source" ? <SourceConnectorPolygon /> : <TargetConnectorPolygon />}
        {type === "target" && status === "OPEN" ? <polyline points="1,2 6,10 1,18" fill="none"
            className="stroke-black animate-svg-stroke-blink" /> : <></>}
    </svg>
}
