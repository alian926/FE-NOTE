const runPromiseInSequence = function (arr, value) {
    return arr.reduce(
        (promiseChain, currentFunc) => promiseChain.then(currentFunc),
        Promise.resolve(value)
    );
};

const f1 = () =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('p1 running');
            resolve();
        }, 200);
    });

const f2 = () =>
    new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('p2 running');
            resolve();
        }, 200);
    });

runPromiseInSequence([f1, f2]);
