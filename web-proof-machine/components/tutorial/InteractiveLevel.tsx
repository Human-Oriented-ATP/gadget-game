import { AdjustablePosition, DragIndicatorProps } from "./DragIndicator";
import { InitialDiagram } from "lib/game/Initialization";
import { InitialViewportSetting } from "lib/game/ViewportInitialisation";
import { CellPosition } from "lib/game/CellPosition";
import { GadgetId } from "lib/game/Primitives";

export type LevelConfiguration = {
    zoomEnabled: boolean
    proximityConnectEnabled: boolean
    gadgetDeletionEnabled: boolean
    panEnabled: boolean
    initialViewportSetting: InitialViewportSetting
    showBrokenConnectionStatusBarMessage: boolean
}

export type GadgetSelector = { gadgetId: GadgetId } | { axiom: string } | "ANY_GADGET";

export type Trigger = { GameCompleted: null }
    | { GadgetAdded: GadgetSelector }
    | { ConnectionAdded: { from?: GadgetSelector, to?: [GadgetSelector, CellPosition] } }
    | { GadgetRemoved: GadgetSelector }
    | { ConnectionRemoved: { from?: GadgetSelector, to?: [GadgetSelector, CellPosition] } };

export type OverlayPosition =
    { gadget: GadgetSelector } & AdjustablePosition
    | { elementId: string } & AdjustablePosition

export type JsxAndDragIndicator = {
    jsx?: JSX.Element
    dragIndicator?: DragIndicatorProps<OverlayPosition>
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
    showBrokenConnectionStatusBarMessage: false
};

export const DELETE_ONLY_SETTINGS: LevelConfiguration = {
    zoomEnabled: false,
    panEnabled: false,
    proximityConnectEnabled: false,
    gadgetDeletionEnabled: true,
    initialViewportSetting: "ORIGIN_AT_RIGHT",
    showBrokenConnectionStatusBarMessage: false,
};

export const DEFAULT_SETTINGS: LevelConfiguration = {
    zoomEnabled: true,
    panEnabled: true,
    proximityConnectEnabled: true,
    gadgetDeletionEnabled: true,
    initialViewportSetting: "ORIGIN_AT_RIGHT",
    showBrokenConnectionStatusBarMessage: true
};
