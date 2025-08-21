import { useGameStateContext } from 'lib/state/StateContextProvider';
import { GameSlice } from 'lib/state/Store';
import Button from 'components/primitive/buttons/Default';
import { useShallow } from 'zustand/react/shallow';

const selector = (state: GameSlice) => ({
  isOpen: state.studyCompletionPopupIsOpen,
  close: state.closeStudyCompletionPopup,
  config: state.setup.configurationIdentifier
})


function CompletionPopupContent() {
  return <>
    <h1 className="text-2xl p-4">Thank you for your participation!</h1>
    <div className='text-justify max-w-(--breakpoint-sm) p-4'>
      <p className="p-2">The time limit for participation in this study is over. You can use the following code to confirm your participation on Prolific.</p>

      <div className="flex flex-col items-center m-4">
        <div className="text-xl text-center font-mono bg-palette-gray p-4 w-48">C136DL0Z</div>
      </div>

      <p className="p-2">If you would like you can continue playing the game. Note, however, that this will not be part of your official participation in this study and will not be paid.</p>
    </div>
    <div className="absolute top-0 right-0 p-2 text-sm">Contact: kmc61@cam.ac.uk </div>
  </>
}

export function StudyCompletionPopup() {
  const { isOpen, close, config } = useGameStateContext(useShallow(selector))

  if (config === "internal") {
    return <></>
  }

  if (isOpen) {
    return <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/30" onClick={close}>
      <div className="bg-white p-6 rounded-lg shadow-lg text-center" onClick={e => e.stopPropagation()}>
        <CompletionPopupContent />
        <Button onClick={close}>Continue with the game</Button>
      </div>
    </div>
  } else {
    return <></>
  }
}