import { applyNodeChanges, NodeChange, OnNodesChange } from '@xyflow/react';
import { GadgetNode } from '../../../components/game/flow/GadgetFlowNode';
import { CreateStateWithInitialValue } from '../Types';
import { gadgetDndFromShelfSlice, GadgetDndFromShelfSlice } from './DragGadgetFromShelf';
import { ConnectorStatus } from 'components/game/gadget/handles/ConnectorTypes';

export type NodeStateInitializedFromData = {
  nodes: GadgetNode[],
}

export type NodeState = {
  handleStatus: Map<string, ConnectorStatus>
  connectingHandles: string[]
}

export interface NodeActions {
  reset: () => void;
  onNodesChange: OnNodesChange<GadgetNode>;
  abortAddingGadget: () => void;
  getNode(nodeId: string): GadgetNode;
};

export type NodeSlice = GadgetDndFromShelfSlice & NodeStateInitializedFromData & NodeState & NodeActions

function newGadgetNodeHasBeenInitialized(nodeChanges: NodeChange[]) {
  return nodeChanges.length === 1 && nodeChanges[0].type === "dimensions"
}

export const nodeSlice: CreateStateWithInitialValue<NodeStateInitializedFromData, NodeSlice> = (initialState: NodeStateInitializedFromData, set, get): NodeSlice => {
  return {
    ...gadgetDndFromShelfSlice(set, get),
    nodes: initialState.nodes,
    handleStatus: new Map<string, ConnectorStatus>(),
    connectingHandles: [],

    reset: () => {
      gadgetDndFromShelfSlice(set, get).reset()
      set({
        nodes: initialState.nodes,
        handleStatus: new Map<string, ConnectorStatus>(),
        connectingHandles: [],
      })
    },

    onNodesChange: (changes) => {
      if (newGadgetNodeHasBeenInitialized(changes)) {
        get().initializeSyntheticDraggging()
      }
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },

    abortAddingGadget: () => {
      const { gadgetBeingDraggedFromShelf } = get();
      if (gadgetBeingDraggedFromShelf !== undefined) {
        const { id } = gadgetBeingDraggedFromShelf
        set({ nodes: get().nodes.filter((node) => node.id !== id), });
      }
      set({ gadgetBeingDraggedFromShelf: undefined });
    },

    getNode: (nodeId: string): GadgetNode => {
      const node = get().nodes.find((node) => node.id === nodeId);
      if (node === undefined)
        throw Error(`Trying to look for node that does not exist: ${nodeId}`);
      return node
    },
  }
}