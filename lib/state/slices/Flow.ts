import { CreateStateWithInitialValue } from '../Types';
import { addEdge, applyEdgeChanges, applyNodeChanges, Connection, Edge, EdgeChange, OnBeforeDelete, OnConnect, OnConnectStartParams, OnEdgesChange, OnNodeDrag, OnNodesChange, ReactFlowInstance, XYPosition } from '@xyflow/react';
import { GadgetNode } from 'components/game/flow/GadgetFlowNode';
import { toGadgetConnection, isValidConnection } from './Edges';
import { initViewport } from 'lib/game/ViewportInitialisation';
import { flowUtilitiesSlice, FlowUtilitiesSlice, FlowUtilitiesState, FlowUtilitiesStateInitializedFromData } from './FlowUtilities';
import { HoleFocusSlice, holeFocusSlice } from './HoleFocus';

export type FlowStateInitializedFromData = FlowUtilitiesStateInitializedFromData

export type FlowState = FlowUtilitiesState

export interface FlowActions {
  reset: () => void;
  onInit: () => void;
  onEdgesChange: OnEdgesChange;
  onBeforeDelete: OnBeforeDelete<GadgetNode, Edge>;
  onConnectStart: (event: MouseEvent | TouchEvent, params: OnConnectStartParams) => void;
  onConnectEnd: () => void;
  onConnect: OnConnect;
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
      if (!isValidConnection(connection))
        throw Error(`Connection is not valid ${connection.source}:${connection.sourceHandle} -> ${connection.target}:${connection.targetHandle}`);
      const edgeRemovalEvents = get().removeEdgesConnectedToHandle(connection.targetHandle)
      set({
        edges: addEdge({ ...connection, type: 'customEdge' }, get().edges),
      });
      const gadgetConnection = toGadgetConnection(connection)
      get().updateLogicalState([...edgeRemovalEvents, { ConnectionAdded: gadgetConnection }])
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