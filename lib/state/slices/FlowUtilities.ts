import { CreateStateWithInitialValue } from '../Types';
import { addEdge, Connection, ReactFlowInstance, XYPosition } from '@xyflow/react';
import { GadgetNode } from 'components/game/flow/GadgetFlowNode';
import { EdgeSlice, edgeSlice, EdgeStateInitializedFromData } from './Edges';
import { toGeneralConnection } from 'lib/game/Connection';
import { NodeSlice, nodeSlice, NodeState, NodeStateInitializedFromData } from './Nodes';
import { GameEvent } from "lib/game/History";
import { GadgetIdGeneratorSlice, gadgetIdGeneratorSlice } from './GadgetIdGenerator';
import { axiomToGadget } from 'lib/game/GameLogic';
import { GadgetId } from 'lib/game/Primitives';
import { unificationSlice, UnificationSlice, UnificationState, UnificationStateInitializedFromData } from './Unification';
import { ConnectorStatus } from 'components/game/gadget/Connector';
import { calculateProximityConnection, ConnectionWithHandles, getPositionOfHandle, HandlesWithPositions } from 'lib/util/calculateProximityConnection';
import { relationsMatch } from 'lib/game/Term';
import { GOAL_GADGET_ID } from 'lib/game/Primitives';
import { isAboveGadgetShelf } from 'lib/util/XYPosition';
import { saveLevelCompletedAsCookie } from 'lib/study/CompletedProblems';

export type FlowUtilitiesStateInitializedFromData = UnificationStateInitializedFromData & NodeStateInitializedFromData & EdgeStateInitializedFromData & {
  rf: ReactFlowInstance
}

export type FlowUtilitiesState = UnificationState & NodeState & {
  levelIsCompleted: boolean
}

export interface FlowUtilitiesActions {
  reset: () => void;
  nodeIsAboveShelf(node: GadgetNode): boolean;
  makeGadgetNode: (axiom: string, axiomPosition: XYPosition) => GadgetNode;
  addGadgetNode: (axiom: string, axiomPosition: XYPosition) => void;
  removeGadgetNode: (node: GadgetNode) => GameEvent[];
  removeGadgetNodes: (nodes: GadgetNode[]) => GameEvent[];
  handleGadgetDraggedAboveShelf: (node: GadgetNode) => void;
  handleGadgetDragStopAwayFromShelf: (node: GadgetNode) => void;
  handleCompletedLevel: () => void;
  updateLogicalState: (events: GameEvent[]) => void;
  isHandleWithBrokenConnection: (handle: string) => boolean;
  updateHandleStatus: (openHandles: string[]) => void;
  calculatePositionOfHandles: (handles: string[]) => HandlesWithPositions;
  isValidConnection: (connection: Connection) => boolean;
  isValidProximityConnection: (connection: ConnectionWithHandles) => boolean;
  getProximityConnection(nodeThatIsBeingDragged: string): ConnectionWithHandles | null;
  runProximityConnect(nodeId: string): GameEvent[];
  calculateCompletionStatusAndOpenHandles: () => { isCompleted: boolean, openHandles: string[] };
};

export type DependencySlices = NodeSlice & EdgeSlice & UnificationSlice & GadgetIdGeneratorSlice
export type FlowUtilitiesSlice = DependencySlices & FlowUtilitiesStateInitializedFromData & FlowUtilitiesState & FlowUtilitiesActions

export const flowUtilitiesSlice: CreateStateWithInitialValue<FlowUtilitiesStateInitializedFromData, FlowUtilitiesSlice> = (initialState, set, get) => {
  return {
    ...edgeSlice(initialState, set, get),
    ...nodeSlice(initialState, set, get),
    ...unificationSlice(initialState, set, get),
    ...gadgetIdGeneratorSlice(set, get),
    rf: initialState.rf,
    levelIsCompleted: false,
    reset: () => {
      set({ levelIsCompleted: false, rf: initialState.rf })
      edgeSlice(initialState, set, get).reset()
      nodeSlice(initialState, set, get).reset()
      unificationSlice(initialState, set, get).reset()
      gadgetIdGeneratorSlice(set, get).reset()
    },

    nodeIsAboveShelf(node: GadgetNode): boolean {
      const { flowToScreenPosition } = get().rf
      const position = flowToScreenPosition(node.position)
      return isAboveGadgetShelf(position)
    },

    makeGadgetNode: (axiom: string, axiomPosition: XYPosition) => {
      const id = get().generateNewGadgetId()
      const gadgetProps = axiomToGadget(axiom, id)
      const gadgetNode: GadgetNode = {
        id, type: 'gadgetNode',
        position: get().rf.screenToFlowPosition(axiomPosition),
        dragging: true,
        deletable: get().setup.settings.gadgetDeletionEnabled && id !== GOAL_GADGET_ID,
        data: gadgetProps
      }
      return gadgetNode
    },

    addGadgetNode: (axiom: string, axiomPosition: XYPosition) => {
      const node = get().makeGadgetNode(axiom, axiomPosition)
      set({ gadgetBeingDraggedFromShelf: { id: node.id, position: node.position, status: "STILL_ABOVE_SHELF", axiom } })
      set({ nodes: [...get().nodes, node], });
      // Intentionally no update of logical state here -- this happens in onNodeDragStop
    },

    removeGadgetNode: (node: GadgetNode) => {
      if (node.deletable) {
        const connectionDeletionEvents = get().removeEdgesConnectedToNode(node.id);
        set({ nodes: get().nodes.filter((n) => n.id !== node.id), });
        return [...connectionDeletionEvents, { GadgetRemoved: { gadgetId: node.id } }]
      } else {
        return []
      }
    },

    removeGadgetNodes(nodes: GadgetNode[]) {
      let events = new Array()
      for (const node of nodes) {
        const edgeDeletionEvents = get().removeGadgetNode(node)
        events = [...events, ...edgeDeletionEvents]
      }
      return events
    },

    handleGadgetDraggedAboveShelf(node: GadgetNode) {
      const gadgetBeingDraggedFromShelf = get().gadgetBeingDraggedFromShelf
      if (gadgetBeingDraggedFromShelf === undefined) {
        const event = get().removeGadgetNode(node)
        get().updateLogicalState(event)
      } else {
        if (node.id !== gadgetBeingDraggedFromShelf.id)
          throw Error("Impossible value for gadgetBeingDraggedFromShelf")
        set({ nodes: get().nodes.filter((n) => n.id !== gadgetBeingDraggedFromShelf.id) });
        set({ gadgetBeingDraggedFromShelf: undefined });
      }
    },

    handleGadgetDragStopAwayFromShelf(node: GadgetNode) {
      set({ connectingHandles: [] })
      const gadgetBeingDraggedFromShelf = get().gadgetBeingDraggedFromShelf
      const proximityConnectionEvents = get().runProximityConnect(node.id)
      if (gadgetBeingDraggedFromShelf !== undefined) {
        const { id, axiom } = gadgetBeingDraggedFromShelf
        const gadgetAddedEvent = { GadgetAdded: { gadgetId: id, axiom } }
        set({ gadgetBeingDraggedFromShelf: undefined });
        get().updateLogicalState([gadgetAddedEvent, ...proximityConnectionEvents])
      } else {
        if (proximityConnectionEvents.length > 0) {
          get().updateLogicalState(proximityConnectionEvents)
        }
      }
    },

    handleCompletedLevel() {
      set({ levelIsCompleted: true })
      get().logEvents([{ GameCompleted: null }])
      get().uploadFinalHistory()
      const problemId = get().setup.problemId
      saveLevelCompletedAsCookie(problemId)
    },

    updateLogicalState(events: GameEvent[]) {
      get().logEvents(events)
      get().runUnification()
      const { isCompleted, openHandles } = get().calculateCompletionStatusAndOpenHandles()
      get().updateHandleStatus(openHandles)
      if (isCompleted) {
        get().handleCompletedLevel()
        get().advanceTutorialWithEvents([...events, { GameCompleted: null }])
      }
      if (!isCompleted) {
        get().uploadHistoryAsynchronously()
        get().advanceTutorialWithEvents(events)
      }
    },

    isHandleWithBrokenConnection(handle: string) {
      const edges = get().getEdgesConnectedToHandle(handle)
      return edges.some((edge) => !get().edgeIsSatisfied(edge))
    },

    updateHandleStatus(openHandles: string[]) {
      const allHandles = get().getAllHandles()
      const handleStatus = new Map<string, ConnectorStatus>()
      for (const handle of allHandles) {
        if (openHandles.includes(handle)) {
          handleStatus.set(handle, "OPEN")
        } else if (get().isHandleWithBrokenConnection(handle)) {
          handleStatus.set(handle, "BROKEN")
        } else if (get().isConnectedHandle(handle)) {
          handleStatus.set(handle, "CONNECTED")
        } else {
          handleStatus.set(handle, "DEFAULT")
        }
      }
      set({ handleStatus })
    },

    calculatePositionOfHandles(handles: string[]): HandlesWithPositions {
      const handlesWithPositions = new Map<string, XYPosition>()
      handles.forEach(handle => {
        handlesWithPositions.set(handle, getPositionOfHandle(handle, get().rf))
      })
      return handlesWithPositions
    },

    isValidConnection: (connection: Connection) => {
      const generalConnection = toGeneralConnection(connection);
      if (generalConnection === undefined) {
        return false;
      }

      let doesNotYetExist = !get().connectionExists(connection);
      if (generalConnection.type === "equality") {
        const reversedConnection: Connection = {
          source: connection.target, target: connection.source,
          sourceHandle: connection.targetHandle, targetHandle: connection.sourceHandle
        };
        doesNotYetExist &&= !get().connectionExists(reversedConnection);
      }

      if (generalConnection.type === 'equality') {
        const equalityConnection = generalConnection.connection;
        const gadgetsDifferent = equalityConnection.from[0] !== equalityConnection.to[0];
        return gadgetsDifferent && doesNotYetExist;
      } else {
        const equation =  get().getEquationOfConnection(generalConnection);
        if (equation.type !== "relation")
          throw Error(`${JSON.stringify(generalConnection)} converted to wrong type of equation: ${JSON.stringify(equation)}`);
        const [lhs, rhs] = equation.equation;
        const relationsOk = relationsMatch(lhs, rhs);
        const createsNoCycle = get().doesNotCreateACycle(connection);
        return relationsOk && createsNoCycle && doesNotYetExist;
      }
    },

    isValidProximityConnection: (connection: ConnectionWithHandles) => {
      const generalConnection = toGeneralConnection(connection);
      if (generalConnection === undefined || generalConnection.type === 'equality') {
        // Don't do proximity connections for equality handles or invalid connections
        return false;
      }

      const proximityConnectEnabled = get().setup.settings.proximityConnectEnabled
      const isValidConnection = get().isValidConnection(connection)
      const sourceNode: GadgetNode = get().getNode(connection.source)
      const targetNode: GadgetNode = get().getNode(connection.target)
      const notAboveShelf = !(get().nodeIsAboveShelf(sourceNode) || get().nodeIsAboveShelf(targetNode))
      return proximityConnectEnabled && isValidConnection && notAboveShelf
    },

    getProximityConnection(nodeThatIsBeingDragged: string) {
      const handlesOfNodeBeingDragged = get().getHandlesOfNode(nodeThatIsBeingDragged)
      const otherNodes = get().nodes.filter(node => node.id !== nodeThatIsBeingDragged)
      const handlesOfOtherNodes = otherNodes.flatMap(node => Array.from(get().getHandlesOfNode(node.id).values()))
      const proximityConnection = calculateProximityConnection(
        get().calculatePositionOfHandles(handlesOfNodeBeingDragged),
        get().calculatePositionOfHandles(handlesOfOtherNodes))
      if (proximityConnection === null) return null
      else if (!get().isValidProximityConnection(proximityConnection)) {
        return null
      }
      else return proximityConnection
    },

    runProximityConnect(nodeId: string): GameEvent[] {
      const proximityConnection = get().getProximityConnection(nodeId)
      if (proximityConnection !== null) {
        const removalEvents = get().removeEdgesConnectedToHandle(proximityConnection.targetHandle)
        set({ edges: addEdge({ ...proximityConnection, type: 'customEdge' }, get().edges), });
        const generalConnection = toGeneralConnection(proximityConnection)!;
        const connectionEvent: GameEvent = { ConnectionAdded: generalConnection }
        return [...removalEvents, connectionEvent]
      } else {
        return []
      }
    },

    calculateCompletionStatusAndOpenHandles: () => {
      const openHandles: string[] = [];
      let currentLayer: GadgetId[] = [GOAL_GADGET_ID];
      let hasInvalidEdge = false;

      const getGadgetNodesInLayer = (layer: GadgetId[]) => {
        return get().nodes.filter(node => layer.includes(node.id));
      };

      const getTargetHandlesInLayer = (layer: GadgetId[]) => {
        const gadgetNodes = getGadgetNodesInLayer(layer);
        return gadgetNodes.map(node => get().getTargetHandlesOfNode(node.id)).flat();
      };

      const processHandle = (handle: string, nextLayer: GadgetId[]) => {
        const incomingEdges = get().edges.filter(edge => edge.targetHandle === handle);

        if (incomingEdges.length === 0) {
          openHandles.push(handle);
        } else if (incomingEdges.length === 1) {
          const incomingEdge = incomingEdges[0];
          if (!get().edgeIsSatisfied(incomingEdge)) {
            hasInvalidEdge = true;
          }
          nextLayer.push(incomingEdge.source);
        } else {
          throw new Error(`Unexpected number of incoming edges: handle ${handle} has ${incomingEdges.length} incoming edges`);
        }
      };

      while (true) {
        const inputHandlesInCurrentLayer = getTargetHandlesInLayer(currentLayer);
        if (inputHandlesInCurrentLayer.length === 0) break;

        let nextLayer: GadgetId[] = [];
        inputHandlesInCurrentLayer.forEach(handle => processHandle(handle, nextLayer));

        currentLayer = nextLayer;
      }

      const isCompleted = openHandles.length === 0 && !hasInvalidEdge;
      return { isCompleted, openHandles };
    }

  }
}
