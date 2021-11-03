Function.prototype.apply2 = function (context, arr) {
  let context = Object(context) || window;
  context.fn = this;

  let result;
  if (!arr) {
      result = context.fn();
  }
  else {
      let args = [];
      for (let i = 0, len = arr.length; i < len; i++) {
          args.push('arr[' + i + ']');
      }
      result = eval('context.fn(' + args + ')')
  }

  delete context.fn
  return result;
}

// 测试一下
let foo = {
  value: 1
};

function bar(name, age) {
  console.log(name)
  console.log(age)
  console.log(this.value);
  return {
      value: this.value,
      name: name,
      age: age
  }
}

console.log(bar.apply2(foo, ['kevin', 18]));