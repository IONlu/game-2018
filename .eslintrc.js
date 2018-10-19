module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/recommended',
        '@vue/standard'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // 4 spaces
        'indent': ['error', 4, {
            "SwitchCase": 1
        }],
        'vue/html-indent': ['error', 4]
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}
