import isEmptyIterable from 'isEmptyIterable';

/**
 * @description: p-race 这个模块修复了 Promise.race API 一个 “愚蠢” 的行为。当使用空的可迭代对象，调用 Promise.race API 时，将会返回一个永远处于 pending 状态的 Promise 对象
 * @param {*} iterable
 * @return {*}
 */
export default async function pRace(iterable) {
	if (isEmptyIterable(iterable)) {
		throw new RangeError('Expected the iterable to contain at least one item');
	}

	return Promise.race(iterable);
}
