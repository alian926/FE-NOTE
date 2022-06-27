import { noop } from 'shared/util';
import { handleError } from './error';
import { isIE, isIOS } from './env';

// 原生方法 返回的toString结果 function Promise() { [native code] }
function isNative(Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

export let isUsingMicroTask = false;

const callbacks = [];
let pending = false;

function flushCallbacks() {
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
        copies[i]();
    }
}

let timerFunc; // timerFunc函数是重点！
// task的执行优先级
// Promise -> MutationObserver -> setImmediate -> setTimeout

if (typeof Promise !== 'undefined' && isNative(Promise)) {
    const p = Promise.resolve();
    timerFunc = () => {
        p.then(flushCallbacks);
        // 执行 if (isIOS) { setTimeout(noop)} 来在 IOS 浏览器下添加空的计时器强制刷新微任务队列。
        if (isIOS) setTimeout(noop);
    };
    isUsingMicroTask = true;
} else if (
    !isIE &&
    typeof MutationObserver !== 'undefined' &&
    (isNative(MutationObserver) ||
        MutationObserver.toString() === '[object MutationObserverConstructor]')
) {
    let counter = 1;
    const observer = new MutationObserver(flushCallbacks);
    const textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
        characterData: true,
    });
    timerFunc = () => {
        counter = (counter + 1) % 2;
        textNode.data = String(counter);
    };
    isUsingMicroTask = true;
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    timerFunc = () => {
        setImmediate(flushCallbacks);
    };
} else {
    // Fallback to setTimeout.
    timerFunc = () => {
        setTimeout(flushCallbacks, 0);
    };
}

// nextTick 主函数
export function nextTick(cb?: Function, ctx?: Object) {
    let _resolve;
    callbacks.push(() => {
        if (cb) {
            try {
                cb.call(ctx);
            } catch (e) {
                handleError(e, ctx, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(ctx);
        }
    });
    if (!pending) {
        pending = true;
        timerFunc();
    }
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(resolve => {
            _resolve = resolve;
        });
    }
}

/**
 * 总结一下nextTick函数的逻辑
定义了一个callbacks数组来模拟事件队列,通过参数cb传入的函数经过一个函数包装，在这个包装过程中会执行传入的函数，处理执行失败的情况，以及参数cb不存在的情景，然后添加到callbacks数组中。再调用timerFunc函数，该函数就是用各种异步执行的方法调用flushCallbacks 函数，在flushCallbacks 函数中拷贝callbacks中的每个函数，并执行。定义了一个变量 pending来保证一个事件循环中只调用一次 timerFunc 函数。
那么其中的关键还是怎么定义 timerFunc 函数。因为在各浏览器下对创建异步执行函数的方法各不相同，要做兼容处理，下面来介绍一下各种方法。
 */