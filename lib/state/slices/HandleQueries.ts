import { CreateStateWithInitialValue } from '../Types';
import { isGadgetHandle, isTargetHandle, makeEqualityHandleId, makeHandleId } from 'lib/game/Handles';
import { EqualityPosition, GadgetId } from 'lib/game/Primitives';
import { OUTPUT_POSITION, CellPosition } from 'lib/game/CellPosition';
import { TutorialStateInitializedFromData } from './Tutorial';
import { logicalStateSlice, LogicalStateSlice } from './LogicalState';

export type HandleQueriesStateInitializedFromData = TutorialStateInitializedFromData

export interface HandleQueriesActions {
  reset: () => void;
  getHandlesOfGadget: (gadgetId: GadgetId) => string[];
  getTargetHandlesOfGadget: (gadgetId: GadgetId) => string[];
  getAntecedentHandlesOfGadget: (gadgetId: GadgetId) => string[];
  getAllHandles(): string[];
}

export type HandleQueriesSlice = LogicalStateSlice & HandleQueriesActions;

export const handleQueriesSlice: CreateStateWithInitialValue<HandleQueriesStateInitializedFromData, HandleQueriesSlice> = (initialState, set, get): HandleQueriesSlice => {
  return {
    ...logicalStateSlice(initialState, set, get),

    reset: () => {
      logicalStateSlice(initialState, set, get).reset();
    },

    getHandlesOfGadget: (gadgetId: GadgetId): string[] => {
      const gadgetProps = get().lookupPropsWithDragged(gadgetId);
      if (gadgetProps === undefined) {
        throw Error(`Gadget ${gadgetId} not found in state`);
      }

      const relations = gadgetProps.relations;
      const cellPositions = Array.from(relations.keys());

      const getCellHandles = (pos: CellPosition) => {
        const relation = relations.get(pos)!;
        const cellHandles = "equals" in relation ? [] : [makeHandleId(pos, gadgetId)];
        if ("equals" in relation && pos === OUTPUT_POSITION)
          cellHandles.push(...["left", "right"].map(
            (eqPos: EqualityPosition) => makeEqualityHandleId(gadgetId, eqPos))
          );
        return cellHandles;
      }

      const handles = cellPositions.flatMap(getCellHandles);
      return handles
    },

    getTargetHandlesOfGadget: (gadgetId: GadgetId): string[] => {
      const handles = get().getHandlesOfGadget(gadgetId)
      const targetHandles = handles.filter((handle) => isTargetHandle(handle))
      return targetHandles
    },

    getAntecedentHandlesOfGadget: (gadgetId: GadgetId): string[] => {
      const handles = get().getHandlesOfGadget(gadgetId)
      const targetHandles = handles.filter((handle) =>
        !isGadgetHandle(handle) || isTargetHandle(handle)
      );
      return targetHandles
    },

    getAllHandles(): string[] {
      const gadgetIds = get().getCurrentGadgetIds();
      const handles = gadgetIds.flatMap(id => get().getHandlesOfGadget(id));
      return handles
    },

  }
}
