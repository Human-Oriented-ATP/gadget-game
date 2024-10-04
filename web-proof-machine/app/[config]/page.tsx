import StudyScreen from "components/navigation/StudyScreen";
import { promises as fs } from "fs"
import { loadAllProblemsInDirectory } from "lib/game/LoadProblems";
import { StudyConfiguration } from "lib/study/Types";

export async function generateStaticParams() {
    let configurations = ["pilot1", "pilot2", "new-tutorial"]
    const slugs = configurations.map(problem => ({ config: problem }))
    return slugs
}

export default async function Page({ params }: { params: { config: string } }) {
    const configuration : StudyConfiguration = JSON.parse(await fs.readFile(process.cwd() + "/study_setup/" + params.config + ".json", "utf-8"))
    const allProblems = await loadAllProblemsInDirectory()
    
    return <StudyScreen config={configuration} allProblems={allProblems} />
}