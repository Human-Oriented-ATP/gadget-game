"use client"

import { GOAL_GADGET_ID } from 'lib/game/Primitives'
import { Relation } from 'lib/game/Term'
import { useLayoutEffect, useState } from 'react'
import { twJoin } from 'tailwind-merge'
import { calculateHolePosition } from '../../../lib/game/calculateHolePosition'
import { CellPosition, isInputPosition, isOutputPosition, OUTPUT_POSITION } from '../../../lib/game/CellPosition'
import { InternalConnection, makeConnections } from '../../../lib/game/GadgetInternalConnections'
import { Cell } from './Cell'
import { ConnectionDrawingData, ConnectionSvg, ConnectionSvgProps } from './ConnectionSvg'
import { HandleDoubleClickProps } from './handles/Connector'
import { ResolvedGadgetProps } from './Gadget'
import { SwapperToggleProps } from './handles/ToggleableSwapperHandle'
import { ConnectedSwapperCarets } from './SwapperCaretsSvg'

function hasOutputNode(relations: Map<CellPosition, Relation>): boolean {
    const positions = Array.from(relations.keys())
    return positions.some(isOutputPosition)
}

function hasInputNode(relations: Map<CellPosition, Relation>): boolean {
    const positions = Array.from(relations.keys())
    return positions.some(isInputPosition)
}


function FixedGadgetInputNodes(props: ResolvedGadgetProps & HandleDoubleClickProps & SwapperToggleProps) {
    const relations: [CellPosition, Relation][] = Array.from(props.relations.entries())
    return <>
        {relations.map(([cellPosition, relation]) => {
            if (isInputPosition(cellPosition)) {
                return <Cell key={cellPosition}
                    relation={relation}
                    position={cellPosition}
                    gadgetId={props.id}
                    isOnShelf={props.isOnShelf}
                    isGoalNode={props.id === GOAL_GADGET_ID}
                    isSwapper={props.isSwapper ?? false}
                    toggledSwapperHoles={props.toggledSwapperHoles}
                    onToggleSwapperHole={props.onToggleSwapperHole}
                    onHandleDoubleClick={props.onHandleDoubleClick} />
            }
        })}
    </>
}

function FixedGadgetOutputNode(props: ResolvedGadgetProps & HandleDoubleClickProps & SwapperToggleProps) {
    const relation = props.relations.get(OUTPUT_POSITION)
    if (relation === undefined) return <></>
    return <Cell
        relation={relation}
        position={OUTPUT_POSITION}
        gadgetId={props.id}
        isOnShelf={props.isOnShelf}
        isGoalNode={false}
        isSwapper={props.isSwapper ?? false}
        toggledSwapperHoles={props.toggledSwapperHoles}
        onToggleSwapperHole={props.onToggleSwapperHole}
        onHandleDoubleClick={props.onHandleDoubleClick} />
}

export function FixedGadget(props: ResolvedGadgetProps & HandleDoubleClickProps & SwapperToggleProps) {
    const [connectionState, setConnectionState] = useState<ConnectionSvgProps>({ connections: [] })

    useLayoutEffect(() => {
        function calculateInternalConnectionDrawingData(internalConnection: InternalConnection):
            ConnectionDrawingData {
            const start = calculateHolePosition(props.id, internalConnection.from)
            const end = calculateHolePosition(props.id, internalConnection.to)
            const [fromNode] = internalConnection.from
            const [toNode] = internalConnection.to
            const fromInput = fromNode !== "output"
            const toOutput = toNode === "output"

            const toPos = toNode === "output" ? OUTPUT_POSITION : toNode
            const relation = props.relations.get(toPos)
            const toEquality = relation !== undefined && "equals" in relation

            return { start, end, fromInput, toOutput, toEquality }
        }

        const connections = makeConnections(props.relations);
        const drawingData = connections.map(calculateInternalConnectionDrawingData)
        setConnectionState({ connections: drawingData })

    }, [props.relations, props.id])

    return <div className="text-center relative">
        {/* <span style={{ color: "grey" }}>{props.id}</span> */}
        <div className={twJoin("flex", hasInputNode(props.relations) && "space-x-8")} id={props.id}>
            <div className="flex flex-col items-start">
                <FixedGadgetInputNodes {...props} />
            </div>
            <div className={twJoin("flex flex-col justify-center", !hasOutputNode(props.relations) && "hidden")}>
                <FixedGadgetOutputNode {...props} />
            </div>
        </div>
        <ConnectionSvg {...connectionState}></ConnectionSvg>
        {props.isSwapper && <ConnectedSwapperCarets gadgetId={props.id} />}
    </div>
}