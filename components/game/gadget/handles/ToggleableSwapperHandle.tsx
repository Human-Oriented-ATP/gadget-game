import { Fragment, useLayoutEffect, useState } from 'react'
import { getRelationArgs, Relation, VariableName } from 'lib/game/Term'
import { GadgetId } from 'lib/game/Primitives'
import { CellPosition } from 'lib/game/CellPosition'
import { calculateHolePosition } from 'lib/game/calculateHolePosition'
import { useUpdateNodeInternals, XYPosition } from '@xyflow/react'
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


interface ToggleableSwapperHandlesProps {
    gadgetId: GadgetId
    relations: Map<CellPosition, Relation>
    toggledVariables: VariableName | null
}

export function ToggleableSwapperHandles(props: ToggleableSwapperHandlesProps & HandleDoubleClickProps) {
    const updateNodeInternals = useUpdateNodeInternals();

    useLayoutEffect(() => {
        updateNodeInternals(props.gadgetId);
    }, [updateNodeInternals, props.toggledVariables, props.gadgetId]);

    const inputRelations = props.relations.get(0);
    if (inputRelations === undefined)
        throw Error(`Invalid relations for resolved swapper: ${props.gadgetId}`);
    const inputTerms = getRelationArgs(inputRelations);

    return <> {inputTerms.map((term, idx) => {
        if (!("variable" in term))
            throw new Error("Swapper input holes should always be variables");

        const variableName = term.variable;

        if (props.toggledVariables !== variableName) return;

        // The two handles are at the top of the cell, positioned left and right
        const leftHandleId = makeSwapperHandleId(props.gadgetId, idx, 'left');
        const rightHandleId = makeSwapperHandleId(props.gadgetId, idx, 'right');

        return <Fragment key={idx}>
            {[leftHandleId, rightHandleId].map((handleId, handleIdx) => {
                const side = handleIdx === 0 ? 'left' : 'right';

                return <CustomSwapperHandle
                    key={handleIdx}
                    swapperPosition={side}
                    handleId={handleId}
                    onHandleDoubleClick={props.onHandleDoubleClick}
                />
            })}
        </Fragment>;
    })} </>;
}
