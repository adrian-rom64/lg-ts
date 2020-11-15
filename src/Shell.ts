import readline, { Interface } from 'readline'
import Exception from './Exception'
import Lexer from './Lexer'
import Parser from './Parser'

const start = () => {
  const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  prompt(terminal)
}

const prompt = (terminal: Interface) => {
  terminal.question('Ida > ', (input) => {
    try {
      const tokens = Lexer.tokenize(input)
      console.log('TOKENS =>', tokens)
      const node = Parser.parse(tokens)
      console.log('AST =>', node.toString())
      const result = node.visit()
      console.log('RESULT =>', result.toString())
    } catch (err) {
      if (err instanceof Exception) {
        console.log(err.toString())
      } else {
        throw err
      }
    }
    prompt(terminal)
  })
}

export default { start }
