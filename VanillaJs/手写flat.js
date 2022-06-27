function flatDeep(arr, n = 1) {
    while (n-- && arr.some(i => Array.isArray(i))) {
        arr = [].concat.apply([], arr);
    }
    return arr;
}
