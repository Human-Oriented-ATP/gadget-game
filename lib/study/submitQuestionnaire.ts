"use server"

import { sql } from "../util/Database";
import { getPlayerId } from "./synchronizeHistory";
import { StudyConfiguration } from "./Types";
import { cookies } from "next/headers";
import { getProblemList } from "./LevelConfiguration";

const MAXIMUM_STUDY_DURATION = 45 * 60 * 1000;
const COMPLETION_THRESHOLD = 0.9;

export async function submitQuestionnaire1(formData: string) {
    const playerId = await getPlayerId();
    const questionnaire = JSON.parse(formData);
    console.log(questionnaire);
    await sql`INSERT INTO questionnaire_responses (respondent_id, education_level, math_training, math_regularity, 
        specialty, first_language, prolific_id, feedback)
        VALUES (${playerId}, ${questionnaire.educationLevel}, ${questionnaire.mathTraining}, ${questionnaire.mathRegularity}, 
        ${questionnaire.specialty}, ${questionnaire.firstLanguage}, ${questionnaire.prolific}, ${questionnaire.feedback})`;
}

export async function submitQuestionnaire2(formData) {
    const playerId = await getPlayerId();
    const questionnaire = JSON.parse(formData);
    await sql`UPDATE questionnaire_responses
    SET 
        difficulty = ${questionnaire.difficulty}, 
        enjoyableness = ${questionnaire.enjoyableness}, 
        strategies = ${questionnaire.strategies}, 
        skipped = ${questionnaire.skipped},
        feedback2 = ${questionnaire.feedback2}
    WHERE respondent_id = ${playerId};
`;
}

export async function hasSubmittedQuestionnaire2() {
    const submitted = cookies().get("questionnaire2Submitted");
    return submitted !== undefined;
}

export async function hasCompletedEnoughProblems(config: StudyConfiguration) {
    const problems = getProblemList(config);
    const completed = cookies().get("completed");
    if (completed === undefined) {
        return false
    } else {
        const completedProblems = completed.value.split(",");
        const ratioSolved = completedProblems.length / problems.length;
        return ratioSolved >= COMPLETION_THRESHOLD;
    }
}

export async function timeIsOver() {
    const startTime = cookies().get("start_time");
    if (!startTime) {
        return false
    } else {
        const startDate = new Date(startTime.value)
        return startDate.valueOf() + MAXIMUM_STUDY_DURATION < Date.now().valueOf();
    }
}

export async function progressSufficientForQuestionnaire2(config) {
    const completed = await hasCompletedEnoughProblems(config)
    const timeOver = await timeIsOver();
    const hasAlreadySubmitted = await hasSubmittedQuestionnaire2();
    return !hasAlreadySubmitted && (timeOver || completed);
}
