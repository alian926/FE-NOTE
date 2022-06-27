class EventEmitter {
    constructor() {
        this.store = new Map();
    }
    on(key, callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('callback must be a function');
        }
        if (this.store.has(key)) {
            this.store.get(key).push(callback);
        } else {
            this.store.set(key, [callback]);
        }
    }
    once(key, callback) {
        const wrapper = () => {
            callback();
            this.off(key, wrapper);
        };
        this.on(key, wrapper);
    }
    off(key, callback) {
        if (this.store.has(key)) {
            if(callback) {
                const callbacks = this.store.get(key);
                const idx = callbacks.indexOf(callback);
                if(idx !== -1) {
                    const newCallbacks = callbacks.slice();
                    newCallbacks.splice(idx, 1)
                    this.store.set(key, newCallbacks);
                }
            }else {
                this.store.delete(key);
            }
        }
    }
    emit(key) {
        if (this.store.has(key)) {
            const callbacks = this.store.get(key);
            callbacks.forEach(callback => {
                callback();
            });
        }
    }
}

const myEvent = new EventEmitter();
const handler1 = () => {
    console.log('out 1');
};
myEvent.on('change', handler1);
myEvent.on('change', () => {
    console.log('out 2');
});
myEvent.once('change', () => {
    console.log('out 3');
});
myEvent.emit('change');
console.log('~~~~~~~')
myEvent.emit('change');
console.log('~~~~~~~')
myEvent.off('change', handler1);
myEvent.emit('change');
console.log('~~~~~~~')
myEvent.off('change');
myEvent.emit('change');
console.log('~~~~~~~')

