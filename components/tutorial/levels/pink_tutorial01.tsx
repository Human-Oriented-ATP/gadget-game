import { DragIndicatorProps } from "../DragIndicator";
import { GadgetPosition, InteractiveLevel, TUTORIAL_SETTINGS } from "../InteractiveLevel";
import { GOAL_GADGET_ID } from 'lib/game/Primitives';
import { InitialDiagram } from "lib/game/Initialization";
import { PinkHole } from "../TutorialSetup";
import { gadgetToGeneralConnection } from "lib/game/Connection";

const firstAxiomDragPoint: GadgetPosition = {
    elementId: "axiom_0",
    anchorPoint: "BOTTOM_RIGHT",
    offset: { x: -20, y: -20 }
};

const dragFirstAxiomOut: DragIndicatorProps<GadgetPosition> = {
    origin: firstAxiomDragPoint,
    destination: { relativePosition: { x: 280, y: 240 } },
};

const initialDiagram: InitialDiagram = {
    gadgets: new Map([
        [GOAL_GADGET_ID, { statement: ":-b(A)", position: { x: 0, y: 0 } }],
        ["initial_gadget_1", { statement: "b(A) :- r(A, 1), r(A, 1)", position: { x: -200, y: -40 } }],
    ]),
    connections: [gadgetToGeneralConnection({
        from: "initial_gadget_1",
        to: [GOAL_GADGET_ID, 0]
    })]
};

const connectGadgets1: DragIndicatorProps<GadgetPosition> = {
    origin: {
        gadget: { gadgetId: "g_0" },
        anchorPoint: "CENTER_RIGHT",
        offset: { x: -4, y: 0 }
    },
    destination: {
        absolutePosition: {
            elementId: "initial_gadget_1",
            anchorPoint: "CENTER_LEFT",
            offset: { x: 3, y: -38 }
        }
    },
    drawLine: true
};

const connectGadgets2: DragIndicatorProps<GadgetPosition> = {
    origin: {
        gadget: { gadgetId: "g_1" },
        anchorPoint: "CENTER_RIGHT",
        offset: { x: -4, y: 0 }
    },
    destination: {
        absolutePosition: {
            elementId: "initial_gadget_1",
            anchorPoint: "CENTER_LEFT",
            offset: { x: 3, y: 38 }
        }
    },
    drawLine: true
};

export const pink_tutorial01: InteractiveLevel = {
    settings: TUTORIAL_SETTINGS,
    initialDiagram: initialDiagram,
    steps: [{
        content: {
            jsx: <> Drag the gadget from the shelf onto the work bench.</>,
            dragIndicator: dragFirstAxiomOut
        },
        trigger: { GadgetAdded: { axiom: "r(f(X), X)" } }
    }, {
        content: {
            jsx: <>The pink circle generates letters! Add another copy of the same gadget.</>,
        },
        trigger: { GadgetAdded: { axiom: "r(f(X), X)" } }
    }, {
        content: {
            jsx: <>See what happens when you make a connection.</>,
            dragIndicator: connectGadgets1
        },
        trigger: { ConnectionAdded: {} }
    }, {
        content: {
            jsx: <>If the circle below <PinkHole /> is the same then the letter in <PinkHole /> becomes the same.</>,
            dragIndicator: connectGadgets2
        },
        trigger: { ConnectionAdded: {} }
    }, {
        content: {
            jsx: <>Well done!</>
        }
    }]
};
