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

export type LogicalState = {
  gadgetsProps: Map<GadgetId, GadgetProps>
  statements: Map<GadgetId, string>
  connections: GeneralConnection[]
}

export interface LogicalStateActions {
  reset: () => void;
  updateLogicalStateWithEvents: (events: GameEvent[]) => void;
  updateGadget: (gadgetId: GadgetId, gadgetProps: GadgetProps, gadgetStatement: string) => void;
  lookupProps: (gadgetId: GadgetId) => GadgetProps | undefined;
  lookupPropsWithDragged: (gadgetId: GadgetId) => GadgetProps | undefined;
  removeGadgetFromState: (gadgetId: GadgetId) => void;
  addGadgetToState: (gadgetId: GadgetId, statement: string) => void;
  addConnectionToState: (connection: GeneralConnection) => void;
  removeConnectionFromState: (connection: GeneralConnection) => void;
  generalConnectionExists: (connection: GeneralConnection) => boolean;
  getConnections: () => GeneralConnection[];
  getCurrentGadgetIds: () => GadgetId[];
  getRelationsOfGadget: (gadgetId: GadgetId) => Map<CellPosition, Relation>;
  getCurrentHoleTerms: () => any[];
  getEquationOfConnection: (connection: GeneralConnection) => GeneralEquation;
  getCurrentEquations: () => ValueMap<GeneralConnection, GeneralEquation>;
  getStatementOfGadget: (gadgetId: GadgetId) => string;
  getSomeGadgetWithAxiom: (axiom: string) => GadgetId;
}

export type LogicalStateSlice = SetupReadonlyState & GadgetDndFromShelfSlice & LogicalState & LogicalStateActions;

function getInitial(initialDiagram: InitialDiagram): LogicalState {
  const gadgetsProps = new Map<GadgetId, GadgetProps>();
  const statements = new Map<GadgetId, string>();

  for (const [gadgetId, gadget] of initialDiagram.gadgets) {
    const gadgetProps = axiomToGadget(gadget.statement, gadgetId);
    gadgetsProps.set(gadgetId, gadgetProps);
    statements.set(gadgetId, gadget.statement);
  }

  const connections = [...initialDiagram.connections];

  return {gadgetsProps, statements, connections};
}

export const logicalStateSlice: CreateStateWithInitialValue<SetupReadonlyState, LogicalStateSlice> = (initialState, set, get): LogicalStateSlice => {
  const initialLogicalState = getInitial(initialState.setup.initialDiagram);

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
          get().addGadgetToState(event.GadgetAdded.gadgetId, event.GadgetAdded.axiom)
        } else if ("GadgetRemoved" in event) {
          get().removeGadgetFromState(event.GadgetRemoved.gadgetId)
        } else if ("ConnectionAdded" in event) {
          get().addConnectionToState(event.ConnectionAdded)
        } else if ("ConnectionRemoved" in event) {
          get().removeConnectionFromState(event.ConnectionRemoved)
        }
      }
    },

    updateGadget: (gadgetId: GadgetId, gadgetProps: GadgetProps, gadgetStatement: string) => {
      const gadgetsProps = new Map(get().gadgetsProps);
      const statements = new Map(get().statements);
      gadgetsProps.set(gadgetId, gadgetProps);
      statements.set(gadgetId, gadgetStatement);
      set({ gadgetsProps, statements });
    },

    lookupProps: (gadgetId: GadgetId) => {
      return get().gadgetsProps.get(gadgetId);
    },

    lookupPropsWithDragged: (gadgetId: GadgetId) => {
      const gadgetBeingDragged = get().gadgetBeingDraggedFromShelf;
      if (gadgetBeingDragged !== undefined && gadgetBeingDragged.id === gadgetId) 
        return axiomToGadget(gadgetBeingDragged.axiom, gadgetId);
      return get().gadgetsProps.get(gadgetId);
    },

    removeGadgetFromState: (gadgetId: GadgetId) => {
      const gadgetsProps = new Map(get().gadgetsProps);
      const statements = new Map(get().statements);
      gadgetsProps.delete(gadgetId);
      statements.delete(gadgetId);
      set({ gadgetsProps, statements });
    },

    addGadgetToState: (gadgetId: GadgetId, statement: string) => {
      if (get().lookupProps(gadgetId) !== undefined) {
        throw Error(`Gadget ${gadgetId} already exists in `);
      }
      const gadgetProps = axiomToGadget(statement, gadgetId);
      const gadgetsProps = new Map(get().gadgetsProps);
      const statements = new Map(get().statements);
      gadgetsProps.set(gadgetId, gadgetProps);
      statements.set(gadgetId, statement);
      set({ gadgetsProps, statements });
    },

    addConnectionToState: (connection: GeneralConnection) => {
      const connections = [...get().connections, connection];
      set({ connections });
    },

    removeConnectionFromState: (connection: GeneralConnection) => {
      const connections = get().connections.filter(
        conn => JSON.stringify(conn) !== JSON.stringify(connection)
      );
      set({ connections });
    },

    generalConnectionExists: (connection: GeneralConnection) => {
      const connectionJson = JSON.stringify(connection);
      return get().connections.some(conn => JSON.stringify(conn) === connectionJson);
    },

    getConnections: () => {
      return get().connections;
    },

    getCurrentGadgetIds: () => {
      const GadgetIds = Array.from(get().gadgetsProps.keys());

      const gadgetBeingDragged = get().gadgetBeingDraggedFromShelf;
      if (gadgetBeingDragged !== undefined) 
        GadgetIds.push(gadgetBeingDragged.id);

      return GadgetIds;
    },

    getRelationsOfGadget: (gadgetId: GadgetId) => {
      const gadgetBeingDragged = get().gadgetBeingDraggedFromShelf;
      if (gadgetBeingDragged !== undefined && gadgetBeingDragged.id === gadgetId) {
        return getGadgetRelations(gadgetBeingDragged.axiom, gadgetId);
      }

      const gadgetProps = get().lookupProps(gadgetId);
      if (gadgetProps === undefined) {
        throw Error(`Gadget ${gadgetId} not found in `);
      }

      return gadgetProps.relations;
    },

    getCurrentHoleTerms: () => {
      const gadgetIds = get().getCurrentGadgetIds();
      const relations = gadgetIds.flatMap(gadgetId => {
        const Relations = get().getRelationsOfGadget(gadgetId);
        return Array.from(Relations.values());
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
      const connections = get().getConnections();
      const connectionsWithEquations: Array<[GeneralConnection, GeneralEquation]> = connections.map((connection) =>
        [connection, get().getEquationOfConnection(connection)]);
      return new ValueMap(connectionsWithEquations);
    },

    getStatementOfGadget: (gadgetId: GadgetId) => {
      const gadgetBeingDragged = get().gadgetBeingDraggedFromShelf;
      if (gadgetBeingDragged !== undefined && gadgetBeingDragged.id === gadgetId) {
        return gadgetBeingDragged.axiom;
      }

      const Statement = get().statements.get(gadgetId);
      if (Statement === undefined)
        throw Error(`Gadget ${gadgetId} statement not found`);

      return Statement;
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