import { loadAllStudyConfigurations, loadStudyConfiguration } from "lib/game/LoadProblems";
import GameOrQuestionnaireLoader from "components/navigation/GameOrQuestionnaireLoader";
import { ProblemCategory } from "lib/study/Types";

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
    const config = await loadStudyConfiguration(params.config)
    const loaderProps = { problemId: params.problem_id, config };
    return <GameOrQuestionnaireLoader {...loaderProps} />
}
