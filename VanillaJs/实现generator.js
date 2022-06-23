function readFile(fileName) {
    return new Promise((resolve, reject) => {
        resolve(fileName);
    });
}

function* read() {
    let template = yield readFile('template-xxx');
    let data = yield readFile('data-xxx');
    return {
        template,
        data,
    };
}

let r1 = read();
let templatePromise = r1.next().value;
console.log('templatePromise', templatePromise);
templatePromise.then(function (template) {
    // 将获取到的template的内容传递给生成器函数
    let dataPromise = r1.next(template).value;
    dataPromise.then(function (data) {
        //最后一次执行next传入data的值；最后返回{template， data}
        let result = r1.next(data).value;
        console.log(result);
    });
});

//实现 co 方法
//参数是一个生成器函数
function co(genFn) {
    let r1 = genFn();
    return new Promise(function (resolve, reject) {
        function next(lastVal) {
            let p1 = r1.next(lastVal);
            if (p1.done) {
                resolve(p1.value);
            } else {
                Promise.resolve(p1.value).then(next, reject);
            }
        };
        next();
    });
}

//现在获取上边的result可以这样来取
co(read).then(function (result) {
    console.log('co-then', result);
});
