"use client"

import { FormlessGadgetProps } from "./Gadget";
import { HandleDoubleClickProps } from "./handles/Connector";
import { makeHandleId } from "lib/game/Handles";
import './formlessswapper.css';
import { OUTPUT_POSITION } from "lib/game/CellPosition";
import { CustomCellHandle } from "./handles/CustomCellHandle";

export default function HollowQuestionMark() {
    return (
        <svg viewBox="0 0 30 30" width="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="g">
                    <stop offset="20%" stopColor="magenta"/>
                    <stop offset="50%" stopColor="orange"/>
                    <stop offset="80%" stopColor="red"/>
                </linearGradient>
            </defs>
            <text x="50%" y="58.5%" textAnchor="middle" 
                dominantBaseline="middle" fontSize="25" fill="white"
                stroke="url(#g)" strokeWidth="1" fontWeight="bold">?</text>
        </svg>
    );
}

export function FormlessGadget(props: FormlessGadgetProps & HandleDoubleClickProps) {
    const targetHandleId = !props.isOnShelf ? makeHandleId(0, props.id) : undefined;
    const sourceHandleId = !props.isOnShelf ? makeHandleId(OUTPUT_POSITION, props.id) : undefined;

    return (
        <div className="text-center relative">
            <div className="flex items-center" id={props.id}>
                <CustomCellHandle
                    type="target"
                    handleId={targetHandleId}
                    onHandleDoubleClick={props.onHandleDoubleClick}
                />

                <div className="m-1 border-gray-400 border-2 rounded-lg px-4 py-2 h-9 w-20 flex items-center justify-center swapper-background">
                    <div className="relative z-10">
                        <HollowQuestionMark />
                    </div>
                </div>

                <CustomCellHandle
                    type="source"
                    handleId={sourceHandleId}
                    onHandleDoubleClick={props.onHandleDoubleClick}
                />
            </div>
        </div>
    );
}