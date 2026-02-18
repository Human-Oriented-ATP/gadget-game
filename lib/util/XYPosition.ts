import { XYPosition } from "@xyflow/react"

function containsPoint(rect: DOMRect, point: XYPosition): boolean {
    return rect.left <= point.x && point.x <= rect.right && rect.top <= point.y && point.y <= rect.bottom
}

export function isAboveGadgetShelf(position: XYPosition): boolean {
    const paletteElement = document.getElementById("gadget_shelf")!
    const paletteRect = paletteElement?.getBoundingClientRect()
    return containsPoint(paletteRect, position)
}

export function pointToString(point: XYPosition): string {
    return point.x + " " + point.y;
}

export function addOffsetX(p: XYPosition, dx: number): XYPosition {
    return { x: p.x + dx, y: p.y };
}

export function addOffsetY(p: XYPosition, dy: number): XYPosition {
    return { x: p.x, y: p.y + dy };
}

export function getCenterRelativeToParent(e: HTMLElement): XYPosition {
    const left = e.offsetLeft;
    const top = e.offsetTop;
    const width = e.offsetWidth;
    const height = e.offsetHeight;
    return { x: left + width / 2, y: top + height / 2 };
}

export function getCenter(rect: DOMRect): XYPosition {
    return {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2
    };
}