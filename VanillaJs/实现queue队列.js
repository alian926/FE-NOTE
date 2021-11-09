
// 通过数组实现队列
class Queue{
  constructor(){
      // 总数量
      this.count = 0
      // 队首位置
      this.lowestCount = 0
      this.items = {}
  }
  enqueue(ele) {
      this.items[this.count++] = ele
  }
  dequeue() {
      if(this.isEmpty()) {
          return
      }
      const result = this.item[this.lowestCount]
      delete this.item[this.lowestCount]
      this.lowestCount++
      return result
  }
  peek() {
      if(this.isEmpty()) {
          return
      }
      return this.items[this.lowestCount]
  }
  clear() {
      this.count = 0
      this.lowestCount = 0
      this.items = {}
  }
  isEmpty() {
      return this.size() === 0
  }
  size() {
      return this.count - this.lowestCount
  }
}



// 双端队列
class Deque {
  constructor() {
      this.count = 0
      this.lowestCount = 0
      this.items = []
  }
  addFront(ele) {
      if(this.isEmpty()) {
          this.addBack(ele)
      }else if(this.lowestCount > 0) {
          this.items[this.lowestCount] = ele
          this.lowestCount--
      }else {
          for(let i=this.count; i>0; i--) {
              this.items[i] = this.items[i-1]
          }
          this.count++
          this.lowestCount = 0;
          this.items[0] = ele
      }
  }
  addBack(ele) {
      this.items[this.count++] = ele
  }
  removeFront() {
      if(this.isEmpty()) {
          return
      }
      let result = this.items[this.lowestCount]
      delete this.items[this.lowestCount]
      this.lowestCount++
      return result
  }
  removeBack() {
      if(this.isEmpty()) {
          return
      }
      let result = this.items[this.count - 1]
      delete this.items[this.count]
      this.count--
      return result
  }
  peekFront() {
      if(this.isEmpty()) {
          return
      }
      return this.items[this.lowestCount]
  }
  peekBack() {
      if(this.isEmpty()) {
          return
      }
      return this.items[this.count - 1]
  }
  isEmpty() {
      return this.size() === 0
  }
  size() {
      return this.count - this.lowestCount
  }
}

