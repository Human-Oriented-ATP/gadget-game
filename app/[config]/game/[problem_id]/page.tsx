import { loadAllStudyConfigurations, loadStudyConfiguration } from "lib/game/LoadProblems";
import { ProblemCategory } from "lib/study/Types";
import { GameLoader } from "components/game/GameLoader";

async function generateConfigurationStaticParams(config: string) {
    const loadedConfig = await loadStudyConfiguration(config)
    const configCategories = loadedConfig.categories;
    const generateProblemsParams = (category: ProblemCategory) => 
        category.problems.map(problem_id => ({config, problem_id}));

    return configCategories.flatMap(generateProblemsParams);
}

export async function generateStaticParams() {
    const configurations = await loadAllStudyConfigurations();
    return configurations.flatMap(generateConfigurationStaticParams);
}

type Params = Promise<{ config: string, problem_id: string }>

export default async function Page(props: { params: Params }) {
    const params = await props.params;
    return <GameLoader configId={params.config} problemId={params.problem_id} />
}
