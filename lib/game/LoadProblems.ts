"use server"

import { promises as fs } from "fs"
import path from 'path'
import { StudyConfiguration } from "lib/study/Types"

export async function loadAllProblemsInDirectory(): Promise<string[]> {
    const pathToProblems = process.cwd() + "/problems/"
    const folderContent = await fs.readdir(pathToProblems)
    const prologFiles = folderContent.filter(file => file.toLowerCase().endsWith(".pl"))
    const withExtensionRemoved = prologFiles.map(file => file.slice(0, -3))
    return withExtensionRemoved
}

export async function loadAllStudyConfigurations(): Promise<string[]> {
    const pathToProblems = process.cwd() + "/study_setup/"
    const folderContent = await fs.readdir(pathToProblems)
    const prologFiles = folderContent.filter(file => file.toLowerCase().endsWith(".json"))
    const withExtensionRemoved = prologFiles.map(file => file.slice(0, -5))
    return withExtensionRemoved
}

export async function loadStudyConfiguration(configurationIdentifier: string): Promise<StudyConfiguration> { 
    const configurationFilePath = path.resolve('study_setup', configurationIdentifier + ".json")
    const configurationFile = await fs.readFile(configurationFilePath, "utf-8")
    const configuration : StudyConfiguration = JSON.parse(configurationFile)
    return configuration
}