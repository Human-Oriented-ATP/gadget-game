import { XYPosition } from "@xyflow/react";
import { pointToString, addOffsetX, addOffsetY } from 'lib/util/XYPosition';
import { RankAllocator } from 'lib/util/RankAllocator';

const LAYOUT = {
  cornerRadius: 5,
  equalityOffset: -5,
  holeRadius: 11,
  interColumnDistance: 56, // used as intra-input offset
  intraOutputOffset: 75,
  interColumnTensionFrom: 0.75,
  interColumnTensionTo: 0.45,
  reducedRankSpan: 50,
  rankToOffsetPercent: (rank: number) => {
    const channelPositions = [0.46, 0.38, 0.31, 0.26, 0.22, 0.19];
    return channelPositions[Math.min(rank, channelPositions.length - 1)];
  },
  rankToColour: (rank: number) => (
    // Red, blue and yellow tinges
    ['#5a2727ff', '#2e2e6dff', '#61612aff'][rank % 3]
  ),
} as const;


export interface ConnectionDrawingData {
    start: XYPosition
    end: XYPosition
    fromInput: boolean
    toOutput: boolean
    toEquality?: boolean
}

export interface ConnectionSvgProps {
    connections: ConnectionDrawingData[]
}

interface IntraConnection extends ConnectionDrawingData {
    rank: number | "equality";
}

type Connection = ConnectionDrawingData | IntraConnection;

function createIntraColumnPath(connection: IntraConnection): string {
    if (connection.rank === "equality") 
        throw Error("createEqualityIntraPath must be used for equalities");
    const holeRadius = LAYOUT.holeRadius;

    const crossingOffset = connection.fromInput ? 
        LAYOUT.interColumnDistance : LAYOUT.intraOutputOffset;
    const rankOffset = LAYOUT.rankToOffsetPercent(connection.rank) * crossingOffset;
    
    const startPoint = addOffsetX(connection.start, holeRadius);
    const endPoint = addOffsetX(connection.end, holeRadius);

    const cornerRadius = LAYOUT.cornerRadius;
    const cornerOffsetY = Math.sign(endPoint.y - startPoint.y) * cornerRadius;
    
    return (
     `M ${pointToString(startPoint)}
      l ${rankOffset - cornerRadius} 0
      a ${cornerRadius},${cornerRadius} 0 0,1 ${cornerRadius},${cornerOffsetY}
      l 0 ${endPoint.y - startPoint.y - 2 * cornerOffsetY}
      a ${cornerRadius},${cornerRadius} 0 0,1 ${-cornerRadius},${cornerOffsetY}
      L ${pointToString(endPoint)}`);
}

function createEqualityIntraPath(connection: IntraConnection): string {
    const holeRadius = LAYOUT.holeRadius;
    const offset = LAYOUT.equalityOffset;

    const startPoint = addOffsetY(connection.start, -holeRadius);
    const endPoint = addOffsetY(connection.end, -holeRadius);

    const cornerRadius = LAYOUT.cornerRadius;
    const cornerOffsetX = Math.sign(endPoint.x - startPoint.x) * cornerRadius;
    
    return (
     `M ${pointToString(startPoint)}
      l 0 ${offset + cornerRadius}
      a ${cornerRadius},${cornerRadius} 0 0,1 ${cornerOffsetX},${-cornerRadius}
      l ${endPoint.x - startPoint.x - 2 * cornerOffsetX} 0
      a ${cornerRadius},${cornerRadius} 0 0,1 ${cornerOffsetX},${cornerRadius}
      L ${pointToString(endPoint)}`);
}

function createInterColumnPath(connection: ConnectionDrawingData): string {
    const startPoint = addOffsetX(connection.start, LAYOUT.holeRadius);
    const endPoint = addOffsetX(connection.end, -LAYOUT.holeRadius);
    const dx = LAYOUT.interColumnDistance;
    const c1 = addOffsetX(connection.start, LAYOUT.interColumnTensionFrom * dx);
    const c2 = addOffsetX(connection.end, -LAYOUT.interColumnTensionTo * dx);
    
    return `M ${pointToString(startPoint)}
            C ${pointToString(c1)}
              ${pointToString(c2)}
              ${pointToString(endPoint)}`;
}

function createEqualityInterPath(connection: ConnectionDrawingData): string {
    const startPoint = addOffsetX(connection.start, LAYOUT.holeRadius);

    const isTopEntry = connection.start.y <= connection.end.y;
    const endOffsetY = isTopEntry ? -LAYOUT.holeRadius : LAYOUT.holeRadius;
    const endPoint = addOffsetY(connection.end, endOffsetY);

    const dx = Math.abs(connection.end.x - connection.start.x);
    const c1 = addOffsetX(connection.start, LAYOUT.interColumnTensionFrom * dx * 0.5);
    const c2 = addOffsetY(endPoint, (isTopEntry ? -1 : 1) * LAYOUT.interColumnTensionTo * dx * 0.5);

    return `M ${pointToString(startPoint)}
            C ${pointToString(c1)}
              ${pointToString(c2)}
              ${pointToString(endPoint)}`;
}

function createYPositionLookup(connections: ConnectionDrawingData[]): Map<number, number> {
    const allYPositions = 
        new Set<number>(connections.flatMap(c => [c.start.y, c.end.y]));
    
    const sortedPositions = Float64Array.from(allYPositions).sort();
    const yToOrderMap = new Map<number, number>();
    
    sortedPositions.forEach((y, index) => {
        yToOrderMap.set(y, index);
    });
    
    return yToOrderMap;
}

function assignRanksToIntraConnections(connections: ConnectionDrawingData[]): Connection[] {
    const intraConnectionsLeft = connections.filter(c => c.fromInput && !c.toOutput);
    const intraConnectionsRight = connections.filter(c => !c.fromInput && c.toOutput && !c.toEquality);
    const equalityLoops = connections.filter(c => !c.fromInput && c.toEquality);
    const interConnections = connections.filter(c => c.fromInput === c.toOutput);

    const augmentedConnections: Connection[] = [];
    
    for (const intra of [intraConnectionsLeft, intraConnectionsRight]) {
        const yPositionLookup = createYPositionLookup(intra);
        const rankAllocator = new RankAllocator();
        
        const sortedIntraConnections = intra
            .map(conn => ({
                conn,
                startOrder: yPositionLookup.get(conn.start.y)!,
                endOrder: yPositionLookup.get(conn.end.y)!,
                span: Math.abs(conn.start.y - conn.end.y) 
            }))
            .sort((a, b) => b.span - a.span);

        for (const item of sortedIntraConnections) {
            const minRank = item.span < LAYOUT.reducedRankSpan ? 2 : 0;
            const rank = rankAllocator.allocate(
                item.startOrder, item.endOrder, minRank
            );
            augmentedConnections.push({...item.conn, rank});
        }
    }


    augmentedConnections.push(...interConnections);
    augmentedConnections.push(...equalityLoops.map(c => ({...c, rank: "equality"})));
    
    return augmentedConnections;
}

export function ConnectionPath(props: Connection, index: number): React.JSX.Element {
    let pathData: string;
    let strokeColor: string | undefined;

    if ("rank" in props) {
        pathData = (props.toEquality ? createEqualityIntraPath : createIntraColumnPath)(props);
        strokeColor = props.rank === "equality" ? undefined : LAYOUT.rankToColour(props.rank);
    } else {
        pathData = (props.toEquality ? createEqualityInterPath : createInterColumnPath)(props);
    }
    
    return <path 
        key={index}
        d={pathData}
        strokeWidth="2px"
        fill="transparent"
        stroke={strokeColor}
    />;
}

export function ConnectionSvg({ ...props }: ConnectionSvgProps) {
    const rankedConnections = assignRanksToIntraConnections(props.connections);
    
    return <svg overflow="visible" className="absolute top-0 left-0 w-full h-full z-5 pointer-events-none stroke-black">
        {rankedConnections.map((connection, index) => 
            ConnectionPath(connection, index)
        )}
    </svg>;
}
