import Link from "next/link"

export default function AboutPage() {
    return <div className="p-6">
        <div className="mx-auto max-w-3xl space-y-6 text-justify">
            <h1 className="text-2xl font-semibold text-center">About the Gadget Game</h1>

            <p>
                Welcome to the Gadget Game, developed at the University of Cambridge and MIT to study the process of reasoning in mathematics. 
            </p>
                
            <p>
                By playing the game, you will allow us to gather valuable data (strictly anonymized), so you will be helping to advance science and, we hope, having fun in the process. The game comes with two tutorials, one that is enough to get started and another that introduces &quot;dependent gadgets&quot;, which open up a much larger range of puzzles. The puzzles are grouped roughly according to difficulty. It should be possible to do the easier ones fairly quickly, but don&apos;t worry if you feel stuck on one of the harder ones: good players can take an hour or more on some of them!
            </p>

            <Link
                href="/"
                className="block w-fit mx-auto border-2 border-black rounded-lg p-2.5 hover:bg-black hover:text-white"
            >
                Back to Home
            </Link>
        </div>
    </div>
}
