export type ProblemCategory = {
    name: string;
    problems: string[];
};

export interface StudyConfiguration {
    name: string;
    displayNamesAs: "name" | "number"
    displayUnlistedProblems: boolean
    displayEndParticipationButton: boolean
    skipTime?: number
    categories: ProblemCategory[]
}