import Lexer from './Lexer'
import Parser from './Parser'
import Exception from './Exception'

const log = Object.assign(
  (input: string) => console.log(input),
  { line: () => { console.log('='.repeat(process.stdout.columns)) } }
)

const evaluate = (input: string, debug = false): string  => {
  try {
    debug && log.line()
    const tokens = Lexer.tokenize(input)
    debug && log(`Tokens => ${tokens}`)
    const node = Parser.parse(tokens)
    debug && log(`AST => ${node}`)
    const result = node.visit()
    debug && log(`Result => ${result}`)
    debug && log.line()
    return result.toString()
  } catch (err) {
    if (err instanceof Exception) {
      debug && log(err.toString())
      return err.toString()
    } else {
      throw err
    }
  }
}

export default { eval: evaluate }
