// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    "ecmaVersion": 6,
    "ecmaFeatures": {
    "experimentalObjectRestSpread": true,
    "jsx": true
    },
    "sourceType": "module"
  },
  env: {
    "browser": true,
    "es6": true,
    "node": true
  },
  globals: {
      "document": true,
      "navigator": true,
      "window": true
  },
  // required to lint *.vue files
  plugins: [
    'html',
    // "standard",
    // "promise"
  ],
  // add your custom rules here
  'rules': {
    //禁止使用多余的圆括号
    // "no-extra-parens": 1,
    // 箭头函数参数是否必须用括号包裹
    'arrow-parens': 0,
    //禁止多余的冒号
    "no-extra-semi": 2,
    //禁止重复的函数声明
    "no-func-assign": 2,
    //禁止在块语句中声明变量或函数
    "no-inner-declarations": 2,
    //全都需要{ }包围
    "curly": 2,
    //所有的switch语句都必须要有一个default分支
    "default-case": 2,
     //警告非4个空格缩进
    "indent": [0, 4, { "SwitchCase": 1 }],
    //该规则规定了在对象字面量语法中key和value之间的空白，冒号前不要留空格，冒号后面需留一个空格
    "key-spacing": [2, { "beforeColon": false, "afterColon": true }],
     //警告混用tab制表符和空格
    "no-mixed-spaces-and-tabs": 1,
     //警告未使用但以声明的变量
    "no-unused-vars": [1, { "vars": "all", "args": "none" }],
    //字符串必须用单引号包裹
    "quotes": [2, "single", "avoid-escape"],
    //无分号时提示
    "semi": [1, "never"],
     //{}前必须一个单空格
    "space-before-blocks": [2, "always"],

    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
