import { twMerge } from "tailwind-merge"
import { Connector } from "components/game/gadget/Connector"


export type StaticHandleProps = {
    type: "source" | "target"
}

export function StaticHandle(props: StaticHandleProps) {
    if (props.type === "source") {
        return <div className="react-flow__handle react-flow__handle-right"><Connector type="source" /></div>
    } else {
        return <div className="react-flow__handle react-flow__handle-left"><Connector type="target" /></div>
    }
}