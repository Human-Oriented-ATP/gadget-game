"use client"

import { useLayoutEffect, useState } from 'react'
import { Cell } from './Cell'
import { CellPosition, isInputPosition, isOutputPosition, OUTPUT_POSITION } from '../../../lib/game/CellPosition'
import { ConnectionSvg, ConnectionSvgProps, ConnectionDrawingData } from './ConnectionSvg'
import { InternalConnection, makeConnections } from '../../../lib/game/GadgetInternalConnections'
import { twJoin } from 'tailwind-merge'
import { calculateHolePosition } from '../../../lib/game/calculateHolePosition'
import { GadgetId, GOAL_GADGET_ID } from 'lib/game/Primitives'
import { Relation } from 'lib/game/Term'
import { HandleDoubleClickProps } from './CustomHandle'

export type GadgetProps = {
    id: GadgetId;
    relations: Map<CellPosition, Relation>;
    isOnShelf: boolean;
}

function hasOutputNode(relations: Map<CellPosition, Relation>): boolean {
    const positions = Array.from(relations.keys())
    return positions.some(isOutputPosition)
}

function hasInputNode(relations: Map<CellPosition, Relation>): boolean {
    const positions = Array.from(relations.keys())
    return positions.some(isInputPosition)
}


function GadgetInputNodes(props: GadgetProps & HandleDoubleClickProps) {
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
                    onHandleDoubleClick={props.onHandleDoubleClick} />
            }
        })}
    </>
}

function GadgetOutputNode(props: GadgetProps & HandleDoubleClickProps) {
    const relation = props.relations.get(OUTPUT_POSITION)
    if (relation === undefined) return <></>
    return <Cell 
        relation={relation} 
        position={OUTPUT_POSITION}
        gadgetId={props.id} 
        isOnShelf={props.isOnShelf} 
        isGoalNode={false}
        onHandleDoubleClick={props.onHandleDoubleClick} />
}

export function Gadget(props: GadgetProps & HandleDoubleClickProps) {
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
            return { start, end, fromInput, toOutput }
        }

        const connections = makeConnections(props.relations);
        const drawingData = connections.map(calculateInternalConnectionDrawingData)
        setConnectionState({ connections: drawingData })

    }, [props.relations, props.id])

    return <div className="text-center relative">
        {/* <span style={{ color: "grey" }}>{props.id}</span> */}
        <div className={twJoin("flex", hasInputNode(props.relations) && "space-x-8")} id={props.id}>
            <div className="flex flex-col items-start">
                <GadgetInputNodes {...props} />
            </div>
            <div className={twJoin("flex flex-col justify-center", !hasOutputNode(props.relations) && "hidden")}>
                <GadgetOutputNode {...props} />
            </div>
        </div>
        <ConnectionSvg {...connectionState}></ConnectionSvg>
    </div>
}
