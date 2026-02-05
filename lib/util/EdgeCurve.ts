import { XYPosition } from "@xyflow/react";
import { EqualityPosition } from "lib/game/Primitives";

export type TensionDirection =
  | { type: "horizontal" }
  | { type: "vertical", sourcePosition?: EqualityPosition, targetPosition?: EqualityPosition }

export interface CurveProps {
    startPos: XYPosition;
    endPos: XYPosition;
    tensionDir: TensionDirection;
}

export function createEdgeCurve(props: CurveProps): string {
    const { startPos, endPos, tensionDir } = props;

    if (tensionDir.type === "horizontal") {
        // Use a tension of 0.5 for an entirely symmetric curve
        const cx = (startPos.x + endPos.x) / 2;
        return (
            `M ${startPos.x} ${startPos.y}
             C ${cx} ${startPos.y}
               ${cx} ${endPos.y}
               ${endPos.x} ${endPos.y}`
        );
    } else {
        // Equality connection
        const { sourcePosition, targetPosition } = tensionDir;

        // Create S-curve when both positions are the same
        if (sourcePosition && targetPosition && sourcePosition === targetPosition) {
            const xDiff = Math.abs(endPos.x - startPos.x);
            const yOffset = sourcePosition === "bottom" ? 80 : -80;
            const controlOffset = xDiff * 0.5;

            const cx1 = startPos.x + (endPos.x > startPos.x ? controlOffset : -controlOffset);
            const cx2 = endPos.x + (endPos.x > startPos.x ? -controlOffset : controlOffset);
            const cy1 = startPos.y + yOffset;
            const cy2 = endPos.y + yOffset;

            return (
                `M ${startPos.x} ${startPos.y}
                 C ${cx1} ${cy1}
                   ${cx2} ${cy2}
                   ${endPos.x} ${endPos.y}`
            );
        } else {
            // Otherwise stick to symmetric vertical curve
            const cy = (startPos.y + endPos.y) / 2;
            return (
                `M ${startPos.x} ${startPos.y}
                 C ${startPos.x} ${cy}
                   ${endPos.x} ${cy}
                   ${endPos.x} ${endPos.y}`
            );
        }
    }
}