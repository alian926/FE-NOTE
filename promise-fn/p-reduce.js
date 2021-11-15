const pReduce = async (iterable, reducer, initialValue) => {
	return new Promise((resolve, reject) => {
		// 获取迭代器
		const iterator = iterable[Symbol.iterator]();
		let index = 0;

		const next = async (total) => {
			// 获取下一项
			const element = iterator.next();

			// 判断迭代器是否迭代完成
			if (element.done) {
				resolve(total);
				return;
			}

			try {
				const [resolvedTotal, resolvedValue] = await Promise.all([
					total,
					element.value,
				]);
        // 迭代下一项
        // reducer(previousValue, currentValue, index): Function
        next(reducer(resolvedTotal, resolvedValue, index++))
			} catch (error) {
				reject(error);
			}
		};
    
    next(initialValue)
	});
};

export default pReduce;

/**
  const inputs = [Promise.resolve(1), delay(50, { value: 6 }), 8];

  async function main() {
    const result = await pReduce(inputs, async (a, b) => a + b, 0);
    console.dir(result); // 输出结果：15
  }

  main();
 */