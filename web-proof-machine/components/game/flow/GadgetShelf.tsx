import { Gadget } from '../gadget/Gadget'
import { GadgetProps } from "../gadget/Gadget";
import { useGameStateContext } from 'lib/state/StateContextProvider';
import { InsertGadgetButton } from './InsertGadgetButton';
import { getGadgetTerms } from 'lib/game/GameLogic';

function makeShelfGadgetProps(axiom: string, id: number): GadgetProps {
    const axiomId = `axiom_${id}`
    const terms = getGadgetTerms(axiom, axiomId)
    return { terms, id: axiomId, isOnShelf: true }
}

export function GadgetShelf(): JSX.Element {
    const axioms = useGameStateContext((state) => state.setup.axioms)

    return <>
        {axioms.length !== 0 &&
            <div id="gadget_shelf" className="absolute top-0 bottom-0 min-w-40 w-auto flex flex-col p-1 overflow-y-scroll overflow-x-hidden bg-palette-gray/50">
                {axioms.map((axiom, id) => {
                    return <InsertGadgetButton key={JSON.stringify(axiom)} axiom={axiom}>
                        <Gadget {...makeShelfGadgetProps(axiom, id)} />
                    </InsertGadgetButton>
                })}
            </div>}
    </>
}