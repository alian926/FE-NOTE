// const retry = (fn, times, delay = 1000) => {
//     return new Promise((res, rej) => {
//         const attempt = () => {
//             fn()
//                 .then(res)
//                 .catch(error => {
//                     if (times-- > 0) {
//                         setTimeout(() => {
//                             attempt();
//                         }, delay);
//                     } else {
//                         rej('机会用光了');
//                     }
//                 });
//         };
//         attempt();
//     });
// };
const retry = (fn, times, delay = 1000) => {
    return new Promise((resolve, reject) => {
        fn()
            .then(resolve)
            .catch(err => {
                setTimeout(() => {
                    if (times--) {
                        resolve(retry(fn, times--, delay));
                    } else {
                        reject(`Retry Error: ${err}`);
                    }
                }, delay);
            });
    });
};

let getNum = function () {
    console.log('函数执行一次');
    return new Promise((res, rej) => {
        let num = Math.random() * 10;
        num < 2 ? res('数字小于2') : rej('数字大于2');
    });
};

retry(getNum, 3)
    .then(mes => {
        console.log(mes);
    })
    .catch(err => {
        console.log(err);
    });
