const Compare = {
	LESS_THAN: -1,
	BIGGER_THAN: 1,
	EQUAL: 0,
};

function defaultCompare(a, b) {
	if (a === b) {
		return Compare.EQUAL;
	}
	return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
}

const swap = (array, a, b) => {
	[array[a], array[b]] = [array[b], array[a]];
};

function testSort(cb) {
	// let arr = [3, 2, 1, 5, 6, 8, 4, 7, 9]
	let arr = [3, 2, 1, 5, 6, 8];
	console.log(cb.valueOf(), cb(arr));
}

// 冒泡排序,   相邻值进行比较,符合条件进行交换
function bubbleSort(array, compareFn = defaultCompare) {
	const { length } = array;
	// 外层循环,循环次数
	for (let i = 0; i < length - 1; i++) {
		// 内层循环, 获取比较对象的下标
		for (let j = 0; j < length - 1 - i; j++) {
			if (compareFn(array[j], array[j + 1]) === Compare.BIGGER_THAN) {
				swap(array, j, j + 1);
			}
		}
	}
	return array;
}

testSort(bubbleSort);

// 选择排序,  每轮找到最小值的下标, 在每轮结尾进行值交换
function selectionSort(array, compareFn = defaultCompare) {
	const { length } = array;
	let indexMin;
	// 每轮寻找最小下标的起点下标
	for (let i = 0; i < length - 1; i++) {
		indexMin = i;
		// 找到 起点下标到终点下标过程中的最小值下标
		for (let j = i; j < length; j++) {
			if (compareFn(array[indexMin], array[j]) === Compare.BIGGER_THAN) {
				indexMin = j;
			}
		}
		// 交换最小值下标和此轮起点下标
		if (i !== indexMin) {
			swap(array, i, indexMin);
		}
	}
	return array;
}

testSort(selectionSort);

// 插入排序, 滑动数组,将当前值和前面的值比较,如果比前面的小则逐个移动,最终将当前值插入到特定位置
function insertionSort(array, compareFn = defaultCompare) {
	let { length } = array;
	let temp;
	for (let i = 1; i < length; i++) {
		// 存储当前位置的 信息
		let j = i;
		temp = array[i];
		// 如果当前值小于前面的值, 需要逐个交换位置
		while (j > 0 && compareFn(array[j - 1], temp) === Compare.BIGGER_THAN) {
			array[j] = array[j - 1];
			j--;
		}
		// 找到目标位置并保持当前值
		if (j !== i) {
			array[j] = temp;
		}
	}
	return array;
}

testSort(insertionSort);

// 归并排序, 将大数组分成小数组再合成 (firefox的sort采用此算法的改版)
function mergeSort(array, compareFn = defaultCompare) {
	const { length } = array;
	if (length > 1) {
		// 从中间将数组递归拆分
		const middle = Math.floor(length / 2);
		const left = mergeSort(array.slice(0, middle), compareFn);
		const right = mergeSort(array.slice(middle), compareFn);
		// 合并
		array = merge(left, right, compareFn);
	}
	return array;
}
function merge(left, right, compareFn) {
	// i管理left, j管理right
	let i = 0;
	let j = 0;
	const result = [];
	// 从左右两个数组中逐个比较,放入结果中
	while (i < left.length && j < right.length) {
		result.push(
			compareFn(left[i], right[j]) === Compare.LESS_THAN
				? left[i++]
				: right[j++]
		);
	}
	// 比较后可能还会有剩余的数据,进行拼接
	return result.concat(i < left.length ? left.slice(i) : right.slice(j));
}

testSort(mergeSort);

// 快速排序, 根据参考值(主元) 将数组划分大小成两个部分
function quickSort(array, compareFn = defaultCompare) {
	return quick(array, 0, array.length - 1, compareFn);
}

function quick(array, left, right, compareFn) {
	let index;
	if (array.length > 1) {
		// 划分数组,在partition内进行交换,并得到一个划分下标
		index = partition(array, left, right, compareFn);
		if (left < index - 1) {
			quick(array, left, index - 1, compareFn);
		}
		if (index < right) {
			quick(array, index, right, compareFn);
		}
	}
	return array;
}

function partition(array, left, right, compareFn) {
	// 如果选取第一个值的话, 对于有序数组, 表现是最差的
	// 选取中值
	const pivot = array[Math.floor((right + left) / 2)];
	let i = left;
	let j = right;
	while (i <= j) {
		while (compareFn(array[i], pivot) === Compare.LESS_THAN) {
			i++;
		}
		while (compareFn(array[j], pivot) === Compare.BIGGER_THAN) {
			j--;
		}
		if (i <= j) {
			swap(array, i, j);
			i++;
			j--;
		}
	}
	return i;
}

testSort(quickSort);

// 计数排序, 需要使用桶结构, 占用更多内存
function countingSort(array) {
	if (array.length < 2) {
		return array;
	}
	const maxValue = findMaxValue(array);
	const counts = new Array(maxValue + 1);
	array.forEach((element) => {
		if (!counts[element]) {
			counts[element] = 0;
		}
		counts[element]++;
	});
	let sortedIndex = 0;
	counts.forEach((count, i) => {
		while (count > 0) {
			array[sortedIndex++] = i;
			count--;
		}
	});
	return array;
}

const findMaxValue = (array) => Math.max(...array);
const findMinValue = (array) => Math.min(...array);

testSort(countingSort);

// 桶排序 将数组拆小,使用其他排序再组合
function bucketSort(array, bucketSize = 5) {
	if (array.length < 2) {
		return array;
	}
	const buckets = createBuckets(array, bucketSize);
	return sortBuckets(buckets);
}

// 获取桶的元素分布, 是一个二维数组
function createBuckets(array, bucketSize) {
	let minValue = array[0];
	let maxValue = array[0];
	for (let i = 1; i < array.length; i++) {
		if (array[i] < minValue) {
			minValue = array[i];
		} else if (array[i] > maxValue) {
			maxValue = array[i];
		}
	}
	const bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;
	const buckets = [];
	for (let i = 0; i < bucketCount; i++) {
		buckets[i] = [];
	}
	for (let i = 0; i < array.length; i++) {
		const bucketIndex = Math.floor((array[i] - minValue) / bucketSize);
		buckets[bucketIndex].push(array[i]);
	}
	return buckets;
}

function sortBuckets(buckets) {
	const sortedArray = [];
	for (let i = 0; i < buckets.length; i++) {
		if (buckets[i] !== null) {
			insertionSort(buckets[i]);
			sortedArray.push(...buckets[i]);
		}
	}
	return sortedArray;
}

testSort(bucketSort);

// 基数排序  根据数字的有效位或基数将整数分布到桶中
function radixSort(array, radixBase = 10) {
	if (array.length < 2) {
		return array;
	}
	const minValue = findMinValue(array);
	const maxValue = findMaxValue(array);

	let significantDigit = 1;
	while ((maxValue - minValue) / significantDigit >= 1) {
		array = countingSortForRadix(array, radixBase, significantDigit, minValue);
		significantDigit *= radixBase;
	}
	return array;
}
function countingSortForRadix(array, radixBase, significantDigit, minValue) {
	let bucketsIndex;
	const buckets = [];
	const aux = [];
	for (let i = 0; i < radixBase; i++) {
		buckets[i] = 0;
	}
	for (let i = 0; i < array.length; i++) {
		bucketsIndex = Math.floor(
			((array[i] - minValue) / significantDigit) % radixBase
		);
		buckets[bucketsIndex]++;
	}
	for (let i = 1; i < radixBase; i++) {
		buckets[i] += buckets[i - 1];
	}
	for (let i = array.length - 1; i >= 0; i--) {
		bucketsIndex = Math.floor(
			((array[i] - minValue) / significantDigit) % radixBase
		);
		aux[--buckets[bucketsIndex]] = array[i];
	}
	for (let i = 0; i < array.length; i++) {
		array[i] = aux[i];
	}
	return array;
}
testSort(radixSort);
