import { Axiom } from "lib/game/Primitives";
import { useGameStateContext } from "lib/state/StateContextProvider";
import { useRef } from "react";
import { useShallow } from "zustand/react/shallow";

interface InsertGadgetButtonProps extends React.PropsWithChildren<{}> {
    axiom: string;
}

export function InsertGadgetButton({ axiom, children }: InsertGadgetButtonProps): React.JSX.Element {
    const addGadgetNode = useGameStateContext(useShallow((state) => state.addGadgetNode));
    const abortAddingGadget = useGameStateContext(useShallow((state) => state.abortAddingGadget));

    const ref = useRef<HTMLDivElement>(null);

    function getPosition() {
        const domRect = (ref.current as HTMLElement).getBoundingClientRect();
        return { x: domRect.left + domRect.width / 2, y: domRect.top + domRect.height / 2 };
    }

    function onMouseDown(e: React.MouseEvent) {
        addGadgetNode(axiom, getPosition());
    }

    return <div ref={ref} className="flex justify-center px-1" onMouseDown={onMouseDown} onClick={abortAddingGadget}>
        {children}
    </div>;
}
