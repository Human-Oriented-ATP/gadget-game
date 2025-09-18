import { ValueMap } from "../util/ValueMap";
import { DisjointSetWithAssignment } from "../util/DisjointSetWithAssignment";
import { Term, Relation, Assignment, VariableName, assignTermDeeply, occursIn } from "./Term";

export type TermEquation = [Term, Term]
export type RelationEquation = [Relation, Relation]

export interface UnificationResult<T> {
    assignment: Assignment
    equationIsSatisfied: ValueMap<T, boolean>
}

function assignDeeplyIfCreatesNoCycles(assignment: Assignment, v: VariableName, term: Term): boolean {
    const fullyAssignedTerm = assignTermDeeply(term, assignment)
    if (occursIn(v, fullyAssignedTerm, assignment)) {
        return false
    } else {
        assignment.assign(v, fullyAssignedTerm)
        return true
    }
}

function unifyVariable(currentAssignment: Assignment, v: VariableName, term: Term): boolean {
    if (currentAssignment.isAssigned(v)) {
        const value = currentAssignment.getAssignedValue(v)!
        return unifyEquation(currentAssignment, [value, term])
    } else {
        return assignDeeplyIfCreatesNoCycles(currentAssignment, v, term)
    }
}

function unifyVariables(currentAssignment: Assignment, v1: VariableName, v2: VariableName): boolean {
    let v1Value = currentAssignment.getAssignedValue(v1);
    let v2Value = currentAssignment.getAssignedValue(v2);

    if (v1Value !== undefined && v2Value !== undefined)
        return unifyEquation(currentAssignment, [v1Value, v2Value]); 

    if (v1Value !== undefined)
        return unifyEquation(currentAssignment, [v1Value, { variable: v2 }]);

    if (v2Value !== undefined)
        return unifyEquation(currentAssignment, [{ variable: v1 }, v2Value]);

    currentAssignment.unite(v1, v2);
    return true;
}

function unifyEquation(currentAssignment: Assignment, equation: TermEquation): boolean {
    const [lhs, rhs] = equation

    if ("variable" in lhs && "variable" in rhs)
        return unifyVariables(currentAssignment, lhs.variable, rhs.variable);

    if ("variable" in lhs)
        return unifyVariable(currentAssignment, lhs.variable, rhs);

    if ("variable" in rhs)
        return unifyVariable(currentAssignment, rhs.variable, lhs);   

    if ("number" in lhs)
        return ("number" in rhs) && lhs.number === rhs.number;

    if ("number" in rhs) return false;

    // Now, lhs and rhs must be function terms
    if (lhs.function !== rhs.function) return false;
    if (lhs.args.length !== rhs.args.length) return false;

    let unifiedSuccessfully = true;

    for (let i = 0; i < lhs.args.length; i++) {
        const lhsArg = lhs.args[i]
        const rhsArg = rhs.args[i]
        if (!unifyEquation(currentAssignment, [lhsArg, rhsArg]))
            unifiedSuccessfully = false;
    }

    return unifiedSuccessfully; 
}

export function unifyTermEquations<T>(equations: ValueMap<T, TermEquation>): UnificationResult<T> {
    const equationIsSatisfied = new ValueMap<T, boolean>()
    const assignment: Assignment = new DisjointSetWithAssignment()
    equations.forEach((equation, key) => {
        const unifiedSuccessfully = unifyEquation(assignment, equation)
        equationIsSatisfied.set(key, unifiedSuccessfully)
    })
    return { assignment, equationIsSatisfied }
}

export function unifyRelationEquations<T>(equations: ValueMap<T, RelationEquation>): UnificationResult<T> {
    const equationIsSatisfied = new ValueMap<T, boolean>()
    const assignment: Assignment = new DisjointSetWithAssignment()
    equations.forEach((equation, key) => {
        let unifiedSuccessfully = true;
        const [lhs, rhs] = equation; 

        for (let i = 0; i < lhs.args.length; i++) {
            const lhsArg = lhs.args[i]
            const rhsArg = rhs.args[i]
            if (!unifyEquation(assignment, [lhsArg, rhsArg]))
                unifiedSuccessfully = false;
        }

        equationIsSatisfied.set(key, unifiedSuccessfully)
    })
    return { assignment, equationIsSatisfied }
}
