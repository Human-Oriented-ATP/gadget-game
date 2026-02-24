import { CheckCircledIcon, LockClosedIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { twJoin } from "tailwind-merge";
import Button from "./Default";

function AdjustableButton({ isSquare = false, isNextProblem = false, ...props }) {
    let classNames = "w-36 text-base";
    if (isSquare === true) {
        classNames = "w-16";
    }
    return <Button {...props} moreClassnames={twJoin("h-16", classNames, isNextProblem && "outline outline-offset-2 outline-2 bg-white")} />;
}

export interface GameLevelButtonProps {
    label: string
    href: string
    isSelected: boolean
    isSolved: boolean
    isUnlocked: boolean
    isSquare: boolean
}

export function LockedButton() {
    return <AdjustableButton highlightOnHover={false} isSquare={true}>
        <LockClosedIcon className="w-6 h-6 inline" />
    </AdjustableButton>
}

export function GameLevelButton(props: GameLevelButtonProps) {
    if (props.isUnlocked) {
        return <Link href={props.href}>
            {props.isSolved ?
                <CheckCircledIcon className={twJoin("w-6 h-6 float-right rounded-full bg-green absolute right-0 bottom-0 translate-y-1",
                    props.isSquare && " translate-x-1", !props.isSquare && " translate-x-3")} /> : <></>}
            <AdjustableButton isSquare={props.isSquare} isNextProblem={props.isSelected}>{props.label}</AdjustableButton>
        </Link>
    } else {
        return <LockedButton />
    }
}
