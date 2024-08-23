import React, { useCallback, useEffect, useRef } from 'react';
import {
    useNodesState, useEdgesState, addEdge, NodeTypes, Connection, useReactFlow, Node as ReactFlowNode,
    EdgeTypes, Edge, getOutgoers, useStore, XYPosition, ReactFlow, OnConnectStartParams
} from '@xyflow/react';
import { GadgetFlowNode, GadgetNode } from './GadgetFlowNode';
import { GadgetPalette, GadgetPaletteProps } from './GadgetPalette';
import { CustomEdge, EdgeWithEquation } from './CustomEdge';

import '@xyflow/react/dist/base.css';
import './flow.css'
import { axiomToGadget } from '../../../lib/game/GameLogic';
import { Axiom, GadgetId, GadgetProps, NodePosition } from "../../../lib/game/Primitives";
import { Equation } from '../../../lib/game/Unification';
import { Term } from '../../../lib/game/Term';
import { useIdGenerator } from '../../../lib/hooks/IdGeneratorHook';
import { ControlButtons } from './ControlButtons';
import { sameArity, colorsMatch } from 'lib/game/Term';
import { hasTargetHandle, init } from '../../../lib/util/ReactFlow';
import { useCompletionCheck } from 'lib/hooks/CompletionCheckHook';
import { useProximityConnect } from 'lib/hooks/ProximityConnectHook';
import { getHandleId, getNodePositionFromHandle, getTermOfHandle } from '../gadget/Node';
import { HANDLE_BROKEN_CLASSES } from 'lib/Constants';
import { InitialDiagram, InitialDiagramEdge, InitialDiagramGadget, InitializationData } from 'lib/game/Initialization';
import { parseTerm } from 'lib/parsing/Semantics';

const nodeTypes: NodeTypes = { 'gadgetNode': GadgetFlowNode }
const edgeTypes: EdgeTypes = { 'edgeWithEquation': CustomEdge }

interface DiagramProps {
    initData: InitializationData
    addGadget: (gadgetId: string, axiom: Axiom) => void
    removeGadget: (gadgetId: string) => void
    addEquation: (from: [GadgetId, NodePosition], to: [GadgetId, NodePosition], equation: Equation) => void
    removeEquation: (from: [GadgetId, NodePosition], to: [GadgetId, NodePosition], equation: Equation) => void
    isSatisfied: Map<string, boolean>
    setProblemSolved: () => void
}

const nodesLengthSelector = (state) =>
    Array.from(state.nodeLookup.values()).length || 0;

interface GadgetDragStartInfo {
    id: string,
    position: XYPosition
}

function containsPoint(rect: DOMRect, point: XYPosition): boolean {
    return rect.left <= point.x && point.x <= rect.right && rect.top <= point.y && point.y <= rect.bottom
}

function isAbovePalette(position: XYPosition): boolean {
    const paletteElement = document.getElementById("gadget_palette")!
    const paletteRect = paletteElement?.getBoundingClientRect()
    return containsPoint(paletteRect, position)
}

function getGadgetProps(node: InitialDiagramGadget): GadgetProps {
    if ("hypotheses" in node.terms) {
        return axiomToGadget(node.terms, node.id)
    } else {
        return {
            id: node.id,
            terms: new Map([[0, node.terms]]),
            isAxiom: false,
            displayHoleFocus: true
        }
    }
}

function initializeNode(node: InitialDiagramGadget): GadgetNode {
    return {
        id: node.id,
        type: 'gadgetNode',
        position: node.position,
        deletable: node.id !== "goal_gadget",
        data: getGadgetProps(node)
    }
}

function getInitialConnections(edge: InitialDiagramEdge): Connection {
    const sourceGadget = edge.from[0]
    const targetGadget = edge.to[0]
    const sourceNode = edge.from[1]
    const targetNode = edge.to[1]
    return {
        source: sourceGadget,
        sourceHandle: getHandleId(sourceNode, sourceGadget),
        target: targetGadget,
        targetHandle: getHandleId(targetNode, targetGadget)
    }
}

export function getEquationFromEdge(initialDiagram: InitialDiagram, edge: InitialDiagramEdge): Equation | null {
    const sourceNode = initialDiagram.nodes.find(node => node.id === edge.from[0])
    const targetNode = initialDiagram.nodes.find(node => node.id === edge.to[0])
    if (!sourceNode || !targetNode) {
        return null
    }
    if (!('conclusion' in sourceNode.terms)) {
        return null // excludes the case where the source node is the goal itself
    }
    const sourceTerm = sourceNode.terms.conclusion
    const targetTerm = ("conclusion" in targetNode.terms) ? 
        targetNode.terms.hypotheses[edge.to[1]] : 
        ("goal" in targetNode.terms && edge.to[1] == 0) ? targetNode.terms : null
    if (!sourceTerm || !targetTerm) {
        return null
    }
    return [sourceTerm, targetTerm]
}

function getInitialEdge(initialDiagram: InitialDiagram, edge: InitialDiagramEdge, label: string): EdgeWithEquation | null {
    const equation = getEquationFromEdge(initialDiagram, edge)
    if (equation === null) {
        return null
    }
    return {
        id: label,
        source: edge.from[0],
        sourceHandle: getHandleId(edge.from[1], edge.from[0]),
        target: edge.to[0],
        targetHandle: getHandleId(edge.to[1], edge.to[0]),
        type: 'edgeWithEquation',
        animated: true,
        data: { eq: equation }
    }
}

function getInitialEdges(initialDiagram: InitialDiagram): EdgeWithEquation[] {
    return initialDiagram.edges
    .map((edge, idx) => getInitialEdge(initialDiagram, edge, `edge_${idx}`))
    .filter(edge => edge !== null) as EdgeWithEquation[]
}

export function Diagram(props: DiagramProps) {
    const initialNodes: GadgetNode[] = props.initData.initialDiagram.nodes.map(initializeNode)
    const initialEdges: EdgeWithEquation[] = getInitialEdges(props.initData.initialDiagram)

    const rf = useReactFlow<GadgetNode, EdgeWithEquation>();
    const [nodes, setNodes, onNodesChange] = useNodesState<GadgetNode>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<EdgeWithEquation>(initialEdges);

    const getNode = rf.getNode
    const getNodes = rf.getNodes
    const getEdges = rf.getEdges

    const [generateGadgetId] = useIdGenerator("gadget_")

    const dragStartInfo = useRef<GadgetDragStartInfo | undefined>(undefined)

    const numberOfNodes = useStore(nodesLengthSelector)

    useEffect(() => {
        if (dragStartInfo.current !== undefined) {
            const nodeToBeDragged = document.querySelector(`[data-id='${dragStartInfo.current.id}']`)
            nodeToBeDragged?.dispatchEvent(new MouseEvent("mousedown", {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: dragStartInfo.current.position.x,
                clientY: dragStartInfo.current.position.y,
            }))
        }
        dragStartInfo.current = undefined
    }, [numberOfNodes])

    useCompletionCheck({ setProblemSolved: props.setProblemSolved, nodes, edges })

    const getConnectionInfo = useCallback((connection: Connection | Edge): { from: [GadgetId, NodePosition], to: [GadgetId, NodePosition] } => {
        const fromGadget = connection.source!
        const fromNode = getNodePositionFromHandle(connection.sourceHandle!)
        const toGadget = connection.target!
        const toNode = getNodePositionFromHandle(connection.targetHandle!)
        return { from: [fromGadget, fromNode], to: [toGadget, toNode] }
    }, [])

    const deleteEquationsOfEdges = useCallback((edges: Edge<{ eq: Equation }>[]): void => {
        edges.map(e => {
            const connectionInfo = getConnectionInfo(e)
            props.removeEquation(connectionInfo.from, connectionInfo.to, e.data!.eq)
        })
    }, [edges, props])

    const getEquationFromConnection = useCallback((connection: Connection) => {
        const sourceTerms = getNode(connection.source!)!.data.terms
        const targetTerms = getNode(connection.target!)!.data.terms
        const sourceTerm: Term = getTermOfHandle(connection.sourceHandle!, sourceTerms)!
        const targetTerm: Term = getTermOfHandle(connection.targetHandle!, targetTerms)!
        const equation: Equation = [sourceTerm, targetTerm]
        return equation
    }, [getNode])

    const doesNotCreateACycle = useCallback((connection: Connection) => {
        const nodes = getNodes();
        const edges = getEdges();

        const target = nodes.find((node) => node.id === connection.target)!
        const hasCycle = (node: ReactFlowNode, visited = new Set()) => {
            if (visited.has(node.id)) return false;

            visited.add(node.id);

            for (const outgoer of getOutgoers(node, nodes, edges)) {
                if (outgoer.id === connection.source) return true;
                if (hasCycle(outgoer, visited)) return true;
            }
        };

        if (target.id === connection.source) return false;
        return !hasCycle(target);
    }, [getNodes, getEdges]);

    const removeEdgesConnectedToHandle = useCallback((handleId: string) => {
        const edges = getEdges()
        const edgesConnectedToThisHandle = edges.filter(e => hasTargetHandle(e, handleId))
        deleteEquationsOfEdges(edgesConnectedToThisHandle)
        setEdges(edges => {
            return edges.filter(e => !hasTargetHandle(e, handleId))
        })
    }, [getEdges, setEdges, props])

    const savelyAddEdge = useCallback((connection: Connection): void => {
        removeEdgesConnectedToHandle(connection.targetHandle!)
        const equation = getEquationFromConnection(connection)
        const connectionInfo = getConnectionInfo(connection)
        props.addEquation(connectionInfo.from, connectionInfo.to, equation)
        setEdges((edges) => {
            return addEdge({
                ...connection,
                type: 'edgeWithEquation',
                animated: true,
                data: { eq: equation }
            }, edges)
        });
    }, [props, setEdges, getEquationFromConnection])

    function makeGadget(axiom: Axiom, axiomPosition: XYPosition): void {
        const id = generateGadgetId()
        const flowNode: GadgetNode = {
            id: id,
            type: 'gadgetNode',
            position: rf.screenToFlowPosition(axiomPosition),
            dragging: true,
            deletable: true,
            data: axiomToGadget(axiom, id)
        }
        props.addGadget(id, axiom)
        setNodes((nodes) => nodes.concat(flowNode));
        dragStartInfo.current = { id, position: axiomPosition }
    }

    const paletteProps: GadgetPaletteProps = {
        axioms: props.initData.axioms,
        makeGadget: makeGadget
    }

    const disableHoleFocus = useCallback(() => {
        setNodes(nodes => nodes.map(node => {
            return { ...node, data: { ...node.data, displayHoleFocus: false } }
        }))
    }, [])

    const onConnectStart: (event: MouseEvent | TouchEvent, params: OnConnectStartParams) => void = useCallback((event, params) => {
        if (params.handleType === "target") {
            removeEdgesConnectedToHandle(params.handleId!)
        }
        disableHoleFocus()
    }, [removeEdgesConnectedToHandle])

    const enableHoleFocus = useCallback(() => {
        setNodes(nodes => nodes.map(node => {
            return { ...node, data: { ...node.data, displayHoleFocus: true } }
        }))
    }, [])

    const onConnect = useCallback((connection: Connection) => {
        savelyAddEdge(connection)
        enableHoleFocus()
    }, [])

    const isInDiagram = useCallback((connection: Connection): boolean => {
        const edges = getEdges()
        return edges.some(edge => edge.sourceHandle === connection.sourceHandle && edge.targetHandle === connection.targetHandle)
    }, [edges, getEquationFromConnection])

    const isValidConnection = useCallback((connection: Connection) => {
        const [source, target] = getEquationFromConnection(connection)
        const arityOk = sameArity(source, target)
        const colorsOk = colorsMatch(source, target)
        const noCycle = doesNotCreateACycle(connection)
        const notYetAConection = !isInDiagram(connection)
        return colorsOk && arityOk && noCycle && notYetAConection
    }, [getEquationFromConnection, getEdges, getNodes]);

    const isSatisfied = props.isSatisfied
    const updateEdgeAnimation = useCallback(() => {
        function highlightHandle(handleId: string) {
            const handle = document.querySelector(`[data-handleid="${handleId}"]`);
            if (handle) {
                (handle as HTMLElement).children[0].classList.add(...HANDLE_BROKEN_CLASSES)
            }
        }

        document.querySelectorAll("[data-handleid]").forEach(handle => {
            (handle as HTMLElement).children[0].classList.remove(...HANDLE_BROKEN_CLASSES)
        })
        setEdges(edges => edges.map(edge => {
            const edgeIsSatisfied = isSatisfied.get(JSON.stringify(edge.data!.eq))
            if (edgeIsSatisfied === undefined) {
                throw new Error("Something went wrong! There is an edge in the diagram without a corresponding equation")
            }
            if (edgeIsSatisfied === false) {
                highlightHandle(edge.sourceHandle!)
                highlightHandle(edge.targetHandle!)
            }
            return { ...edge, animated: !edgeIsSatisfied }
        }))
    }, [isSatisfied, setEdges])

    useEffect(() => {
        updateEdgeAnimation()
    }, [isSatisfied, setEdges, setNodes])

    const [onNodeDrag, onNodeDragStopProximityConnect] = useProximityConnect(rf, isValidConnection, savelyAddEdge)

    const onNodeDragStop = useCallback((event: React.MouseEvent, node: GadgetNode) => {
        if (isAbovePalette({ x: event.clientX, y: event.clientY })) {
            props.removeGadget(node.id)
            const edgesToBeDeleted = getEdges().filter(e => node.id === e.source || node.id === e.target)
            deleteEquationsOfEdges(edgesToBeDeleted)
            setNodes(nodes => nodes.filter(n => n.id !== node.id || n.deletable === false))
            setEdges(edges => edges.filter(e => node.id !== e.source && node.id !== e.target))
        } else {
            onNodeDragStopProximityConnect(event, node)
        }
    }, [])

    const onEdgesDelete = useCallback((edges: EdgeWithEquation[]) => {
        deleteEquationsOfEdges(edges)
    }, [])

    const onNodesDelete = useCallback((nodes: GadgetNode[]) => {
        nodes.map(node => props.removeGadget(node.id))
    }, [])

    return <>
        <GadgetPalette {...paletteProps} />
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgesDelete={onEdgesDelete}
            onNodesDelete={onNodesDelete}
            edgeTypes={edgeTypes}
            nodeTypes={nodeTypes}
            onInit={() => init(rf)}
            onConnectStart={onConnectStart}
            isValidConnection={isValidConnection}
            minZoom={0.1}
            onNodeDrag={onNodeDrag}
            onNodeDragStop={onNodeDragStop}
            nodeOrigin={[0.5, 0.5]}
        />
        <ControlButtons rf={rf} ></ControlButtons>
    </>
}
