import Token from './Token'
import * as Nodes from './Nodes'
import TT from './TT'
import ET from './ET'
import Exception from './Exception'

interface Context {
  tokens: Token[]
  index: number
  token: Token
  end: boolean
}

const initialContext = (tokens: Token[]) => {
  return {
    tokens,
    index: -1,
    token: tokens[0]
  } as Context
}

const parse = (tokens: Token[]): Nodes.Node => {
  if (tokens.length === 0) {
    throw new Exception(ET.RuntimeError, 'Empty expression')
  }

  const ctx = initialContext(tokens)
  advance(ctx)

  return expression(ctx)
}

const advance = (ctx: Context) => {
  ctx.index += 1
  if (ctx.index < ctx.tokens.length) {
    ctx.token = ctx.tokens[ctx.index]
  } else {
    ctx.token = new Token(TT.NIL)
  }
}

const factor = (ctx: Context): Nodes.Node => {
  const unaryOpNode = resolveUnaryOpNode(ctx)
  if (unaryOpNode) return unaryOpNode

  const numberNode = resolveNumberNode(ctx)
  if (numberNode) return numberNode

  const accessAssigmentNodes = resolveAccessAssigmentNodes(ctx)
  if (accessAssigmentNodes) return accessAssigmentNodes

  const parenthesis = resolveParenthesis(ctx)
  if (parenthesis) return parenthesis

  throw new Exception(ET.InvalidSyntax, 'Expected factor')
}

const term = (ctx: Context): Nodes.Node => {
  const ops = [new Token(TT.MUL), new Token(TT.DIV)]
  return resolveBinaryOpNode(ctx, factor, ops)
}

const expression = (ctx: Context): Nodes.Node => {
  const declarationNodes = resolveDeclarationNodes(ctx)
  if (declarationNodes) return declarationNodes

  const ops = [new Token(TT.KEYWORD, 'and'), new Token(TT.KEYWORD, 'or')]
  return resolveBinaryOpNode(ctx, comparisonExpression, ops)
}

const comparisonExpression = (ctx: Context): Nodes.Node => {
  if (ctx.token.eq(TT.KEYWORD, 'not')) {
    const token = ctx.token
    advance(ctx)
    const node = comparisonExpression(ctx)
    return new Nodes.UnaryOpNode(token, node)
  }
  const ops = [
    new Token(TT.EQUALS),
    new Token(TT.NOT_EQUALS),
    new Token(TT.LESS_THAN),
    new Token(TT.LESS_OR_EQ),
    new Token(TT.GRATER_THAN),
    new Token(TT.GREATER_OR_EQ)
  ]
  return resolveBinaryOpNode(ctx, arithmeticExpression, ops)
}

const arithmeticExpression = (ctx: Context): Nodes.Node => {
  const ops = [new Token(TT.ADD), new Token(TT.SUB)]
  return resolveBinaryOpNode(ctx, term, ops)
}

const resolveParenthesis = (ctx: Context): Nodes.Node | null => {
  if (ctx.token.type !== TT.LP) return null

  advance(ctx)
  const nested = expression(ctx)
  if (ctx.token.type === TT.RP) {
    advance(ctx)
    return nested
  } else {
    throw new Exception(ET.InvalidSyntax, 'Expected ) separator')
  }
}

const resolveNumberNode = (ctx: Context): Nodes.NumberNode | null => {
  if (ctx.token.type !== TT.INT && ctx.token.type !== TT.FLOAT) return null

  const token = ctx.token
  advance(ctx)
  return new Nodes.NumberNode(token)
}

const resolveUnaryOpNode = (ctx: Context): Nodes.UnaryOpNode | null => {
  if (ctx.token.type !== TT.ADD && ctx.token.type !== TT.SUB) return null

  const token = ctx.token
  advance(ctx)
  const nested = factor(ctx)
  return new Nodes.UnaryOpNode(token, nested)
}

const resolveDeclarationNodes = (ctx: Context): Nodes.Node | null => {
  if (!ctx.token.eq(TT.KEYWORD, 'let')) return null

  advance(ctx)
  if (ctx.token.type === TT.IDENTIFIER) {
    const identifier = ctx.token
    advance(ctx)
    if (ctx.token.eq(TT.EQ)) {
      advance(ctx)
      const value = expression(ctx)
      return new Nodes.DeclarationAndAssigmentNode(identifier, value)
    } else {
      return new Nodes.DeclarationNode(identifier)
    }
  } else {
    throw new Exception(ET.InvalidSyntax, 'Expected identifier')
  }
}

const resolveAccessAssigmentNodes = (ctx: Context): Nodes.Node | null => {
  if (ctx.token.type !== TT.IDENTIFIER) return null

  const identifier = ctx.token
  advance(ctx)
  if (ctx.token.eq(TT.EQ)) {
    advance(ctx)
    const value = expression(ctx)
    return new Nodes.AssigmentNode(identifier, value)
  } else {
    return new Nodes.AccessNode(identifier)
  }
}

const resolveBinaryOpNode = (
  ctx: Context,
  func: (ctx: Context) => Nodes.Node,
  ops: Token[]
) => {
  let left = func(ctx)

  while (ops.find(token => token.eq(ctx.token.type, ctx.token.value))) {
    const op = ctx.token
    advance(ctx)
    const right = func(ctx)
    left = new Nodes.BinaryOpNode(left, op, right)
  }
  return left
}

export default { parse }
