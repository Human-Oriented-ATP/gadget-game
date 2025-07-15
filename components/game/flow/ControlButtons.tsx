import { ControlButton, Controls } from "@xyflow/react";
import { Crosshair1Icon, MinusIcon, PlusIcon } from '@radix-ui/react-icons'
import { useGameStateContext } from "lib/state/StateContextProvider";
import { GameSlice } from "lib/state/Store";
import { useShallow } from "zustand/react/shallow";

const selector = (state: GameSlice) => ({
    zoomEnabled: state.setup.settings.zoomEnabled,
    panEnabled: state.setup.settings.panEnabled,
    rf: state.rf
})

export function ControlButtons(): React.JSX.Element {
    const { rf, zoomEnabled, panEnabled } = useGameStateContext(useShallow(selector))

    function fitView() {
        rf.fitView({ padding: 0.5 })
    }

    const buttonClassNames = "w-10! h-10! border-black border-2 rounded-lg m-0.5 hover:bg-black hover:text-white"
    const svgClassNames = "max-w-none! max-h-none! h-full"

    return <Controls showZoom={false} showInteractive={false} showFitView={false} position="bottom-right">
        {zoomEnabled &&
            <>
                <ControlButton className={buttonClassNames} onClick={() => rf.zoomIn()}><PlusIcon className={svgClassNames} /></ControlButton>
                <ControlButton className={buttonClassNames} onClick={() => rf.zoomOut()}><MinusIcon className={svgClassNames} /></ControlButton>
            </>
        }
        {panEnabled &&
            <ControlButton className={buttonClassNames} onClick={() => fitView()}><Crosshair1Icon className={svgClassNames} /></ControlButton>
        }
    </Controls >
}