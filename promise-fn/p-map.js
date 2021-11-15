const pMap = async (
	iterable,
	mapper,
	{ concurrency = Number.POSITIVE_INFINITY, stopOnError = true } = {}
) => {
	return new Promise((resolve, reject) => {
		// 参数校验
    // mapper必须是函数
		if (typeof mapper !== 'function') {
			throw new TypeError('Mapper function is required');
		}
    // concurrency 必须是>=1的安全整数
		if (
			!(
				(Number.isSafeInteger(concurrency) ||
					concurrency === Number.POSITIVE_INFINITY) &&
				concurrency >= 1
			)
		) {
			throw new TypeError(
				`Expected \`concurrency\` to be an integer from 1 and up or \`Infinity\`, got \`${concurrency}\` (${typeof concurrency})`
			);
		}

    // 存储返回结果
		const result = [];
    // 存储异常对象
		const errors = [];
    // 保存跳过项索引值的数组
		const skippedIndexes = [];
    // 获取迭代器
		const iterator = iterable[Symbol.iterator]();
    // 标识是否出现异常
		let isRejected = false;
    // 标识是否已经迭代完成
		let isIterableDone = false;
    // 正在处理的任务个数
		let resolvingCount = 0;
    // 当前索引
		let currentIndex = 0;

		const next = () => {
      // 如果有异常,直接返回
			if (isRejected) {
				return;
			}

      // 获取下一项 迭代内容
			const nextItem = iterator.next();
      // 记录当前索引
			const index = currentIndex;
			currentIndex++;

      // 判断迭代器是否迭代完成
			if (nextItem.done) {
				isIterableDone = true;

        // 判断所有的任务都已经完成了,没有正在处理的任务了
				if (resolvingCount === 0) {
          // 异常处理
					if (!stopOnError && errors.length > 0) {
            // stopOnError为false,不立刻终止, 等全部执行后, 如果有错误,将错误内容以数组形式抛出
						reject(new Error(errors));
					} else {
						for (const skippedIndex of skippedIndexes) {
              // 删除跳过的值, 不然会存在空的占位
							result.splice(skippedIndex, 1);
						}
            // 返回最终的处理结果
						resolve(result);
					}
				}
				return;
			}

      // 正在处理的任务加1
			resolvingCount++;

			(async () => {
				try {
          // 获取迭代元素
					const element = await nextItem.value;

          // 如果有异常,直接返回
					if (isRejected) {
						return;
					}

          // 调用mapper函数 
					const value = await mapper(element, index);

					if (value === pMapSkip) {
            // 处理跳过的情形，可以在mapper函数中返回pMapSkip，来跳过当前项
            // 比如在异常捕获的catch语句中，返回pMapSkip值
						skippedIndexes.push(index);
					} else {
            // 把返回值按照索引进行保存
						result[index] = value;
					}
					resolvingCount--;
          // 迭代下一项
					next();
				} catch (error) {
					if (stopOnError) {
            // 出现异常时, 是否终止, 默认值为true
						isRejected = true;
						reject(error);
					} else {
						errors.push(error);
						resolvingCount--;
						next();
					}
				}
			})();
		};

    // 根据配置的concurrency值, 并发执行任务
		for (let index = 0; index < concurrency; index++) {
			next();
			if (isIterableDone) {
				break;
			}
		}
	});
};

export const pMapSkip = Symbol('skip');

export default pMap;

/**
 * 
  const inputs = [200, 100, 50];
  const mapper = (value) => delay(value, { value });

  async function main() {
    console.time("start");
    const result = await pMap(inputs, mapper, { concurrency: 1 });
    console.dir(result); // 输出结果：[ 200, 100, 50 ]
    console.timeEnd("start");
  }
  // [ 200, 100, 50 ]
  // start: 368.708ms

  //当吧concurrency 属性的值更改为 2 之后
  [ 200, 100, 50 ]
  start: 210.322ms
 */
