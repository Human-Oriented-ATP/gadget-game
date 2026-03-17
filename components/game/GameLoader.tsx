import { makeInitializationDataFromProblemFileData } from "lib/game/Initialization"
import { loadProblemData, loadStudyConfiguration } from "lib/game/LoadProblems"
import { parseProblemFile } from "lib/parsing/Semantics"
import { getDestinationIfSolved } from "lib/study/LevelConfiguration"
import { cookies } from "next/headers"
import { Suspense } from "react"
import { Game } from "./Game"
import { DEFAULT_SETTINGS } from "components/tutorial/InteractiveLevel"
import { interactiveTutorialLevels } from "components/tutorial/InteractiveTutorialLevels"

function getTutorialProps(problemId: string) {
    const interactiveLevel = interactiveTutorialLevels.get(problemId)
    return {
        initialDiagramFromTutorialSpecification: interactiveLevel?.initialDiagram,
        settings: interactiveLevel?.settings,
        tutorialSteps: interactiveLevel?.steps
    }
}

function LoadingScreen() {
    return <div className="absolute top-1/3 w-full text-center">...loading game...</div>
}

export async function GameLoader({ configId, problemId }: { configId: string, problemId: string }) {
    const configuration = await loadStudyConfiguration(configId)
    const problemData = await loadProblemData(problemId);

    const completedProblems = (await cookies()).get("completed")?.value?.split(",") ?? []
    const destinationIfSolvedHref = getDestinationIfSolved(configuration, problemId, completedProblems)
    const { initialDiagramFromTutorialSpecification, settings, tutorialSteps } = getTutorialProps(problemId)

    try {
        const problemFileData = parseProblemFile(problemData.trim())
        const { initialDiagram: initialDiagramFromProblemFile, axioms } = makeInitializationDataFromProblemFileData(problemFileData)
        return <Suspense fallback={<LoadingScreen />}>
            <Game
                initialDiagram={initialDiagramFromTutorialSpecification ?? initialDiagramFromProblemFile}
                axioms={axioms}
                problemId={problemId}
                destinationIfSolvedHref={destinationIfSolvedHref}
                configuration={configuration}
                settings={settings ?? DEFAULT_SETTINGS}
                tutorialSteps={tutorialSteps}
            />
        </Suspense>
    } catch (e) {
        return <div>
            <div>Problem file not found or unable to parse.</div>
            <div>{e.message}</div>
        </div>
    }
}
