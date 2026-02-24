"use client"

import { GameLevelButton } from "components/primitive/buttons/GameLevel";
import { getCompletedProblems } from "lib/study/CompletedProblems";
import { findFirstUncompletedProblem } from "lib/study/LevelConfiguration";
import { ProblemCategory, StudyConfiguration } from "lib/study/Types";
import { useEffect, useState } from "react";
import { twJoin } from "tailwind-merge";

interface ProblemCategoryProps {
    config: StudyConfiguration
    category: ProblemCategory;
}

export function ProblemCategoryDisplay(props: ProblemCategoryProps) {
    const [completedProblems, setCompletedProblems]
        = useState<undefined | string[]>(undefined);

    useEffect(() => setCompletedProblems(getCompletedProblems()), []);

    function getButtonLabel(index: number, problem: string): string {
        if (props.config.displayNamesAs === "number") {
            return `${index + 1}`
        } else {
            return problem
        }
    }

    const useFlexibleNumberOfColumns = props.config.displayNamesAs !== "number"
    const problems = props.category.problems.filter(problem => problem !== "questionnaire1" && problem !== "questionnaire2");
    const solvedProblems = completedProblems?.filter(problem => problems.includes(problem)).length ?? 0;

    const nextProblem = completedProblems && findFirstUncompletedProblem(props.config);

    return <div className="max-w-3xl">
        <div className="flex items-baseline gap-2">
            <span>{props.category.name}</span>
            <span className="text-xs opacity-70">({solvedProblems}/{problems.length} levels solved)</span>
        </div>
        <div className={twJoin("grid", useFlexibleNumberOfColumns && "grid-cols-3 md:grid-cols-5", !useFlexibleNumberOfColumns && "grid-cols-5")}>
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
        </div>
    </div>
}