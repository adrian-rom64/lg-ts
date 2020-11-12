class Heap {
  private data: { [key: string]: number }

  constructor() {
    this.data = { env: 0 }
  }

  public access(identifier: string): number | null {
    if (identifier in this.data) {
      return this.data[identifier]
    }
    return null
  }

  public assign(identifier: string, value: number): boolean {
    if (identifier in this.data) {
      this.data[identifier] = value
      return true
    }
    return false
  }

  public declare(identifier: string): boolean {
    if (!(identifier in this.data)) {
      this.data[identifier] = 0
      return true
    }
    return false
  }
}

export default new Heap()
