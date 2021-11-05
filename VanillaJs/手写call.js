// 第二版
Function.prototype.call2 = function(context) {
  let context = context || window;
  context.fn = this;
  let args = [];
  for(let i = 1, len = arguments.length; i < len; i++) {
      args.push('arguments[' + i + ']');
  }
  // 这里 args 会自动调用 Array.toString() 这个方法。
  // 如果字符串表示的是表达式，eval() 会对表达式进行求值。
  let result = eval('context.fn(' + args +')');
  delete context.fn;
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

console.log(bar.call2(foo, 'kevin', 18)); 
// kevin
// 18
// 1
// {value: 1, name: 'kevin', age: 18}