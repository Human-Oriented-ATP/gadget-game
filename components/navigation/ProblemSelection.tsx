import Button from "components/primitive/buttons/Default"
import  ProblemCategoryGrid from "./ProblemGrid"
import StartButton from "components/primitive/buttons/StartFirstUnsolvedLevel"
import { StudyConfiguration } from "lib/study/Types"
import Link from "next/link"

export function ProblemSelection(props: { config: StudyConfiguration, allProblems: string[] }) {
    return <>
        <div className="p-4 pb-48">
            <ProblemCategoryGrid {...props} />
        </div>
        <div className='fixed bottom-0 flex flex-col items-center w-full bg-middle-gray p-6'>
            <StartButton config={props.config} />
        </div>
        {props.config.displayEndParticipationButton && <div className="relative md:fixed bottom-0 left-0 p-2">
            <Link href={`${props.config.name}/game/questionnaire2`}>
                <Button moreClassnames="text-sm">End participation in study</Button>
            </Link >
        </div>
        }
    </>
}