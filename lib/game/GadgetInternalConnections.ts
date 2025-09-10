import { CellPosition, isOutputPosition } from "./CellPosition";
import { Term, VariableName, getVariableList } from "./Term";

export type NodePositionDeprecated = number | "output"
export type HolePosition = [NodePositionDeprecated, number]

export interface InternalConnection {
    from: HolePosition
    to: HolePosition
}

function getPositionsInTerm(v: VariableName, t: Term): number[] {
    if ("variable" in t) return [];

    return t.args.flatMap((arg, i) => (
        "variable" in arg && arg.variable == v ? [i] : []
    ));
}

function makeSequentialConnections(positions: HolePosition[]) {
    let connections: InternalConnection[] = []
    for (let i = 0; i < positions.length - 1; i++) {
        connections.push({ from: positions[i], to: positions[i + 1] })
    }
    return connections
}

function makeConnectionsForVariable(terms: Map<CellPosition, Term>, v: VariableName): InternalConnection[] {
    let positionsInInputs: HolePosition[] = []; 
    let positionsInOutput: HolePosition[] = []; 

    for (const [indexOfTerm, term] of terms.entries()) {
        const indexOfTermDeprecated = isOutputPosition(indexOfTerm) ? 
            "output" : indexOfTerm;
        const arrayToPushTo = isOutputPosition(indexOfTerm) ?
            positionsInOutput : positionsInInputs;

        for (const variablePosition of getPositionsInTerm(v, term)) {
            arrayToPushTo.push([indexOfTermDeprecated, variablePosition]);
        }
    }

    // Three different strategies are employed in displaying
    // connections, depending on where the holes lie.
    if (positionsInOutput.length === 0)
        return makeSequentialConnections(positionsInInputs);
    
    if (positionsInInputs.length === 0) 
        return makeSequentialConnections(positionsInOutput);
    
    return positionsInInputs.flatMap(from =>
            positionsInOutput.map(to => ( { from, to } )));
}

export function makeConnections(terms: Map<CellPosition, Term>): InternalConnection[] {
    const variableList = terms.values().flatMap(getVariableList);
    const variableSet = new Set(variableList)
    const connections = [...variableSet].flatMap(v => 
        makeConnectionsForVariable(terms, v)
    );
    return connections;
}
