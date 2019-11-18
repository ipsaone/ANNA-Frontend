// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module'
    },
    env: {
        browser: true,
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
    'rules': {
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        // semicolons
        'semi': ['error', 'always'],
        // quotes
        'quotes': ['error', 'single', {'allowTemplateLiterals': true}],
        // indentation
        'indent': ['error', 4, {SwitchCase: 1}]
    }
};
