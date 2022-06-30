const loadImg = urlId => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(urlId);
            console.log('Loaded image', urlId);
        }, 1000);
    });
};

const loadByLimit = (urlIds, loadImg, limit) => {
    const urlIdsCopy = [...urlIds];

    // 如果数组长度小于最大并发数.直接发送全部请求
    if (urlIdsCopy.length < limit) {
        const promiseArray = urlIds.map(urlId => loadImg(urlId));
        return Promise.all(promiseArray);
    }

    const currentUrlIds = urlIdsCopy.splice(0, limit);
    const promiseArray = currentUrlIds.map(urlId => loadImg(urlId));

    urlIdsCopy
        .reduce(
            (prevPromise, urlId) =>
                prevPromise
                    .then(() => Promise.race(promiseArray))
                    .catch(error => console.log(error))
                    .then(resolvedId => {
                        let resolvedIdPosition = currentUrlIds.findIndex(
                            id => resolvedId === id
                        );
                        currentUrlIds.splice(resolvedIdPosition, 1);
                        currentUrlIds.push(urlId);
                        promiseArray.splice(resolvedIdPosition, 1);
                        promiseArray.push(loadImg(urlId));
                    }),
            Promise.resolve()
        )
        .then(() => Promise.all(promiseArray));
};

// loadByLimit([1, 2, 3, 4, 5, 6, 7, 8], loadImg, 3);

const limitLoad = (array,fetch, limit = 3) => {
    const sequence = [...array];

    let promises = sequence
        .splice(0, limit)
        .map((url, index) => fetch(url).then(() => index));

    let done = Promise.race(promises);

    for (let i = 0; i < sequence.length; i++) {
        done = done.then(resolvedIndex => {
            promises[resolvedIndex] = fetch(sequence[i]).then(() => resolvedIndex);
            return Promise.race(promises);
        });
    }
};

limitLoad([1, 2, 3, 4, 5, 6, 7, 8], loadImg, 3);
