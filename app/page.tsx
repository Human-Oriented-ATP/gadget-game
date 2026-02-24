import { MainPage } from 'components/navigation/MainPage'
import { loadAllProblemsInDirectory, loadStudyConfiguration } from 'lib/game/LoadProblems'
import '../tailwind.css'

export default async function Page() {
    const configuration = await loadStudyConfiguration('public-v0')
    const allProblems = await loadAllProblemsInDirectory()

    return <MainPage config={configuration} allProblems={allProblems} />
}