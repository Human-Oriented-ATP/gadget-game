import { CellConnector } from "components/game/gadget/handles/CellConnector";
import { StaticHole } from "components/game/gadget/StaticHole";

export function SourceConnector() {
    return <div className="inline-block translate-y-[-2px]"><CellConnector type={"source"} isInline={true} /></div>;
}

export function TargetConnector() {
    return <div className="inline-block translate-y-[-2px]"><CellConnector type={"target"} isInline={true} /></div>;
}

export function BrokenTargetConnector() {
    return <div className="inline-block translate-y-[-2px]"><CellConnector type={"target"} isInline={true} status={"BROKEN"} /></div>;
}

export function OpenTargetConnector() {
    return <div className="inline-block translate-y-[-2px]"><CellConnector type={"target"} isInline={true} status={"OPEN"} /></div>;
}

export function PinkHole({ value = "" }: { value?: string }) {
    return <div className="inline-flex align-middle translate-x-[-3px] translate-y-[-3px] scale-90">
        <StaticHole value={value} isFunctionHole={true} />
    </div>
}

