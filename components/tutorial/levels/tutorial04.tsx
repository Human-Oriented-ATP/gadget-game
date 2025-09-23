import { InitialDiagram } from "lib/game/Initialization";
import { DragIndicatorProps } from "../DragIndicator";
import { fromGadgetSelector, GadgetPosition, InteractiveLevel } from "../InteractiveLevel";
import { RESTRICTIVE_SETTINGS } from "../InteractiveLevel";
import { GOAL_GADGET_ID } from 'lib/game/Primitives';

const tutorial04InitialDiagram: InitialDiagram = {
    gadgets: new Map([
        [GOAL_GADGET_ID, { statement: ":-b(1, 2)", position: { x: 0, y: 0 } }],
        ["initial_gadget_1", { statement: "r(1, 2).", position: { x: -400, y: -45 } }],
        ["initial_gadget_2", { statement: "b(A,B):-r(A, B),r(A, C),r(D,B).", position: { x: -200, y: 20 } }]
    ]),
    connections: []
};
const tutorial04SrcDragPoint: GadgetPosition = {
    elementId: "initial_gadget_1",
    anchorPoint: "CENTER_RIGHT",
    offset: { x: 0, y: 0 }
};
const tutorial04TgtDragPoint1: GadgetPosition = {
    elementId: "initial_gadget_2",
    anchorPoint: "CENTER_LEFT",
    offset: { x: 0, y: -75 }
};
const tutorial04TgtDragPoint2: GadgetPosition = {
    elementId: "initial_gadget_2",
    anchorPoint: "CENTER_LEFT",
    offset: { x: 0, y: 0 }
};
const tutorial04TgtDragPoint3: GadgetPosition = {
    elementId: "initial_gadget_2",
    anchorPoint: "CENTER_LEFT",
    offset: { x: 0, y: 75 }
};
const tutorial04DragIndicator1: DragIndicatorProps<GadgetPosition> = {
    origin: tutorial04SrcDragPoint,
    destination: { absolutePosition: tutorial04TgtDragPoint1 },
    drawLine: true
};
const tutorial04DragIndicator2: DragIndicatorProps<GadgetPosition> = {
    origin: tutorial04SrcDragPoint,
    destination: { absolutePosition: tutorial04TgtDragPoint2 },
    drawLine: true
};
const tutorial04DragIndicator3: DragIndicatorProps<GadgetPosition> = {
    origin: tutorial04SrcDragPoint,
    destination: { absolutePosition: tutorial04TgtDragPoint3 },
    drawLine: true
};
export const tutorial04: InteractiveLevel = {
    settings: RESTRICTIVE_SETTINGS,
    initialDiagram: tutorial04InitialDiagram,
    steps: [{
        content: {
            jsx: <>You can create multiple connections from one gadget by drawing multiple lines.</>,
            dragIndicator: tutorial04DragIndicator1
        },
        trigger: { ConnectionAdded: fromGadgetSelector({ to: [{ gadgetId: "initial_gadget_2" }, 0] }) }
    }, {
        content: {
            jsx: <>You can create multiple connections from one gadget by drawing multiple lines.</>,
            dragIndicator: tutorial04DragIndicator2
        },
        trigger: { ConnectionAdded: fromGadgetSelector({ to: [{ gadgetId: "initial_gadget_2" }, 1] }) }
    }, {
        content: {
            jsx: <>You can create multiple connections from one gadget by drawing multiple lines.</>,
            dragIndicator: tutorial04DragIndicator3
        },
        trigger: { ConnectionAdded: fromGadgetSelector({ to: [{ gadgetId: "initial_gadget_2" }, 2] }) }
    }, {
        content: {
            jsx: <>Now make the final connection to finish the level!</>,
        },
        trigger: {
            GameCompleted: null
        }
    }]
};
