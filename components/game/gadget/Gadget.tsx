import { CellPosition } from '../../../lib/game/CellPosition'
import { GadgetId } from 'lib/game/Primitives'
import { Relation, VariableName } from 'lib/game/Term'
import { HandleDoubleClickProps } from './handles/Connector'
import { FormlessGadget } from './FormlessGadget'
import { FixedGadget } from './FixedGadget'
import { SwapperToggleProps } from './handles/ToggleableSwapperHandle'

type BaseGadgetProps = {
    id: GadgetId
    isOnShelf: boolean
    isSwapper?: boolean
    toggledSwapperHoles?: VariableName | null
};

export type ResolvedGadgetProps = BaseGadgetProps & { relations: Map<CellPosition, Relation> };
export type FormlessGadgetProps = BaseGadgetProps &  { isSwapper: true, relations: "formless" };
export type GadgetProps = ResolvedGadgetProps | FormlessGadgetProps;

export function Gadget(props: GadgetProps & HandleDoubleClickProps & SwapperToggleProps) {
    if (props.relations === "formless") {
        return <FormlessGadget {...props}/>
    } else {
        return <FixedGadget {...props}/>
    }
}
