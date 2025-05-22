import { XYPosition } from '@xyflow/react';
import { GetState, SetState } from '../Types';

interface GadgetDndFromShelfData {
  id: string;
  position: XYPosition;
  axiom: string
  status: "STILL_ABOVE_SHELF" | "MOVED_TO_WORK_BENCH";
}

export interface GadgetDndFromShelfState {
  gadgetBeingDraggedFromShelf: GadgetDndFromShelfData | undefined;
}

export interface GadgetDndFromShelfActions {
  reset: () => void;
  initializeSyntheticDraggging: () => void;
}

export type GadgetDndFromShelfSlice = GadgetDndFromShelfState & GadgetDndFromShelfActions;

function triggerSyntheticDragEvent(gadgetBeingDragged: GadgetDndFromShelfData): void {
  const { id, position } = gadgetBeingDragged;
  const gadgetNodeToBeDragged = document.querySelector(`[data-id='${id}']`);
  gadgetNodeToBeDragged?.dispatchEvent(new MouseEvent("mousedown", {
    bubbles: true,
    cancelable: true,
    view: window,
    clientX: position.x,
    clientY: position.y,
  }));
}

export const gadgetDndFromShelfSlice = (set: SetState<GadgetDndFromShelfSlice>, get: GetState<GadgetDndFromShelfSlice>): GadgetDndFromShelfSlice => {
  return {
    gadgetBeingDraggedFromShelf: undefined,
    reset: () => {
      set({ gadgetBeingDraggedFromShelf: undefined });
    },

    initializeSyntheticDraggging: () => {
      const { gadgetBeingDraggedFromShelf } = get();
      if (gadgetBeingDraggedFromShelf !== undefined) {
        triggerSyntheticDragEvent(gadgetBeingDraggedFromShelf);
        const withUpdatedStatus: GadgetDndFromShelfData = { ...gadgetBeingDraggedFromShelf, status: "MOVED_TO_WORK_BENCH" };
        set({ gadgetBeingDraggedFromShelf: withUpdatedStatus });
        // props.setUserIsDraggingOrNavigating(true)
      } else {
        set({ gadgetBeingDraggedFromShelf: undefined });
      }
    },
  };
};
