import { CreateStateWithInitialValue } from '../Types';
import { Connection, Edge } from '@xyflow/react';
import { getNodePositionFromHandle } from 'lib/game/Handles';
import { GadgetConnection } from "lib/game/History";
import { GameEvent } from "lib/game/History";
import { OUTPUT_POSITION } from 'lib/game/CellPosition';

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

export function isValidConnection(connection: Connection): connection is { source: string, target: string, sourceHandle: string; targetHandle: string } {
  return connection.sourceHandle !== null && connection.targetHandle !== null;
}

export function toGadgetConnection(connection: Connection): GadgetConnection {
  if (!isValidConnection(connection)) throw Error(`Connection is not valid ${JSON.stringify(connection)}`)
  const sourcePosition = getNodePositionFromHandle(connection.sourceHandle)
  const targetPosition = getNodePositionFromHandle(connection.targetHandle)
  if (sourcePosition === OUTPUT_POSITION) {
    return {
      from: connection.source,
      to: [connection.target, targetPosition]
    }
  } else {
    return {
      from: connection.target,
      to: [connection.source, sourcePosition]
    }
  }
}

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
      const removedGadgetConnections = edgesToBeRemoved.map((edge) => toGadgetConnection(edge as Connection))
      const events: GameEvent[] = removedGadgetConnections.map((connection) => ({ ConnectionRemoved: connection }))
      set({
        edges: get().edges.filter((edge) => edge.id !== edgeId),
      });
      return events
    },
    removeEdgesConnectedToNode: (nodeId: string) => {
      const edgesToBeRemoved = get().edges.filter((edge) => edge.source === nodeId || edge.target === nodeId);
      const removedGadgetConnections = edgesToBeRemoved.map((edge) => toGadgetConnection(edge as Connection))
      const events: GameEvent[] = removedGadgetConnections.map((connection) => ({ ConnectionRemoved: connection }))
      set({
        edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      });
      return events
    },
    removeEdgesConnectedToHandle: (handleId: string) => {
      const edgesToBeRemoved = get().edges.filter((edge) => edge.sourceHandle === handleId || edge.targetHandle === handleId);
      const removedGadgetConnections = edgesToBeRemoved.map((edge) => toGadgetConnection(edge as Connection))
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
      const { source, target } = connection
      if (source === target) return false
      const edges = get().edges
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
