"use client"

import { useState } from "react";
import { InitializationData } from "../../lib/game/Initialization";
import Popup, { usePopup } from "../primitive/Popup";
import MenuBar from "components/navigation/MenuBar";
import { GameHelp } from "./GameHelp";
import { Game } from "./Game";
import { interactiveTutorialLevels } from "components/tutorial/InteractiveTutorialLevels";

interface GameScreenProps {
    initData: InitializationData
    problemId: string
}

export function GameScreen(props: GameScreenProps) {
    const [levelIsCompleted, setLevelIsCompleted] = useState(false)
    const [diagramHasBrokenConnection, setDiagramHasBrokenConnection] = useState(false)
    const helpPopup = usePopup()

    const interactiveLevel = interactiveTutorialLevels.get(props.problemId)
    const initialDiagram = interactiveLevel?.initialDiagram
    const initData = initialDiagram ? { ...props.initData, initialDiagram } : props.initData
    const settings = interactiveLevel?.settings
    const showBrokenConnectionStatusBarMessage = settings?.showBrokenConnectionStatusBarMessage ?? true

    return <div className='h-dvh flex flex-col'>
        <div><MenuBar levelIsCompleted={levelIsCompleted} 
                      diagramHasBrokenConnection={showBrokenConnectionStatusBarMessage ? diagramHasBrokenConnection : false} 
                      showHelpWindow={helpPopup.open} /></div>
        <div className="grow">
            <Game 
                problemId={props.problemId}
                initData={initData}
                setLevelIsCompleted={setLevelIsCompleted}
                setDiagramHasBrokenConnection={setDiagramHasBrokenConnection}
                interactiveSteps={interactiveLevel?.steps}
                {...settings}
            />
            <Popup isOpen={helpPopup.isOpen} close={helpPopup.close}><GameHelp /></Popup>
        </div>
    </div>
}