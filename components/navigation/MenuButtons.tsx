import Button from '../primitive/buttons/Default';
import { HighlightedButton } from "../primitive/buttons/Highlighted";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGameStateContext } from 'lib/state/StateContextProvider';
import { useShallow } from 'zustand/react/shallow';
import { GameSlice } from 'lib/state/Store';
import { useCallback, useEffect, useState } from 'react';
import { clientSideCookies } from 'lib/util/ClientSideCookies';

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const paddedSeconds = remainingSeconds.toString().padStart(2, "0");
  return `${minutes}:${paddedSeconds}`;
}

function HelpButton() {
  const openHelpPopup = useGameStateContext(useShallow((state) => state.openHelpPopup))
  return <div className='m-1'>
    <Button onClick={openHelpPopup}>Help</Button>
  </div>
}

function MainMenuButton() {
  const uploadHistory = useGameStateContext(useShallow((state) => state.uploadHistory))
  const router = useRouter();
  const mainButtonAction = useCallback(() => {
    uploadHistory()
    router.push('../')
  }, [])

  return <div className='m-1'>
    <Button onClick={mainButtonAction}>Main menu</Button>
  </div>
}

function RestartLevelButton() {
  const { reset, uploadHistory } = useGameStateContext((state) => state)
  const restartLevel = useCallback(() => {
    const confirmed = confirm("Are you sure that you want to restart the level? All progress will be lost.")
    if (confirmed) {
      uploadHistory()
      reset()
    }
  }, [])

  return <div className='m-1'>
    <Button onClick={restartLevel}>Restart level</Button>
  </div>
}

function SkipButton({ nextLevelHref, skipTime }: { nextLevelHref: string, skipTime: number | undefined }) {
  const [timeUntilSkip, setTimeUntilSkip] = useState(skipTime || 0)
  const uploadHistory = useGameStateContext(useShallow((state) => state.uploadHistory))

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeUntilSkip <= 0) {
        clearInterval(interval)
        return
      }
      setTimeUntilSkip((prev) => prev - 1)
    }, 1000)
  }, [skipTime])

  return <div className='m-1'>
    <Link href={nextLevelHref} onClick={uploadHistory}>
      <Button disabled={timeUntilSkip > 0}
        title={timeUntilSkip <= 0 ? "" : `You can skip this level in ${formatTime(timeUntilSkip)}.`}>
        Skip level
      </Button>
    </Link>
  </div>
}

function NextLevelButton({ nextLevelHref }: { nextLevelHref: string }) {
  const levelIsCompleted = useGameStateContext(useShallow((state) => state.levelIsCompleted))
  return <div className='m-1'>
    <Link href={nextLevelHref}>
      <HighlightedButton disabled={!levelIsCompleted}
        title={levelIsCompleted ? "" : "Connect all gadgets and remove broken connections to continue."}>
        Next level
      </HighlightedButton>
    </Link>
  </div>
}

function ShowCompletionCodeButton() {
  const [showButton, setShowButton] = useState(false);

  const openStudyCompletionPopup = useGameStateContext(useShallow((state) => state.openStudyCompletionPopup))

  const STUDY_DURATION_IN_S = 30 * 60;

  useEffect(() => {
    let startTime = clientSideCookies.get("study_start_time");

    if (!startTime) {
      startTime = Date.now().toString();
      clientSideCookies.set("study_start_time", startTime);
      console.log("Start time was not set!")
    }

    const interval = setInterval(() => {
      const elapsed = (Date.now() - parseInt(startTime, 10)) / 1000;
      if (elapsed >= STUDY_DURATION_IN_S) {
        setShowButton(true);
        openStudyCompletionPopup()
        clearInterval(interval);
      }
      console.log(startTime, elapsed)
    }, 1000);

    return () => clearInterval(interval);
  }, [openStudyCompletionPopup, STUDY_DURATION_IN_S]);


  if (!showButton) {
    return <></>
  } else {
    return <div className='m-1'>
      <Button onClick={openStudyCompletionPopup}>Show Completion Code</Button>
    </div>
  }
}

const selector = (state: GameSlice) => ({
  isTutorialLevel: state.setup.settings.isTutorialLevel,
  skipTime: state.setup.settings.skipTime,
})

export function MenuButtons() {
  const { isTutorialLevel, skipTime } = useGameStateContext(useShallow(selector))

  const { nextProblem } = useGameStateContext((state) => state.setup)
  const nextLevelHref = nextProblem ? `../game/${nextProblem}` : undefined

  const showMainMenuButton = skipTime === undefined && !isTutorialLevel
  const showSkipButton = skipTime !== undefined && nextLevelHref !== undefined

  return <>
    <ShowCompletionCodeButton />
    <HelpButton />
    {showMainMenuButton && <MainMenuButton />}
    {!isTutorialLevel && <RestartLevelButton />}
    {showSkipButton && <SkipButton nextLevelHref={nextLevelHref} skipTime={skipTime} />}
    {nextLevelHref !== undefined && <NextLevelButton nextLevelHref={nextLevelHref} />}
  </>;
}
