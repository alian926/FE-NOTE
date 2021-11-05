/**
 * 简单的浅拷贝
 */
/*
function shallowClone(source) {
	let target = {};
	for (let key of Object.keys(source)) {
		target[key] = source[key];
	}
	return target;
}

let a1 = { b: { c: {} } };

let a2 = shallowClone(a1); // 浅拷贝
console.log(a2.b.c === a1.b.c); // true
*/

/**
 * 深拷贝
 */
function isObject(obj) {
	return typeof obj === 'object' && obj != null;
}
const hasOwn = Object.prototype.hasOwnProperty;

function cloneDeep(source, hash = new WeakMap()) {
	if (!isObject(source)) return source;
  // 避免循环引用
	if (hash.has(source)) return hash.get(source);

	let target = Array.isArray(source) ? [] : {};
	hash.set(source, target);

	// ============= 处理symbol类型的键
	let symKeys = Object.getOwnPropertySymbols(source); // 查找
	if (symKeys.length) {
		// 查找成功
		symKeys.forEach((symKey) => {
			if (isObject(source[symKey])) {
				target[symKey] = cloneDeep(source[symKey], hash);
			} else {
				target[symKey] = source[symKey];
			}
		});
	}
	// =============

	for (let key in source) {
		if (hasOwn.call(source, key)) {
			if (isObject(source[key])) {
				target[key] = cloneDeep(source[key], hash);
			} else {
				target[key] = source[key];
			}
		}
	}

	return target;
}

const originObj = { a: 'a', b: 'b', c: [1, 2, 3], d: { dd: 'dd' } };
const cloneObj = cloneDeep(originObj);
console.log(cloneObj === originObj, cloneObj.c === originObj.c); // false

// cloneObj.a = 'aa';
// cloneObj.c = [1, 1, 1];
// cloneObj.d.dd = 'doubled';

console.log(cloneObj); // {a:'aa',b:'b',c:[1,1,1],d:{dd:'doubled'}};
console.log(originObj); // {a:'a',b:'b',c:[1,2,3],d:{dd:'dd'}};
