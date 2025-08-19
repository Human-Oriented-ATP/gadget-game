import { DragIndicatorProps } from "../DragIndicator";
import { GadgetPosition, InteractiveLevel, TUTORIAL_SETTINGS } from "../InteractiveLevel";
import { GOAL_GADGET_ID } from 'lib/game/Primitives';
import { InitialDiagram } from "lib/game/Initialization";
import { parseTerm } from "lib/parsing/Semantics";
import { Gadget } from "components/game/gadget/Gadget";
import { BrokenTargetConnector, PinkHole } from "../TutorialSetup";

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
        ["initial_gadget_1", { statement: "b(A) :- r(A, 1), r(A, 2)", position: { x: -150, y: 40 } }],
    ]),
    connections: [{
        from: "initial_gadget_1",
        to: [GOAL_GADGET_ID, 0]
    }]
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

function RedCell1() {
    return <div className="inline-block backdrop-blur-sm scale-75 align-middle pl-1">
        <Gadget id="tutorial_g_1" isOnShelf={true} terms={new Map([[0, parseTerm(`r(A,1)`)]])} />
    </div>
}

function RedCell2() {
    return <div className="inline-block backdrop-blur-sm scale-75 align-middle pl-1">
        <Gadget id="tutorial_g_2" isOnShelf={true} terms={new Map([[0, parseTerm(`r(A,2)`)]])} />
    </div>
}

function TopOnlyGadget() {
    return <div className="inline-block backdrop-blur-sm scale-75 align-middle">
        <Gadget id="tutorial_g_3" isOnShelf={true} terms={new Map([[0, parseTerm(`r(X, C)`)], [-1, parseTerm('r(X, B)')]])} />
    </div>
}

export const pink_tutorial02: InteractiveLevel = {
    settings: { ...TUTORIAL_SETTINGS, showBrokenConnectionStatusBarMessage: false },
    initialDiagram: initialDiagram,
    steps: [{
        content: {
            jsx: <> Start by connecting the gadget with <PinkHole value="?" /> to <RedCell1 />.</>,
        },
        trigger: { ConnectionAdded: { from: { axiom: "r(f(X), X)" }, to: [{ gadgetId: "initial_gadget_1" }, 0] } }
    }, {
        content: {
            jsx: <>Now try connecting another copy to <RedCell2 /> .</>,
        },
        trigger: { ConnectionAdded: { from: { axiom: "r(f(X), X)" }, to: [{ gadgetId: "initial_gadget_1" }, 1] } }
    }, {
        content: {
            jsx: <>Oops! The letters only become the same if the values below them are the same. <br /><br />To continue, remove the connection by double-clicking on <BrokenTargetConnector />.</>,
        },
        trigger: { ConnectionRemoved: {} }
    }, {
        content: {
            jsx: <>Try wiring the <TopOnlyGadget /> gadget in between.</>,
        },
        trigger: { GameCompleted: null }
    }, {
        content: {
            jsx: <>Well done!</>
        }
    }]
};
