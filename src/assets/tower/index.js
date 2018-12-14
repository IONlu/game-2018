import path from 'path'

let context = require.context('.', false, /\.svg$/)
export default context.keys()
    .reduce((assets, key) => {
        let name = path.basename(key).slice(0, -4)
        assets[name] = context(key)
        return assets
    }, {})
