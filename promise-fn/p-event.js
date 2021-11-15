import pTimeout from 'p-timeout';

//  符号指定了一个对象的默认异步迭代器。如果一个对象设置了这个属性,它就是异步可迭代对象,可用于for await...of循环。 
const symbolAsyncIterator = Symbol.asyncIterator || '@@asyncIterator';

// 监听函数标准化
const normalizeEmitter = (emitter) => {
	const addListener =
		emitter.on || emitter.addListener || emitter.addEventListener;
	const removeListener =
		emitter.off || emitter.removeListener || emitter.removeEventListener;

	if (!addListener || !removeListener) {
		throw new TypeError('Emitter is not compatible');
	}

	return {
		addListener: addListener.bind(emitter),
		removeListener: removeListener.bind(emitter),
	};
};

// 值 数组化
const toArray = (value) => (Array.isArray(value) ? value : [value]);

/**
 * @description: 等待多个事件释放。返回一个数组, 参数和pEvent基本相同
 * @param {*} options : {count: 在promise解析之前需要触发事件的次数。resolveImmediately: 是否立即解决承诺。触发其中一个rejectionevent不会抛出错误。注意:当事件被触发时，返回的数组将被改变。}
 * @return {*}
 */
const multiple = (emitter, event, options) => {
	let cancel;
	const ret = new Promise((resolve, reject) => {
		options = {
			rejectionEvents: ['error'],
			multiArgs: false,
			resolveImmediately: false,
			...options,
		};

    // count 类型校验
		if (
			!(
				options.count >= 0 &&
				(options.count === Infinity || Number.isInteger(options.count))
			)
		) {
			throw new TypeError('The `count` option should be at least 0 or more');
		}

		// Allow multiple events 允许复合事件
		const events = toArray(event);

		const items = [];
		const { addListener, removeListener } = normalizeEmitter(emitter);

		const onItem = (...args) => {
			const value = options.multiArgs ? args : args[0];

			if (options.filter && !options.filter(value)) {
				return;
			}

			items.push(value);

			if (options.count === items.length) {
				cancel();
				resolve(items);
			}
		};

		const rejectHandler = (error) => {
			cancel();
			reject(error);
		};

		cancel = () => {
			for (const event of events) {
				removeListener(event, onItem);
			}

			for (const rejectionEvent of options.rejectionEvents) {
				removeListener(rejectionEvent, rejectHandler);
			}
		};

		for (const event of events) {
			addListener(event, onItem);
		}

		for (const rejectionEvent of options.rejectionEvents) {
			addListener(rejectionEvent, rejectHandler);
		}

		if (options.resolveImmediately) {
			resolve(items);
		}
	});

	ret.cancel = cancel;

	if (typeof options.timeout === 'number') {
		const timeout = pTimeout(ret, options.timeout);
		timeout.cancel = cancel;
		return timeout;
	}

	return ret;
};

/**
 * @description: 
 * @param {*} emitter 拥有 .on()/.addListener()/.addEventListener() and .off()/.removeListener()/.removeEventListener() 像是EventEmitter / DOM events
 * @param {string, string[]} event 要听的事件或事件的名称。如果在这里和rejectionEvents中定义了相同的事件，则此事件优先。
 * @param {object} options {rejectionEvents: 会拒绝承诺的事件 , multiArgs: 默认情况下，承诺的函数将只返回事件回调的第一个参数，这在大多数api中都可以正常工作。这个选项对于在回调中返回多个参数的api非常有用。打开这个选项将使它返回一个包含回调函数所有参数的数组，而不仅仅是第一个参数。这也适用于拒绝。 timeout: 超时前的时间(毫秒)。 filter:用于接受事件的筛选函数 }
 * @return {*}
 */
const pEvent = (emitter, event, options) => {
	if (typeof options === 'function') {
		options = { filter: options };
	}

	options = {
		...options,
		count: 1,
		resolveImmediately: false,
	};

	const arrayPromise = multiple(emitter, event, options);
	const promise = arrayPromise.then((array) => array[0]); // eslint-disable-line promise/prefer-await-to-then
	promise.cancel = arrayPromise.cancel;

	return promise;
};

/**
 * @description: 返回一个异步迭代器，它允许您异步迭代从发射器发出的事件的事件。 当发射器发出与 resolutionEvents 中定义的任何事件相匹配的事件时，迭代器结束，或者如果发射器发射了 rejectEvents 选项中定义的任何事件，则迭代器拒绝。

此方法具有与 pEvent() 相同的参数和选项
 * @param {*}
 * @return {*}
 */
const iterator = (emitter, event, options) => {
	if (typeof options === 'function') {
		options = { filter: options };
	}

	// Allow multiple events
	const events = toArray(event);

	options = {
		rejectionEvents: ['error'],
		resolutionEvents: [],
		limit: Infinity,
		multiArgs: false,
		...options,
	};

	const { limit } = options;
	const isValidLimit =
		limit >= 0 && (limit === Infinity || Number.isInteger(limit));
	if (!isValidLimit) {
		throw new TypeError(
			'The `limit` option should be a non-negative integer or Infinity'
		);
	}

	if (limit === 0) {
		// Return an empty async iterator to avoid any further cost
		return {
			[Symbol.asyncIterator]() {
				return this;
			},
			async next() {
				return {
					done: true,
					value: undefined,
				};
			},
		};
	}

	const { addListener, removeListener } = normalizeEmitter(emitter);

	let isDone = false;
	let error;
	let hasPendingError = false;
	const nextQueue = [];
	const valueQueue = [];
	let eventCount = 0;
	let isLimitReached = false;

	const valueHandler = (...args) => {
		eventCount++;
		isLimitReached = eventCount === limit;

		const value = options.multiArgs ? args : args[0];

		if (nextQueue.length > 0) {
			const { resolve } = nextQueue.shift();

			resolve({ done: false, value });

			if (isLimitReached) {
				cancel();
			}

			return;
		}

		valueQueue.push(value);

		if (isLimitReached) {
			cancel();
		}
	};

	const cancel = () => {
		isDone = true;
		for (const event of events) {
			removeListener(event, valueHandler);
		}

		for (const rejectionEvent of options.rejectionEvents) {
			removeListener(rejectionEvent, rejectHandler);
		}

		for (const resolutionEvent of options.resolutionEvents) {
			removeListener(resolutionEvent, resolveHandler);
		}

		while (nextQueue.length > 0) {
			const { resolve } = nextQueue.shift();
			resolve({ done: true, value: undefined });
		}
	};

	const rejectHandler = (...args) => {
		error = options.multiArgs ? args : args[0];

		if (nextQueue.length > 0) {
			const { reject } = nextQueue.shift();
			reject(error);
		} else {
			hasPendingError = true;
		}

		cancel();
	};

	const resolveHandler = (...args) => {
		const value = options.multiArgs ? args : args[0];

		if (options.filter && !options.filter(value)) {
			return;
		}

		if (nextQueue.length > 0) {
			const { resolve } = nextQueue.shift();
			resolve({ done: true, value });
		} else {
			valueQueue.push(value);
		}

		cancel();
	};

	for (const event of events) {
		addListener(event, valueHandler);
	}

	for (const rejectionEvent of options.rejectionEvents) {
		addListener(rejectionEvent, rejectHandler);
	}

	for (const resolutionEvent of options.resolutionEvents) {
		addListener(resolutionEvent, resolveHandler);
	}

	return {
		[symbolAsyncIterator]() {
			return this;
		},
		async next() {
			if (valueQueue.length > 0) {
				const value = valueQueue.shift();
				return {
					done: isDone && valueQueue.length === 0 && !isLimitReached,
					value,
				};
			}

			if (hasPendingError) {
				hasPendingError = false;
				throw error;
			}

			if (isDone) {
				return {
					done: true,
					value: undefined,
				};
			}

			return new Promise((resolve, reject) =>
				nextQueue.push({ resolve, reject })
			);
		},
		async return(value) {
			cancel();
			return {
				done: isDone,
				value,
			};
		},
	};
};

const TimeoutError = pTimeout.TimeoutError;

export default pEvent;

export {
  multiple,
  iterator,
  TimeoutError
};



/**
 * 
const pEvent = require('p-event');

(async () => {
	await pEvent(document, 'DOMContentLoaded');
	console.log('😎');
})();

// async iteration

const pEvent = require('p-event');
const emitter = require('./some-event-emitter');

(async () => {
	const asyncIterator = pEvent.iterator(emitter, 'data', {
		resolutionEvents: ['finish']
	});

	for await (const event of asyncIterator) {
		console.log(event);
	}
})();

 */