import { GadgetId } from '../../../lib/game/Primitives';
import { Hole } from './Hole';
import { twJoin } from 'tailwind-merge';
import { makeHandleId, makeEqualityHandleId } from 'lib/game/Handles';
import { getRelationArgs, Relation } from 'lib/game/Term';
import { CustomEqualityHandle } from './handles/CustomEqualityHandle';
import { CustomCellHandle } from './handles/CustomCellHandle';
import { HandleDoubleClickProps } from './handles/ConnectorTypes';
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

    const backgroundClassName = "equals" in props.relation
        ? "bg-cyan-200 border-cyan-400"
        : getCellClassNameFromLabel(props.relation.label);

    const relationArgs = getRelationArgs(props.relation);

    const needsEqualityHandles = "equals" in props.relation && isOutputPosition(props.position);
    const equalityHandlePadding = needsEqualityHandles && "py-2";
    const needsEqualityHandleIDs = needsEqualityHandles && !props.isOnShelf;
    const makeIdForPos = pos => needsEqualityHandleIDs ?
        makeEqualityHandleId(props.gadgetId, pos) : undefined;

    return <div className="flex items-center">
        <div className={twJoin(
            "m-1 border-black border-2 rounded-lg p-0.5",
            backgroundClassName,
            equalityHandlePadding,
            props.isGoalNode && "outline-2 outline-offset-2 outline-black"
        )}>
            {relationArgs.map((arg, idx) => <Hole key={idx} term={arg}></Hole>)}
        </div>

        <CustomCellHandle
            type={handleType}
            handleId={handleId}
            onHandleDoubleClick={props.onHandleDoubleClick}
        />

        {needsEqualityHandles && (["bottom", "top"] as const).map(pos => (
            <CustomEqualityHandle
                key={pos}
                equalityPosition={pos}
                handleId={makeIdForPos(pos)}
                onHandleDoubleClick={props.onHandleDoubleClick}
            />
        ))}
    </div>
}
