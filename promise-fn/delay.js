// 获取 最小值~最大数之间的随机整数, 闭区间
const randomInteger = (minimum, maximum) =>
	Math.floor(Math.random() * (maximum - minimum + 1) + minimum);

const createAbortError = () => {
	const error = new Error('Delay aborted');
	error.name = 'AbortError';
	return error;
};

const createDelay =
  // willResolve:返回resolve还是reject的结果 
	({ clearTimeout: defaultClear, setTimeout: set, willResolve }) =>
  // ms延迟时间, value作为resolve/reject的参数, signal: AbortSignal对象
	(ms, { value, signal } = {}) => {

		if (signal && signal.aborted) {
			return Promise.reject(createAbortError());
		}

		let timeoutId;
		let settle;
		let rejectFn;
		const clear = defaultClear || clearTimeout;

		const signalListener = () => {
			clear(timeoutId);
			rejectFn(createAbortError());
		};

		const cleanup = () => {
			if (signal) {
				signal.removeEventListener('abort', signalListener);
			}
		};

		const delayPromise = new Promise((resolve, reject) => {
			settle = () => {
				cleanup();
				if (willResolve) {
					resolve(value);
				} else {
					reject(value);
				}
			};

			rejectFn = reject;
			timeoutId = (set || setTimeout)(settle, ms);
		});

		if (signal) {
			signal.addEventListener('abort', signalListener, { once: true });
		}

    // 清除延时, 直接返回直接结果
		delayPromise.clear = () => {
			clear(timeoutId);
			timeoutId = null;
			settle();
		};

		return delayPromise;
	};

  // clearAndSet 自定义的 clearTimeout, setTimeout
const createWithTimers = clearAndSet => {
  // 返回一个reolved
  const delay = createDelay({...clearAndSet, willResolve: true});
  // 返回一个rejected
  delay.reject = createDelay({...clearAndSet, willResolve: false});
  // 在特定时间内返回一个resolved
  delay.range = (minimum, maximum, options) => delay(randomInteger(minimum, maximum), options);
  return delay;
}

const delay = createWithTimers();
delay.createWithTimers = createWithTimers;

export default delay;
