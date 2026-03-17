import { DragIndicatorProps } from "../DragIndicator";
import { GadgetPosition, InteractiveLevel } from "../InteractiveLevel";
import { SourceConnector, TargetConnector } from "../TutorialSetup";
import { RESTRICTIVE_SETTINGS } from "../InteractiveLevel";
import { GOAL_GADGET_ID } from 'lib/game/Primitives';

const firstAxiomDragPoint: GadgetPosition = {
    elementId: "axiom_0",
    anchorPoint: "BOTTOM_RIGHT",
    offset: { x: -20, y: -20 }
};

const dragFirstAxiomOut: DragIndicatorProps<GadgetPosition> = {
    origin: firstAxiomDragPoint,
    destination: { relativePosition: { x: 280, y: 240 } },
    drawPlacementCircle: true
};

const connectGadgets: DragIndicatorProps<GadgetPosition> = {
    origin: {
        gadget: { axiom: "r(1)" },
        anchorPoint: "CENTER_RIGHT",
        offset: { x: -4, y: 0 }
    },
    destination: {
        absolutePosition: {
            elementId: GOAL_GADGET_ID,
            anchorPoint: "CENTER_LEFT",
            offset: { x: 3, y: 0 }
        }
    },
    drawLine: true
};

export const tutorial01: InteractiveLevel = {
    settings: RESTRICTIVE_SETTINGS,
    steps: [{
        content: {
            jsx: <>Drag the matching gadget from the shelf onto the work bench.</>,
            dragIndicator: dragFirstAxiomOut
        },
        trigger: { GadgetAdded: { axiom: "r(1)" } }
    }, {
        content: {
            jsx: <>Now draw a line between the connectors <SourceConnector /> and <TargetConnector />.</>,
            dragIndicator: connectGadgets
        },
        trigger: { ConnectionAdded: {} }
    }, {
        content: {
            jsx: <>You have completed the gadget machine. Click the continue button to proceed to the next level!</>
        }
    }]
};
