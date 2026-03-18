import { getCompletedProblems } from "./CompletedProblems";
import { StudyConfiguration } from "./Types";

function getProblemListWithQuestionnaires(config: StudyConfiguration): string[] {
    const categories = config.categories
    const problemList = categories.flatMap(category => category.problems)
    return problemList
}

export function getProblemList(config: StudyConfiguration): string[] {
    const problems = getProblemListWithQuestionnaires(config)
        .filter(problem => problem !== "questionnaire1" && problem !== "questionnaire2")
    return problems
}

export function getDestinationIfSolved(config: StudyConfiguration, currentProblem: string, completedProblems: string[] = []): string {
    const category = config.categories.find(cat => cat.problems.includes(currentProblem))

    if (!category) {
        return `/${config.name}/`
    }

    const categoryProblems = category.problems
    const currentIndex = categoryProblems.indexOf(currentProblem)
    const otherProblems = categoryProblems.filter((_, i) => i !== currentIndex)
    const allOthersCompleted = otherProblems.every(p => completedProblems.includes(p))

    if (allOthersCompleted) {
        return `../world-complete?worldName=${encodeURIComponent(category.name)}`
    }

    const isLastInCategory = currentIndex === categoryProblems.length - 1
    if (isLastInCategory) {
        return `/${config.name}/`
    }

    return `../game/${categoryProblems[currentIndex + 1]}`
}

export function findFirstUncompletedProblem(config: StudyConfiguration): string | undefined {
    const problems = getProblemList(config!);
    const completedProblems = getCompletedProblems();
    const firstUncompletedProblem = problems.find(problem => !completedProblems.includes(problem));
    return firstUncompletedProblem;
}

