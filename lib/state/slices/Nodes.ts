import { applyNodeChanges, NodeChange, OnNodesChange } from '@xyflow/react';
import { GadgetNode } from '../../../components/game/flow/GadgetFlowNode';
import { CreateStateWithInitialValue } from '../Types';
import { gadgetDndFromShelfSlice, GadgetDndFromShelfSlice } from './DragGadgetFromShelf';
import { Relation } from 'lib/game/Term';
import { getRelationOfHandle, isTargetHandle, makeHandleId } from 'lib/game/Handles';
import { ConnectorStatus } from 'components/game/gadget/Connector';

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
  getGadgetNodeOfHandle: (handleId: string) => GadgetNode;
  getRelationOfHandle: (handleId: string) => Relation;
  abortAddingGadget: () => void;
  getHandlesOfNode: (nodeId: string) => string[];
  getTargetHandlesOfNode: (nodeId: string) => string[];
  getNode(nodeId: string): GadgetNode;
  getAllHandles(): string[];
};

export type NodeSlice = GadgetDndFromShelfSlice & NodeStateInitializedFromData & NodeState & NodeActions

function hasHandle(node: GadgetNode, handleId: string): boolean {
  const handles = node.handles;
  if (handles === undefined) return false;
  return handles.some((handle) => handle.id === handleId);
}

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

    getGadgetNodeOfHandle(handleId: string): GadgetNode {
      const node = get().nodes.find((node) => hasHandle(node, handleId));
      if (node === undefined) throw Error(`Trying to look for handle that does not exist: ${handleId}`);
      return node
    },

    getRelationOfHandle(handleId: string): Relation {
      const node = get().getGadgetNodeOfHandle(handleId)
      const relations = node.data.relations
      return getRelationOfHandle(handleId, relations)
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

    getHandlesOfNode: (nodeId: string): string[] => {
      const node = get().getNode(nodeId)
      const cellPositions = Array.from(node.data.relations.keys())
      const handles = cellPositions.map((position) => makeHandleId(position, node.data.id))
      return handles
    },

    getTargetHandlesOfNode: (nodeId: string): string[] => {
      const handles = get().getHandlesOfNode(nodeId)
      const targetHandles = handles.filter((handle) => isTargetHandle(handle))
      return targetHandles
    },

    getAllHandles(): string[] {
      const handles = new Array<string>()
      for (const node of get().nodes) {
        handles.push(...Array.from(get().getHandlesOfNode(node.id).values()))
      }
      return handles
    },

  }
}