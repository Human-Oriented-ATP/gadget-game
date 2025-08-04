"use client"

import { useLayoutEffect, useState } from 'react'
import { Cell } from './Cell'
import { CellPosition, isInputPosition, isOutputPosition, OUTPUT_POSITION } from '../../../lib/game/CellPosition'
import { ConnectionSvg, ConnectionSvgProps, ConnectionDrawingData } from './ConnectionSvg'
import { InternalConnection, makeConnections } from '../../../lib/game/GadgetInternalConnections'
import { twJoin } from 'tailwind-merge'
import { calculateHolePosition } from '../../../lib/game/calculateHolePosition'
import { GadgetId, GOAL_GADGET_ID } from 'lib/game/Primitives'
import { Term } from 'lib/game/Term'

export type GadgetProps = {
    id: GadgetId;
    terms: Map<CellPosition, Term>;
    isOnShelf: boolean;
}

function hasOutputNode(terms: Map<CellPosition, Term>): boolean {
    const positions = Array.from(terms.keys())
    return positions.some(isOutputPosition)
}

function hasInputNode(terms: Map<CellPosition, Term>): boolean {
    const positions = Array.from(terms.keys())
    return positions.some(isInputPosition)
}


function GadgetInputNodes(props: GadgetProps) {
    const terms: [CellPosition, Term][] = Array.from(props.terms.entries())
    return <>
        {terms.map(([cellPosition, term]) => {
            if (isInputPosition(cellPosition)) {
                return <Cell key={cellPosition}
                    term={term}
                    position={cellPosition}
                    gadgetId={props.id}
                    isOnShelf={props.isOnShelf}
                    isGoalNode={props.id === GOAL_GADGET_ID} />
            }
        })}
    </>
}

function GadgetOutputNode(props: GadgetProps) {
    const term = props.terms.get(OUTPUT_POSITION)
    if (term === undefined) return <></>
    return <Cell term={term} position={OUTPUT_POSITION} gadgetId={props.id} isOnShelf={props.isOnShelf} isGoalNode={false} />
}

export function Gadget(props: GadgetProps) {
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

        const connections = makeConnections(props.terms);
        const drawingData = connections.map(calculateInternalConnectionDrawingData)
        setConnectionState({ connections: drawingData })

    }, [props.terms, props.id])

    return <div className="text-center relative">
        {/* <span style={{ color: "grey" }}>{props.id}</span> */}
        <div className={twJoin("flex", hasInputNode(props.terms) && "space-x-8")} id={props.id}>
            <div className="flex flex-col items-start">
                <GadgetInputNodes {...props} />
            </div>
            <div className={twJoin("flex flex-col justify-center", !hasOutputNode(props.terms) && "hidden")}>
                <GadgetOutputNode {...props} />
            </div>
        </div>
        <ConnectionSvg {...connectionState}></ConnectionSvg>
    </div>
}
