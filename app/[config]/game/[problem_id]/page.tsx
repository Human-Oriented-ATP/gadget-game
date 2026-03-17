import { GameLoader } from "components/game/GameLoader";

export const dynamic = "force-dynamic";

type Params = Promise<{ config: string, problem_id: string }>

export default async function Page(props: { params: Params }) {
    const params = await props.params;
    return <GameLoader configId={params.config} problemId={params.problem_id} />
}
