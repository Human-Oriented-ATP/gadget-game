"use client"

import { GameLevelButton } from "components/primitive/buttons/GameLevel";
import { categoryIsUnlocked, getCompletedProblems, problemIsUnlocked } from "lib/study/CompletedProblems";
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

    const isUnlocked = completedProblems !== undefined &&
        categoryIsUnlocked(props.category, props.config, completedProblems);
    const nextProblem = completedProblems && findFirstUncompletedProblem(props.config);

    return <div className="max-w-3xl">
        <div>
            {props.category.name}
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
                            isUnlocked={isUnlocked && problemIsUnlocked(problem, props.category, completedProblems)}
                            isSquare={props.config.displayNamesAs === "number"} />
                    </div>
                </div>
            })}
        </div>
    </div>
}