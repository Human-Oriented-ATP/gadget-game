import Link from "next/link"
import Button from "../primitive/buttons/Default"
import { ProblemSelection } from "./ProblemSelection"
import internal from "study_setup/internal.json"
import { StudyConfiguration } from "lib/study/Types"
import { ResetProgressButton } from "components/primitive/buttons/ResetProgress"

export default function MainScreen({ allProblems }: { allProblems: string[] }) {
    return <div className="w-screen text-center pt-10">
        <h1 className="text-2xl p-4">Welcome to the Gadgets Game!</h1>

        <h2 className="text-xl p-4">You might find the following interesting:</h2>
        <div>
            <div className="m-1.5 inline-block">
                <Link href="new-tutorial">
                    <Button>Interactive Tutorial</Button>
                </Link>
            </div>
            <div className="m-1.5 inline-block">
                <Link href="pilot1">
                    <Button>Pilot 1</Button>
                </Link>
            </div>
            <div className="m-1.5 inline-block">
                <Link href="pilot1">
                    <Button>Pilot 2</Button>
                </Link>
            </div>
            <div className="m-1.5 inline-block">
                <ResetProgressButton />
            </div>
        </div>

        <h2 className="text-xl p-4">Choose the game you want to play:</h2>
        <div>
            <ProblemSelection config={(internal as StudyConfiguration)} allProblems={allProblems} />
        </div>
    </div>
}