import { StudyConfiguration } from "lib/study/Types";
import { ProblemSelection } from "./ProblemSelection";

export default function StudyScreen(props: { config: StudyConfiguration, allProblems: string[] }) {
    return <div className="w-full text-center pt-10">
        <div>
            <h1 className="text-2xl p-8">Welcome to the Gadget Game!</h1>
            <ProblemSelection {...props} />
        </div>
    </div>
}