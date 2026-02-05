import { twMerge } from "tailwind-merge"
import { CellConnector } from "./CellConnector"
import { ConnectorDetails } from "./ConnectorTypes"

interface StaticCellHandleProps extends ConnectorDetails {
    type: "source" | "target"
}

export function StaticCellHandle(props: StaticCellHandleProps) {
    const handlePositionClass = props.type === "source" ? "react-flow__handle-right" : "react-flow__handle-left";
    return <div className={twMerge("react-flow__handle", handlePositionClass)}>
        <CellConnector {...props} />
    </div>
}
