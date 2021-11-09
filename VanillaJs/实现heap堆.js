// 最小堆
const COMPARE = {
	LESS_THAN: -1,
	MORE_THAN: 1,
	EQUAL: 0,
};

function defaultCompare(a, b) {
	if (a === b) {
		return COMPARE.EQUAL;
	}
	return a < b ? COMPARE.LESS_THAN : COMPARE.MORE_THAN;
}

function swap(arr, a, b) {
	const tmp = arr[a];
	arr[a] = arr[b];
	arr[b] = tmp;
}

class MinHeap {
	constructor(compareFn = defaultCompare) {
		this.compareFn = compareFn;
		// 使用数组的存储结构, 可以使用如下规则
		// 左侧 子节点位置 2*index+1
		// 右侧 子节点位置 2*index+2
		// 父节点位置 index = 1 >> 1 等效于 Math.floor((index+1) / 2)
		this.heap = [];
	}
	getLeftIndex(index) {
		return 2 * index + 1;
	}
	getRightIndex(index) {
		return 2 * index + 2;
	}
	getParentIndex(index) {
		if (index === 0) {
			return;
		}
		return (index - 1) >> 1;
	}
	size() {
		return this.heap.length;
	}
	findMinimum() {
		return this.isEmpty() ? undefined : this.heap[0];
	}
	isEmpty() {
		return this.size() === 0;
	}
	insert(value) {
		if (value != null) {
			this.heap.push(value);
			this.siftUp(this.size() - 1);
			return true;
		}
		return false;
	}
	siftUp(index) {
		let parent = this.getParentIndex(index);
		while (
			index > 0 &&
			this.compareFn(this.heap[parent], this.heap[index]) === COMPARE.MORE_THAN
		) {
			swap(this.heap, parent, index);
			index = parent;
			parent = this.getParentIndex(index);
		}
	}
	// 提取最小值
	extract() {
		if (this.isEmpty()) {
			return;
		}
		// if(this.size() === 1) {
		//   return this.heap.pop();
		// }
		swap(this.heap, 0, this.size() - 1);
		const extractedValue = this.heap.pop();
		this.siftDown(0);
		return extractedValue;
	}
	siftDown(index) {
		let element = index;
		const left = this.getLeftIndex(index);
		const right = this.getRightIndex(index);
		const size = this.size();
		if (
			left < size &&
			this.compareFn(this.heap[element], this.heap[left]) === COMPARE.MORE_THAN
		) {
			element = left;
		}
		if (
			right < size &&
			this.compareFn(this.heap[element], this.heap[right]) === COMPARE.MORE_THAN
		) {
			element = right;
		}
		if (element !== index) {
			swap(this.heap, index, element);
			this.siftDown(element);
		}
	}
}

// 最大堆
function reverseCompare(compareFn) {
	return (a, b) => compareFn(b, a);
}

class MaxHeap extends MinHeap {
	constructor(compareFn = reverseCompare(defaultCompare)) {
		super(compareFn);
		this.compareFn = compareFn;
	}
}

let heap = new MinHeap();
for (let i = 9; i > 0; i--) {
	heap.insert(i);
}
console.log(heap);
console.log('Extract minimum: ', heap.extract());
heap.insert(3);
heap.insert(1);
console.log('Extract minimum: ', heap.extract());