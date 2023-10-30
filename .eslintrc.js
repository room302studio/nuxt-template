module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended',
    'prettier'
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    'vue/no-setup-props-reactivity-loss': 'warn',
    'vue/no-unused-refs': 'warn',
    'vue/html-comment-indent': 'warn',
    'vue/brace-style': 'warn',
    'vue/key-spacing': 'warn',
    'vue/no-console': 'warn',
  },
};