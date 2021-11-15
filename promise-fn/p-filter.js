import pMap from './p-map';

/**
 * @description:
 * @param {Iterable<Promise | any>} iterable
 * @param {(element, index)=> Function} filterer filterer(element, index): Function
 * @param {Object} options {concurrency: number —— 并发数，默认值 Infinity，最小值为 1。}
 * @return {*}
 */
export default async function pFilter(iterable, filterer, options) {
	const values = await pMap(
		iterable,
		(element, index) => Promise.all([filterer(element, index), element]),
		options
	);

	return values.filter((value) => Boolean(value[0])).map((value) => value[1]);
}

/**
 * 
import pFilter from "p-filter";

const inputs = [Promise.resolve(1), 2, 3];
const filterer = (x) => x % 2;

async function main() {
  const result = await pFilter(inputs, filterer, { concurrency: 1 });
  console.dir(result); // 输出结果：[ 1, 3 ]
}


// filterer也可以是一个promise
import pFilter from "p-filter";

const inputs = [Promise.resolve(1), 2, 3];
const filterer = (x) => Promise.resolve(x % 2);

async function main() {
  const result = await pFilter(inputs, filterer);
  console.dir(result); // [ 1, 3 ]
}

 */
