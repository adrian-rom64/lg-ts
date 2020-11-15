import Exception from "./Exception"
import ET from './ET'

type Op = '+' | '-' | '*' | '/' | '%'
type Comparison = '<' | '>' | '<=' | '>='
type Type = 'int' | 'float' | 'bool' | 'null'

const notImplemented = (type1: Type, op: Op, type2: Type) => {
  return new Exception(ET.RuntimeError, `Not implemented => ${type1} ${op} ${type2}`)
}

interface IVariable {
  toString: () => string
  toBool: () => boolean
  operation: (operator: Op, operand: Variable) => Variable
  equals: (operand: Variable) => boolean
  compare: (operator: Comparison, operand: Variable) => boolean
}

export abstract class Variable implements IVariable {
  static count = 0
  id: number
  type: Type

  constructor (type: Type) {
    this.type = type
    this.id = Variable.count
    Variable.count += 1
  }

  public toString (): string {
    return `variable <${this.id}>`
  }

  public operation (operator: Op, operand: Variable): Variable {
    throw notImplemented(this.type, operator, operand.type)
  }

  public toBool (): boolean {
    return false
  }

  public equals (operand: Variable) {
    return false
  }

  public compare (operator: Comparison, operand: Variable): boolean {
    throw new Exception(ET.RuntimeError, 'Comparison not implemented')
  }
}

export class Integer extends Variable implements IVariable {
  val: number

  constructor (input: string | number) {
    super('int')
  
    if (typeof input === 'string') {
      this.val = parseInt(input)
    } else {
      this.val = Math.floor(input)
    }
  }

  public toString (): string {
    return this.val.toString()
  }

  public toBool (): boolean {
    return this.val !== 0
  }

  public equals (operand: Variable): boolean {
    if (!(operand instanceof Integer)) return false
    
    return this.val === operand.val
  }

  public compare (operator: Comparison, operand: Variable): boolean {
    if (!(operand instanceof Integer || operand instanceof Float)) return false

    switch (operator) {
      case '<':
        return this.val < operand.val
      case '<=':
        return this.val <= operand.val
      case '>':
        return this.val > operand.val
      case '>=':
        return this.val >= operand.val
      default: return false
    }
  }

  public operation (operator: Op, operand: Variable): Variable {
    if (operand instanceof Integer) {
      switch (operator) {
        case '+':
          return new Integer(this.val + operand.val)
        case '-':
          return new Integer(this.val - operand.val)
        case '*':
          return new Integer(this.val * operand.val)
        case '/':
          return new Integer(this.val / operand.val)
        case '%':
          return new Integer(this.val % operand.val)
      }
    }
    if (operand instanceof Float) {
      switch (operator) {
        case '+':
          return new Float(this.val + operand.val)
        case '-':
          return new Float(this.val - operand.val)
        case '*':
          return new Float(this.val * operand.val)
        case '/':
          return new Float(this.val / operand.val)
        case '%':
          return new Float(this.val % operand.val)
      }
    }
    throw notImplemented(this.type, operator, operand.type)
  }
}

export class Float extends Variable implements IVariable {
  val: number

  constructor (input: string | number) {
    super('float')

    if (typeof input === 'string') {
      this.val = parseFloat(input)
    } else {
      this.val = input
    }
  }

  public toString (): string {
    return this.val.toString()
  }

  public toBool (): boolean {
    return this.val !== 0
  }

  public equals (operand: Variable): boolean {
    if (!(operand instanceof Float)) return false
    
    return this.val === operand.val
  }

  public operation (operator: Op, operand: Variable): Variable {
    if (operand instanceof Integer) {
      switch (operator) {
        case '+':
          return new Float(this.val + operand.val)
        case '-':
          return new Float(this.val - operand.val)
        case '*':
          return new Float(this.val * operand.val)
        case '/':
          return new Float(this.val / operand.val)
        case '%':
          return new Float(this.val % operand.val)
      }
    }
    if (operand instanceof Float) {
      switch (operator) {
        case '+':
          return new Float(this.val + operand.val)
        case '-':
          return new Float(this.val - operand.val)
        case '*':
          return new Float(this.val * operand.val)
        case '/':
          return new Float(this.val / operand.val)
        case '%':
          return new Float(this.val % operand.val)
      }
    }
    throw notImplemented(this.type, operator, operand.type)
  }
}

export class Bool extends Variable implements IVariable {
  val: boolean

  constructor (input: boolean) {
    super('bool')

    this.val = input
  }

  public toBool(): boolean {
    return this.val
  }

  public equals (operand: Variable): boolean {
    if (!(operand instanceof Bool)) return false
    
    return this.val === operand.val
  }

  public toString (): string {
    return this.val.toString()
  }
}

export class Null extends Variable implements IVariable {
  constructor () {
    super('null')
  }

  public toString (): string {
    return 'null'
  }

  public toBool(): boolean {
    return false
  }

  public equals (operand: Variable): boolean {
    return operand instanceof Null
  }
}
