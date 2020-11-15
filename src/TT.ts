class TT {
  static readonly ADD = new TT('ADD')
  static readonly SUB = new TT('SUB')
  static readonly MUL = new TT('MUL')
  static readonly DIV = new TT('DIV')
  static readonly MOD = new TT('MOD')

  static readonly INT = new TT('INT')
  static readonly FLOAT = new TT('FLOAT')
  static readonly STRING = new TT('STRING')
  static readonly BOOL = new TT('BOOL')

  static readonly LP = new TT('LP')
  static readonly RP = new TT('RP')
  static readonly EQ = new TT('EQ')

  static readonly IDENTIFIER = new TT('IDENTIFIER')
  static readonly KEYWORD = new TT('KEYWORD')
  static readonly NIL = new TT('NIL')

  static readonly AND = new TT('AND')
  static readonly OR = new TT('OR')
  static readonly NOT = new TT('NOT')
  static readonly EQUALS = new TT('EQUALS')
  static readonly NOT_EQUALS = new TT('NOT_EQUALS')
  static readonly LESS_THAN = new TT('LESS_THAN')
  static readonly GRATER_THAN = new TT('GRATER_THAN')
  static readonly LESS_OR_EQ = new TT('LESS_OR_EQ')
  static readonly GREATER_OR_EQ = new TT('GREATER_OR_EQ')


  name: string

  constructor(name: string) {
    this.name = name
  }

  public toString(): string {
    return this.name
  }
}

export default TT
