import { ValueMap } from "lib/util/ValueMap";
import { Assignment, Term } from "./Term";
import { RelationEquation } from "./Unification";
import { DisjointSetWithAssignment } from "lib/util/DisjointSetWithAssignment";

function getLabel(t: Term): string | undefined {
    if ("number" in t) return t.label; 
    if ("variable" in t) return t.variable;
    return t.identifier;
}

export function calculateHoleAssignment<T>(equations: ValueMap<T, RelationEquation>): Assignment {
    const assignment = new DisjointSetWithAssignment<string, never>();
    equations.forEach(([lhs, rhs]) => {
        if (lhs.args.length !== rhs.args.length)
            throw Error(`LHS ${lhs} and RHS ${rhs} should match`);

        for (let i = 0; i < lhs.args.length; i++) {
            const lhsLabel = getLabel(lhs.args[i]);
            const rhsLabel = getLabel(rhs.args[i]);
            if (lhsLabel !== undefined && rhsLabel !== undefined)
                assignment.unite(lhsLabel, rhsLabel);
        }
    })
    return assignment;
}