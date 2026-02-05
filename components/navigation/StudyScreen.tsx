import { StudyConfiguration } from "lib/study/Types";
import { ProblemSelection } from "./ProblemSelection";

export default function StudyScreen(props: { config: StudyConfiguration, allProblems: string[] }) {
    return <div className="w-full text-center pt-10 relative">
        <div className="absolute top-4 right-4 max-w-xs text-sm text-gray-700 bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-sm">
            Like solving logical puzzles?<br/> Check out <a href="https://mitpuzzles.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">https://mitpuzzles.com/</a>!
        </div>
        <div>
            <h1 className="text-2xl p-8">Welcome to the Gadget Game!</h1>
            <ProblemSelection {...props} />
        </div>
    </div>
}