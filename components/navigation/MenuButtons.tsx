import Button from '../primitive/buttons/Default';
import { HighlightedButton } from "../primitive/buttons/Highlighted";
import { HomeIcon, ReloadIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGameStateContext } from 'lib/state/StateContextProvider';
import { useShallow } from 'zustand/react/shallow';
import { GameSlice } from 'lib/state/Store';
import { useCallback } from 'react';

function HelpButton() {
  const openHelpPopup = useGameStateContext(useShallow((state) => state.openHelpPopup))
  return <div className='m-1'>
    <Button onClick={openHelpPopup}>Game Rules</Button>
  </div>
}

function MainMenuButton() {
  const uploadHistory = useGameStateContext(useShallow((state) => state.uploadHistory))
  const router = useRouter();
  const mainButtonAction = useCallback(() => {
    uploadHistory()
    router.push('../')
  }, [router, uploadHistory])

  return <div className='m-1'>
    <Button
      onClick={mainButtonAction}
      aria-label='Main menu'
      title='Main menu'
    >
      <HomeIcon className='h-6 w-6' />
    </Button>
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
  }, [reset, uploadHistory])

  return <div className='m-1'>
    <Button
      onClick={restartLevel}
      aria-label='Restart level'
      title='Restart level'
    >
      <ReloadIcon className='h-6 w-6' />
    </Button>
  </div>
}

function ContinueButton({ nextDestinationHref }: { nextDestinationHref: string }) {
  const levelIsCompleted = useGameStateContext(useShallow((state) => state.levelIsCompleted))
  return <div className='m-1'>
    <Link href={nextDestinationHref}>
      <HighlightedButton disabled={!levelIsCompleted}
        title={levelIsCompleted ? "" : "Connect all gadgets and remove broken connections to continue."}>
        Continue
      </HighlightedButton>
    </Link>
  </div>
}

function ReportBugButton() {
  const openBugReportPopup = useGameStateContext(useShallow((state) => state.openBugReportPopup))
  return (
    <div className='m-1'>
      <Button onClick={openBugReportPopup}>
        Give Feedback
      </Button>
    </div>
  );
}

export function MenuButtons() {
  const { isTutorialLevel, destinationIfSolvedHref } = useGameStateContext(useShallow((state: GameSlice) => ({
    isTutorialLevel: state.setup.settings.isTutorialLevel,
    destinationIfSolvedHref: state.setup.destinationIfSolvedHref,
  })))
  
  return <>
    <ReportBugButton />
    <HelpButton />
    <MainMenuButton />
    {!isTutorialLevel && <RestartLevelButton />}
    <ContinueButton nextDestinationHref={destinationIfSolvedHref} />
  </>;
}
