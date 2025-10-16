import { twMerge } from "tailwind-merge"

type StaticHoleProps = {
    value: string
    isFunctionHole: boolean
    isFocussed?: boolean
    onMouseEnter?: () => void
    onMouseLeave?: () => void
}

export function StaticHole(props: StaticHoleProps) {
    const isFocussed = props.isFocussed ?? false
    const className = twMerge("bg-white w-6 h-6 m-1 border-black border-2 rounded-full select-none relative z-50 text-base text-center",
        props.isFunctionHole && "bg-pink",
        isFocussed && "scale-110 bg-yellow-highlight",
        props.isFunctionHole && isFocussed && "bg-peach-highlight"
    );

    return <div className={className} onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
        {props.value}
    </div>
}
