"use client"

import MenuBar from "components/navigation/MenuBar";
import { Flow } from "./flow/Flow";
import { GadgetShelf } from "./flow/GadgetShelf";
import { HelpPopup } from "./HelpPopup";
import { InteractiveOverlay } from "components/tutorial/InteractiveOverlay";
import { StudyCompletionPopup } from "./StudyCompletionPopup";

export default function FlowWithMenuBar() {
  return <div className='h-dvh flex flex-col select-none'>
    <div className="w-full"><MenuBar /></div>
    <div className="relative flex flex-1">
      <Flow />
      <GadgetShelf />
      <InteractiveOverlay />
      <HelpPopup />
      <StudyCompletionPopup />
    </div>
  </div>
}