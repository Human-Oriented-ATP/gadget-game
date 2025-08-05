import { MenuButtons } from './MenuButtons';
import { ExclamationTriangleIcon, StarIcon } from '@radix-ui/react-icons';
import { Connector } from 'components/game/gadget/Connector';
import { useGameStateContext } from 'lib/state/StateContextProvider';
import { GameSlice } from 'lib/state/Store';

const LEVEL_COMPLETED_MESSAGE = <>
    <StarIcon className='w-8 h-8 inline-block mr-2' />
    Level completed!
    <StarIcon className='w-8 h-8 inline-block ml-2' />
</>

const BROKEN_CONNECTION_MESSAGE = <>
    <ExclamationTriangleIcon className='w-8 h-8 inline-block mr-2' />
    Broken connection! Double-click the connector
    <span className="inline-block mx-0.5 align-text-bottom"><Connector type={'target'} isInline={true} status={"BROKEN"} /></span>
    below to remove
</>

const EMPTY_MESSAGE = <></>

const selector = (state: GameSlice) => ({
    levelIsCompleted: state.levelIsCompleted,
    equationIsSatisfied: state.equationIsSatisfied,
    showBrokenConnectionStatusBarMessage: state.setup.settings.showBrokenConnectionStatusBarMessage
})

export default function MenuBar() {
    const { levelIsCompleted, equationIsSatisfied, showBrokenConnectionStatusBarMessage } = useGameStateContext(selector)
    const existsBrokenConnection = Array.from(equationIsSatisfied.values()).some(satisfied => !satisfied)
    const displayBrokenConnectionMessage = existsBrokenConnection && showBrokenConnectionStatusBarMessage

    const message = levelIsCompleted ? LEVEL_COMPLETED_MESSAGE :
        displayBrokenConnectionMessage ? BROKEN_CONNECTION_MESSAGE : EMPTY_MESSAGE

    return <div className="flex items-center justify-center z-10">
        <div className="flex items-center bg-white p-1 shadow-lg w-full text-left">
            <div className='grow m-1 text-center text-xl'>
                {message}
            </div>
            <MenuButtons />
        </div>
    </div>
};
