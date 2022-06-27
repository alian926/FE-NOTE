
// 使用Map实现的LRU实现复杂度为O(1)。
class LRUCache {
    constructor(capacity) {
        this.cache = new Map();
        this.capacity = capacity; // 最大缓存容量
    }
    get(key) {
        if (this.cache.has(key)) {
            const temp = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, temp);
            return temp;
        }
        return undefined;
    }
    set(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            this.cache.delete(this.cache.keys().next().value);
        }
        this.cache.set(key, value);
    }
    delete(key) {
        const temp = this.cache.get(key);
        this.cache.delete(key);
        return temp;
    }
    size() {
        return this.cache.size;
    }
}
