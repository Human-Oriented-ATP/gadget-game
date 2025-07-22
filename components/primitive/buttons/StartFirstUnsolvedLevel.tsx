"use client"

import Link from "next/link";
import { StudyConfiguration } from "lib/study/Types";
import { findFirstUncompletedProblem } from "lib/study/LevelConfiguration";
import { useEffect, useState } from "react";

export function StartButton(props) {
    return <button className="border-2 border-black bg-green rounded-lg p-3 px-10 hover:bg-black hover:text-white text-2xl"
        {...props}>
        Start
    </button>;
}

export default function StartFirstUnsolvedLevelButton({ config }: { config: StudyConfiguration }) {
    const [href, setHref] = useState<string | undefined>(undefined);
    useEffect(() => (
        setHref(`${config.name}/game/${findFirstUncompletedProblem(config)}`)
    ), [config]);

    if (href === undefined) return <StartButton disabled />;
    return <Link href={href}>
        <StartButton />
    </Link>
}
