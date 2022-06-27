/* 
swr  缓存失效策略, stale-while-revalidate
通常与max-age连用比如: Cache-Control: max-age=1, stale-while-revalidate=59
表示缓存在1s内是新鲜的,但是在1-60s内,虽然缓存过期了,但仍可以直接使用,同事异步revalidate,在60s后,缓存完全过期需要进行传统的同步 revalidate
*/

// map 的遍历顺序就是插入顺序, 可以基于此特性来实现LRU 最近最少使用 缓存淘汰策略
// 此处的map结构可以更换为 LRU
// 缓存数据中应该有 1.请求返回的数据. 2.当前正在进行中的请求,避免多次请求, 3.缓存时间
const cache = new Map();

async function swr(cacheKey, fetcher, cacheTime) {
    // cacheKey 支持传入函数, 可通过函数结果判断是否启用缓存
    const cKey = typeof cacheKey === 'function' ? cacheKey() : cacheKey;

    if (cKey) {
        // 首先从缓存中获取
        let data = cache.get(cacheKey) || {
            value: null,
            promise: null,
            time: 0,
        };
        //写入缓存
        cache.set(cacheKey, data);

        // 是否过期
        const isStaled = Date.now() - data.time > cacheTime;
        // 已经过期了,且也没有在请求中, 需要重新发送请求
        if (isStaled && !data.promise) {
            data.promise = fetcher()
                .then(val => {
                    data.value = val;
                    data.time = Date.now(); // 保存获取到数据的时间
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    data.promise = null;
                });
        }

        if (data.promise && !data.value) {
            await data.promise;
        }

        return data.value;
    } else {
        return await fetcher();
    }
}
