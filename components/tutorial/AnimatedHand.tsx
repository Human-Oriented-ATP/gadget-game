import { useGameStateContext } from 'lib/state/StateContextProvider'
import Image from 'next/image'
import { useEffect, useState } from "react"
import { useShallow } from 'zustand/react/shallow'

interface AnimatedHandProps {
    toX: number
    toY: number
    drawLine: boolean
    drawPlacementCircle: boolean
    endWithClick: boolean
}

const NUMBER_OF_FRAMES = 100
const MILLISECONDS_BETWEEN_FRAMES = 10
const WAIT_BEFORE_ANIMATION = 500
const WAIT_AFTER_ANIMATION = 500

const IMAGE_SIZE = 70
const CIRCLE_SIZE = 80
const MARGIN = 70 // Ensures that the dotte line & hand are not cut off
const OFFSET_ALIGNING_HAND_AND_LINE_X = -31
const OFFSET_ALIGNING_HAND_AND_LINE_Y = -20

function easeAnimation(x: number) {
    return x * x * (3 - 2 * x)
}

function getMillisecondsUntilNextFrame(animationProgress: number, endWithClick: boolean) {
    if (animationProgress === 0) {
        if (!endWithClick)
            return WAIT_BEFORE_ANIMATION
        else
            return MILLISECONDS_BETWEEN_FRAMES
    } else if (animationProgress >= 1) {
        return WAIT_AFTER_ANIMATION
    } else {
        return MILLISECONDS_BETWEEN_FRAMES
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

    const x = easeAnimation(animationProgress) * props.toX
    const y = easeAnimation(animationProgress) * props.toY

    const height = Math.abs(props.toY) + MARGIN
    const width = Math.abs(props.toX) + MARGIN

    const style = { 'left': `${width + x + OFFSET_ALIGNING_HAND_AND_LINE_X}px`, 'top': `${height + y + OFFSET_ALIGNING_HAND_AND_LINE_Y}px` }

    const imageSource = props.endWithClick && animationProgress >= 0.999 ? "/clicking-hand.svg" : "/pointing-hand.svg"

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
                <Image src={imageSource} width={IMAGE_SIZE} height={IMAGE_SIZE} alt="" className="stroke-black fill-green" />
            </div>
        </>}
    </div >
}