class Pointer {
  col: number
  line: number

  constructor(col: number, line?: number) {
    this.col = col
    this.line = line ?? 0
  }
}

export default Pointer
