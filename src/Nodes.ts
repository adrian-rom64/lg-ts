import ET from './ET'
import Exception from './Exception'
import Token from './Token'
import TT from './TT'
import Heap from './Heap'

export interface Node {
  toString(): string
  visit(): number
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

  public visit(): number {
    const left = this.left.visit()
    const right = this.right.visit()
    const op = this.op.type

    switch (op) {
      case TT.ADD:
        return left + right
      case TT.SUB:
        return left - right
      case TT.MUL:
        return left * right
      case TT.DIV:
        return left / right
      case TT.DIV:
        return left % right
    }

    throw new Exception(ET.RuntimeError, '')
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

  public visit(): number {
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

  public visit(): number {
    const inititalValue = 0
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

  public visit(): number {
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

  public visit(): number {
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

  public visit(): number {
    if (this.op.type === TT.SUB) {
      return this.right.visit() * -1
    } else {
      return this.right.visit()
    }
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

  public visit(): number {
    if (this.num.type === TT.INT) {
      return parseInt(this.num.value as string)
    } else {
      return parseFloat(this.num.value as string)
    }
  }
}
