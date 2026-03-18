import { twMerge } from "tailwind-merge"
import { ConnectorDetails } from "./Connector"

export function SwapperDiamondConnector() {
    return <polygon points="13,5 21,13 13,21 5,13" />
}

export function SwapperConnector({ status = "DEFAULT", isConnecting = false, isInline = false }: ConnectorDetails) {
    const diamondClassName = twMerge(
        "stroke-[1.5px] stroke-black pointer-events-none fill-white",
        status === "BROKEN" && isConnecting === false && "animate-svg-stroke-glow-red",
        status === "CONNECTED" && isConnecting === false && "fill-dark-gray",
        isConnecting && "fill-green",
        isInline && "inline align-text-bottom"
    );

    return <svg width="26" height="26" xmlns="http://www.w3.org/2000/svg" className={diamondClassName}>
        <SwapperDiamondConnector />
        {status === "OPEN" ? <polyline points="5,10 13,2 21,10" fill="none"
            className="stroke-black animate-svg-stroke-blink" /> : <></>}
    </svg>
}
