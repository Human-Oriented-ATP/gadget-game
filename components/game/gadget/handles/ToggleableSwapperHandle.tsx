import { useLayoutEffect } from 'react'
import { GadgetId, SwapperPosition } from 'lib/game/Primitives'
import { getRelationArgs, Relation, VariableName } from 'lib/game/Term'
import { useUpdateNodeInternals } from '@xyflow/react'
import { makeSwapperHandleId } from 'lib/game/Handles'
import { HandleDoubleClickProps } from './Connector'
import { CustomSwapperHandle } from './CustomSwapperHandle'

export type SwapperHoleClickHandler =
    (event: React.MouseEvent, gadgetId: GadgetId, variable: VariableName, enabled: boolean) => void

export interface SwapperToggleProps {
    onToggleSwapperHole?: SwapperHoleClickHandler
}

export interface ToggleableSwapperButtonProps {
    gadgetId: GadgetId
    variableName: VariableName
    isToggled: boolean
    onToggle: SwapperHoleClickHandler
}

export function ToggleableSwapperButton(props: ToggleableSwapperButtonProps) {
    const radialBackground = props.isToggled ?
        "transparent 0, transparent 54%, #0005 55%, #000b 60%, #000b 65%, #0005 70%, transparent 71%"
        : "transparent 0, transparent 54%, #0005 55%, #0007 60%, #0007 65%, #0005 70%, transparent 71%";
    return (
        <>
            <button
                onClick={(event) => props.onToggle(event, props.gadgetId, props.variableName, !props.isToggled)}
                className="absolute w-11 h-11 rounded-full cursor-pointer z-20 opacity-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                type="button"
            />

            <div
                className={`absolute w-9 h-9 z-10 pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
                style={{
                    background: `radial-gradient(circle at center, ${radialBackground})`
                }}
            />
        </>
    );
}

export interface SwapperHandleCreatorProps {
    gadgetId: GadgetId
    relation: Relation
    isOutput: boolean
    toggledVariableName: VariableName | null
}

/**
 * Creates and destroys the swapper handles depending on the swapper hole selected.
 * ReactFlow requires the useUpdateNodeInternals hook to be called when handles are dynamically created.
 */
export function SwapperHandleCreator(props: SwapperHandleCreatorProps & HandleDoubleClickProps) {
    const updateNodeInternals = useUpdateNodeInternals();

    useLayoutEffect(() => {
        updateNodeInternals(props.gadgetId);
    }, [updateNodeInternals, props.toggledVariableName, props.gadgetId]);

    if (!props.toggledVariableName) return null;

    const relationArgs = getRelationArgs(props.relation);
    const holeIndex = relationArgs.findIndex(arg => 
        "variable" in arg && arg.variable.replace("SWAPOUT_", "SWAPIN_") === props.toggledVariableName
    );

    if (holeIndex === -1) return null;

    const side: SwapperPosition = props.isOutput ? 'right' : 'left';
    const handleId = makeSwapperHandleId(props.gadgetId, holeIndex, side);

    return (
        <CustomSwapperHandle
            swapperPosition={side}
            handleId={handleId}
            onHandleDoubleClick={props.onHandleDoubleClick}
        />
    );
}

