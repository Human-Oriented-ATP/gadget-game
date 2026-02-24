import { StudyConfiguration } from "lib/study/Types";
import { ProblemSelection } from "./ProblemSelection";

export default function StudyScreen(props: { config: StudyConfiguration, allProblems: string[] }) {
    return <div className="w-full text-center pt-10 relative">
        <div>
            <ProblemSelection {...props} />
        </div>
    </div>
}