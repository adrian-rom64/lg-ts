import ET from './ET'

class Exception extends Error {
  type: ET
  details: string

  constructor(type: ET, details: string) {
    super(type.name)

    this.type = type
    this.details = details
  }

  public toString(): string {
    return `${this.type} => ${this.details}`
  }
}

export default Exception
