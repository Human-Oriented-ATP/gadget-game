import { expect, test } from 'vitest'
import { RelationEquation, TermEquation, unifyRelationEquations, unifyTermEquations } from "../lib/game/Unification";
import { parseRelation, parseTerm } from '../lib/parsing/Semantics';
import { ValueMap } from '../lib/util/ValueMap';

type EquationId = string

function parseEquation(eq: string): TermEquation {
    const [lhs, rhs] = eq.split("=")
    return [parseTerm(lhs), parseTerm(rhs)]
}

function parseRelationEquation(eq: string): RelationEquation {
    const [lhs, rhs] = eq.split("=")
    return [parseRelation(lhs), parseRelation(rhs)]
}

test("Empty unification", () => {
    const emptyListOfEquations = new ValueMap<EquationId, TermEquation>()
    const res = unifyTermEquations(emptyListOfEquations)
    expect(Array.from(res.equationIsSatisfied.keys()).length === 0);
    const assignment = res.assignment
    expect(assignment.getAssignedValues.length).toBe(0)
})

test("Conflict with different constants", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseEquation("1=2")]])
    const { equationIsSatisfied, assignment } = unifyTermEquations(equations)
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", false]])
    expect(assignment.getAssignedValues()).toEqual([])
})

test("Unification of a single variable", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseEquation("A=1")]])
    const { equationIsSatisfied, assignment } = unifyTermEquations(equations)
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", true]])
    expect(assignment.getAssignedValues()).toEqual([parseTerm("1")])
    expect(assignment.getAssignedValue("A")).toEqual(parseTerm("1"))
})

test("Unification of a single variable symmetric", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseEquation("1=B")]])
    const { equationIsSatisfied, assignment } = unifyTermEquations(equations)
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", true]])
    expect(assignment.getAssignedValues()).toEqual([parseTerm("1")])
    expect(assignment.getAssignedValue("B")).toEqual(parseTerm("1"))
})

test("Transitive unification of a single variable", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseEquation("A=B")], ["eq2", parseEquation("B=1")]])
    const { equationIsSatisfied, assignment } = unifyTermEquations(equations)
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", true], ["eq2", true]])
    expect(assignment.getAssignedValues()).toEqual([parseTerm("1")])
    expect(assignment.getAssignedValue("A")).toEqual(parseTerm("1"))
})

test("Conflict in transitive unification", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseEquation("2=B")], ["eq2", parseEquation("B=1")]])
    const { equationIsSatisfied, assignment } = unifyTermEquations(equations)
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", true], ["eq2", false]])
    expect(assignment.getAssignedValues()).toEqual([parseTerm("2")])
    expect(assignment.getAssignedValue("B")).toEqual(parseTerm("2"))
})

test("Valid circular assignment", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseEquation("A=B")], ["eq2", parseEquation("B=A")], ["eq3", parseEquation("A=1")]])
    const { equationIsSatisfied, assignment } = unifyTermEquations(equations)
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", true], ["eq2", true], ["eq3", true]])
    expect(assignment.getAssignedValues()).toEqual([parseTerm("1")])
    expect(assignment.getAssignedValue("B")).toEqual(parseTerm("1"))
})

test("Valid circular equivalence", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseEquation("A=B")], ["eq2", parseEquation("B=C")], ["eq3", parseEquation("C=A")]])
    const { equationIsSatisfied, assignment } = unifyTermEquations(equations)
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", true], ["eq2", true], ["eq3", true]])
    expect(assignment.getAssignedValues()).toEqual([])
    expect(assignment.findRepresentative("A")).toEqual(assignment.findRepresentative("B"))
    expect(assignment.findRepresentative("A")).toEqual(assignment.findRepresentative("C"))
})

// Tests including functions
test("Circular equality", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseEquation("f(A)=A")]])
    const { equationIsSatisfied, assignment } = unifyTermEquations(equations)
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", false]])
    expect(assignment.getAssignedValues()).toEqual([])
    expect(assignment.findRepresentative("A")).toEqual(assignment.findRepresentative("A"))
})

test("Circular equality with transitivity", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseEquation("f(A)=B")], ["eq2", parseEquation("A=B")]])
    const { equationIsSatisfied, assignment } = unifyTermEquations(equations)
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", true], ["eq2", false]])
    expect(assignment.getAssignedValues()).toEqual([parseTerm("f(A)")])
    expect(assignment.getAssignedValue("B")).toEqual(parseTerm("f(A)"))
    expect(assignment.findRepresentative("A")).toEqual(assignment.findRepresentative("A"))
    expect(assignment.isAssigned("A")).toEqual(false)
})

test("Circular equality with transitivity symmetric", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseEquation("A=B")], ["eq2", parseEquation("f(A)=B")]])
    const { equationIsSatisfied, assignment } = unifyTermEquations(equations)
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", true], ["eq2", false]])
    expect(assignment.getAssignedValues()).toEqual([])
    expect(assignment.findRepresentative("B")).toEqual(assignment.findRepresentative("A"))
    expect(assignment.findRepresentative("A")).toEqual(assignment.findRepresentative("B"))
    expect(assignment.isAssigned("A")).toEqual(false)
    expect(assignment.isAssigned("B")).toEqual(false)
})

test("Circular equality with transitivity twice valid", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseEquation("A=B")], ["eq2", parseEquation("f(B)=C")], ["eq3", parseEquation("f(A)=C")]])
    const { equationIsSatisfied, assignment } = unifyTermEquations(equations)
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", true], ["eq2", true], ["eq3", true]])
    expect(assignment.findRepresentative("B")).toEqual(assignment.findRepresentative("A"))
    expect(assignment.findRepresentative("A")).toEqual(assignment.findRepresentative("B"))
    expect(assignment.isAssigned("A")).toEqual(false)
    expect(assignment.isAssigned("B")).toEqual(false)
    expect(assignment.isAssigned("C")).toEqual(true)
    expect(assignment.getAssignedValue("C")).toEqual(parseTerm("f(B)"))
})

test("Circular equality with transitivity twice invalid", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseEquation("A=B")], ["eq2", parseEquation("f(B)=C")], ["eq3", parseEquation("A=f(C)")]])
    const { equationIsSatisfied, assignment } = unifyTermEquations(equations)
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", true], ["eq2", true], ["eq3", false]])
    expect(assignment.getAssignedValues()).toEqual([parseTerm("f(B)")])

    expect(assignment.isAssigned("A")).toEqual(false)
    expect(assignment.isAssigned("B")).toEqual(false)
    expect(assignment.isAssigned("C")).toEqual(true)

    expect(assignment.findRepresentative("B")).toEqual(assignment.findRepresentative("A"))
})

test("Empty relation unification", () => {
    const emptyListOfEquations = new ValueMap<EquationId, RelationEquation>()
    const res = unifyRelationEquations(emptyListOfEquations)
    expect(Array.from(res.equationIsSatisfied.keys()).length === 0);
    const assignment = res.assignment
    expect(assignment.getAssignedValues.length).toBe(0)
})

test("Rejection of non-matching relations", () => {
    const equations = new ValueMap<EquationId, RelationEquation>([ 
        ["eq1", parseRelationEquation("r(A,B)=r(E,B,C)")],
        ["eq2", parseRelationEquation("r(A,B,C)=r(E,B)")],
        ["eq3", parseRelationEquation("g(A,B,C)=r(E,B,C)")],
    ]);

    const { equationIsSatisfied, assignment } = unifyRelationEquations(equations)
    expect(equationIsSatisfied.values().every(bool => !bool)).toEqual(true);
    
    // Unification did not proceed
    expect(assignment.findRepresentative("A")).not.toEqual(assignment.findRepresentative("E"));
})

test("Matching relations proceed with unification", () => {
    const equations = new ValueMap<EquationId, RelationEquation>([ 
        ["eq1", parseRelationEquation("r(A,1)=r(C,1)")],
        ["eq2", parseRelationEquation("r(1,F)=r(2,G)")],
    ]);

    const { equationIsSatisfied, assignment } = unifyRelationEquations(equations);
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", true], ["eq2", false]]);
    
    
    // Unification did proceed
    expect(assignment.findRepresentative("A")).toEqual(assignment.findRepresentative("C"));
    expect(assignment.findRepresentative("F")).toEqual(assignment.findRepresentative("G"));
})


