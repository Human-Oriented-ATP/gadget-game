"use client"

import { useState } from "react"
import { StudyConfiguration } from "lib/study/Types"
import { MainMenuBar, MainMenuBottom, MainMenuTop } from "./MainMenuBar"
import ProblemCategoryGrid from "./ProblemGrid"
import StartButton from "components/primitive/buttons/StartFirstUnsolvedLevel"
import { BugReportDialog } from "./BugReportPopover"
import { useTouchDevice } from "lib/util/useTouchDevice"

type MainPageProps = { config: StudyConfiguration, allProblems: string[] }

function IntroBanner() {
    return <div className="w-full bg-blue-50 border-b border-blue-200 px-4 py-4 text-sm md:text-base text-gray-800 text-center">
        The Gadget Game was designed by mathematicians and cognitive scientists to understand human reasoning and cognition. Play to help science and have fun!
    </div>
}

function TouchDeviceDetectedBanner() {
    return <div className="w-full bg-yellow-100 border-b-2 border-yellow-500 px-4 py-4 text-sm md:text-base text-gray-800 text-center">
        ⚠️ Sorry, we don&apos;t yet support touch devices. The game won&apos;t function properly on phones or tablets yet. Please use a desktop or laptop computer.
    </div>
}

function StickyStartPanel(props: { config: StudyConfiguration, disableStartButton?: boolean }) {
    return <div className='sticky top-0 p-4 z-20 mb-12 flex justify-center bg-light-gray shadow-lg'>
        <div className='rounded-xl border-2 border-black bg-white p-2'>
            <StartButton config={props.config} disabled={props.disableStartButton} />
        </div>
    </div>
}

export function MainPage({ config, allProblems }: MainPageProps) {
    const [feedbackPopupIsOpen, setFeedbackPopupIsOpen] = useState(false)
    const isTouchDevice = useTouchDevice()

    return <div className="h-dvh flex flex-col overflow-hidden">
        <div className="md:hidden border-b border-gray-200 p-6">
            <MainMenuTop onOpenFeedback={() => setFeedbackPopupIsOpen(true)} />
        </div>

        <div className="flex flex-1 min-h-0 flex-col md:flex-row">
            <div className="hidden md:block">
                <MainMenuBar />
            </div>

            <main className="flex-1 min-h-0 overflow-y-auto">
                {isTouchDevice ? <TouchDeviceDetectedBanner /> : <IntroBanner />}
                <StickyStartPanel config={config} disableStartButton={isTouchDevice === true} />
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
