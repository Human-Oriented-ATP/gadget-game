import { parseTermCst, parseStatementCst, parseProblemCst, parser, parseRelationCst } from "./Parser"
import { Term, Relation } from "../game/Term"
import { Statement, makeProblemFileDataFromStatements, ProblemFileData, isAxiom } from "../game/Initialization"
import { FunctionNode, ProblemNode, RelationNode, StatementNode, TermNode, NormalRelationNode, EqualityRelationNode } from "./Nodes"
import { Axiom } from "lib/game/Primitives"

const BaseVisitor = parser.getBaseCstVisitorConstructor()

class PrologAstBuilderVisitor extends BaseVisitor {
    constructor() {
        super()
        this.validateVisitor()
    }

    functionTerm(node: FunctionNode): Term {
        const label = node.function[0].image
        const args = node.args.map(arg => this.visit(arg))
        return {
            function: label,
            args: args
        }
    }

    term(node: TermNode): Term {
        if (node.Number !== undefined) {
            return { number: node.Number[0].image }
        }
        else if (node.Variable !== undefined) {
            return { variable: node.Variable[0].image }
        }
        else {
            return this.visit(node.functionTerm!)
        }
    }

    relation(node: RelationNode): Relation {
        if (node.equalityRelation !== undefined) {
            return this.visit(node.equalityRelation)
        } else {
            return this.visit(node.normalRelation!)
        }
    }

    normalRelation(node: NormalRelationNode): Relation {
        const label = node.label!![0].image
        const args = node.args.map(arg => this.visit(arg))
        return {
            label: label,
            args: args
        }
    }

    equalityRelation(node: EqualityRelationNode): Relation {
        const leftTerm = this.visit(node.leftTerm[0])
        const rightTerm = this.visit(node.rightTerm[0])
        return {
            equals: [leftTerm, rightTerm] as const
        }
    }

    statement(node: StatementNode): Statement {
        if (node.conclusion) {
            const conclusion = this.visit(node.conclusion)
            if (node.hypotheses) {
                const hypotheses = node.hypotheses.map((hyp) => this.visit(hyp))
                return { axiom: { conclusion, hypotheses } }
            } else {
                return { axiom: { conclusion: conclusion, hypotheses: [] } }
            }
        } else {
            if (node.hypotheses) {
                const hypotheses = node.hypotheses.map((hyp) => this.visit(hyp))
                if (hypotheses.length !== 1) {
                    throw new Error("Expected exactly one term in the conclusion.")
                }
                return {
                    goal: hypotheses[0]!!
                }
            } else {
                throw new Error("Error in parsing statement, no conclusions or hypotheses found.")
            }
        }
    }

    problem(node: ProblemNode): ProblemFileData {
        const stmts = node.statements.map(stmt => this.visit(stmt))
        return makeProblemFileDataFromStatements(stmts);
    }

}

const astBuilder = new PrologAstBuilderVisitor()

export function parseTerm(text: string): Term {
    const cst = parseTermCst(text)
    const ast = astBuilder.visit(cst)
    return ast
}

export function parseRelation(text: string): Relation {
    const cst = parseRelationCst(text)
    const ast = astBuilder.visit(cst)
    return ast
}

export function parseStatement(text: string): Statement {
    let textToBeParsed = text.trim().endsWith(".") ? text : `${text}.`
    const cst = parseStatementCst(textToBeParsed)
    const ast = astBuilder.visit(cst)
    return ast
}

export function parseAxiom(text: string): Axiom {
    const stmt = parseStatement(text)
    if (isAxiom(stmt)) {
        return stmt.axiom;
    }
    else {
        throw new Error("Expected an axiom, got a goal.")
    }
}

export function parseProblemFile(text: string): ProblemFileData {
    const cst = parseProblemCst(text)
    const ast = astBuilder.visit(cst)
    return ast
}