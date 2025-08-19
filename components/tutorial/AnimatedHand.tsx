import { useGameStateContext } from 'lib/state/StateContextProvider'
import { useEffect, useState } from "react"
import { useShallow } from 'zustand/react/shallow'
import ClickingHand from '../assets/ClickingHand';
import PointingHand from '../assets/PointingHand';


export type EndClickType = "none" | "single" | "double"

interface AnimatedHandProps {
    toX: number
    toY: number
    drawLine: boolean
    drawPlacementCircle: boolean
    endWithClick: EndClickType
}

const NUMBER_OF_FRAMES = 100
const MILLISECONDS_BETWEEN_FRAMES = 10
const WAIT_AFTER_ANIMATION = 500
const CLICK_THRESHOLD = 0.9

const IMAGE_SIZE = 70
const CIRCLE_SIZE = 80
const MARGIN = 70 // Ensures that the dotte line & hand are not cut off
const OFFSET_ALIGNING_HAND_AND_LINE_X = -31
const OFFSET_ALIGNING_HAND_AND_LINE_Y = -20

function easeAnimation(x: number) {
    return x * x * (3 - 2 * x)
}

function getMillisecondsUntilNextFrame(animationProgress: number, endWithClick: EndClickType) {
    if (animationProgress >= 1) {
        return WAIT_AFTER_ANIMATION
    } else {
        // Adjust frame timing to normalize speed
        const speedMultiplier = endWithClick !== "none" ? CLICK_THRESHOLD : 1
        return MILLISECONDS_BETWEEN_FRAMES / speedMultiplier
    }
}

function getAnimationState(progress: number, endWithClick: EndClickType) {
    if (endWithClick === "none") {
        return {
            movementProgress: progress,
            showClick: false
        }
    }
    
    // Hand movement takes CLICK_THRESHOLD of the time, and clicking takes the rest
    const movementProgress = Math.min(progress / CLICK_THRESHOLD, 1)
    const clickProgress = Math.max((progress - CLICK_THRESHOLD) / (1 - CLICK_THRESHOLD), 0)
    
    let showClick = false
    if (progress >= CLICK_THRESHOLD) {
        if (endWithClick === "single") {
            showClick = true
        } else if (endWithClick === "double") {
            showClick = clickProgress < 0.25 || 0.7 < clickProgress && clickProgress < 0.95;
        }
    }
    
    return {
        movementProgress,
        showClick
    }
}

export function AnimatedHand(props: AnimatedHandProps) {
    const displayAnimatedTutorialContent = useGameStateContext(useShallow(state => state.displayAnimatedTutorialContent))

    const [animationProgress, setAnimationProgress] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            if (animationProgress < 1)
                setAnimationProgress(animationProgress + 1 / NUMBER_OF_FRAMES)
            else
                setAnimationProgress(0)
        }, getMillisecondsUntilNextFrame(animationProgress, props.endWithClick))

        return () => clearInterval(interval)
    }, [animationProgress, props.endWithClick])

    const animState = getAnimationState(animationProgress, props.endWithClick)
    const easedProgress = easeAnimation(animState.movementProgress)
    
    const x = easedProgress * props.toX
    const y = easedProgress * props.toY

    const height = Math.abs(props.toY) + MARGIN
    const width = Math.abs(props.toX) + MARGIN

    const style = { 'left': `${width + x + OFFSET_ALIGNING_HAND_AND_LINE_X}px`, 'top': `${height + y + OFFSET_ALIGNING_HAND_AND_LINE_Y}px` }

    const IconComponent = animState.showClick ? ClickingHand : PointingHand;

    return <div style={{ "width": `${width * 2}px`, "height": `${height * 2}px`, 'transform': 'translate(-50%,-50%)' }}>
        {props.drawPlacementCircle &&
            <div style={{ left: width + props.toX - CIRCLE_SIZE, top: height + props.toY - CIRCLE_SIZE, height: CIRCLE_SIZE * 2, width: CIRCLE_SIZE * 2 }}
                className={`absolute rounded-full border-4 border-dashed border-black`}></div>
        }
        {displayAnimatedTutorialContent && <>
            {props.drawLine ?
                <svg className="absolute w-full h-full">
                    <line x1={width} y1={height} x2={width + x} y2={height + y} stroke="black" strokeWidth="2" strokeDasharray="5 5" strokeDashoffset={0} />
                </svg>
                : <></>}
            <div className="absolute" style={style}>
                <IconComponent width={IMAGE_SIZE} height={IMAGE_SIZE} className="stroke-black" />
            </div>
        </>}
    </div >
}