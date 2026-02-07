import { CellPosition } from 'lib/game/CellPosition';
import { connectionToEquation, GeneralConnection, getConnectionEndpoints } from 'lib/game/Connection';
import { axiomToGadget, getGadgetRelations } from 'lib/game/GameLogic';
import { GameEvent } from 'lib/game/History';
import { GadgetId } from 'lib/game/Primitives';
import { getRelationArgs, Relation, VariableName } from 'lib/game/Term';
import { GeneralEquation } from 'lib/game/Unification';
import { ValueMap } from 'lib/util/ValueMap';
import { CreateStateWithInitialValue } from '../Types';
import { GadgetDndFromShelfSlice, gadgetDndFromShelfSlice } from './DragGadgetFromShelf';
import { SetupReadonlyState } from './Setup';
import { GadgetProps } from 'components/game/gadget/Gadget';
import { InitialDiagram } from 'lib/game/Initialization';

export type LogicalStateCache = {
  gadgetPropsCache: Map<GadgetId, GadgetProps>
  statementsCache: Map<GadgetId, string>
  connectionsCache: GeneralConnection[]
}

export interface LogicalStateCacheActions {
  reset: () => void;
  updateLogicalStateWithEvents: (events: GameEvent[]) => void;
  updateGadget: (gadgetId: GadgetId, gadgetProps: GadgetProps, gadgetStatement: string) => void;
  lookupCachedProps: (gadgetId: GadgetId) => GadgetProps | undefined;
  lookupCachedPropsWithDragged: (gadgetId: GadgetId) => GadgetProps | undefined;
  removeGadgetFromCache: (gadgetId: GadgetId) => void;
  addGadgetToCache: (gadgetId: GadgetId, statement: string) => void;
  addConnection: (connection: GeneralConnection) => void;
  removeConnection: (connection: GeneralConnection) => void;
  generalConnectionInCache: (connection: GeneralConnection) => boolean;
  getCachedConnections: () => GeneralConnection[];
  getCurrentGadgetIds: () => GadgetId[];
  getRelationsOfGadget: (gadgetId: GadgetId) => Map<CellPosition, Relation>;
  getCurrentHoleTerms: () => any[];
  getEquationOfConnection: (connection: GeneralConnection) => GeneralEquation;
  getCurrentEquations: () => ValueMap<GeneralConnection, GeneralEquation>;
  getStatementOfGadget: (gadgetId: GadgetId) => string;
  getSomeGadgetWithAxiom: (axiom: string) => GadgetId;
}

export type LogicalStateCacheSlice = SetupReadonlyState & GadgetDndFromShelfSlice & LogicalStateCache & LogicalStateCacheActions;

function getInitialCache(initialDiagram: InitialDiagram): LogicalStateCache {
  const gadgetPropsCache = new Map<GadgetId, GadgetProps>();
  const statementsCache = new Map<GadgetId, string>();

  for (const [gadgetId, gadget] of initialDiagram.gadgets) {
    const gadgetProps = axiomToGadget(gadget.statement, gadgetId);
    gadgetPropsCache.set(gadgetId, gadgetProps);
    statementsCache.set(gadgetId, gadget.statement);
  }

  const connectionsCache = [...initialDiagram.connections];

  return {gadgetPropsCache, statementsCache, connectionsCache};
}

export const logicalStateCacheSlice: CreateStateWithInitialValue<SetupReadonlyState, LogicalStateCacheSlice> = (initialState, set, get): LogicalStateCacheSlice => {
  const initialLogicalState = getInitialCache(initialState.setup.initialDiagram);

  return {
    ...initialState,
    ...gadgetDndFromShelfSlice(set, get),
    ...structuredClone(initialLogicalState),

    reset: () => {
      gadgetDndFromShelfSlice(set, get).reset();
      set(structuredClone(initialLogicalState));
    },

    updateLogicalStateWithEvents: (events: GameEvent[]) => {
      for (const event of events) {
        if ("GadgetAdded" in event) {
          get().addGadgetToCache(event.GadgetAdded.gadgetId, event.GadgetAdded.axiom)
        } else if ("GadgetRemoved" in event) {
          get().removeGadgetFromCache(event.GadgetRemoved.gadgetId)
        } else if ("ConnectionAdded" in event) {
          get().addConnection(event.ConnectionAdded)
        } else if ("ConnectionRemoved" in event) {
          get().removeConnection(event.ConnectionRemoved)
        }
      }
    },

    updateGadget: (gadgetId: GadgetId, gadgetProps: GadgetProps, gadgetStatement: string) => {
      const gadgetPropsCache = new Map(get().gadgetPropsCache);
      const statementsCache = new Map(get().statementsCache);
      gadgetPropsCache.set(gadgetId, gadgetProps);
      statementsCache.set(gadgetId, gadgetStatement);
      set({ gadgetPropsCache, statementsCache });
    },

    lookupCachedProps: (gadgetId: GadgetId) => {
      return get().gadgetPropsCache.get(gadgetId);
    },

    lookupCachedPropsWithDragged: (gadgetId: GadgetId) => {
      const gadgetBeingDragged = get().gadgetBeingDraggedFromShelf;
      if (gadgetBeingDragged !== undefined && gadgetBeingDragged.id === gadgetId) 
        return axiomToGadget(gadgetBeingDragged.axiom, gadgetId);
      return get().gadgetPropsCache.get(gadgetId);
    },

    removeGadgetFromCache: (gadgetId: GadgetId) => {
      const gadgetPropsCache = new Map(get().gadgetPropsCache);
      const statementsCache = new Map(get().statementsCache);
      gadgetPropsCache.delete(gadgetId);
      statementsCache.delete(gadgetId);
      set({ gadgetPropsCache, statementsCache });
    },

    addGadgetToCache: (gadgetId: GadgetId, statement: string) => {
      if (get().lookupCachedProps(gadgetId) !== undefined) {
        throw Error(`Gadget ${gadgetId} already exists in cache`);
      }
      const gadgetProps = axiomToGadget(statement, gadgetId);
      const gadgetPropsCache = new Map(get().gadgetPropsCache);
      const statementsCache = new Map(get().statementsCache);
      gadgetPropsCache.set(gadgetId, gadgetProps);
      statementsCache.set(gadgetId, statement);
      set({ gadgetPropsCache, statementsCache });
    },

    addConnection: (connection: GeneralConnection) => {
      const connectionsCache = [...get().connectionsCache, connection];
      set({ connectionsCache });
    },

    removeConnection: (connection: GeneralConnection) => {
      const connectionsCache = get().connectionsCache.filter(
        conn => JSON.stringify(conn) !== JSON.stringify(connection)
      );
      set({ connectionsCache });
    },

    generalConnectionInCache: (connection: GeneralConnection) => {
      const connectionJson = JSON.stringify(connection);
      return get().connectionsCache.some(conn => JSON.stringify(conn) === connectionJson);
    },

    getCachedConnections: () => {
      return get().connectionsCache;
    },

    getCurrentGadgetIds: () => {
      const cacheGadgetIds = Array.from(get().gadgetPropsCache.keys());

      const gadgetBeingDragged = get().gadgetBeingDraggedFromShelf;
      if (gadgetBeingDragged !== undefined) 
        cacheGadgetIds.push(gadgetBeingDragged.id);

      return cacheGadgetIds;
    },

    getRelationsOfGadget: (gadgetId: GadgetId) => {
      const gadgetBeingDragged = get().gadgetBeingDraggedFromShelf;
      if (gadgetBeingDragged !== undefined && gadgetBeingDragged.id === gadgetId) {
        return getGadgetRelations(gadgetBeingDragged.axiom, gadgetId);
      }

      const gadgetProps = get().lookupCachedProps(gadgetId);
      if (gadgetProps === undefined) {
        throw Error(`Gadget ${gadgetId} not found in cache`);
      }

      return gadgetProps.relations;
    },

    getCurrentHoleTerms: () => {
      const gadgetIds = get().getCurrentGadgetIds();
      const relations = gadgetIds.flatMap(gadgetId => {
        const cachedRelations = get().getRelationsOfGadget(gadgetId);
        return Array.from(cachedRelations.values());
      });
      return relations.flatMap(relation => getRelationArgs(relation));
    },

    getEquationOfConnection: (connection: GeneralConnection): GeneralEquation => {
      const [lhsId, rhsId] = getConnectionEndpoints(connection);
      const lhsRelations = get().getRelationsOfGadget(lhsId);
      const rhsRelations = get().getRelationsOfGadget(rhsId);

      return connectionToEquation(connection, lhsRelations, rhsRelations);
    },

    getCurrentEquations: () => {
      const connections = get().getCachedConnections();
      const connectionsWithEquations: Array<[GeneralConnection, GeneralEquation]> = connections.map((connection) =>
        [connection, get().getEquationOfConnection(connection)]);
      return new ValueMap(connectionsWithEquations);
    },

    getStatementOfGadget: (gadgetId: GadgetId) => {
      const gadgetBeingDragged = get().gadgetBeingDraggedFromShelf;
      if (gadgetBeingDragged !== undefined && gadgetBeingDragged.id === gadgetId) {
        return gadgetBeingDragged.axiom;
      }

      const cachedStatement = get().statementsCache.get(gadgetId);
      if (cachedStatement === undefined)
        throw Error(`Gadget ${gadgetId} statement not found`);

      return cachedStatement;
    },

    getSomeGadgetWithAxiom: (axiom: string) => {
      const gadgetIds = get().getCurrentGadgetIds();
      for (const gadgetId of gadgetIds) {
          const statement = get().getStatementOfGadget(gadgetId);
          if (statement === axiom)
            return gadgetId;
      }
      throw Error(`No gadget with axiom ${axiom} found`);
    },
  };
};