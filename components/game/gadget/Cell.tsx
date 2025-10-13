import { GadgetId } from '../../../lib/game/Primitives';
import { Hole } from './Hole';
import { twJoin } from 'tailwind-merge';
import { makeHandleId } from 'lib/game/Handles';
import { Relation } from 'lib/game/Term';
import { CustomHandle, HandleDoubleClickProps } from './CustomHandle';
import { getCellClassNameFromLabel } from 'lib/util/CellColors';
import { CellPosition, isOutputPosition } from '../../../lib/game/CellPosition';

export interface CellProps {
    relation: Relation
    gadgetId: GadgetId
    position: CellPosition
    isOnShelf: boolean
    isGoalNode: boolean
}

export function Cell(props: CellProps & HandleDoubleClickProps) {
    const handleType = isOutputPosition(props.position) ? "source" : "target"
    const handleId = !props.isOnShelf ? makeHandleId(props.position, props.gadgetId) : undefined

    const backgroundClassName = getCellClassNameFromLabel(props.relation.label)
        const onHandleDoubleClick = props.onHandleDoubleClick;
    return <div className="flex items-center">
        <div className={twJoin("m-1 border-black border-2 rounded-lg p-0.5", backgroundClassName, props.isGoalNode && "outline-2 outline-offset-2 outline-black")}>
            {props.relation.args.map((arg, idx) => <Hole key={idx} term={arg}></Hole>)}
        </div>
        <CustomHandle 
                type={handleType}
                handleId={handleId}
                onHandleDoubleClick={props.onHandleDoubleClick}
            />
    </div>
}
