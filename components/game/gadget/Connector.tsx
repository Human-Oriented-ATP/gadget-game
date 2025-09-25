import { EqualityPosition } from "lib/game/Primitives"
import { twMerge } from "tailwind-merge"

export type ConnectorStatus = "DEFAULT" | "OPEN" | "CONNECTED" | "BROKEN"

interface ConnectorProps {
    type: "source" | "target" | "equality"
    equalityPosition?: EqualityPosition
    status?: ConnectorStatus
    isConnecting?: boolean
    isInline?: boolean
}

export function SourceConnectorPolygon() {
    return <polygon points="3,2 14,2 19,10 14,18 3,18" />
}

export function TargetConnectorPolygon() {
    return <polygon points="10,10 5,2 17,2 22,10 17,18 5,18" />
}

export function EqualityConnector() {
    return <polygon points="10,0 10,10 15,15 10,20 5,15 10,10"/>
}

export function Connector({ type, equalityPosition, status = "DEFAULT", isConnecting = false, isInline = false }: ConnectorProps) {
    if (type === "equality") {
        if (equalityPosition === undefined) throw Error("Position of equality connector unspecified")
        const circleClassName = twMerge("stroke-[1.5px] fill-black stroke-black pointer-events-none fill-white",
            status === "BROKEN" && isConnecting === false && "animate-svg-stroke-glow-red",
            isConnecting && "fill-green", 
            isInline && "inline align-text-bottom");

        const transformProps = equalityPosition === "top" ? "scale(1,-1)" : undefined; 

        return <svg width="20" height="21" xmlns="http://www.w3.org/2000/svg" className={circleClassName} transform={transformProps}>
            <EqualityConnector />
        </svg>
    } else {
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
}