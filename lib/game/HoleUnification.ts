import { ValueMap } from "lib/util/ValueMap";
import { Assignment, shapesMatch, Term } from "./Term";
import { GeneralEquation } from "./Unification";
import { DisjointSetWithAssignment } from "lib/util/DisjointSetWithAssignment";

export function getIdentifier(t: Term): string | undefined {
    if ("variable" in t) return t.variable;
    return t.identifier;
}

export function calculateHoleAssignment<T>(equations: ValueMap<T, GeneralEquation>, equationIsSatisfied: ValueMap<T, boolean>): Assignment {
    const assignment = new DisjointSetWithAssignment<string, never>();
    equations.forEach((generalEquation, key) => {
        if (!equationIsSatisfied.get(key)) return;
        
        let lhsArgs: readonly Term[], rhsArgs: readonly Term[];
        if (generalEquation.type === "relation") {
            [lhsArgs, rhsArgs] = generalEquation.equation.map(v =>
              "args" in v ? v.args : v.equals
            );
            if (!shapesMatch(...generalEquation.equation)) {
              equationIsSatisfied.set(key, false);
              return;
            }
        } else {
            [lhsArgs, rhsArgs] = generalEquation.equation.map(v => [v]);
        };

        for (let i = 0; i < lhsArgs.length; i++) {
            const lhsLabel = getIdentifier(lhsArgs[i]);
            const rhsLabel = getIdentifier(rhsArgs[i]);
            if (lhsLabel !== undefined && rhsLabel !== undefined)
                assignment.unite(lhsLabel, rhsLabel);
        }
    })
    return assignment;
}