// 自定义超时错误
export class TimeoutError extends Error {
	constructor(message) {
		super(message);
		this.name = 'TimeoutError';
	}
}

/**
 * @description: promise在超时指定的时间后,返回报错信息,执行超时回调
 * @param {Promise} promise
 * @param {number} milliseconds 通过无穷大将导致它永远不会超时
 * @param {Function | string | Error} fallback 在超时的时候做一些错误的拒绝之外的事情, 为string|Error的时候是超时返回内容
 * @param {*} options
 * @return {*}
 */
export default function pTimeout(promise, milliseconds, fallback, options) {
	let timer;
	const cancelablePromise = new Promise((resolve, reject) => {
		// milliseconds 类型校验
		if (typeof milliseconds !== 'number' || milliseconds < 0) {
			throw new TypeError('Expected `milliseconds` to be a positive number');
		}

		// milliseconds为Number.POSITIVE_INFINITY 将不会提示超时的错误
		if (milliseconds === Number.POSITIVE_INFINITY) {
			resolve(promise);
			return;
		}

		// 可以自定义 定时器函数, 例如测试工具使用
		options = {
			customTimers: { setTimeout, clearTimeout },
			...options,
		};

		timer = options.customTimers.setTimeout.call(
			undefined,
			() => {
				if (typeof fallback === 'function') {
					try {
						resolve(fallback());
					} catch (error) {
						reject(error);
					}

					return;
				}

				const message =
					typeof fallback === 'string'
						? fallback
						: `Promise timed out after ${milliseconds} milliseconds`;
				const timeoutError =
					fallback instanceof Error ? fallback : new TimeoutError(message);

				if (typeof promise.cancel === 'function') {
					promise.cancel();
				}

				reject(timeoutError);
			},
			milliseconds
		);

		(async () => {
			try {
        // await 一个 promise 表示需要等待这个promise为rejected或resolved再执行后续的代码
				resolve(await promise);
			} catch (error) {
				reject(error);
			} finally {
				options.customTimers.clearTimeout.call(undefined, timer);
			}
		})();
	});

	cancelablePromise.clear = () => {
		clearTimeout(timer);
		timer = undefined;
	};

	return cancelablePromise;
}

/*
import {setTimeout} from 'timers/promises';
import pTimeout from 'p-timeout';

const delayedPromise = setTimeout(200);

await pTimeout(delayedPromise, 50);


let p = () => new Promise((resolve) => {
	setTimeout(() => {
		console.log('normal func');
		resolve();
	}, 1000);
});

pTimeout(p(), 500, () => {
	console.log('has delay');
});
*/

