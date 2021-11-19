var test = 'geekbang';


// 查看ast  d8 --print-ast test.js
// 查看生成的作用域 d8 --print-scopes test.js
// 查看字节码 d8 --print-bytecode test.js
// 查看优化代码 d8 --trace-opt test.js
// 查看反优代码 pt --trace-deopt test.js

/**
 * 
 * 安装v8
https://gist.github.com/kevincennis/0cd2138c78a07412ef21

或者通过jsvu
1. npm install jsvu -g
2. jsvu运行，选择V8 debug
3. bash或者zsh配置如下
    1. export PATH="${HOME}/.jsvu:${PATH}"
    2. alias d8='v8-debug'
 */