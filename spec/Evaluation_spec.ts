import { expect } from 'chai'
import Interpreter from '../src/Interpreter'

const run = (input: string): string => {
  return Interpreter.eval(input)
}

describe('Interpreter - examples', () => {
  it('Addition', () => {
    expect(run('3 + 3')).eq('6')
  })
  it('Substraction', () => {
    expect(run('5 - 20')).eq('-15')
  })
  it('Multiplication', () => {
    expect(run('3 * 4')).eq('12')
  })
  it('Division', () => {
    expect(run('21 / 5')).eq('4')
  })
  it('Modulo', () => {
    expect(run('21 % 5')).eq('1')
  })
})
