"use server"

import { sql } from "../util/Database";
import { promisify } from "node:util"
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { GameHistory } from "./GameHistory";

async function generateNewPlayerId(): Promise<string> {
    const newPlayerId = (await promisify(randomBytes)(20)).toString('hex');
    return newPlayerId
}

async function setPlayerId(playerId: string) {
    const MILLISECONDS_IN_A_YEAR = 1000 * 60 * 60 * 24 * 365
    cookies().set('id', playerId, { expires: new Date(Date.now() + MILLISECONDS_IN_A_YEAR) })
    cookies().set('start_time', new Date().toISOString(), { expires: new Date(Date.now() + MILLISECONDS_IN_A_YEAR) })
}

export async function getPlayerId(): Promise<string> {
    const playerId = cookies().get('id')
    if (playerId === undefined) {
        const newPlayerId = await generateNewPlayerId()
        setPlayerId(newPlayerId)
        return newPlayerId
    } else {
        return playerId.value
    }
}

function passesSanityCheck(history: GameHistory): boolean {
    const logIsNotEmpty = history.log.length !== 0
    return logIsNotEmpty
}

export async function synchronizeHistory(historyString: string) {
    "use server"
    try {
        const playerId = await getPlayerId()
        const history: GameHistory = JSON.parse(historyString)
        if (passesSanityCheck(history)) {
            const log: string = JSON.stringify(history.log);
            const lastSynchronized = new Date().toISOString();
            const startTime = history.startTime.toString();
            await sql`INSERT INTO study_data (player_id, problem_id, config, start, latest, history, completed) VALUES 
                (${playerId}, ${history.problemId}, ${history.configId}, ${startTime}, ${lastSynchronized}, ${log}, ${history.completed})
                ON CONFLICT (player_id, problem_id, start) DO UPDATE
                SET latest=${lastSynchronized}, 
                    history=${log},
                    completed=${history.completed}
                WHERE study_data.completed=false;`
            console.log(`Synchronized history. Player ID: ${playerId}, Problem ID: ${history.problemId}, Config ID: ${history.configId}, Completed: ${history.completed}`)
        }
    } catch (error) {
        console.error("Error synchronizing history.")
        console.error(error);
    }
}