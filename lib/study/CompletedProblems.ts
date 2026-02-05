"use client"

import { clientSideCookies } from "lib/util/ClientSideCookies";
import { ProblemCategory, StudyConfiguration } from "./Types";

export function getCompletedProblems(): string[] {
    const completedProblemsString = clientSideCookies.get("completed")
    if (completedProblemsString === undefined) {
        return []
    } else {
        return completedProblemsString.split(",")
    }
}

export function saveLevelCompletedAsCookie(problemId: string | undefined) {
    if (!problemId) return
    if (getCompletedProblems().includes(problemId)) return
    const currentlyCompleted = clientSideCookies.get("completed")
    const newValue = currentlyCompleted === undefined ? problemId : `${currentlyCompleted},${problemId}`
    clientSideCookies.set("completed", newValue, 365)
}

export async function resetProgress() {
    clientSideCookies.delete("completed")
}

function getPreviousCategory(category: ProblemCategory, config: StudyConfiguration): ProblemCategory | undefined {
    try {
        const previousCategoryIndex = config.categories.findIndex(c => c.name === category.name) - 1;
        const previousCategory = config.categories[previousCategoryIndex];
        return previousCategory;
    } catch (e) {
        return undefined;
    }
}

export function categoryIsUnlocked(category: ProblemCategory, config: StudyConfiguration, completedProblems: string[]): boolean {
    const categoryUnlockThreshold = category.categoryUnlockThreshold ?? 0;
    const previousCategory = getPreviousCategory(category, config);
    if (!previousCategory) {
        return true;
    } else {
        const numberOfProblemsSolvedInPreviousCategory = previousCategory.problems.filter((problem) => completedProblems.includes(problem)).length;
        return numberOfProblemsSolvedInPreviousCategory >= categoryUnlockThreshold;
    }
}

export function problemIsUnlocked(problem: string, category: ProblemCategory, completedProblems: string[]): boolean {
    const numberOfUnlockedProblemsInCategory = category.numberOfUnlockedProblems ?? 1;
    const numberOfSolvedProblemsInCategory = category.problems.filter(problem => completedProblems.includes(problem)).length;
    const problemIndex = category.problems.indexOf(problem) + 1;
    return problemIndex <= numberOfSolvedProblemsInCategory + numberOfUnlockedProblemsInCategory;
}
