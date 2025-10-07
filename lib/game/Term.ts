import { DisjointSetWithAssignment } from "../util/DisjointSetWithAssignment"
import { Axiom } from "./Primitives"

export type VariableName = string
export type FunctionName = string
export type LabelName = string

// Within problem files, the function terms correspond to
// skolemization. The arguments will always consist of the
// non-function arguments in the term, and functions will
// always be uniquely be determined by all three of the
// term label, function position, and position of other functions
// in the term.
export type Term 
    = {number: string, label?: LabelName } | { variable: VariableName } 
    | { function: FunctionName, args: Term[]}
export type Relation = { label: LabelName, args: Term[] }

export function occursInNaive(v: string, term: Term): boolean {
    if ("variable" in term) {
        return v === term.variable
    } else if ("number" in term) {
       return v === term.label
    } else {
        const appearsInArg = term.args.map(arg => occursInNaive(v, arg))
        return appearsInArg.includes(true)
    }
}

export function replaceWithRepresentatives(t: Term, assignment: Assignment): Term {
    if ("variable" in t) {
        return { variable: assignment.findRepresentative(t.variable) }
    } else if ("number" in t) {
        return { number: t.number }
    } else {
        return { function: t.function, args: t.args.map(arg => replaceWithRepresentatives(arg, assignment)) }
    }
}

export function occursIn(v: VariableName, term: Term, assignment: Assignment): boolean {
    const vRepresentative = assignment.findRepresentative(v)
    const termWithRepresentatives = replaceWithRepresentatives(term, assignment)
    return occursInNaive(vRepresentative, termWithRepresentatives)
}

export type Assignment = DisjointSetWithAssignment<VariableName, Term>

export function getTermVariableList(t: Term): VariableName[] {
    if ("variable" in t) {
        return [t.variable];
    } else if ("function" in t) {
        return t.args.flatMap(arg => getTermVariableList(arg));
    } else return [];
}

export function getVariableList(r: Relation): VariableName[] {
    return r.args.flatMap(arg => getTermVariableList(arg));
}

export function getVariableSet(r: Relation): Set<VariableName> {
    return new Set(getVariableList(r))
}

export function assignTermDeeply(t: Term, assignment: Assignment): Term {
    if ("function" in t) {
        const argsAssigned: Term[] = t.args.map(arg => assignTermDeeply(arg, assignment));
        return { function: t.function, args: argsAssigned };
    } else {
        const label = "variable" in t ? t.variable : t.label;
        if (label === undefined) return t;
        const assignedValue = assignment.getAssignedValue(label);
        if (!assignedValue) return t;

        if (occursIn(label, assignedValue, assignment)) 
                throw Error("Attempting to deeply assign the variables in a term in a cyclic way")

        return assignTermDeeply(assignedValue, assignment);
    }
}

export function makeTermWithFreshLabels(t: Term, prefix: string, number_prefix: string): Term {
    if ("variable" in t) {
        return { variable: prefix + "_" + t.variable}
    } else if ("number" in t) {
        return {number: t.number, label: number_prefix + "_" + prefix}
    } else {
        return { 
            function: t.function, 
            args: t.args.map((arg, p) =>
                makeTermWithFreshLabels(arg, prefix, `${number_prefix},${p}`)
            ) 
        }
    }
}

export function makeRelationWithFreshLabels(r: Relation, prefix: string, number_prefix: string): Relation {
    return {
        label: r.label, 
        args: r.args.map((arg, p) => 
            makeTermWithFreshLabels(arg, prefix, `${number_prefix},${p}`)
        )
    }
}

// Have variable names be unique across axioms, and assign every
// number term a unique label (so we can track the exact numeric 
// hole a term is associated with). The prefix should begin with g_, 
// to not collide with number labels. 
export function makeAxiomWithFreshLabels(axiom: Axiom, prefix: string): Axiom {
    const hypotheses = axiom.hypotheses.map((h, i) => makeRelationWithFreshLabels(h, prefix, `n_${i}`))
    const conclusion = makeRelationWithFreshLabels(axiom.conclusion, prefix, "nc")
    return { hypotheses, conclusion }
}

export function labelsMatch(r1: Relation, r2: Relation): boolean {
    return r1.label === r2.label;
}

export function aritiesMatch(r1: Relation, r2: Relation): boolean {
    return r1.args.length === r2.args.length;
}

export function isNumericalConstant(t: Term): number | undefined {
    if ("number" in t) {
        if (isNaN(Number(t.number))) {
            return undefined;
        } else {
            return Number(t.number);
        }
    } else return undefined;
}
