"use client"

import { GameLevelButton } from "components/primitive/buttons/GameLevel";
import { categoryIsUnlocked, getCompletedProblems, problemIsUnlocked } from "lib/study/CompletedProblems";
import { findFirstUncompletedProblem } from "lib/study/LevelConfiguration";
import { ProblemCategory, StudyConfiguration } from "lib/study/Types";
import next from "next";
import { twJoin } from "tailwind-merge";

interface ProblemCategoryProps {
    config: StudyConfiguration
    category: ProblemCategory;
}

export function ProblemCategoryDisplay(props: ProblemCategoryProps) {
    const completedProblems: string[] = getCompletedProblems()

    function getButtonLabel(index: number, problem: string): string {
        if (props.config.displayNamesAs === "number") {
            return `${index + 1}`
        } else {
            return problem
        }
    }

    const useFlexibleNumberOfColumns = props.config.displayNamesAs !== "number"

    const isUnlocked = categoryIsUnlocked(props.category, props.config, completedProblems)

    const nextProblem = findFirstUncompletedProblem(props.config)

    const problems = props.category.problems.filter(problem => problem !== "questionnaire1" && problem !== "questionnaire2")

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
                            isSolved={completedProblems.includes(problem)}
                            isUnlocked={isUnlocked && problemIsUnlocked(problem, props.category, completedProblems)}
                            isSquare={props.config.displayNamesAs === "number"} />
                    </div>
                </div>
            })}
        </div>
    </div>
}