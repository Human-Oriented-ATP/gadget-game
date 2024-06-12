import { DummyHandle } from "components/primitive/DummyHandle"

const tutorialTexts: Map<string, JSX.Element> = new Map([
    ["tutorial01",
        <>
            The goal in this game is to build diagrams from gadgets. <br />
            Start by dragging the gadget from the left into the diagram. <br />
            Then connect the two gadgets by drawing a line from <span><DummyHandle position="inline" /></span> to <span><DummyHandle position="inline" /></span>.
        </>
    ],
    ["tutorial02",
        <>
            You can only create connections between cells of the same color.
        </>
    ],
    ["tutorial03",
        <>
            If you move two gadgets close to each other they connect automatically. <br />
        </>
    ],
    ["tutorial04",
        <>
            If the numbers don't match the connection breaks and handles become grey <span><DummyHandle position="inline" isBrokenConnection={true} /></span>. <br />
            You can always remove a connection by clicking on the handle <span><DummyHandle position="inline" isBrokenConnection={true} /></span> or <span>
                <DummyHandle position="inline" /></span>. <br />
        </>
    ],
    ["jacob_easy01",
        <>
            Be sure to only connect gadgets where the colours and numbers line up. <br />
        </>
    ],
    ["jacob_easy02",
        <>
            Remember, the ordering of the numbers matters as well. <br />
        </>
    ],
    ["tutorial05",
        <>
            Pink nodes acquire a value that depends on the remaining numbers in the cell. <br />
            Until they are connected to other gadgets with numbers, their value is undetermined.
        </>
    ],
    ["tutorial06",
        <>
            Pink nodes always take the same value with the same inputs.
        </>
    ],
    ["jacob_easy03",
        <>
            Be careful, pink nodes will take different values when the other numbers are different.
        </>
    ]
])

export default function TutorialOverlay({ problemId }: { problemId: string }) {
    if (tutorialTexts.has(problemId)) {
        return <div className="fixed w-full h-full">
            <div className="absolute left-40 top-12">
                {tutorialTexts.get(problemId)}
            </div>
        </div>
    } else {
        return <></>
    }
}