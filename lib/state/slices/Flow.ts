import { CreateStateWithInitialValue } from '../Types';
import { addEdge, applyEdgeChanges, Connection, Edge, EdgeChange, getConnectedEdges, OnBeforeDelete, OnConnect, OnConnectStartParams, OnEdgesChange, OnNodeDrag, OnSelectionChangeFunc } from '@xyflow/react';
import { GadgetNode } from 'components/game/flow/GadgetFlowNode';
import { isValidConnection, toGeneralConnection } from 'lib/game/Connection';
import { initViewport } from 'lib/game/ViewportInitialisation';
import { flowUtilitiesSlice, FlowUtilitiesSlice, FlowUtilitiesState, FlowUtilitiesStateInitializedFromData } from './FlowUtilities';
import { HoleFocusSlice, holeFocusSlice } from './HoleFocus';
import { DoubleClickHandler } from 'components/game/gadget/handles/ConnectorTypes';
import { isEqualityHandle } from 'lib/game/Handles';
import { DEFAULT_EDGE_PROPS, ELEVATED_EDGE_PROPS } from './Edges';
import { CONNECTED_NODE_Z_INDEX, DEFAULT_NODE_Z_INDEX } from './Nodes';

export type FlowStateInitializedFromData = FlowUtilitiesStateInitializedFromData

export type FlowState = FlowUtilitiesState

type OnEdgeClick = React.MouseEvent<Element, MouseEvent>;

export interface FlowActions {
  reset: () => void;
  onInit: () => void;
  onSelectionChange: OnSelectionChangeFunc;
  onEdgesChange: OnEdgesChange;
  onBeforeDelete: OnBeforeDelete<GadgetNode, Edge>;
  onConnectStart: (event: MouseEvent | TouchEvent, params: OnConnectStartParams) => void;
  onConnectEnd: () => void;
  onConnect: OnConnect;
  onEdgeClick: (event: OnEdgeClick, edge: Edge) => void;
  onHandleDoubleClick: DoubleClickHandler;
  onNodeDrag: OnNodeDrag<GadgetNode>
  onNodeDragStop: (event: React.MouseEvent, node: GadgetNode, nodes: GadgetNode[]) => void;
};

export type FlowSlice = FlowUtilitiesSlice & FlowActions & HoleFocusSlice

export const flowSlice: CreateStateWithInitialValue<FlowStateInitializedFromData, FlowSlice> = (initialState, set, get) => {
  return {
    ...flowUtilitiesSlice(initialState, set, get),
    ...holeFocusSlice(set, get),

    reset: () => {
      flowUtilitiesSlice(initialState, set, get).reset()
      holeFocusSlice(set, get).reset()
    },

    onInit() {
      const initialViewPortSetting = get().setup.settings.initialViewportSetting
      initViewport(get().rf, initialViewPortSetting)
      get().updateLogicalState([])
    },

    onSelectionChange: ({ nodes: selectedNodes }) => {
      const connectedEdges = getConnectedEdges(selectedNodes, get().edges);
      const connectedEdgeIds = new Set(connectedEdges.map((e) => e.id));

      const connectedNodeIds = new Set<string>();
      connectedEdges.forEach(edge => {
        connectedNodeIds.add(edge.source).add(edge.target);
      });
      selectedNodes.forEach(node => connectedNodeIds.delete(node.id));

      set({
        edges: get().edges.map(edge =>
          connectedEdgeIds.has(edge.id) ? { ...edge, ...ELEVATED_EDGE_PROPS } : { ...edge, ...DEFAULT_EDGE_PROPS }
        ),
        nodes: get().nodes.map(node => ({
          ...node,
          zIndex: connectedNodeIds.has(node.id) ? CONNECTED_NODE_Z_INDEX : DEFAULT_NODE_Z_INDEX
        }))
      })
    },

    onEdgesChange: (changes: EdgeChange<Edge>[]) => {
      set({ edges: applyEdgeChanges(changes, get().edges), });
    },

    onBeforeDelete: (payload) => {
      const events = get().removeGadgetNodes(payload.nodes)
      get().updateLogicalState(events)
      return Promise.resolve(false) // prevents reactflow from trying to delete the nodes again 
    },

    onConnectStart: (event: MouseEvent | TouchEvent, params: OnConnectStartParams) => {
      if (params.handleType === "target") {
        const events = get().removeEdgesConnectedToHandle(params.handleId!)
        get().updateLogicalState(events)
      }
      set({ showHoleFocus: false })
      get().hideAnimatedTutorialContent()
    },

    onConnectEnd: () => {
      set({ showHoleFocus: true })
      get().showAnimatedTutorialContent()
    },

    onConnect: (connection: Connection) => {
      if (!isValidConnection(connection)) throw Error(`Connection is not valid ${connection}`)
      const isEqualityConnection = isEqualityHandle(connection.sourceHandle);
      const edgeRemovalEvents = isEqualityConnection ? [] :
        get().removeEdgesConnectedToHandle(connection.targetHandle);
      set({
        edges: addEdge({ ...connection, ...DEFAULT_EDGE_PROPS }, get().edges),
      });
      const generalConnection = toGeneralConnection(connection)!;
      get().updateLogicalState([...edgeRemovalEvents, { ConnectionAdded: generalConnection }])
    },

    onEdgeClick: (event: OnEdgeClick, edge: Edge) => {
      const events = get().removeEdge(edge.id);
      get().updateLogicalState(events);
    },

    onHandleDoubleClick: (event: React.MouseEvent, handleId: string) => {
      const events = get().removeEdgesConnectedToHandle(handleId)
      get().updateLogicalState(events)
    },

    onNodeDrag(event: React.MouseEvent, node: GadgetNode) {
      const proximityConnection = get().getProximityConnection(node.id)
      if (proximityConnection) {
        set({ connectingHandles: [proximityConnection.sourceHandle, proximityConnection.targetHandle] })
      } else {
        set({ connectingHandles: [] })
      }
      get().hideAnimatedTutorialContent()
    },

    onNodeDragStop(event: React.MouseEvent, draggedNode: GadgetNode, nodes: GadgetNode[]) {
      if (get().nodeIsAboveShelf(draggedNode)) {
        nodes.forEach(node => { get().handleGadgetDraggedAboveShelf(node) })
      } else {
        nodes.forEach(node => { get().handleGadgetDragStopAwayFromShelf(node) })
      }
      get().showAnimatedTutorialContent()
    },

  }
}