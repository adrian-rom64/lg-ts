class ET {
  static readonly IllegalCharacter = new ET('IllegalCharacter')
  static readonly InvalidSyntax = new ET('InvalidSyntax')
  static readonly DivisionByZero = new ET('DivisionByZero')
  static readonly UnexpectedToken = new ET('UnexpectedToken')
  static readonly RuntimeError = new ET('RuntimeError')

  name: string

  constructor(name: string) {
    this.name = name
  }

  public toString(): string {
    return this.name
  }
}

export default ET
