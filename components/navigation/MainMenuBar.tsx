"use client"

import { useState } from "react"
import Link from "next/link"
import Button from "components/primitive/buttons/Default"
import { BugReportDialog } from "./BugReportPopover"

export function MainMenuBar() {
    const [feedbackPopupIsOpen, setFeedbackPopupIsOpen] = useState(false)

    return <>
        <aside className="w-full md:w-72 md:h-full border-b md:border-b-0 md:border-r border-gray-200 p-6 flex flex-col gap-6 text-left">
            <h1 className="text-2xl font-semibold text-center">The Gadget Game</h1>

            <Button onClick={() => setFeedbackPopupIsOpen(true)}>
                Give Feedback
            </Button>

            <div className="text-sm text-gray-700 bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-sm">
                Like solving logical puzzles?<br /> Check out <a href="https://mitpuzzles.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">https://mitpuzzles.com/</a>!
            </div>

            <Link href="/privacy-policy" className="mt-auto hover:underline font-medium">
                Privacy Policy
            </Link>
        </aside>

        <BugReportDialog
            isOpen={feedbackPopupIsOpen}
            onClose={() => setFeedbackPopupIsOpen(false)}
        />
    </>
}
