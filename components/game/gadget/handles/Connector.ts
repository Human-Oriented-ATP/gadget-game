import { useGameStateContext } from "lib/state/StateContextProvider"

export type ConnectorStatus = "DEFAULT" | "OPEN" | "CONNECTED" | "BROKEN"

export interface ConnectorDetails {
    status?: ConnectorStatus
    isConnecting?: boolean
    isInline?: boolean
}

export type DoubleClickHandler = (event: React.MouseEvent, handleId: string) => void

export type HandleDoubleClickProps = {
    onHandleDoubleClick?: DoubleClickHandler;
}

export const toDoubleClickHandler = (props: HandleDoubleClickProps & {handleId?: string}) => (event: React.MouseEvent) => {
    if (props.onHandleDoubleClick !== undefined && props.handleId !== undefined) {
        props.onHandleDoubleClick(event, props.handleId);
    }
};

export function useConnectorDetails(handleId?: string): ConnectorDetails {
    const status = useGameStateContext((state) => 
        handleId !== undefined ? state.handleStatus.get(handleId) : undefined
    );
    const isConnecting = useGameStateContext((state) => 
        handleId !== undefined ? state.connectingHandles.includes(handleId) : undefined
    );

    return {status, isConnecting};
}