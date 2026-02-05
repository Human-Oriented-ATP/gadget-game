"use server"

import { promisify } from "node:util"
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";

async function generateNewPlayerId(): Promise<string> {
    const newPlayerId = (await promisify(randomBytes)(20)).toString('hex');
    return newPlayerId
}

async function setPlayerId(playerId: string) {
    const MILLISECONDS_IN_A_YEAR = 1000 * 60 * 60 * 24 * 365;
    (await cookies()).set('id', playerId, { 
        expires: new Date(Date.now() + MILLISECONDS_IN_A_YEAR) 
    });
    (await cookies()).set('start_time', new Date().toISOString(), { 
        expires: new Date(Date.now() + MILLISECONDS_IN_A_YEAR) 
    });
}

export async function initializePlayerId(): Promise<void> {
    const existingPlayerId = (await cookies()).get('id');
    if (existingPlayerId === undefined) {
        const newPlayerId = await generateNewPlayerId();
        await setPlayerId(newPlayerId);
    }
}

export async function getPlayerId(): Promise<string> {
    const playerId = (await cookies()).get('id');
    if (playerId === undefined) {
        // Fallback: should not happen if initializePlayerId was called
        const newPlayerId = await generateNewPlayerId();
        await setPlayerId(newPlayerId);
        return newPlayerId;
    }
    return playerId.value;
}
