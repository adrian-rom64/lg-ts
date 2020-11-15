import { Variable, Null } from './Variables'

class Heap {
  private data: { [key: string]: Variable }

  constructor() {
    this.data = { env: new Null }
  }

  public access(identifier: string): Variable | null {
    if (identifier in this.data) {
      return this.data[identifier]
    }
    return null
  }

  public assign(identifier: string, value: Variable): boolean {
    if (identifier in this.data) {
      this.data[identifier] = value
      return true
    }
    return false
  }

  public declare(identifier: string): boolean {
    if (!(identifier in this.data)) {
      this.data[identifier] = new Null
      return true
    }
    return false
  }
}

export default new Heap()
