"use client"

import { StudyConfiguration } from "lib/study/Types"
import { MainMenuBar } from "./MainMenuBar"
import StudyScreen from "./StudyScreen"

export function MainPage(props: { config: StudyConfiguration, allProblems: string[] }) {
    return <div className="h-dvh flex flex-col overflow-hidden">
        <div className="w-full bg-blue-50 border-b border-blue-200 px-4 py-4 text-sm md:text-base text-gray-800 text-center">
            The Gadget Game was designed by mathematicians and cognitive scientists to understand human reasoning and cognition. Play to help science and have fun!
        </div>

        <div className="flex flex-1 min-h-0 flex-col md:flex-row">
            <MainMenuBar />


            <main className="flex-1 min-h-0 overflow-y-auto p-6">
                <StudyScreen {...props} />
            </main>
        </div>
    </div>
}
