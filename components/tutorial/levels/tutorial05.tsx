import { InitialDiagram } from "lib/game/Initialization";
import { GadgetPosition, InteractiveLevel } from "../InteractiveLevel";
import { DELETE_ONLY_SETTINGS } from "../InteractiveLevel";
import { DragIndicatorProps } from "../DragIndicator";
import { GOAL_GADGET_ID } from 'lib/game/Primitives';

const tutorial05InitialDiagram: InitialDiagram = {
    gadgets: new Map([
        [GOAL_GADGET_ID, { statement: ":-r(1, 4)", position: { x: 0, y: 0 } }],
        ["initial_gadget_1", { statement: "g(X, Y, Z, W) :- b(X, Y, Z, W), g(X, Z, W, Y).", position: { x: -60, y: -75 } }],
        ["initial_gadget_2", { statement: "g(X, Y, Z, W) :- b(X, Y, Z, W), g(X, Z, W, Y).", position: { x: -75, y: 50 } }],
        ["initial_gadget_3", { statement: "g(X, Y, Z, W) :- b(X, Y, Z, W), g(X, Z, W, Y).", position: { x: -90, y: -150 } }]
    ]),
    connections: []
};

const dragOverGadgetShelf: DragIndicatorProps<GadgetPosition> = {
    origin: { elementId: "initial_gadget_3", anchorPoint: "CENTER_MIDDLE", offset: { x: 0, y: 0 } },
    destination: { absolutePosition: { elementId: "gadget_shelf", anchorPoint: "CENTER_MIDDLE", offset: { x: 0, y: 0 } } },
    drawLine: false
};

export const tutorial05: InteractiveLevel = {
    settings: DELETE_ONLY_SETTINGS,
    initialDiagram: tutorial05InitialDiagram,
    steps: [{
        content: {
            jsx: <>What chaos! Drag gadgets over the gadget shelf to delete them.</>,
            dragIndicator: dragOverGadgetShelf
        },
        trigger: { GadgetRemoved: "ANY_GADGET" }
    }, {
        content: {
            jsx: <>Well done! Remove the other gadgets in the same way.</>,
        },
        trigger: { GadgetRemoved: "ANY_GADGET" }
    }, {
        content: {
            jsx: <>Well done! Remove the other gadgets in the same way.</>,
        },
        trigger: { GadgetRemoved: "ANY_GADGET" }
    }, {
        content: {
            jsx: <>That&apos;s better, now solve the level!</>,
        },
        trigger: {
            GameCompleted: null
        }
    }]
};
