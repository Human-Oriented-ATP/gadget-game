
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
