import TT from './TT'

class Token {
  type: TT
  value: string | null

  constructor(type: TT, value?: string | null) {
    this.type = type
    this.value = value ?? null
  }

  public toString(): string {
    if (!this.value) {
      return this.type.name
    }
    return `${this.type}:${this.value}`
  }

  public eq(type: TT, value?: string): boolean {
    return this.type === type && this.value === (value ?? null)
  }
}

export default Token
