const outputObj = { 'a.b.c.dd': 'abcdd', 'a.d.xx': 'ad', 'a.e': 'ae' };
const entryObj = {
    a: {
        b: {
            c: {
                dd: 'abcdd',
            },
        },
        d: {
            xx: 'ad',
        },
        e: 'ae',
    },
};

const format = obj => {
    const result = {};
    const func = (target, names) => {
        Object.keys(target).forEach(key => {
            const value = target[key];
            if (typeof value === 'object') {
                func(value, names.slice().concat(key));
            } else {
                result[names.concat(key).join('.')] = value;
            }
        });
    };
    func(obj, []);
    return result;
};

console.log(format(entryObj));
