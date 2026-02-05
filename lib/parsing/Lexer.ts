import { createToken, Lexer } from "chevrotain"

export const Atom = createToken({
  name: "Atom",
  pattern: /[a-z]\w*/
})

export const Number = createToken({
  name: "Number",
  pattern: /\d+/
})

export const Variable = createToken({
  name: "Variable",
  pattern: /[A-Z_]\w*/
})

export const Equals = createToken({ name: "Equals", pattern: /eq/ });

export const Entails = createToken({ name: "Entails", pattern: /:-/ });

export const Comma = createToken({ name: "Comma", pattern: /,/ })

export const FullStop = createToken({ name: "FullStop", pattern: /\./ })

export const LeftParen = createToken({ name: "LeftParen", pattern: /\(/ })

export const RightParen = createToken({ name: "RightParen", pattern: /\)/ })

export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /[^\S\r\n]/,
  group: Lexer.SKIPPED
})

export const NewLine = createToken({
  name: "NewLine",
  pattern: /[\r\n]+/,
})

export const Comment = createToken({
  name: "Comment",
  pattern: /%[^\r\n]*/,
  group: Lexer.SKIPPED
})

export const allTokens = [
  Comment,
  WhiteSpace,
  NewLine,
  Entails,
  LeftParen,
  RightParen,
  Comma,
  FullStop,
  Equals,
  Atom,
  Number,
  Variable,
]

export const PrologLexer = new Lexer(allTokens)

export function tokenize(text: string) {
  const result = PrologLexer.tokenize(text)

  if (result.errors.length > 0) {
    const msg = result.errors.map((error) => `[${error.line}:${error.column}] ${error.message}`).join(', ')
    throw new Error(`Error tokenizing the text. ${msg}`)
  }

  return result.tokens
}