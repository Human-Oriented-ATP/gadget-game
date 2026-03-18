import { JSX } from "react";
import { ConnectorStatus } from "./handles/Connector";
import { twMerge } from "tailwind-merge";
import { useGameStateContext } from "lib/state/StateContextProvider";

export interface SwapperCaretsProps {
    status?: ConnectorStatus;
    isInline?: boolean;
}

export function SwapperCaretsSvg({ status = "DEFAULT", isInline = false }: SwapperCaretsProps) {
    const rows = 3;
    const cols = 3;
    const caretOffset = 8;
    const caretWidth = 8;
    const caretHeight = 12;
    const spacing = 6;

    const totalWidth = cols * caretWidth + (cols - 1) * spacing;
    const totalHeight = rows * caretHeight + (rows - 1) * spacing;

    let carets: JSX.Element[] = []

    const isBroken = status === "BROKEN";
    const caretClass = twMerge(
        "fill-[#666]",
        isBroken && "animate-svg-fill-glow-red"
    );

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = caretOffset + col * (caretWidth + spacing) - totalWidth / 2;
            const y = row * (caretHeight + spacing) - totalHeight / 2;

            const path = `M ${x},${y + caretHeight / 2} L ${x - caretWidth},${y} L ${x - caretWidth},${y + caretHeight} Z`;

            carets.push(
                <path
                    key={`${row}-${col}`}
                    d={path}
                    className={caretClass}
                    strokeWidth="0"
                />
            );
        }
    }

    const containerClass = twMerge(
        "z-5 pointer-events-none",
        isInline ? "inline-block align-middle w-[24px] h-[32px] mx-1" : "absolute top-0 left-0 w-full h-full"
    );

    return (
        <svg
            overflow="visible"
            className={containerClass}
            viewBox={isInline ? "-18 -24 36 48" : undefined}
            style={!isInline ? { transform: 'translate(50%, 50%)' } : undefined}
        >
            {carets}
        </svg>
    );
}

export function ConnectedSwapperCarets({ gadgetId }: { gadgetId: string }) {
    const isBroken = useGameStateContext((state) =>
        Array.from(state.handleStatus.entries()).some(
            ([handleId, status]) => handleId.endsWith(`_of_${gadgetId}`) && status === "BROKEN"
        )
    );

    return <SwapperCaretsSvg status={isBroken ? "BROKEN" : "DEFAULT"} />;
}
