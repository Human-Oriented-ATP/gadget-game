"use client"

import Link from "next/link";
import { StudyConfiguration } from "lib/study/Types";
import { findFirstUncompletedProblem, getProblemList } from "lib/study/LevelConfiguration";
import { getCompletedProblems } from "lib/study/CompletedProblems";
import { useEffect, useState } from "react";

type NextProblemInfo = {
    problem: string;
    worldName: string;
    indexInWorld: number;
};

function getNextProblemInfo(config: StudyConfiguration): NextProblemInfo | undefined {
    const nextProblem = findFirstUncompletedProblem(config);
    if (!nextProblem) {
        return undefined;
    }

    for (const category of config.categories) {
        const puzzleProblems = category.problems
            .filter(problem => problem !== "questionnaire1" && problem !== "questionnaire2");
        const indexInWorld = puzzleProblems.indexOf(nextProblem);
        if (indexInWorld !== -1) {
            return {
                problem: nextProblem,
                worldName: category.name,
                indexInWorld: indexInWorld + 1,
            };
        }
    }

    return undefined;
}

export function StartButton(props: { disabled?: boolean; worldLabel?: string; hasSolvedAnyLevel?: boolean }) {
    return <button
        className="border-2 border-black bg-green rounded-lg p-3 px-10 hover:bg-black hover:text-white text-2xl disabled:opacity-60"
        disabled={props.disabled}>
        <div className="leading-tight text-center">
            <div>{props.hasSolvedAnyLevel ? "Continue Playing" : "Start Playing"}</div>
            {props.worldLabel && <div className="text-sm">{props.worldLabel}</div>}
        </div>
    </button>;
}

export default function StartFirstUnsolvedLevelButton({ config, disabled }: { config: StudyConfiguration, disabled?: boolean }) {
    const [href, setHref] = useState<string | undefined>(undefined);
    const [worldLabel, setWorldLabel] = useState<string | undefined>(undefined);
    const [hasSolvedAnyLevel, setHasSolvedAnyLevel] = useState(false);

    useEffect(() => {
        const puzzleProblems = new Set(getProblemList(config));
        const hasSolvedPuzzleLevel = getCompletedProblems().some(problem => puzzleProblems.has(problem));
        setHasSolvedAnyLevel(hasSolvedPuzzleLevel);

        const nextProblemInfo = getNextProblemInfo(config);
        if (!nextProblemInfo) {
            setHref(undefined);
            setWorldLabel(undefined);
            return;
        }

        setHref(`${config.name}/game/${nextProblemInfo.problem}`);
        setWorldLabel(`${nextProblemInfo.worldName} • Puzzle ${nextProblemInfo.indexInWorld}`);
    }, [config]);

    if (disabled) return <StartButton disabled worldLabel={worldLabel} hasSolvedAnyLevel={hasSolvedAnyLevel} />;
    if (href === undefined) return <StartButton disabled worldLabel={worldLabel} hasSolvedAnyLevel={hasSolvedAnyLevel} />;
    return <Link href={href}>
        <StartButton worldLabel={worldLabel} hasSolvedAnyLevel={hasSolvedAnyLevel} />
    </Link>
}
