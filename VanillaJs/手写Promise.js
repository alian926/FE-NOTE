const isFunction = (obj) => typeof obj === 'function';
const isObject = (obj) => !!(obj && typeof obj === 'object');
const isThenable = (obj) => (isFunction(obj) || isObject(obj)) && 'then' in obj;
const isPromise = (promise) => promise instanceof Promise2;

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function Promise2(fn) {
	this.result = null;
	this.state = PENDING;
	this.callbacks = [];

	let onFulfilled = (value) => transition(this, FULFILLED, value);
	let onRejected = (reason) => transition(this, REJECTED, reason);

	const resolve = (value) => {
		resolvePromise(this, value, onFulfilled, onRejected);
	};
	const reject = (reason) => {
		onRejected(reason);
	};

	try {
		fn(resolve, reject);
	} catch (error) {
		reject(error);
	}
}

Promise2.prototype.then = function (onFulfilled, onRejected) {
	return new Promise2((resolve, reject) => {
		const callback = { onFulfilled, onRejected, resolve, reject };
		if (this.state === PENDING) {
			this.callbacks.push(callback);
		} else {
			setTimeout(() => handleCallback(callback, this.state, this.result));
		}
	});
};

Promise2.prototype.catch = function (onRejected) {
	return this.then(null, onRejected);
};

Promise2.prototype.finally = function (callback) {
	return this.then(
		(value) => {
			return Promise2.resolve(callback()).then(() => value);
		},
		(error) => {
			return Promise2.resolve(callback()).then(() => error);
		}
	);
};

const transition = (promise, state, result) => {
	if (promise.state !== PENDING) return;
	promise.state = state;
	promise.result = result;
	setTimeout(() => handleCallbacks(promise.callbacks, state, result), 0);
};

const handleCallbacks = (callbacks, state, result) => {
	while (callbacks.length) {
		handleCallback(callbacks.shift(), state, result);
	}
};

const handleCallback = (callback, state, result) => {
	const { onFulfilled, onRejected, resolve, reject } = callback;
	try {
		if (state === FULFILLED) {
			isFunction(onFulfilled) ? resolve(onFulfilled(result)) : resolve(result);
		} else if (state === REJECTED) {
      // NOTE: 当onRejected是函数时, 调用resolve处理结果而不是reject
			isFunction(onRejected) ? resolve(onRejected(result)) : reject(result);
		}
	} catch (error) {
		reject(error);
	}
};

const resolvePromise = (promise, result, resolve, reject) => {
	if (result === promise) {
		let reason = new TypeError(`can't fullfil promise with itself`);
		return reject(reason);
	}

	if (isPromise(result)) {
		return result.then(resolve, reject);
	}

	if (isThenable(result)) {
		try {
			let then = result.then;
			if (isFunction(then)) {
				return new Promise2(then.bind(result)).then(resolve, reject);
			}
		} catch (error) {
			reject(error);
		}
	}
	resolve(result);
};

Promise2.resolve = (value) => new Promise2((resolve) => resolve(value));
Promise2.reject = (reason) => new Promise2((_, reject) => reject(reason));

/**
 * 测试部分
 */
let p = new Promise2((resolve) => {
	console.log('promise');
	setTimeout(() => {
		console.log('setTimeout');
		resolve(2);
	}, 0);
});
// Promise2.resolve(() => console.log('Promise.resolve')).then((v) => {
// 	console.log('then~', v());
// });

p.then((v) => {
	console.log('~~~', v);
	return v;
})
	.then(() => {
		console.log('throw error');
		throw new Error('person cause');
	})
  .then(() => {
		console.log('after throw error resolve');
		throw new Error('person cause 2');
	},() => {
    console.log('after throw error reject');
		throw new Error('person cause 2');
  })
	.catch(() => {
		console.log('catch error');
		return 3;
	})
	.then(
		(v) => {
			console.log('after catch resolve');
			return v;
		},
		(v) => {
			console.log('after catch reject');
			return v;
		}
	)
	.finally(() => {
		console.log('this is finally');
	})
	.then(
		(v) => {
			console.log('after finally resolve', v);
		},
		(v) => {
			console.log('after finally reject', v);
		}
	);
