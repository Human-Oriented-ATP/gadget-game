"use client"

import { CheckCircledIcon, ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { GameLevelButton } from "components/primitive/buttons/GameLevel";
import { getCompletedProblems } from "lib/study/CompletedProblems";
import { findFirstUncompletedProblem } from "lib/study/LevelConfiguration";
import { ProblemCategory, StudyConfiguration } from "lib/study/Types";
import { useEffect, useState } from "react";
import { twJoin, twMerge } from "tailwind-merge";

interface ProblemCategoryProps {
    config: StudyConfiguration
    category: ProblemCategory;
}

export function ProblemCategoryDisplay(props: ProblemCategoryProps) {
    const [completedProblems, setCompletedProblems]
        = useState<undefined | string[]>(undefined);
    const [isOpen, setIsOpen] = useState(true);
    const [hasInitializedOpenState, setHasInitializedOpenState] = useState(false);

    useEffect(() => setCompletedProblems(getCompletedProblems()), []);

    function getButtonLabel(index: number, problem: string): string {
        if (props.config.displayNamesAs === "number") {
            return `${index + 1}`
        } else {
            return problem
        }
    }

    const fullNamesDisplayed = props.config.displayNamesAs !== "number"
    const problems = props.category.problems.filter(problem => problem !== "questionnaire1" && problem !== "questionnaire2");
    const solvedProblems = completedProblems?.filter(problem => problems.includes(problem)).length ?? 0;
    const allProblemsSolved = problems.length > 0 && solvedProblems === problems.length;

    useEffect(() => {
        if (completedProblems === undefined || hasInitializedOpenState) {
            return;
        }
        setIsOpen(!allProblemsSolved);
        setHasInitializedOpenState(true);
    }, [allProblemsSolved, completedProblems, hasInitializedOpenState]);

    const nextProblem = completedProblems && findFirstUncompletedProblem(props.config);

    return <div className={twMerge("justify-self-center w-lg border-2 border-gray-300 rounded-lg p-3", fullNamesDisplayed && "w-4xl")}>
        <button className="w-full flex items-center justify-between text-left px-2 py-1"
            onClick={() => setIsOpen(current => !current)}>
            <div className="flex items-center gap-2">
                {isOpen ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                {allProblemsSolved ? <CheckCircledIcon className="w-5 h-5 rounded-full bg-green" /> : <></>}
                <span>{props.category.name}</span>
            </div>
            <span className="text-xs opacity-70 whitespace-nowrap">({solvedProblems}/{problems.length} levels solved)</span>
        </button>
        {isOpen && <div className={twJoin("grid mt-2 justify-items-center grid-cols-5")}>
            {problems.map((problem, index) => {
                return <div className="p-2" key={problem}>
                    <div className="relative">
                        <GameLevelButton
                            label={getButtonLabel(index, problem)}
                            href={`${props.config.name}/game/${problem}`}
                            isSelected={problem === nextProblem}
                            isSolved={ completedProblems !== undefined
                                && completedProblems.includes(problem)
                            }
                            isUnlocked={true}
                            isSquare={props.config.displayNamesAs === "number"} />
                    </div>
                </div>
            })}
        </div>}
    </div>
}