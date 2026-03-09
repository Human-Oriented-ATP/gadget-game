import { assertType, expect, test } from 'vitest'
import { parseStatement } from "../lib/parsing/Semantics"
import { isAxiom } from '../lib/game/Initialization'

test("Axiom parsing", () => {
    const statementAsString = "r(A) :- r(B), g(C, D) "
    const parsed = parseStatement(statementAsString)
    expect(isAxiom(parsed)).toBe(true)
    if ("fixedAxiom" in parsed) {
        expect(parsed.fixedAxiom.conclusion).toEqual({ label: "r", args: [{ variable: "A" }] })
        expect(parsed.fixedAxiom.hypotheses).toEqual([
            { label: "r", args: [{ variable: "B" }] },
            { label: "g", args: [{ variable: "C" }, { variable: "D" }] }
        ])
    }
})

test("Goal parsing", () => {
    const statementAsString = ":- bl(B) ."
    const parsed = parseStatement(statementAsString)
    expect(isAxiom(parsed)).toBe(false)
    if ("goal" in parsed) {
        expect(parsed.goal).toEqual({ label: "bl", args: [{ variable: "B" }] })
    }
})