import { CstNode, CstParser, IRecognitionException } from "chevrotain"
import { Equals, Atom, Comma, Entails, FullStop, LeftParen, NewLine, Number, RightParen, Variable, allTokens, tokenize } from "./Lexer"

export class PrologParser extends CstParser {
    constructor() {
        super(allTokens);
        this.performSelfAnalysis();
    }

    relation = this.RULE("relation", () => {
        this.OR([
            { ALT: () => this.SUBRULE(this.equalityRelation) },
            { ALT: () => this.SUBRULE(this.normalRelation) }
        ])
    })

    equalityRelation = this.RULE("equalityRelation", () => {
        this.CONSUME(Equals)
        this.CONSUME(LeftParen)
        this.SUBRULE(this.term, { LABEL: "leftTerm" })
        this.CONSUME(Comma)
        this.SUBRULE1(this.term, { LABEL: "rightTerm" })
        this.CONSUME(RightParen)
    })

    normalRelation = this.RULE("normalRelation", () => {
        this.CONSUME(Atom, { LABEL: "label" })
        this.CONSUME(LeftParen)
        this.AT_LEAST_ONE_SEP({
            SEP: Comma,
            DEF: () => {
                this.SUBRULE(this.term, { LABEL: "args" })
            }
        })
        this.CONSUME(RightParen)
    })

    functionTerm = this.RULE("functionTerm", () => {
        this.CONSUME(Atom, { LABEL: "function" })
        this.CONSUME(LeftParen)
        this.AT_LEAST_ONE_SEP({
            SEP: Comma,
            DEF: () => {
                this.SUBRULE(this.term, { LABEL: "args" })
            }
        })
        this.CONSUME(RightParen)
    })

    term = this.RULE("term", () => {
        this.OR([
            { ALT: () => this.CONSUME(Number) },
            { ALT: () => this.CONSUME(Variable) },
            { ALT: () => this.SUBRULE(this.functionTerm) }
        ])
    })

    statement = this.RULE("statement", () => {
        this.OPTION(() => { this.SUBRULE(this.relation, { LABEL: "conclusion" }) })
        this.OPTION1(() => {
            this.CONSUME(Entails)
            this.MANY_SEP({
                SEP: Comma,
                DEF: () => { this.SUBRULE1(this.relation, { LABEL: "hypotheses" }) }
            })
        })
        this.CONSUME(FullStop)
    })

    problem = this.RULE("problem", () => {
        this.MANY_SEP({
            SEP: NewLine,
            DEF: () => { this.SUBRULE(this.statement, { LABEL: "statements" }) }
        })
    })
}

export const parser: PrologParser = new PrologParser()

export function handleErrors(errors: IRecognitionException[]) {
    if (errors.length > 0) {
        const getPos = (error: IRecognitionException) => {
            const makeMsg = error.token.startLine !== null
                && error.token.startColumn !== null;
            if (!makeMsg) return "";
            return `. Occurs on ${error.token.startLine}:${error.token.startColumn}`
        }
        const msg = errors.map((error) => `[${error.name}] ${error.message}${getPos(error)}`).join('\n')
        throw new Error(msg)
    }
}

export function parseTermCst(text: string): CstNode {
    parser.input = tokenize(text)
    const cst = parser.term()
    handleErrors(parser.errors)
    return cst
}

export function parseRelationCst(text: string): CstNode {
    parser.input = tokenize(text)
    const cst = parser.relation()
    handleErrors(parser.errors)
    return cst
}

export function parseStatementCst(text: string): CstNode {
    parser.input = tokenize(text)
    const cst = parser.statement()
    handleErrors(parser.errors)
    return cst
}

export function parseProblemCst(text: string): CstNode {
    parser.input = tokenize(text)
    const cst = parser.problem()
    handleErrors(parser.errors)
    return cst
}