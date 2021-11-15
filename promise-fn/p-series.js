/**
 * @description: 串行执行任务, 需要等待上一个执行完毕再执行下一个
 * @param {Iterable<Promise | any>} tasks
 * @return {*}
 */
export default async function pSeries(tasks) {
	for (const task of tasks) {
		if (typeof task !== 'function') {
			throw new TypeError(
				`Expected task to be a \`Function\`, received \`${typeof task}\``
			);
		}
	}

	const results = [];

	for (const task of tasks) {
		results.push(await task()); // eslint-disable-line no-await-in-loop
	}

	return results;
}

/**
import pSeries from "p-series";

const tasks = [async () => 1 + 1, () => 2 + 2, async () => 3 + 3];

async function main() {
  const result = await pSeries(tasks);
  console.dir(result); // 输出结果：[2, 4, 6]
}

main();
 */
