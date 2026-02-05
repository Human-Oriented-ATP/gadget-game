import { CreateStateWithInitialValue } from '../Types';
import { Connection, Edge } from '@xyflow/react';
import { toGeneralConnection } from "lib/game/Connection";
import { GameEvent } from "lib/game/History";
import { isGadgetHandle } from 'lib/game/Handles';

export interface EdgeStateInitializedFromData {
  edges: Edge[],
}

export interface EdgeActions {
  reset: () => void;
  removeEdge: (edgeId: string) => GameEvent[];
  removeEdgesConnectedToNode: (nodeId: string) => GameEvent[];
  removeEdgesConnectedToHandle: (handleId: string) => GameEvent[];
  getHandlesOfEdge: (edgeId: string) => { sourceHandle: string, targetHandle: string };
  connectionExists: (connection: Connection) => boolean;
  doesNotCreateACycle: (connection: Connection) => boolean;
  getEdgesConnectedToHandle: (handle: string) => Edge[];
  isConnectedHandle: (handle: string) => boolean;
};

export type EdgeSlice = EdgeStateInitializedFromData & EdgeActions


export const edgeSlice: CreateStateWithInitialValue<EdgeStateInitializedFromData, EdgeSlice> = (initialState, set, get) => {
  return {
    edges: initialState.edges,
    reset: () => {
      set({ edges: initialState.edges })
    },
    getHandlesOfEdge: (edgeId: string) => {
      const edge = get().edges.find((edge) => edge.id === edgeId);
      if (edge === undefined) throw Error(`Trying to look for edge that does not exist: ${edgeId}`);
      if (!edge.sourceHandle || !edge.targetHandle)
        throw Error(`Edge is missing a source or target handle: ${edgeId} with source ${edge.sourceHandle} and target ${edge.targetHandle}`);
      return {
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle
      }
    },
    removeEdge: (edgeId: string) => {
      const edgesToBeRemoved = get().edges.filter((edge) => edge.id == edgeId);
      const removedGadgetConnections = edgesToBeRemoved.map((edge) => toGeneralConnection(edge as Connection)!)
      const events: GameEvent[] = removedGadgetConnections.map((connection) => ({ ConnectionRemoved: connection }))
      set({
        edges: get().edges.filter((edge) => edge.id !== edgeId),
      });
      return events
    },
    removeEdgesConnectedToNode: (nodeId: string) => {
      const edgesToBeRemoved = get().edges.filter((edge) => edge.source === nodeId || edge.target === nodeId);
      const removedGadgetConnections = edgesToBeRemoved.map((edge) => toGeneralConnection(edge as Connection)!)
      const events: GameEvent[] = removedGadgetConnections.map((connection) => ({ ConnectionRemoved: connection }))
      set({
        edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      });
      return events
    },
    removeEdgesConnectedToHandle: (handleId: string) => {
      const edgesToBeRemoved = get().edges.filter((edge) => edge.sourceHandle === handleId || edge.targetHandle === handleId);
      const removedGadgetConnections = edgesToBeRemoved.map((edge) => toGeneralConnection(edge as Connection)!)
      const events: GameEvent[] = removedGadgetConnections.map((connection) => ({ ConnectionRemoved: connection }))
      set({
        edges: get().edges.filter((edge) => edge.sourceHandle !== handleId && edge.targetHandle !== handleId),
      });
      return events
    },
    connectionExists(connection: Connection) {
      return get().edges.some((edge) => edge.sourceHandle === connection.sourceHandle && edge.targetHandle === connection.targetHandle);
    },
    doesNotCreateACycle: (connection: Connection) => {
      if (!isGadgetHandle(connection.sourceHandle!)) return true;
      const { source, target } = connection
      if (source === target) return false
      const edges = get().edges.filter(edge => isGadgetHandle(edge.sourceHandle!));
      let currentNodes = new Set<string>([source])
      while (true) {
        const incomingEdges = edges.filter((edge) => currentNodes.has(edge.target))
        if (incomingEdges.some((edge) => edge.source === target))
          return false
        else if (incomingEdges.length === 0)
          return true
        else
          currentNodes = new Set<string>(incomingEdges.map((edge) => edge.source))
      }
    },

    getEdgesConnectedToHandle(handle: string) {
      return get().edges.filter(edge => edge.sourceHandle === handle || edge.targetHandle === handle)
    },

    isConnectedHandle(handle: string) {
      return get().getEdgesConnectedToHandle(handle).length > 0
    },

  }
}
