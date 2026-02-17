import { Gadget } from '../gadget/Gadget'
import { GadgetProps } from "../gadget/Gadget";
import { useGameStateContext } from 'lib/state/StateContextProvider';
import { InsertGadgetButton } from './InsertGadgetButton';
import { getGadgetRelations } from 'lib/game/GameLogic';
import { useShallow } from 'zustand/react/shallow';
import { twJoin } from 'tailwind-merge';

function makeShelfGadgetProps(axiom: string, id: number): GadgetProps {
    const axiomId = `axiom_${id}`
    const relations = getGadgetRelations(axiom, axiomId)
    return { relations, id: axiomId, isOnShelf: true }
}

export function GadgetShelf(): React.JSX.Element {
    const axioms = useGameStateContext(useShallow((state) => state.setup.axioms))
    const hasEquality = axioms.some(axiom => axiom.includes("eq(") && axiom.includes(":-"));
    const widthClass = hasEquality ? "min-w-64" : "min-w-40";

    return <>
        {axioms.length !== 0 &&
            <div id="gadget_shelf" className={twJoin("absolute top-0 bottom-0 w-auto flex flex-col p-1 overflow-y-scroll overflow-x-hidden bg-palette-gray/50", widthClass)}>
                {axioms.map((axiom, id) => {
                    return <InsertGadgetButton key={JSON.stringify(axiom)} axiom={axiom}>
                        <Gadget {...makeShelfGadgetProps(axiom, id)} />
                    </InsertGadgetButton>
                })}
            </div>}
    </>
}