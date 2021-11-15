import pMap from 'p-map';

/**
 * @description: 用于并发执行promise 可以控制并发数量
 * @param {Iterable<Function>} iterable  
 * @param {Object} options { concurrency: number —— 并发数，默认值 Infinity，最小值为 1；
stopOnError: boolean —— 出现异常时，是否终止，默认值为 true。}
 * @return {*}
 */
export default async function pAll(iterable, options) {
	return pMap(iterable, (element) => element(), options);
}
