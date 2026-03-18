"use client"

import { InitialDiagram } from 'lib/game/Initialization'
import { InteractiveStep, LevelConfiguration } from 'components/tutorial/InteractiveLevel'
import { ReactFlowProvider } from '@xyflow/react'
import { FlowContainer } from './FlowContainer'
import { StudyConfiguration } from 'lib/study/Types'

export interface GameProps {
  initialDiagram: InitialDiagram
  axioms: string[]
  problemId?: string
  destinationIfSolvedHref: string
  configuration?: StudyConfiguration
  settings?: LevelConfiguration
  tutorialSteps?: InteractiveStep[]
}

export function Game(props: GameProps) {
  return <ReactFlowProvider>
    <FlowContainer {...props} />
  </ReactFlowProvider>
}
