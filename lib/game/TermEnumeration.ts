import { Assignment, assignTermDeeply, isNumericalConstant, replaceWithRepresentatives, Term } from "./Term";
import { ValueMap } from "lib/util/ValueMap";
import { deepIncludes } from "lib/util/Array";

export type TermEnumeration = ValueMap<Term, number>

function enumeration(number: number): string {
    let result = '';
    while (number >= 0) {
        result = String.fromCharCode((number % 26) + 65) + result;
        number = Math.floor(number / 26) - 1;
    }
    return result === 'AA' ? '🤯' : result;
}

export function getAssignedValue(term: Term, assignment: Assignment, termEnumeration: TermEnumeration): string {
    const assignedTerm = replaceWithRepresentatives(assignTermDeeply(term, assignment), assignment)
    const c = isNumericalConstant(assignedTerm)
    if (c) {
        return c.toString()
    } else {
        if ("variable" in assignedTerm) {
            return ""
        } else {
            const value = termEnumeration.get(assignedTerm)
            if (value === undefined) return "?"
            return enumeration(value)
        }
    }
}

function removeDeletedTerms(termEnumeration: TermEnumeration, holeTerms: Term[]) {
    const terms = termEnumeration.keys()
    for (const term of terms) {
        if (!deepIncludes(holeTerms, term)) {
            termEnumeration.delete(term)
        }
    }
}

function getTermsToBeEnumerated(termEnumeration: TermEnumeration, holeTerms: Term[]) {
    const toBeEnumerated = new Set<Term>()
    const setOfHoleTerms = new Set(holeTerms)
    setOfHoleTerms.forEach(term => {
        if (!termEnumeration.has(term) && "function" in term) {
            toBeEnumerated.add(term)
        }
    })
    return toBeEnumerated
}

function getLowestUnusedNumber(termEnumeration: TermEnumeration): number {
    const usedNumbers = termEnumeration.values()
    let i = 0
    while (usedNumbers.includes(i)) {
        i++
    }
    return i
}

function enumerateTerms(current: TermEnumeration, terms: Set<Term>) {
    terms.forEach(term => {
        if (!current.has(term)) {
            const value = getLowestUnusedNumber(current)
            current.set(term, value)
        }
    })
}

export function updateEnumeration(current: TermEnumeration, holeTerms: Term[], assignment: Assignment) {
    const enumeration = new ValueMap<Term, number>(current)
    const holeTermsAssigned = holeTerms.map(term => replaceWithRepresentatives(assignTermDeeply(term, assignment), assignment))
    removeDeletedTerms(enumeration, holeTermsAssigned)
    const toBeEnumerated: Set<Term> = getTermsToBeEnumerated(enumeration, holeTermsAssigned)
    enumerateTerms(enumeration, toBeEnumerated)
    return enumeration
}
