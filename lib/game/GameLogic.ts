import { CellPosition, OUTPUT_POSITION } from 'lib/game/CellPosition';
import { Axiom, GOAL_GADGET_ID } from "./Primitives";
import { GadgetId } from "./Primitives";
import { GadgetProps } from "components/game/gadget/Gadget";
import { Relation, Term, makeAxiomWithFreshLabels, makeRelationWithFreshLabels } from "./Term";
import { parseStatement } from 'lib/parsing/Semantics';

export function getGadgetRelations(statement: string, id: GadgetId): Map<CellPosition, Relation> {
    const parsed = parseStatement(statement)
    if ("axiom" in parsed) {
        const axiomWithFreshVariables = makeAxiomWithFreshLabels(parsed.axiom, id)
        let relations = new Map<CellPosition, Relation>()
        axiomWithFreshVariables.hypotheses.forEach((hypothesis, i) => {
            relations.set(i, hypothesis)
        })
        relations.set(OUTPUT_POSITION, axiomWithFreshVariables.conclusion)
        return relations
    } else {
        return new Map<CellPosition, Relation>([[0, parsed.goal]]);
    }
}


export function axiomToGadget(axiom: string, id: GadgetId): GadgetProps {
    const relations = getGadgetRelations(axiom, id)
    return { relations, id, isOnShelf: false }
}

export function termToString(t: Term): string {
    if ("variable" in t) return t.variable; 
    if ("number" in t) return t.number;
    return t.function + "(" + t.args.map(termToString).join(", ") + ")";
}

export function relationToString(r: Relation): string {
    return r.label + "(" + r.args.map(termToString).join(", ") + ")"
}

// export function equationToString(equation: Equation) {
//     return termToString(equation[0]) + "=" + termToString(equation[1])
// }

export function axiomToString(a: Axiom) {
    const hypotheses = a.hypotheses.map(relationToString).join(",")
    const conclusion = relationToString(a.conclusion)
    if (hypotheses === "") {
        return conclusion
    }
    return `${conclusion}:-${hypotheses}`
}

export function goalToString(relation: Relation) {
    return `:-${relationToString(relation)}`
}