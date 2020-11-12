import Pointer from './Pointer'

class Range {
  start: Pointer
  end: Pointer

  constructor(start: Pointer, end: Pointer) {
    this.start = start
    this.end = end
  }
}

export default Range
