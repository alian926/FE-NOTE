import pReduce from 'p-reduce';

/**
 * @description: 从左到右的执行任务流,上一个函数的返回值作为下个函数的参数
 * @param {Iterable<Function>} iterable 
 * @param {unknown} initialValue unknown：将作为第一个任务的 previousValue
 * @return {*}
 */
export default async function pWaterfall(iterable, initialValue) {
	return pReduce(
		iterable,
		(previousValue, function_) => function_(previousValue),
		initialValue
	);
}

/**
import pWaterfall from "p-waterfall";

const tasks = [
  async (val) => val + 1,
  (val) => val + 2,
  async (val) => val + 3,
];

async function main() {
  const result = await pWaterfall(tasks, 0);
  console.dir(result); // 输出结果：6
}

main();

 */