import { expect, test } from 'vitest'
import { RelationEquation, TermEquation, GeneralEquation, unifyEquations } from "../lib/game/Unification";
import { parseRelation, parseTerm } from '../lib/parsing/Semantics';
import { ValueMap } from '../lib/util/ValueMap';

type EquationId = string

function parseTermEquation(eq: string): TermEquation {
    const [lhs, rhs] = eq.split("=")
    return [parseTerm(lhs), parseTerm(rhs)]
}

function parseRelationEquation(eq: string): RelationEquation {
    const [lhs, rhs] = eq.split("=")
    return [parseRelation(lhs), parseRelation(rhs)]
}

function termMapToGeneralEquations<T>(vmap: ValueMap<T, TermEquation>): ValueMap<T, GeneralEquation> {
    return vmap.map(v => ({type: "term", equation: v}));
}

function relationMapToGeneralEquations<T>(vmap: ValueMap<T, RelationEquation>): ValueMap<T, GeneralEquation> {
    return vmap.map(v => ({type: "relation", equation: v}));
}


test("Empty unification", () => {
    const emptyListOfEquations = new ValueMap<EquationId, TermEquation>()
    const res = unifyEquations(termMapToGeneralEquations(emptyListOfEquations))
    expect(Array.from(res.equationIsSatisfied.keys()).length === 0);
    const assignment = res.assignment
    expect(assignment.getAssignedValues.length).toBe(0)
})

test("Conflict with different constants", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseTermEquation("1=2")]])
    const { equationIsSatisfied, assignment } = unifyEquations(termMapToGeneralEquations(equations))
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", false]])
    expect(assignment.getAssignedValues()).toEqual([])
})

test("Unification of a single variable", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseTermEquation("A=1")]])
    const { equationIsSatisfied, assignment } = unifyEquations(termMapToGeneralEquations(equations))
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", true]])
    expect(assignment.getAssignedValues()).toEqual([parseTerm("1")])
    expect(assignment.getAssignedValue("A")).toEqual(parseTerm("1"))
})

test("Unification of a single variable symmetric", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseTermEquation("1=B")]])
    const { equationIsSatisfied, assignment } = unifyEquations(termMapToGeneralEquations(equations))
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", true]])
    expect(assignment.getAssignedValues()).toEqual([parseTerm("1")])
    expect(assignment.getAssignedValue("B")).toEqual(parseTerm("1"))
})

test("Transitive unification of a single variable", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseTermEquation("A=B")], ["eq2", parseTermEquation("B=1")]])
    const { equationIsSatisfied, assignment } = unifyEquations(termMapToGeneralEquations(equations))
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", true], ["eq2", true]])
    expect(assignment.getAssignedValues()).toEqual([parseTerm("1")])
    expect(assignment.getAssignedValue("A")).toEqual(parseTerm("1"))
})

test("Conflict in transitive unification", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseTermEquation("2=B")], ["eq2", parseTermEquation("B=1")]])
    const { equationIsSatisfied, assignment } = unifyEquations(termMapToGeneralEquations(equations))
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", true], ["eq2", false]])
    expect(assignment.getAssignedValues()).toEqual([parseTerm("2")])
    expect(assignment.getAssignedValue("B")).toEqual(parseTerm("2"))
})

test("Valid circular assignment", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseTermEquation("A=B")], ["eq2", parseTermEquation("B=A")], ["eq3", parseTermEquation("A=1")]])
    const { equationIsSatisfied, assignment } = unifyEquations(termMapToGeneralEquations(equations))
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", true], ["eq2", true], ["eq3", true]])
    expect(assignment.getAssignedValues()).toEqual([parseTerm("1")])
    expect(assignment.getAssignedValue("B")).toEqual(parseTerm("1"))
})

test("Valid circular equivalence", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseTermEquation("A=B")], ["eq2", parseTermEquation("B=C")], ["eq3", parseTermEquation("C=A")]])
    const { equationIsSatisfied, assignment } = unifyEquations(termMapToGeneralEquations(equations))
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", true], ["eq2", true], ["eq3", true]])
    expect(assignment.getAssignedValues()).toEqual([])
    expect(assignment.findRepresentative("A")).toEqual(assignment.findRepresentative("B"))
    expect(assignment.findRepresentative("A")).toEqual(assignment.findRepresentative("C"))
})

// Tests including functions
test("Circular equality", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseTermEquation("f(A)=A")]])
    const { equationIsSatisfied, assignment } = unifyEquations(termMapToGeneralEquations(equations))
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", false]])
    expect(assignment.getAssignedValues()).toEqual([])
    expect(assignment.findRepresentative("A")).toEqual(assignment.findRepresentative("A"))
})

test("Circular equality with transitivity", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseTermEquation("f(A)=B")], ["eq2", parseTermEquation("A=B")]])
    const { equationIsSatisfied, assignment } = unifyEquations(termMapToGeneralEquations(equations))
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", true], ["eq2", false]])
    expect(assignment.getAssignedValues()).toEqual([parseTerm("f(A)")])
    expect(assignment.getAssignedValue("B")).toEqual(parseTerm("f(A)"))
    expect(assignment.findRepresentative("A")).toEqual(assignment.findRepresentative("A"))
    expect(assignment.isAssigned("A")).toEqual(false)
})

test("Circular equality with transitivity symmetric", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseTermEquation("A=B")], ["eq2", parseTermEquation("f(A)=B")]])
    const { equationIsSatisfied, assignment } = unifyEquations(termMapToGeneralEquations(equations))
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", true], ["eq2", false]])
    expect(assignment.getAssignedValues()).toEqual([])
    expect(assignment.findRepresentative("B")).toEqual(assignment.findRepresentative("A"))
    expect(assignment.findRepresentative("A")).toEqual(assignment.findRepresentative("B"))
    expect(assignment.isAssigned("A")).toEqual(false)
    expect(assignment.isAssigned("B")).toEqual(false)
})

test("Circular equality with transitivity twice valid", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseTermEquation("A=B")], ["eq2", parseTermEquation("f(B)=C")], ["eq3", parseTermEquation("f(A)=C")]])
    const { equationIsSatisfied, assignment } = unifyEquations(termMapToGeneralEquations(equations))
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", true], ["eq2", true], ["eq3", true]])
    expect(assignment.findRepresentative("B")).toEqual(assignment.findRepresentative("A"))
    expect(assignment.findRepresentative("A")).toEqual(assignment.findRepresentative("B"))
    expect(assignment.isAssigned("A")).toEqual(false)
    expect(assignment.isAssigned("B")).toEqual(false)
    expect(assignment.isAssigned("C")).toEqual(true)
    expect(assignment.getAssignedValue("C")).toEqual(parseTerm("f(B)"))
})

test("Circular equality with transitivity twice invalid", () => {
    const equations = new ValueMap<EquationId, TermEquation>([["eq1", parseTermEquation("A=B")], ["eq2", parseTermEquation("f(B)=C")], ["eq3", parseTermEquation("A=f(C)")]])
    const { equationIsSatisfied, assignment } = unifyEquations(termMapToGeneralEquations(equations))
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", true], ["eq2", true], ["eq3", false]])
    expect(assignment.getAssignedValues()).toEqual([parseTerm("f(B)")])

    expect(assignment.isAssigned("A")).toEqual(false)
    expect(assignment.isAssigned("B")).toEqual(false)
    expect(assignment.isAssigned("C")).toEqual(true)

    expect(assignment.findRepresentative("B")).toEqual(assignment.findRepresentative("A"))
})

test("Empty relation unification", () => {
    const emptyListOfEquations = new ValueMap<EquationId, RelationEquation>()
    const res = unifyEquations(relationMapToGeneralEquations(emptyListOfEquations))
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

    const { equationIsSatisfied, assignment } = unifyEquations(relationMapToGeneralEquations(equations))
    expect(equationIsSatisfied.values().every(bool => !bool)).toEqual(true);
    
    // Unification did not proceed
    expect(assignment.findRepresentative("A")).not.toEqual(assignment.findRepresentative("E"));
})

test("Matching relations proceed with unification", () => {
    const equations = new ValueMap<EquationId, RelationEquation>([ 
        ["eq1", parseRelationEquation("r(A,1)=r(C,1)")],
        ["eq2", parseRelationEquation("r(1,F)=r(2,G)")],
    ]);

    const { equationIsSatisfied, assignment } = unifyEquations(relationMapToGeneralEquations(equations));
    expect(Array.from(equationIsSatisfied.entries())).toEqual([["eq1", true], ["eq2", false]]);
    
    
    // Unification did proceed
    expect(assignment.findRepresentative("A")).toEqual(assignment.findRepresentative("C"));
    expect(assignment.findRepresentative("F")).toEqual(assignment.findRepresentative("G"));
})

test("Mix of general equations correctly handled", () => {
    const equations = new ValueMap<EquationId, GeneralEquation>([ 
        ["eq1", {type: "relation", equation: parseRelationEquation("r(A,C)=r(B,1)")}],
        ["eq2", {type: "term", equation: parseTermEquation("B=3")}],
    ]);

    const { equationIsSatisfied, assignment } = unifyEquations(equations);

    expect(assignment.findRepresentative("A")).toEqual(assignment.findRepresentative("B"));
    expect(assignment.getAssignedValue("A")).toEqual(parseTerm("3"));
})


