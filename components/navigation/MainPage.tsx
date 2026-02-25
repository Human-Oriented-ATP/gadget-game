"use client"

import { useState } from "react"
import { StudyConfiguration } from "lib/study/Types"
import { MainMenuBar, MainMenuBottom, MainMenuTop } from "./MainMenuBar"
import ProblemCategoryGrid from "./ProblemGrid"
import StartButton from "components/primitive/buttons/StartFirstUnsolvedLevel"
import { BugReportDialog } from "./BugReportPopover"

type MainPageProps = { config: StudyConfiguration, allProblems: string[] }

function IntroBanner() {
    return <div className="w-full bg-blue-50 border-b border-blue-200 px-4 py-4 text-sm md:text-base text-gray-800 text-center">
        The Gadget Game was designed by mathematicians and cognitive scientists to understand human reasoning and cognition. Play to help science and have fun!
    </div>
}

function StickyStartPanel(props: { config: StudyConfiguration }) {
    return <div className='sticky top-0 p-4 z-20 mb-12 flex justify-center bg-light-gray shadow-lg'>
        <div className='rounded-xl border-2 border-black bg-white p-2'>
            <StartButton config={props.config} />
        </div>
    </div>
}

export function MainPage({ config, allProblems }: MainPageProps) {
    const [feedbackPopupIsOpen, setFeedbackPopupIsOpen] = useState(false)

    return <div className="h-dvh flex flex-col overflow-hidden">
        <div className="md:hidden border-b border-gray-200 p-6">
            <MainMenuTop onOpenFeedback={() => setFeedbackPopupIsOpen(true)} />
        </div>

        <div className="flex flex-1 min-h-0 flex-col md:flex-row">
            <div className="hidden md:block">
                <MainMenuBar />
            </div>

            <main className="flex-1 min-h-0 overflow-y-auto">
                <IntroBanner />
                <StickyStartPanel config={config} />
                <ProblemCategoryGrid config={config} allProblems={allProblems} />

                <div className="md:hidden border-t border-gray-200 p-6">
                    <MainMenuBottom />
                </div>
            </main>
        </div>

        <BugReportDialog
            isOpen={feedbackPopupIsOpen}
            onClose={() => setFeedbackPopupIsOpen(false)}
        />
    </div>
}
