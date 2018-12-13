let context = require.context('.', false, /\.svg$/)
export default context.keys()
    .reduce((assets, key) => {
        assets[key] = context(key)
        return assets
    }, {})
