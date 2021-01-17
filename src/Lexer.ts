import Token from './Token'
import Exception from './Exception'
import TT from './TT'
import ET from './ET'

interface Context {
  text: string
  char: string
  cursor: number
  end: boolean
}

const initialContext = (text: string) => {
  return {
    text,
    char: '',
    cursor: -1,
    end: false
  } as Context
}

const tokenize = (input: string): Token[] => {
  const ctx = initialContext(input)
  const tokens: Token[] = []

  while (!ctx.end) {
    if (isWhiteSpace(ctx.char)) {
      advance(ctx)
    }
    if (isDigit(ctx.char)) {
      tokens.push(matchNumber(ctx))
    }
    if (isLetter(ctx.char)) {
      tokens.push(matchWord(ctx))
    }
    if (ctx.char === '\'') {
      tokens.push(matchString(ctx))
    }
    const sign = matchOperator(ctx)
    if (sign) {
      tokens.push(new Token(sign))
    }
    advance(ctx)

    if (isIllegal(ctx)) {
      const message = `(char: ${ctx.char}) (char_code: ${ctx.char.charCodeAt(
        0
      )}) at column ${ctx.cursor} is an IllegalCharacter`
      throw new Exception(ET.IllegalCharacter, message)
    }
  }
  return tokens
}

const advance = (ctx: Context) => {
  ctx.cursor += 1
  if (ctx.cursor < ctx.text.length) {
    ctx.char = ctx.text[ctx.cursor]
  } else {
    ctx.end = true
    ctx.char = ''
  }
}

const isIllegal = (ctx: Context) => {
  return (
    !isWhiteSpace(ctx.char) &&
    !isDigit(ctx.char) &&
    !isLetter(ctx.char) &&
    !isOperator(ctx.char) &&
    !ctx.end
  )
}

const matchNumber = (ctx: Context): Token => {
  let num = ''
  let dot = false

  while (isDigit(ctx.char) || (ctx.char === '.' && !dot)) {
    if (ctx.end) break

    if (ctx.char === '.') {
      dot = true
    }
    num += ctx.char
    advance(ctx)
  }

  if (num[num.length - 1] === '.') {
    throw new Exception(ET.InvalidSyntax, '')
  }

  return new Token(dot ? TT.FLOAT : TT.INT, num)
}

const matchWord = (ctx: Context) => {
  const keywords = ['let', 'not', 'and', 'or']
  let word = ''

  while (isLetter(ctx.char) || (isDigit(ctx.char) && !ctx.end)) {
    if (ctx.end) break

    word += ctx.char
    advance(ctx)
  }

  if (word === 'true' || word === 'false') {
    return new Token(TT.BOOL, word)
  }

  if (keywords.includes(word)) {
    return new Token(TT.KEYWORD, word)
  } else {
    return new Token(TT.IDENTIFIER, word)
  }
}

const matchString = (ctx: Context): Token => {
  let str = ''

  advance(ctx)
  while (ctx.char !== '\'') {
    if (ctx.end) {
      throw new Exception(ET.InvalidSyntax, 'Expected \'')
    }

    str += ctx.char
    advance(ctx)
  }

  return new Token(TT.STRING, str)
}

const isLetter = (char: string): boolean => {
  const lowerMin = 97 // char a
  const lowerMax = 122 // char z
  const upperMin = 65 // char A
  const upperMax = 90 // char Z
  const code = char.charCodeAt(0)

  const inLowerRange = code >= lowerMin && code <= lowerMax
  const inUpperRange = code >= upperMin && code <= upperMax
  return inLowerRange || inUpperRange
}

const isDigit = (char: string): boolean => {
  const min = 48 // char 0
  const max = 57 // char 9
  const code = char.charCodeAt(0)
  return code >= min && code <= max
}

const isOperator = (char: string): boolean => {
  const ops = '+-*/%()=<>!\''.split('')
  return ops.includes(char)
}

const isWhiteSpace = (char: string): boolean => {
  return char === ' ' || char === '\t'
}

const matchOperator = (ctx: Context): TT | null => {
  switch (ctx.char) {
    case '+': return TT.ADD
    case '-': return TT.SUB
    case '*': return TT.MUL
    case '/': return TT.DIV
    case '%': return TT.MOD
    case '(': return TT.LP
    case ')': return TT.RP
    case '=':
      advance(ctx)
      return <string>ctx.char === '=' ? TT.EQUALS : TT.EQ
    case '!':
      advance(ctx)
      if (<string>ctx.char === '=') {
        return TT.NOT_EQUALS
      }
      throw new Exception(ET.InvalidSyntax, 'Expected =')
    case '<':
      advance(ctx)
      return <string>ctx.char === '=' ? TT.LESS_OR_EQ : TT.LESS_THAN
    case '>':
      advance(ctx)
      return <string>ctx.char === '=' ? TT.GREATER_OR_EQ : TT.GRATER_THAN
    default:
      return null
  }
}

export default { tokenize }
