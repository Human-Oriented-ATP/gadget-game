import { DragIndicatorProps } from "../DragIndicator";
import { fromGadgetSelector, GadgetPosition, InteractiveLevel } from "../InteractiveLevel";
import { RESTRICTIVE_SETTINGS } from "../InteractiveLevel";

const redGadgetDragIndicator: DragIndicatorProps<GadgetPosition> = {
    origin: { elementId: "axiom_0", anchorPoint: "BOTTOM_RIGHT", offset: { x: -20, y: -20 } },
    destination: { relativePosition: { x: 200, y: 200 } },
    drawPlacementCircle: true
}

const colorConverterDragIndicator: DragIndicatorProps<GadgetPosition> = {
    origin: { elementId: "axiom_1", anchorPoint: "BOTTOM_RIGHT", offset: { x: -20, y: -20 } },
    destination: { relativePosition: { x: 400, y: 200 } },
    drawPlacementCircle: true
}

const connectionDragIndicator: DragIndicatorProps<GadgetPosition> = {
    origin: { gadget: { axiom: "r(1)" }, anchorPoint: "CENTER_RIGHT", offset: { x: -4, y: 0 } },
    destination: { absolutePosition: { gadget: { axiom: "b(A):-r(A)" }, anchorPoint: "CENTER_LEFT", offset: { x: 3, y: 0 } } },
    drawLine: true
}

export const tutorial01a: InteractiveLevel = {
    settings: RESTRICTIVE_SETTINGS,
    steps: [{
        content: {
            jsx: <>Start by adding the red gadget to the work bench.</>,
            dragIndicator: redGadgetDragIndicator
        },
        trigger: { GadgetAdded: { axiom: "r(1)" } }
    }, {
        content: {
            jsx: <>You can only make connections between the same colors. Add the color converter gadget.</>,
            dragIndicator: colorConverterDragIndicator,
        },
        trigger: { GadgetAdded: { axiom: "b(A):-r(A)" } }
    }, {
        content: {
            jsx: <>Draw connections between the connectors to complete the gadget machine.</>,
            dragIndicator: connectionDragIndicator
        },
        trigger: { ConnectionAdded: fromGadgetSelector({ from: { axiom: "r(1)" } }) }
    }, {
        content: {
            jsx: <>Now draw the final connection.</>
        },
        trigger: { GameCompleted: null }
    }]
};