import { GadgetId } from '../../../lib/game/Primitives';
import { Hole } from './Hole';
import { twJoin } from 'tailwind-merge';
import { makeHandleId } from 'lib/game/Handles';
import { Term } from 'lib/game/Term';
import { CustomHandle, HandleDoubleClickProps } from './CustomHandle';
import { getCellClassNameFromLabel } from 'lib/util/CellColors';
import { CellPosition, isOutputPosition } from '../../../lib/game/CellPosition';

export interface CellProps {
    term: Term
    gadgetId: GadgetId
    position: CellPosition
    isOnShelf: boolean
    isGoalNode: boolean
}

export function Cell(props: CellProps & HandleDoubleClickProps) {
    const handleType = isOutputPosition(props.position) ? "source" : "target"
    const handleId = !props.isOnShelf ? makeHandleId(props.position, props.gadgetId) : undefined

    if ("variable" in props.term) {
        console.error("Term cannot be rendered as node:" + props.term)
        return <>???</>
    } else {
        const backgroundClassName = getCellClassNameFromLabel(props.term.label)
        const onHandleDoubleClick = props.onHandleDoubleClick;
        return <div className="flex items-center">
            <div className={twJoin("m-1 border-black border-2 rounded-lg p-0.5", backgroundClassName, props.isGoalNode && "outline outline-offset-2 outline-2 outline-black")}>
                {props.term.args.map((arg, idx) => <Hole key={idx} term={arg}></Hole>)}
            </div>
            <CustomHandle 
                type={handleType}
                handleId={handleId}
                onHandleDoubleClick={props.onHandleDoubleClick}
            />
        </div>
    }
}
