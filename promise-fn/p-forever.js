const endSymbol = Symbol('pForever.end');

/**
 * @description: 重复运行返回promise异步函数，直到你结束它
 * @param {Function} function_
 * @param {unknown} previousValue 传给function_的初始值
 * @return {*}
 */
const pForever = async (function_, previousValue) => {
	const newValue = await function_(await previousValue);

	if (newValue === endSymbol) {
		return;
	}

	return pForever(function_, newValue);
};

pForever.end = endSymbol;

export default pForever;

/**
 * 
import delay from "delay";
import pForever from "p-forever";

async function main() {
  let index = 0;
  await pForever(async () => (++index === 10 ? pForever.end : delay(50)));
  console.log("当前index的值: ", index); // 输出结果：当前index的值: 10
}

main();
 */
