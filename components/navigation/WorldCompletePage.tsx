"use client"

import Link from "next/link"
import Button from "components/primitive/buttons/Default"

function GadgetTrophy() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 240"
            width="210"
            height="252"
            aria-label="Gadget Trophy"
            role="img"
        >
            {/* Stem */}
            <rect x="88" y="136" width="24" height="50" fill="#FFD700" stroke="#000" strokeWidth="3" />

            {/* Cup handles — drawn behind cup body so the join is seamless */}
            <path
                d="M59 58 C16 51 25 112 66 104"
                fill="none"
                stroke="#000"
                strokeWidth="3"
            />
            <path
                d="M141 58 C184 51 175 112 134 104"
                fill="none"
                stroke="#000"
                strokeWidth="3"
            />
            {/* Cup body — drawn on top to cover the inner handle edges */}
            <path
                d="M55 30 L145 30 L130 130 Q100 150 70 130 Z"
                fill="#FFD700"
                stroke="#000"
                strokeWidth="3"
            />
            {/* Base */}
            <rect x="65" y="178" width="70" height="16" rx="4" fill="#FFD700" stroke="#000" strokeWidth="3" />

            {/* Gadget in the center of the cup — smaller and lifted */}
            <rect x="83" y="55" width="34" height="34" rx="6" fill="#ff1e1e" stroke="#000" strokeWidth="2" />
            <circle cx="100" cy="72" r="10" fill="#ffffff" stroke="#000" strokeWidth="2" />
        </svg>
    )
}

type WorldCompletePageProps = {
    config: string
    worldName: string
}

export function WorldCompletePage({ config, worldName }: WorldCompletePageProps) {
    return (
        <div className="w-full flex flex-col items-center text-center pt-12 gap-6 px-4">
            <h1 className="text-4xl font-bold">You completed {worldName.toLowerCase()}!</h1>
            <div className="max-w-lg flex flex-col items-center gap-2 text-gray-700">
                <p className="text-lg">You&apos;ve solved every level in this world &mdash; Excellent work!</p>
            </div>
            <GadgetTrophy />
            <div className="max-w-lg flex flex-col items-center gap-2 text-gray-700">
                <p className="text-lg">Head back to the main page to keep building gadget machines.</p>
            </div>
            <Link href={`/${config}`} className="w-full">
                <Button moreClassnames="h-full text-xl">Back to main page</Button>
            </Link>
        </div>
    )
}
