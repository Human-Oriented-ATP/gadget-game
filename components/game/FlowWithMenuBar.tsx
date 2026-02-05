"use client"

import MenuBar from "components/navigation/MenuBar";
import { Flow } from "./flow/Flow";
import { GadgetShelf } from "./flow/GadgetShelf";
import { HelpPopup } from "./HelpPopup";
import { InteractiveOverlay } from "components/tutorial/InteractiveOverlay";
import { StudyCompletionPopup } from "./StudyCompletionPopup";
import { BugReportPopover } from "components/navigation/BugReportPopover";
import { useGameStateContext } from "lib/state/StateContextProvider";
import { useEffect } from "react";

export default function FlowWithMenuBar() {
  const uploadHistoryWithBeacon = useGameStateContext((state) => state.uploadHistoryWithBeacon);

  useEffect(() => {
    const handleBeforeUnload = () => {
      uploadHistoryWithBeacon();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [uploadHistoryWithBeacon]);

  return <div className='h-dvh flex flex-col select-none'>
    <div className="w-full"><MenuBar /></div>
    <div className="relative flex flex-1">
      <Flow />
      <GadgetShelf />
      <InteractiveOverlay />
      <HelpPopup />
      <StudyCompletionPopup />
      <BugReportPopover />
    </div>
  </div>
}