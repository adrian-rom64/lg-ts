import { expect } from 'chai'
import Token from '../src/Token'
import TT from '../src/TT'
import Parser from '../src/Parser'

const token = (input: { type: TT; value?: string }) => {
  return new Token(input.type, input.value ?? null)
}

const parse = (input: Token[]): string => {
  return Parser.parse(input).toString()
}

describe('Parser - correct', () => {
  it('abc', () => {
    expect(parse([token({ type: TT.IDENTIFIER, value: 'abc' })])).to.deep.equal(
      'abc'
    )
  })
  it('3 + 3', () => {
    expect(
      parse([
        token({ type: TT.INT, value: '3' }),
        token({ type: TT.ADD }),
        token({ type: TT.INT, value: '2' }),
        token({ type: TT.MUL }),
        token({ type: TT.INT, value: '4' })
      ])
    ).to.deep.equal('(3, ADD, (2, MUL, 4))')
  })
  it('1 + 2 - 3.4 - c', () => {
    expect(
      parse([
        token({ type: TT.INT, value: '1' }),
        token({ type: TT.ADD }),
        token({ type: TT.INT, value: '2' }),
        token({ type: TT.SUB }),
        token({ type: TT.FLOAT, value: '3.4' }),
        token({ type: TT.SUB }),
        token({ type: TT.IDENTIFIER, value: 'c' })
      ])
    ).to.deep.equal('(((1, ADD, 2), SUB, 3.4), SUB, c)')
  })
  it('let hello = 123', () => {
    expect(
      parse([
        token({ type: TT.KEYWORD, value: 'let' }),
        token({ type: TT.IDENTIFIER, value: 'hello' }),
        token({ type: TT.EQ }),
        token({ type: TT.INT, value: '123' })
      ])
    ).to.deep.equal('(let hello = 123)')
  })
  it('x = 3.4', () => {
    expect(
      parse([
        token({ type: TT.IDENTIFIER, value: 'x' }),
        token({ type: TT.EQ }),
        token({ type: TT.INT, value: '3.4' })
      ])
    ).to.deep.equal('(x = 3.4)')
  })
})
