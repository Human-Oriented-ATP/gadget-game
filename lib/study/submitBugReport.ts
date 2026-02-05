"use server"

import { sql } from "../util/Database";
import { getPlayerId } from "./synchronizeHistory";
import { UserEnvironment } from "../util/userAgent";
import { GameHistory } from "./GameHistory";

export interface BugReportData {
    userMessage: string;
    environment: UserEnvironment;
    configId?: string;
    problemId?: string;
    history?: GameHistory;
}

export async function submitBugReport(reportData: BugReportData) {
    "use server"
    try {
        const playerId = await getPlayerId();
        const environment = JSON.stringify(reportData.environment);
        const history = reportData.history ? JSON.stringify(reportData.history.log) : null;
        
        await sql`INSERT INTO bug_reports (
            user_message, 
            player_id, 
            config, 
            problem_id, 
            history, 
            environment
        ) VALUES (
            ${reportData.userMessage},
            ${playerId},
            ${reportData.configId || null},
            ${reportData.problemId || null},
            ${history},
            ${environment}
        )`;
        
        console.log(`Bug report submitted. Player ID: ${playerId}, Problem ID: ${reportData.problemId || 'N/A'}, Config ID: ${reportData.configId || 'N/A'}`);
        
        return { success: true };
    } catch (error) {
        console.error("Error submitting bug report.");
        console.error(error);
        return { success: false, error: String(error) };
    }
}
