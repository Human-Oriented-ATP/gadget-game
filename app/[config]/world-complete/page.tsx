import { WorldCompletePage } from "components/navigation/WorldCompletePage"

type Params = Promise<{ config: string }>
type SearchParams = Promise<{ worldName?: string }>

export default async function Page(props: { params: Params, searchParams: SearchParams }) {
    const params = await props.params
    const searchParams = await props.searchParams
    return <WorldCompletePage config={params.config} worldName={searchParams.worldName || "the current world"} />
}
