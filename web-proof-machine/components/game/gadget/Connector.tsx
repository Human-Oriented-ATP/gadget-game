import { twJoin } from "tailwind-merge"

interface ConnectorProps {
    type: "source" | "target"
    isOpen?: boolean
    isInline?: boolean
}

export function SourceConnectorPolygon() {
    return <polygon points="3,2 14,2 19,10 14,18 3,18" />
}

export function TargetConnectorPolygon() {
    return <polygon points="10,10 5,2 17,2 22,10 17,18 5,18" />
}

export function Connector({ type, isOpen: isConnected = false, isInline = false }: ConnectorProps) {
    return <svg width="24" height="20" xmlns="http://www.w3.org/2000/svg"
        className={twJoin("stroke-[1.5px] stroke-black pointer-events-none fill-white", isInline && "inline")}>
        {type === "source" ? <SourceConnectorPolygon /> : <TargetConnectorPolygon />}
        {type === "target" && isConnected ? <polyline points="1,2 6,10 1,18" fill="none" className="stroke-black animate-svg-stroke-blink" /> : <></>}
    </svg>
}