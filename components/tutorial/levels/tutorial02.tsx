import { Gadget } from "components/game/gadget/Gadget";
import { GOAL_GADGET_ID } from 'lib/game/Primitives';
import { InitialDiagram } from "lib/game/Initialization";
import { parseRelation } from "lib/parsing/Semantics";
import { DragIndicatorProps } from "../DragIndicator";
import { GadgetPosition, InteractiveLevel } from "../InteractiveLevel";
import { BrokenTargetConnector } from "../TutorialSetup";
import { RESTRICTIVE_SETTINGS } from "../InteractiveLevel";

const tutorial02InitialDiagram: InitialDiagram = {
    gadgets: new Map([
        [GOAL_GADGET_ID, { statement: ":-r(1, 2)", position: { x: -300, y: 0 } }],
        ["initial_gadget_1", { statement: "r(2, 1).", position: { x: -600, y: -50 } }],
    ]),
    connections: [{
        from: "initial_gadget_1",
        to: [GOAL_GADGET_ID, 0]
    }]
};

const tutorial02DragIndicatorDeleteConnection: DragIndicatorProps<GadgetPosition> = {
    origin: {
        elementId: GOAL_GADGET_ID,
        anchorPoint: "CENTER_LEFT",
        offset: { x: 25, y: 30 }
    },
    destination: { relativePosition: { x: -25, y: -30 } },
    drawLine: false,
    endWithDoubleClick: true
};

function ConverterGadget() {
    return <div className="inline-block backdrop-blur-sm scale-75 align-middle">
        <Gadget id="tutorial_explanation"
            isOnShelf={true}
            relations={new Map([[0, parseRelation("r(A, B)")], [-1, parseRelation("r(B, A)")]])} />
    </div>;
}

export const tutorial02: InteractiveLevel = {
    settings: { ...RESTRICTIVE_SETTINGS, initialViewportSetting: "FIT_INITIAL_DIAGRAM", showBrokenConnectionStatusBarMessage: false },
    initialDiagram: tutorial02InitialDiagram,
    steps: [{
        content: {
            jsx: <>The dotted line means that the connection is broken. Remove it by double-clicking on <BrokenTargetConnector />.</>,
            dragIndicator: tutorial02DragIndicatorDeleteConnection
        },
        trigger: { ConnectionRemoved: { to: [{ gadgetId: GOAL_GADGET_ID }, 0] } }
    }, {
        content: {
            jsx: <>Now add the swapper gadget<ConverterGadget />to the work bench</>,
        },
        trigger: { GadgetAdded: { axiom: "r(A, B):-r(B, A)" } }
    },
    {
        content: {
            jsx: <>You can use this gadget to swap the numbers and complete the gadget machine</>
        },
        trigger: { GameCompleted: null }
    }, 
    {
        content: {
            jsx: <>Well done! Connections that {"aren't"} broken can be removed the same way. <br />
            Clicking on a connection line once also removes it.
            </>
        }
    }]
};
