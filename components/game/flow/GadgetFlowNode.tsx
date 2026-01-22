import { Node } from "@xyflow/react";
import { Gadget } from "../gadget/Gadget";
import { GadgetProps } from "../gadget/Gadget";
import { HandleDoubleClickProps } from "../gadget/handles/ConnectorTypes";

export type GadgetNode = Node<GadgetProps, 'gadgetNode'>

export function GadgetFlowNode({ data, onHandleDoubleClick }: { data: GadgetProps } & HandleDoubleClickProps) {
    return <div>
        <Gadget {...data} onHandleDoubleClick={onHandleDoubleClick}></Gadget>
    </div >
}