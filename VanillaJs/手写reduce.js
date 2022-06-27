Array.prototype.reduce = function (func, initialValue) {
    const arr = this;
    let base = typeof initialValue === 'undefined' ? arr[0] : initialValue;
    const startPoint = typeof initialValue === 'undefined' ? 1 : 0;
    arr.slice(startPoint).forEach(function (val, index) {
        base = func(base, val, index + startPoint, arr);
    });
    return base;
};

const v = [1, 2, 3].reduce((total, val) => total + val, 0);
console.log(v);
