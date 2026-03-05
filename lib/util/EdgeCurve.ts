import { XYPosition } from "@xyflow/react";
import { EqualityPosition } from "lib/game/Primitives";

export type TensionDirection =
    | { type: "cell" }
    | { type: "equality", sourcePosition?: EqualityPosition, targetPosition?: EqualityPosition }

export interface CurveProps {
    startPos: XYPosition;
    endPos: XYPosition;
    tensionDir: TensionDirection;
}

function createEqualityCurve(
    startPos: XYPosition,
    endPos: XYPosition,
    sourcePosition?: EqualityPosition,
    targetPosition?: EqualityPosition
): string {

    const xDir = Math.sign(endPos.x - startPos.x);
    const sourceNeedsAvoidance = (sourcePosition === "left" ? 1 : -1) * xDir > 0;
    const targetNeedsAvoidance = (targetPosition === "left" ? -1 : 1) * xDir > 0;

    // Logic for pushing connection line away from gadget
    if (sourcePosition && targetPosition && (sourceNeedsAvoidance || targetNeedsAvoidance)) {
        // Smoothly vary offset: min 20, max 80, linearly scaled over 50px
        const xDist = Math.abs(endPos.x - startPos.x);
        const offset = Math.min(80, 20 + (xDist / 50) * 60);

        // Non-avoided handles still get minimum offset
        const minOffset = 20;

        const sourceOffset = sourceNeedsAvoidance ? offset : minOffset;
        const targetOffset = targetNeedsAvoidance ? offset : minOffset;

        const cx1 = startPos.x + sourceOffset * (sourcePosition === "left" ? -1 : 1);
        const cx2 = endPos.x + targetOffset * (targetPosition === "left" ? -1 : 1);

        return (
            `M ${startPos.x} ${startPos.y}
             C ${cx1} ${startPos.y}
               ${cx2} ${endPos.y}
               ${endPos.x} ${endPos.y}`
        );
    } else {
        const minOffset = 20;
        const cx1 = startPos.x + minOffset * (sourcePosition === "left" ? -1 : 1);
        const cx2 = endPos.x + minOffset * (targetPosition === "left" ? -1 : 1);

        return (
            `M ${startPos.x} ${startPos.y}
             C ${cx1} ${startPos.y}
               ${cx2} ${endPos.y}
               ${endPos.x} ${endPos.y}`
        );
    }
}

export function createEdgeCurve(props: CurveProps): string {
    const { startPos, endPos, tensionDir } = props;

    if (tensionDir.type === "cell") {
        // Use a tension of 0.5 for an entirely symmetric curve
        const cx = (startPos.x + endPos.x) / 2;
        return (
            `M ${startPos.x} ${startPos.y}
             C ${cx} ${startPos.y}
               ${cx} ${endPos.y}
               ${endPos.x} ${endPos.y}`
        );
    } else {
        return createEqualityCurve(startPos, endPos, tensionDir.sourcePosition, tensionDir.targetPosition);
    }
}