
// 链表
class Node {
  constructor(ele, next=null) {
      this.element = ele
      this.next = next
  }
}
function defaultEquals(a, b) {
  return a === b
}
class LinkedList {
  constructor(equalsFn = defaultEquals) {
      this.count = 0
      this.head = null
      this.equalsFn = equalsFn
  }
  // 向链表尾部添加新元素
  push(ele) {
      const node = new Node(ele)
      let current
      if(this.head == null) {
          this.head = node
      }else {
          current = this.head
          while(current.next != null) {
              current = current.next
          }
          current.next = node
      }
      this.count++
  }
  // 向特定位置插入新元素
  insert(ele, pos) {
      if(pos >=0 && pos<=this.count) {
          const node = new Node(ele)
          if(pos === 0) {
              const current = this.head
              node.next = current
              this.head = node
          }else {
              const previous = this.getElementAt(pos - 1)
              const current = previous.next
              node.next = current
              previous.next = node
          }
          this.count++
          return true
      }
      return false
  }
  // 返回特定位置的元素
  getElementAt(pos) {
      if(pos >=0 && pos <= this.count) {
          let node = this.head
          for(let i=0; i<pos && node!=null; i++) {
              node = node.next
          }
          return node
      }
  }
  // 从链表移除一个元素
  remove(ele) {
      const index= this.indexOf(ele)
      return this.removeAt(index)
  }
  // 返回元素在链表总中的索引,没有则返回-1
  indexOf(ele) {
      let current = this.head
      for(let i=0; i<this.count && current!=null; i++) {
          if(this.equalsFn(ele, current.element)) {
              return i
          }
          current = current.next
      }
      return -1
  }
  // 从链表特定位置移除一个元素
  removeAt(pos) {
      if(pos >= 0 && pos < this.count) {
          let current = this.head
          if(pos === 0) {
              this.head = current.next
          }else {
              const previous = this.getElementAt(pos - 1)
              current = previous.next
              previous.next = current.next
          }
          this.count--
          return current.element
      }
  }
  // 是否空
  isEmpty() {
      this.size() === 0
  }
  // 链表元素个数
  size() {
      return this.count
  }
  // 获取头部
  getHead() {
      return this.head
  }
}

// 双向链表
class DoublyNode extends Node {
  constructor(ele, next, prev) {
      super(ele, next)
      // 前向指针
      this.prev = prev
  }
}

class DoublyLinkedList extends LinkedList {
  constructor(equalsFn = defaultEquals) {
      super(equalsFn) 
      // 尾部节点
      this.tail = null
  }
  insert(ele, pos) {
      if(pos >=0 && pos <= this.count) {
          const node = new DoublyNode(element) 
          let current = this.head
          if(pos === 0) {
          // 头部
              if(this.head == null) {
                  this.head = node
                  this.tail = node
              }else {
                  node.next = this.head
                  current.prev = node
                  this.head = node
              }
          }else if(pos === this.count) {
          // 尾部, 在tail的后面
              current = this.tail
              current.next = node
              node.prev = current
              this.tail = node
          }else {
          // 中间部分进行前插
              const previous = this.getElementAt(pos - 1)
              current = previous.next
              node.next = current
              previous.next = node
              current.prev = node
              node.prev = previous
          }
          this.count++
          return true
      }
  }
  removeAt(pos) {
      if(pos >=0 && pos < this.count) {
          let current = this.head
          if(pos === 0) {
          // 头部
              this.head = current.next
              // 如果原来只有一项,更新tail
              if(this.count === 1) {
                  this.tail = null
              }else {
                  this.head.prev = null
              }
          }else if(pos == this.count - 1) {
          // 尾部
              current = this.tail
              this.tail = current.prev
              this.tail.next = null
          }else {
              current = this.getElementAt(pos)
              const previous = current.prev
              previous.next = current.next
              current.next.prev = previous
          }
          this.count--
          return current.element
      }
  }
}

// 循环链表
class CircularLinkedList extends LinkedList {
  constructor(equalsFn = defaultEquals) {
      super(equalsFn)
  }
  insert(ele, pos) {
      if(pos>=0 && pos <= this.count) {
          const node = new Node(ele)
          let current = this.head
          if(pos === 0) {
              if(this.head == null) {
                  this.head = node
                  node.next = this.head
              }else {
                  node.next = current
                  current = this.getElementAt(this.size() - 1)
                  this.head = node
                  current.next = this.head
              }
          } else {
              const previous = this.getElementAt(pos - 1)
              node.next = previous.next
              previous.next = node
          }
          this.count++
          return true
      }
      return false
  }
  removeAt(pos) {
      if(pos >=0 && pos < this.count) {
          let current = this.head
          if(pos == 0) {
              if(this.size() == 1) {
                  this.head = null
              }else {
                  const removed = this.head
                  current = this.getElementAt(this.size() - 1)
                  this.head = this.head.next
                  current.next = this.head
                  current = removed
              }
          } else {
              // 不需要修改最后一个元素
              const previous = this.getElementAt(pos - 1)
              current = previous.next
              previous.next = current.next
          }
          this.count--
          return current.element
      }
  }
}

// 有序链表
const Compare = {
  LESS_THAN: -1,
  BIGGER_THAN: 1
}
function defaultCompare(a ,b) {
  if(a === b) {
      return 0
  }
  return a < b ?Compare.LESS_THAN : Compare.BIGGER_THAN
}
class SortedLinkedList extends LinkedList {
  constructor(equalsFn = defaultEquals, compareFn = defaultCompare) {
      super(equalsFn)
      this.compareFn = compareFn
  }
  insert(ele, pos=0) {
      if(this.isEmpty()) {
          return super.insert(ele, 0)
      }
      const pos = this.getIndexNextSortedElement(ele)
      return super.insert(ele, pos)
  }
  getIndexNextSortedElement(ele) {
      let current = this.head
      let i = 0
      for(; i<this.size() && current; i++) {
          const comp = this.compareFn(ele, current.element)
          if(comp == Compare.LESS_THAN) {
              return i
          }
          current = current.next
      }
      return i
  }
}

