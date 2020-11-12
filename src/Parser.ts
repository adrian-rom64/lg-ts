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
  return resolveBinaryOpNode(ctx, factor, [TT.MUL, TT.DIV])
}

const expression = (ctx: Context): Nodes.Node => {
  const declarationNodes = resolveDeclarationNodes(ctx)
  if (declarationNodes) return declarationNodes

  return resolveBinaryOpNode(ctx, term, [TT.ADD, TT.SUB])
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
  ops: TT[]
) => {
  let left = func(ctx)

  while (ops.includes(ctx.token.type)) {
    const op = ctx.token
    advance(ctx)
    const right = func(ctx)
    left = new Nodes.BinaryOpNode(left, op, right)
  }
  return left
}

export default { parse }
