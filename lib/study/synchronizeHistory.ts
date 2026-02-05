"use server"

import { sql } from "../util/Database";
import { GameHistory } from "./GameHistory";
import { getPlayerId } from "./playerId";

export async function synchronizeHistory(history: GameHistory) {
    "use server"
    try {
        const playerId = await getPlayerId()
        const log: string = JSON.stringify(history.log);
        const lastSynchronized = new Date().toISOString();
        const startTime = new Date(history.startTime).toISOString();
        await sql`INSERT INTO study_data (player_id, problem_id, config, start, latest, history, completed) VALUES 
            (${playerId}, ${history.problemId}, ${history.configId}, ${startTime}, ${lastSynchronized}, ${log}, ${history.completed})
            ON CONFLICT (player_id, problem_id, start) DO UPDATE
            SET latest=${lastSynchronized}, 
                history=${log},
                completed=${history.completed}
            WHERE study_data.completed=false;`
        console.log(`Synchronized history. Player ID: ${playerId}, Problem ID: ${history.problemId}, Config ID: ${history.configId}, Completed: ${history.completed}`)
    } catch (error) {
        console.error("Error synchronizing history.")
        console.error(error);
    }
}