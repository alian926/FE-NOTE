/**
 * 一些知识点
 * instanceof 检测右侧构造函数的prototype是否出现在左侧实例对象的原型链中
 * 箭头函数 没有自己的this/super/arguments/new.target,不能被用作构造函数(箭头函数内部只拥有[[Call]], 没有function函数的[[Construct]])
 */

function newFactory() {

  let obj = new Object(),

  Constructor = [].shift.call(arguments);

  obj.__proto__ = Constructor.prototype;

  let ret = Constructor.apply(obj, arguments);

  return typeof ret === 'object' ? ret : obj;

};

const newOperator = (function () {
  const _newStack = [];
  function newOperator(ctor) {
    // 设定new.target
    newOperator.target = ctor;
    // 生成新的对象，其隐式原型指向构造函数的原型对象
    const obj = Object.create(ctor.prototype);
    // 执行构造函数，并返回结果
    const result = ctor.apply(obj, Array.prototype.slice.call(arguments, 1));
    // 重置new.target
    newOperator.target = null;
    // 判断最终返回对象
    return (typeof result === 'object' && result !== null) ||
      typeof result === 'function'
      ? result
      : obj;
  }
  // 设定target的get、set方法
  Reflect.defineProperty(newOperator, 'target', {
    get() {
      return _newStack[_newStack.length - 1];
    },
    set(target) {
      if (target == null) {
        _newStack.pop();
      } else {
        _newStack.push(target);
      }
    }
  });
  return newOperator;
})();
function B() {
  if (newOperator.target === B){
    console.log('new调用 B');
  } else {
    console.log('非new调用 B');
  }
  return { balabala: 123 };
}
function A() {
  const b = newOperator(B);
  if (newOperator.target === A) {
    console.log('new调用 A');
  } else {
    console.log('非new调用 A');
  }
}
console.log(49, newOperator)
newOperator(A);