"use client"

import ReactCanvasConfetti from "react-canvas-confetti"
import type { CreateTypes as TCanvasConfettiInstance } from "canvas-confetti"
import { useEffect, useRef, useState } from "react"
import { useGameStateContext } from "lib/state/StateContextProvider"

const GAME_CONFETTI_COLORS = [
  "#ff3838",
  "#fff200",
  "#32ff7e",
  "#7d5fff",
  "#ff9f1a",
  "#7efff5",
  "#c56cf0",
  "#ffcccc",
]

function fireCelebration(confetti: TCanvasConfettiInstance) {
  confetti({
    particleCount: 200,
    angle: 70,
    spread: 30,
    startVelocity: 80,
    colors: GAME_CONFETTI_COLORS,
    origin: { x: 0, y: 1.1 },
  })

  confetti({
    particleCount: 200,
    angle: 110,
    spread: 30,
    startVelocity: 80,
    colors: GAME_CONFETTI_COLORS,
    origin: { x: 1, y: 1.1 },
  })

}

export function LevelCompletionConfetti() {
  const levelIsCompleted = useGameStateContext((state) => state.levelIsCompleted)
  const [confetti, setConfetti] = useState<TCanvasConfettiInstance | null>(null)
  const hasPlayedForCurrentCompletion = useRef(false)

  useEffect(() => {
    if (!levelIsCompleted) {
      hasPlayedForCurrentCompletion.current = false
      return
    }

    if (!confetti || hasPlayedForCurrentCompletion.current) {
      return
    }

    hasPlayedForCurrentCompletion.current = true
    fireCelebration(confetti)
  }, [confetti, levelIsCompleted])

  return <ReactCanvasConfetti
    onInit={({ confetti: confettiInstance }) => setConfetti(() => confettiInstance)}
    className="pointer-events-none fixed inset-0 z-[60]"
    style={{ width: "100%", height: "100%", pointerEvents: "none" }}
    globalOptions={{ resize: true, useWorker: true, disableForReducedMotion: true }}
  />
}