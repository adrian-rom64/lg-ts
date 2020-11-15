import { expect } from 'chai'
import Lexer from '../src/Lexer'
import Token from '../src/Token'
import TT from '../src/TT'
import ET from '../src/ET'

const tokenize = (input: string): Token[] => {
  return Lexer.tokenize(input)
}

const token = (input: { type: TT; value?: string }) => {
  return new Token(input.type, input.value ?? null)
}

describe('Lexer - Correct', () => {
  it('3', () => {
    expect(tokenize('3')).deep.equal([token({ type: TT.INT, value: '3' })])
  })
  it('85764563465546', () => {
    expect(tokenize('85764563465546')).deep.equal([
      token({ type: TT.INT, value: '85764563465546' })
    ])
  })
  it('3.656', () => {
    expect(tokenize('3.656')).deep.equal([
      token({ type: TT.FLOAT, value: '3.656' })
    ])
  })
  it('+-*/%', () => {
    expect(tokenize('+-*/%')).deep.equal([
      token({ type: TT.ADD }),
      token({ type: TT.SUB }),
      token({ type: TT.MUL }),
      token({ type: TT.DIV }),
      token({ type: TT.MOD })
    ])
  })
  it('3 + 2', () => {
    expect(tokenize('3 + 2')).deep.equal([
      token({ type: TT.INT, value: '3' }),
      token({ type: TT.ADD }),
      token({ type: TT.INT, value: '2' })
    ])
  })
  it('3 - 7.21 * 2 % 1', () => {
    expect(tokenize('3 - 7.21 * 2 % 1')).deep.equal([
      token({ type: TT.INT, value: '3' }),
      token({ type: TT.SUB }),
      token({ type: TT.FLOAT, value: '7.21' }),
      token({ type: TT.MUL }),
      token({ type: TT.INT, value: '2' }),
      token({ type: TT.MOD }),
      token({ type: TT.INT, value: '1' })
    ])
  })
  it('', () => {
    expect(tokenize('')).deep.equal([])
  })
  it(' \t ', () => {
    expect(tokenize(' \t ')).deep.equal([])
  })
  it('let ab = 12.5', () => {
    expect(tokenize('let ab = 12.5')).to.deep.eq([
      token({ type: TT.KEYWORD, value: 'let' }),
      token({ type: TT.IDENTIFIER, value: 'ab' }),
      token({ type: TT.EQ }),
      token({ type: TT.FLOAT, value: '12.5' })
    ])
  })
  it('aa BB cc', () => {
    expect(tokenize('aa BB cc')).deep.equal([
      token({ type: TT.IDENTIFIER, value: 'aa' }),
      token({ type: TT.IDENTIFIER, value: 'BB' }),
      token({ type: TT.IDENTIFIER, value: 'cc' })
    ])
  })
  it('ayy12', () => {
    expect(tokenize('ayy12')).deep.equal([
      token({ type: TT.IDENTIFIER, value: 'ayy12' })
    ])
  })
})

describe('Lexer - operators', () => {
  it('==', () => {
    expect(tokenize('==')).to.deep.equal([token({ type: TT.EQUALS })])
  })
  it('=', () => {
    expect(tokenize('=')).to.deep.equal([token({ type: TT.EQ })])
  })
  it('!=', () => {
    expect(tokenize('!=')).to.deep.equal([token({ type: TT.NOT_EQUALS })])
  })
  it('<', () => {
    expect(tokenize('<')).to.deep.equal([token({ type: TT.LESS_THAN })])
  })
  it('>', () => {
    expect(tokenize('>')).to.deep.equal([token({ type: TT.GRATER_THAN })])
  })
  it('<=', () => {
    expect(tokenize('<=')).to.deep.equal([token({ type: TT.LESS_OR_EQ })])
  })
  it('>=', () => {
    expect(tokenize('>=')).to.deep.equal([token({ type: TT.GREATER_OR_EQ })])
  })
})

describe('Lexer - throws error', () => {
  it('0.', () => {
    expect(() => tokenize('0.')).to.throw(ET.InvalidSyntax.name)
  })
  it('^', () => {
    expect(() => tokenize('^')).to.throw(ET.IllegalCharacter.name)
  })
})
