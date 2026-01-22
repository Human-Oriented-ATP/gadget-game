import { AdjustablePosition, DragIndicatorProps } from "./DragIndicator";
import { InitialDiagram } from "lib/game/Initialization";
import { InitialViewportSetting } from "lib/game/ViewportInitialisation";
import { CellPosition } from "lib/game/CellPosition";
import { GadgetId, EqualityPosition } from "lib/game/Primitives";

export type LevelConfiguration = {
    zoomEnabled: boolean
    proximityConnectEnabled: boolean
    gadgetDeletionEnabled: boolean
    panEnabled: boolean
    initialViewportSetting: InitialViewportSetting
    showBrokenConnectionStatusBarMessage: boolean
    isTutorialLevel: boolean
    skipTime?: number
}

export type GadgetSelector = { gadgetId: GadgetId } | { axiom: string } | "ANY_GADGET";

export type GadgetConnectionSelector = {
    from?: GadgetSelector,
    to?: [GadgetSelector, CellPosition]
}

export type EqualityConnectionSelector = {
    from?: [GadgetSelector, EqualityPosition],
    to?: [GadgetSelector, EqualityPosition]
}

export type ConnectionSelector =
    | { type: "gadget", connection: GadgetConnectionSelector }
    | { type: "equality", connection: EqualityConnectionSelector }
    | { type?: undefined }

export function fromGadgetSelector(selector: GadgetConnectionSelector): ConnectionSelector {
    return {type: "gadget", connection: selector};
}

export type Trigger = { GameCompleted: null }
    | { GadgetAdded: GadgetSelector }
    | { ConnectionAdded: ConnectionSelector }
    | { GadgetRemoved: GadgetSelector }
    | { ConnectionRemoved: ConnectionSelector };

export type GadgetPosition =
    { gadget: GadgetSelector } & AdjustablePosition
    | { elementId: string } & AdjustablePosition

export type JsxAndDragIndicator = {
    popup?: React.JSX.Element
    jsx?: React.JSX.Element
    dragIndicator?: DragIndicatorProps<GadgetPosition>
}

export type InteractiveStep = {
    trigger?: Trigger
    content: JsxAndDragIndicator
}

export type InteractiveLevel = {
    settings?: LevelConfiguration
    initialDiagram?: InitialDiagram
    steps: InteractiveStep[]
}
export const RESTRICTIVE_SETTINGS: LevelConfiguration = {
    zoomEnabled: false,
    panEnabled: false,
    proximityConnectEnabled: false,
    gadgetDeletionEnabled: false,
    initialViewportSetting: "ORIGIN_AT_RIGHT",
    showBrokenConnectionStatusBarMessage: true,
    isTutorialLevel: true
};

export const DELETE_ONLY_SETTINGS: LevelConfiguration = {
    zoomEnabled: false,
    panEnabled: false,
    proximityConnectEnabled: false,
    gadgetDeletionEnabled: true,
    initialViewportSetting: "ORIGIN_AT_RIGHT",
    showBrokenConnectionStatusBarMessage: true,
    isTutorialLevel: true
};

export const DEFAULT_SETTINGS: LevelConfiguration = {
    zoomEnabled: true,
    panEnabled: true,
    proximityConnectEnabled: true,
    gadgetDeletionEnabled: true,
    initialViewportSetting: "ORIGIN_AT_RIGHT",
    showBrokenConnectionStatusBarMessage: true,
    isTutorialLevel: false,
    skipTime: undefined,
};

export const TUTORIAL_SETTINGS: LevelConfiguration = {
    ...DEFAULT_SETTINGS,
    isTutorialLevel: true
}
