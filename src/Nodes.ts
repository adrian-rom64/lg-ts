import ET from './ET'
import Exception from './Exception'
import Token from './Token'
import TT from './TT'
import Heap from './Heap'
import * as Variables from './Variables'

export interface Node {
  toString(): string
  visit(): Variables.Variable
}

export class BinaryOpNode implements Node {
  left: Node
  op: Token
  right: Node

  constructor(left: Node, op: Token, right: Node) {
    this.left = left
    this.op = op
    this.right = right
  }

  public toString(): string {
    return `(${this.left}, ${this.op}, ${this.right})`
  }

  public visit(): Variables.Variable {
    const left = this.left.visit()
    const right = this.right.visit()
    const op = this.op.type

    switch (op) {
      case TT.ADD:
        return left.operation('+', right)
      case TT.SUB:
        return left.operation('-', right)
      case TT.MUL:
        return left.operation('*', right)
      case TT.DIV:
        return left.operation('/', right)
      case TT.DIV:
        return left.operation('%', right)
    }

    if (this.op.eq(TT.EQUALS)) {
      return new Variables.Bool(left.equals(right))
    }
    if (this.op.eq(TT.NOT_EQUALS)) {
      return new Variables.Bool(!left.equals(right))
    }


    if (this.op.eq(TT.LESS_THAN)) {
      return new Variables.Bool(left.compare('<', right))
    }
    if (this.op.eq(TT.LESS_OR_EQ)) {
      return new Variables.Bool(left.compare('<=', right))
    }
    if (this.op.eq(TT.GRATER_THAN)) {
      return new Variables.Bool(left.compare('>', right))
    }
    if (this.op.eq(TT.GREATER_OR_EQ)) {
      return new Variables.Bool(left.compare('>=', right))
    }


    if (this.op.eq(TT.KEYWORD, 'and')) {
      return new Variables.Bool(left.toBool() && right.toBool())
    }
    if (this.op.eq(TT.KEYWORD, 'or')) {
      return new Variables.Bool(left.toBool() || right.toBool())
    }

    throw new Exception(ET.RuntimeError, 'eeee')
  }
}

export class AssigmentNode implements Node {
  identifier: Token
  expr: Node

  constructor(identifier: Token, expr: Node) {
    this.identifier = identifier
    this.expr = expr
  }

  public toString(): string {
    return `(${this.identifier.value} = ${this.expr})`
  }

  public visit(): Variables.Variable {
    const expr = this.expr.visit()
    const assigment = Heap.assign(this.identifier.value as string, expr)
    if (!assigment) {
      throw new Exception(ET.RuntimeError, 'Variable undefined')
    }
    return expr
  }
}

export class DeclarationNode implements Node {
  identifier: Token

  constructor(identifier: Token) {
    this.identifier = identifier
  }

  public toString(): string {
    return `(let ${this.identifier.value})`
  }

  public visit(): Variables.Variable {
    const inititalValue = new Variables.Null
    const declaration = Heap.declare(this.identifier.value as string)
    if (!declaration) {
      throw new Exception(ET.RuntimeError, 'Variable redeclared')
    }
    Heap.assign(this.identifier.value as string, inititalValue)
    return inititalValue
  }
}

export class DeclarationAndAssigmentNode implements Node {
  identifier: Token
  expr: Node

  constructor(identifier: Token, expr: Node) {
    this.identifier = identifier
    this.expr = expr
  }

  public toString(): string {
    return `(let ${this.identifier.value} = ${this.expr})`
  }

  public visit(): Variables.Variable {
    const declaration = Heap.declare(this.identifier.value as string)
    if (!declaration) {
      throw new Exception(ET.RuntimeError, 'Varaible redeclared')
    }
    const expr = this.expr.visit()
    Heap.assign(this.identifier.value as string, expr)
    return expr
  }
}

export class AccessNode implements Node {
  identifier: Token

  constructor(identifier: Token) {
    this.identifier = identifier
  }

  public toString(): string {
    return this.identifier.value as string
  }

  public visit(): Variables.Variable {
    const result = Heap.access(this.identifier.value as string)
    if (result === null) {
      throw new Exception(ET.RuntimeError, 'Variable undefined')
    }
    return result
  }
}

export class UnaryOpNode implements Node {
  op: Token
  right: Node

  constructor(op: Token, right: Node) {
    this.op = op
    this.right = right
  }

  public toString(): string {
    return `(${this.op}, ${this.right})`
  }

  public visit(): Variables.Variable {
    if (this.op.eq(TT.KEYWORD, 'not')) {
      return new Variables.Bool(!this.right.visit().toBool())
    }
    if (this.op.type === TT.SUB) {
      return this.right.visit().operation('-', new Variables.Integer(-1))
    }
    return this.right.visit()
  }
}

export class NumberNode implements Node {
  num: Token

  constructor(num: Token) {
    this.num = num
  }

  public toString(): string {
    return this.num.value as string
  }

  public visit(): Variables.Variable {
    if (this.num.type === TT.INT) {
      return new Variables.Integer(this.num.value as string)
    } else {
      return new Variables.Float(this.num.value as string)
    }
  }
}
