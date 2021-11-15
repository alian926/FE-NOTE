/**
 * @description: 将promise-returning或async函数组合到可重用的管道
 * @param {array} functions
 * @return {*}
 */
export default function pPipe(...functions) {
	if (functions.length === 0) {
		throw new Error('Expected at least one argument');
	}

	return async input => {
		let currentValue = input;

		for (const function_ of functions) {
			currentValue = await function_(currentValue); // eslint-disable-line no-await-in-loop
		}

		return currentValue;
	};
}

/**
import pPipe from "p-pipe";

const addUnicorn = async (string) => `${string} Unicorn`;
const addRainbow = async (string) => `${string} Rainbow`;

const pipeline = pPipe(addUnicorn, addRainbow);

(async () => {
  console.log(await pipeline("❤️")); // 输出结果：❤️ Unicorn Rainbow
})();
 */