// 题目需求 let middleware = [] middleware.push((next) => { console.log(1) setTimeout(next, 0); // next() console.log(1.1) })middleware.push((next) => { console.log(2) next() console.log(2.1) })middleware.push((next) => { console.log(3) next() console.log(3.1)})let fn = compose(middleware) fn() // /* // 1 // 2 // 3 // 3.1 // 2.1 // 1.1 // */ //实现 compose 函数
let middleware = [];
middleware.push(next => {
    console.log(1);
    setTimeout(() => {
        next();
        console.log(1.1);
    }, 0);
});
middleware.push(next => {
    console.log(2);
    next();
    console.log(2.1);
});
middleware.push(next => {
    console.log(3);
    next();
    console.log(3.1);
});

// redux中的实现方法 
// const compose = function (...args) {
//     const len = args.length;
//     if (len === 0) {
//         return (arg) => arg;
//     } else if (len === 1) {
//         return args[0];
//     } else {
//         return args.reduce(
//             (left, right) =>
//                 (...params) =>
//                     left(right(...params))
//         );
//     }
// };

function compose(middleware) {
    return function () {
        function dispatch(i) {
            const fn = middleware[i];
            if (typeof fn === 'function') {
                i++;
                const next = function () {
                    dispatch(i);
                };
                fn(next);
            }
        }

        dispatch(0);
    };
}

function compose(middleware) {
    return () => {
        function dispatch(i) {
            const fn = middleware[i];
            if (typeof fn === 'function') {
                const next = () => dispatch(i+1);
                fn(next);
            }
        }
        dispatch(0);
    };
}

let fn = compose(middleware);
fn();
/* // 1 // 2 // 3 // 3.1 // 2.1 // 1.1 // */
