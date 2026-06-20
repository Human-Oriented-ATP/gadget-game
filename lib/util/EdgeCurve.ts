import { XYPosition } from "@xyflow/react";
import { EqualityPosition } from "lib/game/Primitives";

export type TensionDirection =
    | { type: "cell" }
    | { type: "equality", sourcePosition?: EqualityPosition, targetPosition?: EqualityPosition }
    | { type: "mixed", sourcePosition?: EqualityPosition }

export interface CurveProps {
    startPos: XYPosition;
    endPos: XYPosition;
    tensionDir: TensionDirection;
}

function createMixedCurve(
    startPos: XYPosition,
    endPos: XYPosition,
    sourcePosition?: EqualityPosition
): string {
    // Source is always equality, target is swapper
    const xDir = Math.sign(endPos.x - startPos.x);
    const xDist = Math.abs(endPos.x - startPos.x);

    // Smoothly vary offset: min 20, max 80, linearly scaled over 50px
    const offset = Math.min(80, Math.max(20, 20 + (xDist / 50) * 60));
    const minOffset = 20;

    const sourceNeedsAvoidance = sourcePosition && ((sourcePosition === "left" ? 1 : -1) * xDir > 0);

    const cy1 = startPos.y;
    const sourceOffset = sourceNeedsAvoidance ? offset : minOffset;
    const cx1 = startPos.x + sourceOffset * (sourcePosition === "left" ? -1 : 1);

    // Swapper vertical avoidance: smoothly scale offset when moving downwards
    const yDist = Math.abs(endPos.y - startPos.y);
    const swapperScaleOffset = Math.min(80, Math.max(20, 20 + (yDist / 50) * 60));
    const targetNeedsAvoidance = endPos.y < startPos.y;
    const targetOffset = targetNeedsAvoidance ? swapperScaleOffset : minOffset;

    const cx2 = endPos.x;
    const cy2 = endPos.y - targetOffset;

    return (
        `M ${startPos.x} ${startPos.y}
         C ${cx1} ${cy1}
           ${cx2} ${cy2}
           ${endPos.x} ${endPos.y}`
    );
}

function createEqualityCurve(
    startPos: XYPosition,
    endPos: XYPosition,
    sourcePosition?: EqualityPosition,
    targetPosition?: EqualityPosition
): string {

    const xDir = Math.sign(endPos.x - startPos.x);
    const sourceNeedsAvoidance = (sourcePosition === "left" ? 1 : -1) * xDir > 0;
    const targetNeedsAvoidance = targetPosition && ((targetPosition === "left" ? -1 : 1) * xDir > 0);

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
    } else if (tensionDir.type === "equality") {
        return createEqualityCurve(startPos, endPos, tensionDir.sourcePosition, tensionDir.targetPosition);
    } else {
        return createMixedCurve(startPos, endPos, tensionDir.sourcePosition);
    }
}