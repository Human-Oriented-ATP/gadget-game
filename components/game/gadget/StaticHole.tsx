import { twMerge } from "tailwind-merge"

type StaticHoleProps = {
    value: string
    isFunctionHole: boolean
    isToggled?: boolean
    isFocussed?: boolean
    onClick?: React.MouseEventHandler<HTMLDivElement>
    onMouseEnter?: () => void
    onMouseLeave?: () => void
}

export function StaticHole(props: StaticHoleProps) {
    const isFocussed = props.isFocussed ?? false
    const className = twMerge("bg-white w-6 h-6 m-1 border-black border-2 rounded-full select-none relative z-50 text-base flex items-center justify-center",
        props.isFunctionHole && "bg-pink",
        props.isToggled && "bg-gray-400",
        isFocussed && "scale-110 bg-yellow-highlight",
        props.isToggled && isFocussed && "bg-peach-highlight",
        props.onClick && "cursor-pointer"
    );

    return <div className={className} onClick={props.onClick} onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
        {props.value}
    </div>
}
