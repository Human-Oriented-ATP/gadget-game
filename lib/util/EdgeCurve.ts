import { XYPosition } from "@xyflow/react";

export type TensionDirection =
  | { type: "horizontal" }

export interface CurveProps {
    startPos: XYPosition;
    endPos: XYPosition;
    tensionDir: TensionDirection;
}

export function createEdgeCurve(props: CurveProps): string {
    const { startPos, endPos, tensionDir } = props;

    // Use a tension of 0.5 for an entirely symmetric curve
    const cx = (startPos.x + endPos.x) / 2;
    return (
        `M ${startPos.x} ${startPos.y}
            C ${cx} ${startPos.y}
            ${cx} ${endPos.y}
            ${endPos.x} ${endPos.y}`
    );
}