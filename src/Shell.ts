import readline, { Interface } from 'readline'
import Interpreter from './Interpreter'

const start = () => {
  const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  prompt(terminal)
}

const prompt = (terminal: Interface) => {
  terminal.question('Ida > ', (input) => {
    Interpreter.eval(input, true)
    prompt(terminal)
  })
}

export default { start }
