import { twMerge } from "tailwind-merge"
import { Connector } from "components/game/gadget/Connector"
import { EqualityPosition } from "lib/game/Primitives"


export type StaticHandleProps = {
    type: "source" | "target" | "equality"
    equalityPosition?: EqualityPosition
}

export function StaticHandle(props: StaticHandleProps) {
    if (props.type === "source") {
        return <div className="react-flow__handle react-flow__handle-right"><Connector type="source" /></div>
    } else if (props.type === "target") {
        return <div className="react-flow__handle react-flow__handle-left"><Connector type="target" /></div>
    } else {
        const handlePositionClass = props.equalityPosition == "top" ? "react-flow__handle-top" : "react-flow__handle-bottom";
        return <div className={twMerge("react-flow__handle equality-handle", handlePositionClass)}>
            <Connector {...props} />
        </div>
    }
}