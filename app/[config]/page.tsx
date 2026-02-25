import InternalPage from "components/navigation/InternalPage";
import { MainPage } from "components/navigation/MainPage";
import { loadAllProblemsInDirectory, loadStudyConfiguration } from "lib/game/LoadProblems";

export function generateStaticParams() {
    let configurations = ["internal", "pilot1", "pilot2", "pilot3", "new-tutorial", "public-proto"]
    const slugs = configurations.map(problem => ({ config: problem }))
    return slugs
}

type Params = Promise<{ config: string }>

export default async function Page(props: { params: Params }) {
    const params = await props.params;
    const configuration = await loadStudyConfiguration(params.config)
    const allProblems = await loadAllProblemsInDirectory()

    if (params.config === "internal") {
        return <InternalPage allProblems={allProblems} />
    } else {
        return <MainPage config={configuration} allProblems={allProblems} />
    }
}