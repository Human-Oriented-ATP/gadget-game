"use client"

import { clientSideCookies } from "lib/util/ClientSideCookies";

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
