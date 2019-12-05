// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module'
    },
    env: {
        node: true,
        amd: true
    },
    // required to lint *.vue files
    plugins: [
        'vue',
        'html'
    ],
    extends: [
        "eslint:recommended",
        "plugin:vue/recommended"
    ],
    // add your custom rules here
    rules: {
        'vue/max-attributes-per-line': 0,
        'vue/singleline-html-element-content-newline': 0,
        'vue/html-self-closing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        // semicolons
        'semi': ['error', 'always'],
        // quotes
        'quotes': ['error', 'single', {'allowTemplateLiterals': true}],
        // indentation
        'indent': ['error', 4, {SwitchCase: 1}],
        'vue/html-indent': ["error", 4]
    },
    globals: {
        process: true
    }
};
