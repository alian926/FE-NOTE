function Promise(executor) {
    // 托管构造函数的this指向
    let _this = this;
    // 状态描述 pending resolved rejected
    this.state = 'pending';
    // 成功结果
    this.value = undefined;
    // 失败原因
    this.reason = undefined;
    //保存成功回调
    this.onResolvedCallbacks = [];
    //保存失败回调
    this.onRejectedCallbacks = [];

    // 让其处理器函数立即执行
    try {
        executor(resolve, reject);
    } catch (err) {
        reject(err);
    }

    function resolve(value) {
        // 判断当前态是否为pending，只有pending时可更该状态
        if (_this.state === 'pending') {
            // 更改为成功态
            _this.state = 'resolved';
            // 保存成功结果
            _this.value = value;
            // 遍历执行成功回调
            _this.onResolvedCallbacks.forEach(fn => fn(value));
        }
    }

    function reject(reason) {
        // 判断当前态是否为pending，只有pending时可更该状态
        if (_this.state === 'pending') {
            // 更改为失败态
            _this.state = 'rejected';
            // 保存失败原因
            _this.reason = reason;
            // 遍历执行失败回调
            _this.onRejectedCallbacks.forEach(fn => fn(reason));
        }
    }
}

// then原型方法
Promise.prototype.then = function (onFulfilled, onRejected) {
    // 判断参数不为函数时变成普通函数，成功-直接返回接收值 失败-抛出错误
    onFulfilled =
        typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected =
        typeof onRejected === 'function'
            ? onRejected
            : err => {
                  throw err;
              };

    // 创建一个新的Promise实例
    let promise2 = new Promise((resolve, reject) => {
        // 等待态判断，此时异步代码还未走完，回调入数组队列
        const fulfilledCallback = () => {
            // 使用queueMicrotask实现微任务
            queueMicrotask(() => {
                try {
                    let x = onFulfilled(this.value);
                    // 处理返回值
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        };
        const rejectedCallback = () => {
            queueMicrotask(() => {
                try {
                    let x = onRejected(this.reason);
                    // 处理返回值
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
        };
        if (this.state === 'pending') {
            // 将成功回调push入成功队列
            this.onResolvedCallbacks.push(() => {
                // 使用queueMicrotask实现微任务
                fulfilledCallback();
            });

            // 将失败回调push入失败队列
            this.onRejectedCallbacks.push(() => {
                // 使用queueMicrotask实现微任务
                rejectedCallback();
            });
        }
        if (this.state === 'resolved') {
            // 使用queueMicrotask实现微任务
            fulfilledCallback();
        }
        if (this.state === 'rejected') {
            // 使用queueMicrotask实现微任务
            rejectedCallback();
        }
    });
    return promise2;
};

// catch原型方法
Promise.prototype.catch = function (onRejected) {
    // 直接执行then方法，onFulfilled为null，传入onRejected
    return this.then(null, onRejected);
};

// finally原型方法
Promise.prototype.finally = function (fn) {
    return this.then(
        value => {
            return Promise.resolve(fn()).then(() => value);
        },
        error => {
            return Promise.resolve(fn()).then(() => {
                throw error;
            });
        }
    );
};

// resolve方法
Promise.resolve = function (val) {
    // 直接抛出一个成功状态的Promise
    return new Promise((resolve, reject) => {
        resolve(val);
    });
};

// reject方法
Promise.reject = function (val) {
    // 直接抛出一个拒绝状态的Promise
    return new Promise((resolve, reject) => {
        reject(val);
    });
};

// race方法
Promise.race = function (promises) {
    // return一个Promise
    return new Promise((resolve, reject) => {
        // 遍历执行promises
        for (let i = 0; i < promises.length; i++) {
            // then只要接收到状态改变，直接抛出
            promises[i].then(resolve, reject);
        }
    });
};

// all方法
Promise.all = function (arr) {
    // 只有一个目的 获取到所有的promise，都执行then，把结果放到数组，一起返回
    // 递归实现和遍历实现都可以

    // 用于存放每次执行后返回结果
    let aResult = [];
    // 需要使用计数器统计数量
    let count = 0;
    return new Promise(function (resolve, reject) {
        arr.forEach((p, index) => {
            // 数组中可能有的不是Promise
            Promise.resolve(p).then(res => {
                aResult[index] = res;
                count++;
                if (count === arr.length) {
                    resolve(aResult);
                }
            }, reject);
        });
    });
};

/**
 * 解析then返回值与新Promise对象
 * @param {Object} 新的Promise对象，就是我们创建的promise2实例
 * @param {*} x 上一个then的返回值
 * @param {Function} resolve promise2处理器函数的resolve
 * @param {Function} reject promise2处理器函数的reject
 */
function resolvePromise(promise2, x, resolve, reject) {
    // 解决循环引用报错
    if (promise2 === x) {
        // reject报错
        reject(new TypeError('请避免Promise循环引用'));
    }

    // 定义状态-防止多次调用
    let called;
    // x不是null 且x是对象或函数
    if (x != null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            // 拿到x的then方法
            let then = x.then;
            // 如果then是函数，就默认是promise
            if (typeof then === 'function') {
                // 执行then 使用call传递this 第一个参数是this 后面是成功的回调 和 失败的回调
                then.call(
                    x,
                    y => {
                        // 成功和失败只能调用一个
                        if (called) return;
                        called = true;
                        // 防止用户在resolve的时候传入Promise，递归调用
                        resolvePromise(promise2, y, resolve, reject);
                    },
                    err => {
                        // 成功和失败只能调用一个
                        if (called) return;
                        called = true;
                        reject(err);
                    }
                );
            } else {
                resolve(x);
            }
        } catch (e) {
            reject(e);
        }
    } else {
        resolve(x);
    }
}

let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(1);
    }, 0);
});
let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject(2);
    }, 0);
});
Promise.all([p1, p2]).then(
    res => {
        console.log('all', res);
    },
    error => {
        console.log('all error', error);
    }
);
// p1.then(value => {
//     console.log('then ', value);
// });

// Promise.resolve(1).then(val => console.log('then2 :', val));

