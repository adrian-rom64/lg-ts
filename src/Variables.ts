import Exception from "./Exception"
import ET from './ET'

type Op = '+' | '-' | '*' | '/' | '%'
type Comparison = '<' | '>' | '<=' | '>='
type Type = 'int' | 'float' | 'bool' | 'null'

const notImplemented = (type1: Type, op: Op, type2: Type) => {
  return new Exception(ET.RuntimeError, `Not implemented => ${type1} ${op} ${type2}`)
}

const operation = (var1: Integer | Float, var2: Integer | Float, operator: Op, type: 'int' | 'float') => {
  let result = 0
  switch (operator) {
    case '+':
      result = var1.val + var2.val
      break
    case '-':
      result = var1.val - var2.val
      break
    case '*':
      result = var1.val * var2.val
      break
    case '/':
      result = var1.val / var2.val
      break
    case '%':
      result = var1.val % var2.val
      break
  }
  if (type === 'int') {
    return new Integer(result)
  }
  return new Float(result)
}

const compare = (var1: Integer | Float, var2: Integer | Float, operator: Comparison) => {
  switch (operator) {
    case '<':
      return var1.val < var2.val
    case '<=':
      return var1.val <= var2.val
    case '>':
      return var1.val > var2.val
    case '>=':
      return var1.val >= var2.val
    default: return false
  }
}

export abstract class Variable {
  static count = 0
  id: number
  type: Type

  constructor (type: Type) {
    this.type = type
    this.id = Variable.count
    Variable.count += 1
  }

  public toString (): string {
    throw new Exception(ET.RuntimeError, `toString not implemented on ${this.constructor.name}`)
  }

  public operation (operator: Op, operand: Variable): Variable {
    throw new Exception(ET.RuntimeError, `operation not implemented on ${this.constructor.name}`)
  }

  public toBool (): boolean {
    throw new Exception(ET.RuntimeError, `toBool not implemented on ${this.constructor.name}`)
  }

  public equals (operand: Variable): boolean {
    throw new Exception(ET.RuntimeError, `equals not implemented on ${this.constructor.name}`)
  }

  public compare (operator: Comparison, operand: Variable): boolean {
    throw new Exception(ET.RuntimeError, `compare not implemented on ${this.constructor.name}`)
  }
}

export class Integer extends Variable {
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

    return compare(this, operand, operator)
  }

  public operation (operator: Op, operand: Variable): Variable {
    if (operand instanceof Integer) {
      return operation(this, operand, operator, 'int')
    }
    if (operand instanceof Float) {
      return operation(this, operand, operator, 'float')
    }
    throw notImplemented(this.type, operator, operand.type)
  }
}

export class Float extends Variable {
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
      return operation(this, operand, operator, 'float')
    }
    if (operand instanceof Float) {
      return operation(this, operand, operator, 'float')
    }
    throw notImplemented(this.type, operator, operand.type)
  }

  public compare (operator: Comparison, operand: Variable): boolean {
    if (!(operand instanceof Integer || operand instanceof Float)) return false

    return compare(this, operand, operator)
  }
}

export class Bool extends Variable {
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

export class Null extends Variable {
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
