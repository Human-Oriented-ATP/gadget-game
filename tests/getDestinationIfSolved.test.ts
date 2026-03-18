import { expect, test } from 'vitest'
import { getDestinationIfSolved } from 'lib/study/LevelConfiguration'
import { StudyConfiguration } from 'lib/study/Types'

const config: StudyConfiguration = {
    name: "myconfig",
    displayNamesAs: "number",
    displayUnlistedProblems: false,
    displayEndParticipationButton: false,
    categories: [
        { name: "World 1", problems: ["p1", "p2", "p3"] },
        { name: "World 2", problems: ["p4", "p5"] },
    ]
}

test("goes to next problem in category", () => {
    expect(getDestinationIfSolved(config, "p1", [])).toBe("../game/p2")
})

test("goes to world-complete when solving the last unsolved problem", () => {
    expect(getDestinationIfSolved(config, "p3", ["p1", "p2"])).toBe("../world-complete?worldName=World%201")
})

test("world name is URL-encoded", () => {
    const configWithSpaces: StudyConfiguration = {
        ...config,
        categories: [{ name: "My World", problems: ["p1"] }]
    }
    expect(getDestinationIfSolved(configWithSpaces, "p1", [])).toBe("../world-complete?worldName=My%20World")
})

test("goes to config home when last by position but others are unsolved", () => {
    expect(getDestinationIfSolved(config, "p3", ["p1"])).toBe("/myconfig/")
})

test("goes to config home when problem is not found in any category", () => {
    expect(getDestinationIfSolved(config, "unknown", [])).toBe("/myconfig/")
})

test("single-problem category goes to world-complete immediately", () => {
    const singleProblemConfig: StudyConfiguration = {
        ...config,
        categories: [{ name: "Mini World", problems: ["only"] }]
    }
    expect(getDestinationIfSolved(singleProblemConfig, "only", [])).toBe("../world-complete?worldName=Mini%20World")
})
