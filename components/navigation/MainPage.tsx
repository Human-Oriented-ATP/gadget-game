"use client"

import { StudyConfiguration } from "lib/study/Types"
import { MainMenuBar } from "./MainMenuBar"
import ProblemCategoryGrid from "./ProblemGrid"
import StartButton from "components/primitive/buttons/StartFirstUnsolvedLevel"

export function MainPage(props: { config: StudyConfiguration, allProblems: string[] }) {
    return <div className="h-dvh flex flex-col overflow-hidden">
        <div className="flex flex-1 min-h-0 flex-col md:flex-row">
            <MainMenuBar />

          <main className="flex-1 min-h-0 overflow-y-auto">
                <div className="w-full bg-blue-50 border-b border-blue-200 px-4 py-4 text-sm md:text-base text-gray-800 text-center">
                    The Gadget Game was designed by mathematicians and cognitive scientists to understand human reasoning and cognition. Play to help science and have fun!
                </div>
    
                <div className='sticky top-0 p-4 z-20 mb-12 flex justify-center bg-light-gray shadow-lg'>
                    <div className='rounded-xl border-2 border-black bg-white p-2'>
                        <StartButton config={props.config} />
                    </div>
                </div>
    
                <ProblemCategoryGrid {...props} />
            </main>
        </div>
    </div>
}
