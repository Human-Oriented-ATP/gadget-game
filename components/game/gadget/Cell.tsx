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

export function Cell(props: CellProps & HandleDoubleClickProps & SwapperToggleProps) {
    const handleType = isOutputPosition(props.position) ? "source" : "target"
    const handleId = !props.isOnShelf ? makeHandleId(props.position, props.gadgetId) : undefined

    const backgroundClassName = "equals" in props.relation
        ? "bg-cyan-200 border-cyan-400"
        : getCellClassNameFromLabel(props.relation.label);

    const relationArgs = getRelationArgs(props.relation);

    const needsEqualityHandles = "equals" in props.relation && isOutputPosition(props.position);
    const equalityHandlePadding = needsEqualityHandles && "py-0.5 px-2";

    const swapperSpacing = props.isSwapper && "[&>*]:my-4 px-2";
    const borderColor = "equals" in props.relation ? "border-cyan-400" : "border-black";

    return <div className="flex items-center">
        <div className={twJoin(
            "m-1 border-2 rounded-lg p-0.5",
            borderColor,
            backgroundClassName,
            equalityHandlePadding,
            props.isGoalNode && "outline-2 outline-offset-2 outline-black",
            "equals" in props.relation ? "flex flex-row gap-1 items-center justify-center" : "flex flex-col gap-1 items-center justify-center",
            swapperSpacing
        )}>
            {relationArgs.map((arg, idx) => {
                let swapperButton: React.ReactNode = null;
                if (props.isSwapper && props.onToggleSwapperHole && "variable" in arg) {
                    const normalizedName = arg.variable.replace("SWAPOUT_", "SWAPIN_");
                    swapperButton = <ToggleableSwapperButton
                        gadgetId={props.gadgetId}
                        variableName={normalizedName}
                        isToggled={props.toggledSwapperHoles === normalizedName}
                        onToggle={props.onToggleSwapperHole} />
                }
                return (
                    <div key={idx} className="relative flex items-center justify-center">
                        <Hole term={arg} />
                        {swapperButton}
                    </div>
                );
            })}
        </div>

        {!("equals" in props.relation) && <CustomCellHandle
            type={handleType}
            handleId={handleId}
            onHandleDoubleClick={props.onHandleDoubleClick}
        />}

        {needsEqualityHandles && (["left", "right"] as const).map(pos => (
            <CustomEqualityHandle
                key={pos}
                equalityPosition={pos}
                handleId={makeIdForPos(pos)}
                onHandleDoubleClick={props.onHandleDoubleClick}
            />
        ))}
    </div>
}
