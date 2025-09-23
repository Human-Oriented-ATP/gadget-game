"use client"

import { GadgetId } from "../game/Primitives";
import { GeneralConnection } from 'lib/game/Connection';

export type GameEvent = { GameCompleted: null }
    | { GadgetAdded: { gadgetId?: GadgetId, axiom?: string } }
    | { ConnectionAdded: GeneralConnection }
    | { GadgetRemoved: { gadgetId?: GadgetId } }
    | { ConnectionRemoved: GeneralConnection };

export type GameHistory = {
    problemId: string
    configId: string
    startTime: Date
    completed: boolean
    log: [GameEvent, Date][]
}
