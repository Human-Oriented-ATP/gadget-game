import { CstNode, IToken } from 'chevrotain';

export interface FunctionNode {
    function: IToken[]
    args: CstNode[]
}

export interface TermNode {
    Number?: IToken[]
    Variable?: IToken[]
    functionTerm?: CstNode[]
}

export interface RelationNode {
    normalRelation?: CstNode[]
}

export interface NormalRelationNode {
    label: IToken[]
    args: CstNode[]
}

export interface StatementNode {
    conclusion?: CstNode[]
    hypotheses?: CstNode[]
}

export interface ProblemNode {
    statements: CstNode[]
}
