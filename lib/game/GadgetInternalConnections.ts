import { CellPosition, isOutputPosition } from "./CellPosition";
import { Relation, VariableName, getVariableList } from "./Term";

export type NodePositionDeprecated = number | "output"
export type HolePosition = [NodePositionDeprecated, number]

export interface InternalConnection {
    from: HolePosition
    to: HolePosition
}

function getPositionsInRelation(v: VariableName, r: Relation): number[] {
    return r.args.flatMap((arg, i) => (
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

function makeConnectionsForVariable(relations: Map<CellPosition, Relation>, v: VariableName): InternalConnection[] {
    let positionsInInputs: HolePosition[] = []; 
    let positionsInOutput: HolePosition[] = []; 

    for (const [indexOfRelation, relation] of relations.entries()) {
        const indexOfRelationDeprecated = isOutputPosition(indexOfRelation) ? 
            "output" : indexOfRelation;
        const arrayToPushTo = isOutputPosition(indexOfRelation) ?
            positionsInOutput : positionsInInputs;

        for (const variablePosition of getPositionsInRelation(v, relation)) {
            arrayToPushTo.push([indexOfRelationDeprecated, variablePosition]);
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

export function makeConnections(relations: Map<CellPosition, Relation>): InternalConnection[] {
    const variableList = relations.values().flatMap(getVariableList);
    const variableSet = new Set(variableList)
    const connections = [...variableSet].flatMap(v => 
        makeConnectionsForVariable(relations, v)
    );
    return connections;
}
