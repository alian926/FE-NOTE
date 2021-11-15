import pMap from 'p-map';

/**
 * @description: 并发运行promise- returns & async函数特定次数
 * @param {number} count 调用次数
 * @param {Function} mapper mapper(index)
 * @param {*} options
 * @return {*}
 */
export default function pTimes(count, mapper, options) {
	return pMap(
		Array.from({ length: count }).fill(),
		(_, index) => mapper(index),
		options
	);
}
/**
 * 
import delay from "delay";
import pTimes from "p-times";

async function main() {
  console.time("start");
  const result = await pTimes(5, async (i) => delay(50, { value: i * 10 }), {
    concurrency: 3,
  });
  console.dir(result);
  console.timeEnd("start");
}

main();
 */