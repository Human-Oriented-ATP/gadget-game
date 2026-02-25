"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Button from "components/primitive/buttons/Default"
import { BugReportDialog } from "./BugReportPopover"

function MainMenuBottomContent() {
    return <>
        <div className="text-sm text-gray-700 bg-blue-50 border border-blue-200 rounded-lg p-3">
            Like solving logical puzzles?<br /> Check out <a href="https://mitpuzzles.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">MIT Puzzles</a>!
        </div>

        <Link href="/privacy-policy" className="hover:underline font-medium">
            Privacy Policy
        </Link>
    </>
}

export function MainMenuTop(props: { onOpenFeedback: () => void }) {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-center flex items-center justify-center gap-2">
                <Image
                    src="/favicon.svg"
                    alt=""
                    aria-hidden
                    width={29}
                    height={29}
                />
                <span>The Gadget Game</span>
            </h1>

            <Button onClick={props.onOpenFeedback}>
                Give Feedback
            </Button>
        </div>
    )
}

export function MainMenuBottom() {
    return <div className="flex flex-col gap-6 text-left">
        <MainMenuBottomContent />
    </div>
}

export function MainMenuBar() {
    const [feedbackPopupIsOpen, setFeedbackPopupIsOpen] = useState(false)

    return <>
        <aside className="w-full md:w-72 md:h-full border-b md:border-b-0 md:border-r border-gray-200 p-6 flex flex-col text-left">
            <MainMenuTop onOpenFeedback={() => setFeedbackPopupIsOpen(true)} />

            <div className="mt-auto flex flex-col gap-6">
                <MainMenuBottomContent />
            </div>
        </aside>

        <BugReportDialog
            isOpen={feedbackPopupIsOpen}
            onClose={() => setFeedbackPopupIsOpen(false)}
        />
    </>
}
