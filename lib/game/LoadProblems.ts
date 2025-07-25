"use server"

import { promises as fs } from "fs"
import path from 'path'
import { StudyConfiguration } from "lib/study/Types"
import { notFound } from "next/navigation";

const FILE_VALIDATOR_REGEX = /^[a-zA-Z0-9_-]+$/;

async function readFileWith404(filepath: string): Promise<string> {
    try {
        return await fs.readFile(filepath, "utf-8")
    } catch (err) {
        if (err.code === "ENAMETOOLONG" || err.code === "ENOENT") {
            notFound()
        }
        throw err; 
    }
}

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
    if (!FILE_VALIDATOR_REGEX.test(configurationIdentifier)) notFound();
    const configurationFilePath = path.resolve('study_setup', configurationIdentifier + ".json")
    const configurationFile = await readFileWith404(configurationFilePath);
    const configuration : StudyConfiguration = JSON.parse(configurationFile)
    return configuration
}

export async function loadProblemData(problemId: string): Promise<string> { 
    if (!FILE_VALIDATOR_REGEX.test(problemId)) notFound();
    const problemFilePath = path.resolve('problems', problemId + ".pl");
    const problemData = await readFileWith404(problemFilePath);
    return problemData;
}