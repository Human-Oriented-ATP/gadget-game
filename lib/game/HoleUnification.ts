import { ValueMap } from "lib/util/ValueMap";
import { Assignment, shapesMatch, Term } from "./Term";
import { RelationEquation } from "./Unification";
import { DisjointSetWithAssignment } from "lib/util/DisjointSetWithAssignment";

export function getIdentifier(t: Term): string | undefined {
    if ("variable" in t) return t.variable;
    return t.identifier;
}

export function calculateHoleAssignment<T>(equations: ValueMap<T, RelationEquation>, equationIsSatisfied: ValueMap<T, boolean>): Assignment {
    const assignment = new DisjointSetWithAssignment<string, never>();
    equations.forEach(([lhs, rhs], key) => {
        if (!equationIsSatisfied.get(key)) return;
        if (!shapesMatch(lhs, rhs)) return;

        for (let i = 0; i < lhs.args.length; i++) {
            const lhsLabel = getIdentifier(lhs.args[i]);
            const rhsLabel = getIdentifier(rhs.args[i]);
            if (lhsLabel !== undefined && rhsLabel !== undefined)
                assignment.unite(lhsLabel, rhsLabel);
        }
    })
    return assignment;
}