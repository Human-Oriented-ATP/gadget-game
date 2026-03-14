import { Node } from "@xyflow/react";
import { Gadget } from "../gadget/Gadget";
import { GadgetProps } from "../gadget/Gadget";
import { HandleDoubleClickProps } from "../gadget/handles/Connector";
import { SwapperToggleProps } from "../gadget/handles/ToggleableSwapperHandle";

export type GadgetNode = Node<GadgetProps, 'gadgetNode'>

export function GadgetFlowNode({data, onHandleDoubleClick, onToggleSwapperHole}: { data: GadgetProps } & HandleDoubleClickProps & SwapperToggleProps) {
    return <div>
        <Gadget {...data} onHandleDoubleClick={onHandleDoubleClick} onToggleSwapperHole={onToggleSwapperHole}></Gadget>
    </div >
}