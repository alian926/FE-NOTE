// 通过对象实现
class Stack {
	constructor() {
		this.count = 0;
		this.items = {};
	}
	push(ele) {
		this.items[this.count++] = ele;
	}
	pop() {
		if (this.isEmpty()) {
			return;
		}
		this.count--;
		let res = this.items[this.count];
		delete this.items[this.count];
		return res;
	}
	peek() {
		if (this.isEmpty()) {
			return;
		}
		return this.items[this.count - 1];
	}
	isEmpty() {
		return this.count === 0;
	}
	clear() {
		this.count = 0;
		this.items = {};
	}
	size() {
		return this.count;
	}
	toString() {
		if (this.isEmpty()) {
			return '';
		}
		let objString = `${this.items[0]}`;
		for (let i = 1; i < this.count; i++) {
			objString = `${objString}, ${this.items[i]}`;
		}
		return objString;
	}
}

// 通过WeakMap实现
const items = new WeakMap();
class Stack2 {
	constructor() {
		items.set(this, []);
	}
	push(ele) {
		const s = items.get(this);
		s.push(ele);
	}
	pop() {
		const s = items.get(this);
		return s.pop();
	}
}

// 通过数组方式实现,  大部分操作的时间复杂度都是 O(n)
class Stack {
	constructor() {
		this.items = [];
	}
	// 入栈
	push(ele) {
		return this.items.push(ele);
	}
	// 出栈
	pop() {
		return this.items.pop();
	}
	// 返回栈顶元素, 不进行操作
	peek() {
		return this.items[this.items.length - 1];
	}
	// 是否栈空
	isEmpty() {
		return this.items.length === 0;
	}
	// 清除栈
	clear() {
		this.items = [];
	}
	// 栈大小
	size() {
		return this.items.length;
	}
}
